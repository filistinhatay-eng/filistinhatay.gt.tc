import fs from 'fs';
import path from 'path';

export interface UniversityNewsItem {
  id: string;
  titleTr: string;
  titleAr: string;
  contentTr: string;
  contentAr: string;
  date: string;
  categoryTr: string;
  categoryAr: string;
  link: string;
  isRelevantToForeigners: boolean;
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

// In-memory cache
let cachedNews: UniversityNewsItem[] = [];
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const CACHE_FILE_PATH = path.join(process.cwd(), 'cached-iste-news.json');

// Initialize cache from disk if available
try {
  if (fs.existsSync(CACHE_FILE_PATH)) {
    const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
    const parsed = JSON.parse(fileContent);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedNews = parsed;
      lastCacheTime = Date.now();
    }
  }
} catch (e) {
  console.warn('Could not read cached-iste-news.json:', e);
}

/**
 * Call Groq Chat Completions API
 */
export async function callGroqChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { model?: string }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not configured');
  }

  const models = [options?.model || PRIMARY_MODEL, 'allam-2-7b', FALLBACK_MODEL];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Groq API (${model}) failed with ${response.status}:`, errorText);
        lastError = new Error(`Groq ${model} failed: ${errorText}`);
        continue;
      }

      const data = await response.json() as any;
      const content = data.choices?.[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return content.trim();
      }
    } catch (e) {
      console.warn(`Groq request exception for ${model}:`, e);
      lastError = e;
    }
  }

  throw lastError || new Error('All Groq models failed');
}

/**
 * Helper to unescape HTML entities and strip tags
 */
function cleanHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&Uuml;/g, 'Ü')
    .replace(/&uuml;/g, 'ü')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&ouml;/g, 'ö')
    .replace(/&Ccedil;/g, 'Ç')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Icirc;/g, 'Î')
    .replace(/&icirc;/g, 'î')
    .replace(/&Scedil;/g, 'Ş')
    .replace(/&scedil;/g, 'ş')
    .replace(/&Gbreve;/g, 'Ğ')
    .replace(/&gbreve;/g, 'ğ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Scrape individual announcement detail from iste.edu.tr
 */
async function scrapeAnnouncementDetail(url: string): Promise<{ title: string; content: string; date: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
      },
      signal: AbortSignal.timeout(7000),
    });

    if (!res.ok) {
      return { title: '', content: '', date: '' };
    }

    const html = await res.text();

    // Extract title from <div class="text-title..."> or fallback
    let title = '';
    const titleMatch = html.match(/<div[^>]*class=["'][^"']*text-title[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    if (titleMatch) {
      title = cleanHtml(titleMatch[1]);
    } else {
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1Match) title = cleanHtml(h1Match[1]);
    }

    // Extract content from <div class="text-container">
    let content = '';
    const contentMatch = html.match(/<div[^>]*class=["'][^"']*text-container[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    if (contentMatch) {
      content = cleanHtml(contentMatch[1]);
    } else {
      const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      if (pMatches) {
        content = pMatches.map(p => cleanHtml(p)).filter(t => t.length > 20).join(' ');
      }
    }

    // Extract date if present (e.g. 14/08/2026 or from URL /2026/08/14/)
    let date = '';
    const urlDateMatch = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
    if (urlDateMatch) {
      date = `${urlDateMatch[1]}-${urlDateMatch[2]}-${urlDateMatch[3]}`;
    } else {
      const pageDateMatch = html.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (pageDateMatch) {
        date = `${pageDateMatch[3]}-${pageDateMatch[2]}-${pageDateMatch[1]}`;
      }
    }

    return { title, content, date };
  } catch (err) {
    console.warn(`Failed to fetch detail for ${url}:`, err);
    return { title: '', content: '', date: '' };
  }
}

/**
 * Scrape latest announcements from İSTE official portal
 */
export async function scrapeIsteRawAnnouncements(): Promise<Array<{ id: string; link: string; titleTr: string; contentTr: string; date: string; categoryTr: string }>> {
  const targetUrls = [
    'https://iste.edu.tr/duyuru-merkezi',
    'https://iste.edu.tr/haber-merkezi',
    'https://iste.edu.tr'
  ];

  const scrapedLinks: Array<{ link: string; initialDate: string; categoryTr: string }> = [];
  const seenLinks = new Set<string>();

  for (const targetUrl of targetUrls) {
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) continue;
      const html = await res.text();

      // Find all announcement links formatted with /YYYY/MM/DD/ID or /YYYY/MM/ID
      const regex = /<a[^>]+href=["'](https?:\/\/(?:www\.)?iste\.edu\.tr\/(?:duyuru|haber)-merkezi\/[^"']*(?:\/\d{4}\/\d{2}\/\d{2}\/\d+|\/\d{4}\/\d{2}\/\d+))["'][^>]*>/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        const link = match[1];
        if (!seenLinks.has(link)) {
          seenLinks.add(link);
          const dateMatch = link.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
          const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '2026-08-20';
          const categoryTr = link.includes('/oidb/') ? 'Öğrenci İşleri' :
                             link.includes('/lee/') ? 'Lisansüstü' :
                             link.includes('haber-merkezi') ? 'Haber' : 'Duyuru';
          scrapedLinks.push({ link, initialDate: date, categoryTr });
        }
      }
    } catch (e) {
      console.warn(`Error scraping ${targetUrl}:`, e);
    }
  }

  // Sort by date descending and take top 8
  scrapedLinks.sort((a, b) => b.initialDate.localeCompare(a.initialDate));
  const topLinks = scrapedLinks.slice(0, 8);

  // Fetch details in parallel
  const details = await Promise.all(
    topLinks.map(async (item, idx) => {
      const detail = await scrapeAnnouncementDetail(item.link);
      const id = `iste-live-${detail.date || item.initialDate}-${idx + 1}`;
      return {
        id,
        link: item.link,
        titleTr: detail.title || 'İSTE Resmi Duyurusu',
        contentTr: detail.content || 'Detaylar ve başvuru bilgileri için resmi duyuru sayfasını ziyaret ediniz.',
        date: detail.date || item.initialDate,
        categoryTr: item.categoryTr
      };
    })
  );

  return details.filter(d => d.titleTr.length > 5);
}

/**
 * Translate and summarize scraped announcements using Groq AI
 */
export async function translateAnnouncementsWithGroq(
  rawItems: Array<{ id: string; link: string; titleTr: string; contentTr: string; date: string; categoryTr: string }>
): Promise<UniversityNewsItem[]> {
  if (rawItems.length === 0) return [];

  // Truncate content to 250 chars max per item to stay well below token limit
  const trimmedItems = rawItems.slice(0, 8).map(item => ({
    id: item.id,
    titleTr: item.titleTr.substring(0, 150),
    contentSnippetTr: item.contentTr.substring(0, 250),
    date: item.date,
    categoryTr: item.categoryTr,
    link: item.link
  }));

  const prompt = `Translate these Turkish university announcements from Iskenderun Technical University (İSTE) to Arabic for university students.
Return a valid JSON array of objects without Markdown formatting:
[
  {
    "id": "item id",
    "titleAr": "Arabic title",
    "contentAr": "Arabic summary of announcement details and dates",
    "categoryAr": "Arabic category (e.g., 'شؤون الطلاب', 'إعلانات هامة', 'قبول وتسجيل', 'منح وتبادل', 'دراسات عليا')",
    "isRelevantToForeigners": true
  }
]

Announcements to translate:
${JSON.stringify(trimmedItems, null, 2)}
`;

  try {
    const responseText = await callGroqChat(
      [
        { role: 'system', content: 'You are an academic translator. Output ONLY a valid JSON array matching the requested schema.' },
        { role: 'user', content: prompt }
      ]
    );

    // Extract JSON array from text
    let items: any[] = [];
    const arrayMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      items = JSON.parse(arrayMatch[0]);
    } else {
      const objMatch = responseText.match(/\{\s*["']items["']\s*:\s*(\[[\s\S]*\])\s*\}/);
      if (objMatch) {
        items = JSON.parse(objMatch[1]);
      }
    }

    if (Array.isArray(items) && items.length > 0) {
      return rawItems.slice(0, items.length).map((raw, idx) => {
        const translated = items[idx] || items.find(it => it.id === raw.id) || {};
        return {
          id: raw.id,
          titleTr: raw.titleTr,
          titleAr: translated.titleAr || raw.titleTr,
          contentTr: raw.contentTr,
          contentAr: translated.contentAr || raw.contentTr,
          date: raw.date,
          categoryTr: raw.categoryTr,
          categoryAr: translated.categoryAr || (raw.categoryTr === 'Öğrenci İşleri' ? 'شؤون الطلاب' : 'إعلانات'),
          link: raw.link,
          isRelevantToForeigners: typeof translated.isRelevantToForeigners === 'boolean'
            ? translated.isRelevantToForeigners
            : (raw.titleTr.toLowerCase().includes('uluslararası') || raw.titleTr.toLowerCase().includes('yabancı') || raw.titleTr.toLowerCase().includes('af'))
        };
      });
    }
  } catch (err) {
    console.error('Error in translateAnnouncementsWithGroq:', err);
  }

  // Fallback if AI translation failed: provide basic Arabic mapping
  return rawItems.map(item => ({
    id: item.id,
    titleTr: item.titleTr,
    titleAr: item.titleTr,
    contentTr: item.contentTr,
    contentAr: item.contentTr,
    date: item.date,
    categoryTr: item.categoryTr,
    categoryAr: item.categoryTr === 'Öğrenci İşleri' ? 'شؤون الطلاب' :
                item.categoryTr === 'Lisansüstü' ? 'دراسات عليا' :
                item.categoryTr === 'Haber' ? 'أخبار' : 'إعلانات',
    link: item.link,
    isRelevantToForeigners: item.titleTr.toLowerCase().includes('uluslararası') || item.titleTr.toLowerCase().includes('yabancı')
  }));
}

/**
 * Main function to get live university news with caching
 */
export async function getLiveUniversityNews(forceRefresh = false): Promise<{ data: UniversityNewsItem[]; source: string }> {
  const isCacheValid = !forceRefresh && cachedNews.length > 0 && (Date.now() - lastCacheTime < CACHE_TTL_MS);

  if (isCacheValid) {
    return { data: cachedNews, source: 'cache' };
  }

  console.log(`Fetching and translating live announcements from iste.edu.tr (forceRefresh=${forceRefresh})...`);

  try {
    const rawItems = await scrapeIsteRawAnnouncements();
    if (rawItems.length > 0) {
      const translated = await translateAnnouncementsWithGroq(rawItems);
      if (translated.length > 0) {
        cachedNews = translated;
        lastCacheTime = Date.now();

        // Save to disk
        try {
          fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(translated, null, 2), 'utf8');
        } catch (e) {
          console.warn('Failed to save cached-iste-news.json:', e);
        }

        return { data: translated, source: 'live-groq' };
      }
    }
  } catch (error) {
    console.error('Failed to scrape and translate live news:', error);
  }

  if (cachedNews.length > 0) {
    return { data: cachedNews, source: 'stale-cache' };
  }

  return { data: [], source: 'empty' };
}
