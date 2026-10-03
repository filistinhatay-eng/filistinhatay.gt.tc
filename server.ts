import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getLiveUniversityNews, callGroqChat, UniversityNewsItem } from './server/groqService';

const PORT = 3000;

// Initialize Firebase Web SDK
let db: any = null;
try {
  const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(firebaseConfigPath)) {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    const app = initializeApp(config);
    if (config.firestoreDatabaseId) {
      db = getFirestore(app, config.firestoreDatabaseId);
    } else {
      db = getFirestore(app);
    }
    console.log('Firebase Firestore Web SDK initialized successfully on backend.');
  } else {
    console.warn('firebase-applet-config.json not found, falling back to local file storage.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase on backend:', error);
}

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiInstance;
}

// Fallback high-quality translated news
const fallbackNews: UniversityNewsItem[] = [
  {
    id: 'iste-news-fallback-1',
    titleTr: 'Uluslararası Öğrenci Başvuruları Başladı!',
    titleAr: 'بدء استقبال طلبات الطلاب الدوليين في جامعة İSTE!',
    contentTr: 'İskenderun Teknik Üniversitesi 2026-2027 akademik yılı uluslararası öğrenci başvuru süreci resmi olarak başlamıştır. Adaylar online sistem üzerinden belgelerini teslim edebilirler.',
    contentAr: 'بدأت رسمياً عملية تقديم طلبات الطلاب الدوليين في جامعة إسكندرون التقنية للعام الدراسي 2026-2027. يمكن للمرشحين تقديم وثائقهم عبر النظام الإلكتروني مباشرة.',
    date: '2026-06-20',
    categoryTr: 'Uluslararası',
    categoryAr: 'شؤون دولية',
    link: 'https://iste.edu.tr/duyuru/uluslararasi-ogrenci-basvurulari-basladi',
    isRelevantToForeigners: true
  },
  {
    id: 'iste-news-fallback-2',
    titleTr: 'Erasmus+ Öğrenim ve Staj Hareketliliği Sonuçları Açıklandı',
    titleAr: 'إعلان نتائج منح التبادل الطلابي والتدريب Erasmus+',
    contentTr: 'Dış İlişkiler Koordinatörlüğü tarafından yürütülen Erasmus+ programı öğrenim ve staj hareketliliği başvuru sonuçları öğrenci bilgi sisteminde ilan edilmiştir.',
    contentAr: 'أعلن مكتب العلاقات الخارجية عن نتائج طلبات برنامج التبادل الدراسي والتدريب المهني Erasmus+ على نظام معلومات الطلاب.',
    date: '2026-06-18',
    categoryTr: 'Duyuru',
    categoryAr: 'إعلان',
    link: 'https://iste.edu.tr/duyuru/erasmus-sonuclari-aciklandi',
    isRelevantToForeigners: true
  },
  {
    id: 'iste-news-fallback-3',
    titleTr: 'Yabancı Uyruklu Öğrenciler İçin Türkçe Yeterlilik Sınavı',
    titleAr: 'امتحان كفاءة اللغة التركية للطلاب الأجانب (TÖMER)',
    contentTr: 'İSTE TÖMER bünyesinde yeni kayıt yaptıran yabancı uyruklu öğrenciler için Türkçe Yeterlilik Muafiyet Sınavı 1 Temmuz 2026 tarihinde yapılacaktır.',
    contentAr: 'سيعقد امتحان الإعفاء وكفاءة اللغة التركية للطلاب الأجانب المسجلين حديثاً في مركز TÖMER بجامعة İSTE في تاريخ 1 يوليو 2026.',
    date: '2026-06-15',
    categoryTr: 'Sınav Duyuruları',
    categoryAr: 'إعلانات الامتحانات',
    link: 'https://iste.edu.tr/duyuru/tomer-muafiyet-sinavi',
    isRelevantToForeigners: true
  },
  {
    id: 'iste-news-fallback-4',
    titleTr: 'Mühendislik Fakültesi Akreditasyon Başarısı',
    titleAr: 'نجاح اعتماد كلية الهندسة بجامعة إسكندرون التقنية',
    contentTr: 'Mühendislik ve Doğa Bilimleri Fakültesi bünyesindeki Bilgisayar, Elektrik-Elektronik ve İnşaat Mühendisliği bölümleri MÜDEK tarafından akredite edilmiştir.',
    contentAr: 'تم اعتماد أقسام هندسة الكمبيوتر، الهندسة الكهربائية والإلكترونية، والهندسة المدنية في كلية الهندسة والعلوم الطبيعية من قبل جمعية تقييم واعتماد البرامج الهندسية MÜDEK.',
    date: '2026-06-10',
    categoryTr: 'Haber',
    categoryAr: 'أخبار',
    link: 'https://iste.edu.tr/haber/muhendislik-akreditasyon-basarisi',
    isRelevantToForeigners: false
  },
  {
    id: 'iste-news-fallback-5',
    titleTr: 'Teknofest Başvurularında İSTE Projelerine Büyük İlgi',
    titleAr: 'اهتمام كبير بمشاريع جامعة İSTE في طلبات تكنوفست',
    contentTr: 'Türkiye\'nin en büyük teknoloji festivali Teknofest\'e bu yıl İSTE öğrencilerinden rekor sayıda proje başvurusu yapıldı. Takımlarımıza başarılar dileriz.',
    contentAr: 'تم تسجيل رقم قياسي في عدد طلبات المشاريع المقدمة من طلاب جامعة İSTE في مهرجان التكنولوجيا الأكبر في تركيا تكنوفست Teknofest هذا العام. نتمنى التوفيق لفرقنا.',
    date: '2026-06-05',
    categoryTr: 'Haber',
    categoryAr: 'أخبار',
    link: 'https://iste.edu.tr/haber/teknofest-rekordu',
    isRelevantToForeigners: false
  }
];

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes for persisting custom portal data
  app.get('/api/site-data', async (req, res) => {
    try {
      if (db) {
        const docRef = doc(db, 'portal_data', 'global_settings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return res.json({ success: true, siteData: docSnap.data() });
        } else {
          // Seed from local file if Firestore document is empty
          const filePath = path.join(process.cwd(), 'site-data.json');
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(content);
            await setDoc(docRef, parsed);
            return res.json({ success: true, siteData: parsed });
          }
          return res.json({ success: true, siteData: null });
        }
      }

      // Local fallback
      const filePath = path.join(process.cwd(), 'site-data.json');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        return res.json({ success: true, siteData: parsed });
      }
      return res.json({ success: true, siteData: null });
    } catch (err) {
      console.error('Error reading site data:', err);
      res.status(500).json({ success: false, error: 'Failed to read site data' });
    }
  });

  app.post('/api/site-data', async (req, res) => {
    try {
      const updates = req.body;
      if (db) {
        const docRef = doc(db, 'portal_data', 'global_settings');
        const docSnap = await getDoc(docRef);
        let currentData: any = {};
        if (docSnap.exists()) {
          currentData = docSnap.data();
        } else {
          // seed from local file if Firestore document is empty
          const filePath = path.join(process.cwd(), 'site-data.json');
          if (fs.existsSync(filePath)) {
            try {
              currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (e) {}
          }
        }
        const mergedData = { ...currentData, ...updates };
        await setDoc(docRef, mergedData);
        return res.json({ success: true });
      }

      // Local fallback
      const filePath = path.join(process.cwd(), 'site-data.json');
      let currentData: any = {};
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        try {
          currentData = JSON.parse(content);
        } catch (e) {
          console.error('Failed to parse existing site-data.json:', e);
        }
      }
      const mergedData = { ...currentData, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2), 'utf8');
      res.json({ success: true });
    } catch (err) {
      console.error('Error saving site data:', err);
      res.status(500).json({ success: false, error: 'Failed to save site data' });
    }
  });

  // API Route to fetch actual İSTE news scraped live from iste.edu.tr and translated via Groq AI
  app.get('/api/university-news', async (req, res) => {
    try {
      const forceRefresh = req.query.refresh === 'true' || req.query.force === 'true';
      const result = await getLiveUniversityNews(forceRefresh);
      if (result.data && result.data.length > 0) {
        return res.json({ success: true, source: result.source, data: result.data });
      }
      res.json({ success: true, source: 'fallback', data: fallbackNews });
    } catch (error) {
      console.error('Error in fetching university news:', error);
      res.json({ success: true, source: 'fallback-error', data: fallbackNews });
    }
  });

  // General AI translation route powered by Groq AI
  app.post('/api/ai/translate', async (req, res) => {
    try {
      const { text, targetLang = 'ar' } = req.body;
      if (!text) {
        return res.status(400).json({ success: false, error: 'Text is required' });
      }
      const responseText = await callGroqChat([
        {
          role: 'system',
          content: `You are an academic translation assistant for Palestinian and Turkish students. Translate the following text into ${targetLang === 'ar' ? 'clear, professional Arabic' : 'clear Turkish'}. Output only the translation without explanations.`
        },
        { role: 'user', content: text }
      ]);
      res.json({ success: true, translation: responseText });
    } catch (err: any) {
      console.error('AI translation error:', err);
      res.status(500).json({ success: false, error: err.message || 'Translation failed' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Declare vite variable to make it accessible in our custom routing handler
  let vite: any = null;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
  }

  // 1. Helper function to escape HTML attributes for safe meta tag rendering
  function escapeHtmlAttr(str: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 2. Helper function to fetch course or activity metadata from Firestore or local fallback
  async function getShareMetadata(tab: string, id: string) {
    let data: any = null;
    try {
      if (db) {
        const docRef = doc(db, 'portal_data', 'global_settings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data = docSnap.data();
        }
      }
      if (!data) {
        const filePath = path.join(process.cwd(), 'site-data.json');
        if (fs.existsSync(filePath)) {
          data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
      }
    } catch (err) {
      console.error('Error reading site data for metadata:', err);
    }

    if (!data) return null;

    if (tab === 'activities' && data.activities) {
      const activity = data.activities.find((a: any) => a.id === id);
      if (activity) {
        return {
          title: activity.title?.ar || activity.title?.tr || 'فعالية التجمع',
          description: activity.description?.ar || activity.description?.tr || '',
          image: activity.image || '',
          type: 'activity'
        };
      }
    } else if (tab === 'courses' && data.courses) {
      const course = data.courses.find((c: any) => c.id === id);
      if (course) {
        const facultyText = course.faculty?.ar || course.faculty?.tr || '';
        const deptText = course.department?.ar || course.department?.tr || '';
        const defaultDescAr = `مادة تعليمية ومكتبة رقمية تخص قسم ${deptText} في ${facultyText} بجامعة إسكندرون التقنية. تصفح الملفات المرفقة وملفات الدرايف والامتحانات السابقة المحلولة.`;
        return {
          title: course.title?.ar || course.title?.tr || 'مادة تعليمية',
          description: course.description?.ar || course.description?.tr || defaultDescAr,
          image: '',
          type: 'course'
        };
      }
    }
    return null;
  }

  // Helper to serve default logo when no custom image exists or if there is an error
  function serveDefaultLogo(res: any) {
    const localLogoPath = path.join(process.cwd(), 'src', 'assets', 'images', 'logo.jpeg');
    if (fs.existsSync(localLogoPath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(localLogoPath);
    }
    return res.status(404).send('Not Found');
  }

  // 3. API Route to serve binary images of activities or fallback logo for course sharing
  app.get('/api/share-image', async (req, res) => {
    const { tab, id } = req.query;
    if (!tab || !id) {
      return serveDefaultLogo(res);
    }

    try {
      let data: any = null;
      if (db) {
        const docRef = doc(db, 'portal_data', 'global_settings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data = docSnap.data();
        }
      }
      if (!data) {
        const filePath = path.join(process.cwd(), 'site-data.json');
        if (fs.existsSync(filePath)) {
          data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
      }

      if (!data) {
        return serveDefaultLogo(res);
      }

      let base64Image = '';

      if (tab === 'activities' && data.activities) {
        const activity = data.activities.find((a: any) => a.id === id);
        if (activity && activity.image) {
          base64Image = activity.image;
        }
      } else if (tab === 'courses' && data.courses) {
        const course = data.courses.find((c: any) => c.id === id);
        if (course && course.image) {
          base64Image = course.image;
        }
      }

      if (!base64Image && data.logo) {
        base64Image = data.logo;
      }

      if (!base64Image) {
        return serveDefaultLogo(res);
      }

      // Convert Base64 data URI to binary buffer
      const matches = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        if (base64Image.startsWith('http')) {
          return res.redirect(base64Image);
        }
        return serveDefaultLogo(res);
      }

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      return res.send(buffer);
    } catch (error) {
      console.error('Error serving share image:', error);
      return serveDefaultLogo(res);
    }
  });

  // 4. Custom Page Loader to handle dynamic Open Graph tags (dynamic SEO previews for WhatsApp, etc.)
  app.get(['/', '/index.html'], async (req, res, next) => {
    const { tab, id } = req.query;
    
    let templatePath = '';
    if (process.env.NODE_ENV !== 'production') {
      templatePath = path.join(process.cwd(), 'index.html');
    } else {
      templatePath = path.join(process.cwd(), 'dist', 'index.html');
    }

    if (!fs.existsSync(templatePath)) {
      return next();
    }

    try {
      let html = fs.readFileSync(templatePath, 'utf8');

      if (process.env.NODE_ENV !== 'production' && vite) {
        html = await vite.transformIndexHtml(req.url, html);
      }

      // Default values
      let title = 'تجمع الطلاب الفلسطينيين - جامعة إسكندرون التقنية | Filistin Öğrenci Topluluğu - İSTE';
      let description = 'المنصة الرسمية للتمثيل الطلابي والثقافي للطلاب الفلسطينيين في هاتاي بجامعة إسكندرون التقنية. نعمل على مد جسور التواصل الأكاديمي ودعم وتوجيه طلابنا.';
      const host = req.get('host') || 'filistinhatay-gt-tc.vercel.app';
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const siteUrl = `${protocol}://${host}`;
      let imageUrl = `${siteUrl}/api/share-image`;
      let pageUrl = siteUrl;

      if (tab && id) {
        const metadata = await getShareMetadata(String(tab), String(id));
        if (metadata) {
          title = `${metadata.title} | تجمع الطلاب الفلسطينيين`;
          description = metadata.description || description;
          imageUrl = `${siteUrl}/api/share-image?tab=${tab}&id=${id}`;
          pageUrl = `${siteUrl}?tab=${tab}&id=${id}`;
        }
      }

      const escapedTitle = escapeHtmlAttr(title);
      const escapedDesc = escapeHtmlAttr(description.substring(0, 200));
      const escapedImageUrl = escapeHtmlAttr(imageUrl);
      const escapedPageUrl = escapeHtmlAttr(pageUrl);

      // Replace title tag
      html = html.replace(/<title>.*?<\/title>/gi, `<title>${escapedTitle}</title>`);

      // Strip existing duplicate meta tags from static index.html to ensure clean dynamic injection
      html = html.replace(/<meta\s+property="og:[^"]+"\s+content="[^"]*"\s*\/?>/gi, '');
      html = html.replace(/<meta\s+property="twitter:[^"]+"\s+content="[^"]*"\s*\/?>/gi, '');
      html = html.replace(/<meta\s+name="twitter:[^"]+"\s+content="[^"]*"\s*\/?>/gi, '');
      html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi, '');

      // Dynamic Open Graph & Twitter meta tags
      const metaBlock = `
    <!-- Dynamic Open Graph / Share Meta Tags by AI Coding Agent -->
    <meta name="description" content="${escapedDesc}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDesc}" />
    <meta property="og:image" content="${escapedImageUrl}" />
    <meta property="og:url" content="${escapedPageUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="تجمع الطلاب الفلسطينيين" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDesc}" />
    <meta name="twitter:image" content="${escapedImageUrl}" />
      `;

      if (html.includes('</head>')) {
        html = html.replace('</head>', `${metaBlock}\n  </head>`);
      } else {
        html = html.replace('<head>', `<head>\n${metaBlock}`);
      }

      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } catch (err) {
      console.error('Error rendering dynamic page metadata:', err);
      return next();
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    if (vite) {
      app.use(vite.middlewares);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
