import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

interface UniversityNewsItem {
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

const PORT = 3000;

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

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Routes for persisting custom portal data
  app.get('/api/site-data', (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'site-data.json');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        return res.json({ success: true, siteData: parsed });
      }
      return res.json({ success: true, siteData: null });
    } catch (err) {
      console.error('Error reading site-data.json:', err);
      res.status(500).json({ success: false, error: 'Failed to read site data' });
    }
  });

  app.post('/api/site-data', (req, res) => {
    try {
      const updates = req.body;
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
      console.error('Error saving site-data.json:', err);
      res.status(500).json({ success: false, error: 'Failed to save site data' });
    }
  });

  // API Route to fetch actual İSTE news via Gemini Search Grounding
  app.get('/api/university-news', async (req, res) => {
    const client = getGeminiClient();
    if (!client) {
      console.log('No GEMINI_API_KEY found. Returning fallback university news.');
      return res.json({ success: true, source: 'fallback', data: fallbackNews });
    }

    try {
      const prompt = `Search the web for the latest duyurular (announcements), breaking news, and haberler (news) from İskenderun Teknik Üniversitesi (İSTE) official website (iste.edu.tr).
Identify the latest important announcements and news, specifically looking for those relevant to international students, Erasmus+, foreigner applications, registration guides, departments, or general critical academic news.
Produce a JSON array of up to 6 objects. For each object, translate the original Turkish text to Arabic. Maintain Turkish text for Tr fields and Arabic text for Ar fields.
Ensure the date is formatted as YYYY-MM-DD.
Format the output as a valid JSON array of objects with the following schema:
- id: e.g. "iste-news-1"
- titleTr: Title in Turkish
- titleAr: Title translated to Arabic
- contentTr: Content summary in Turkish
- contentAr: Content summary translated to Arabic
- date: Date in YYYY-MM-DD
- categoryTr: Category in Turkish (e.g., Duyuru, Haber)
- categoryAr: Category in Arabic
- link: URL link to the original announcement on iste.edu.tr (e.g., https://iste.edu.tr/duyuru/...)
- isRelevantToForeigners: boolean (true if it concerns international students, foreigners, English-taught programs, or admissions)

Return ONLY valid JSON.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                titleTr: { type: Type.STRING },
                titleAr: { type: Type.STRING },
                contentTr: { type: Type.STRING },
                contentAr: { type: Type.STRING },
                date: { type: Type.STRING },
                categoryTr: { type: Type.STRING },
                categoryAr: { type: Type.STRING },
                link: { type: Type.STRING },
                isRelevantToForeigners: { type: Type.BOOLEAN }
              },
              required: [
                'id', 'titleTr', 'titleAr', 'contentTr', 'contentAr',
                'date', 'categoryTr', 'categoryAr', 'link', 'isRelevantToForeigners'
              ]
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ success: true, source: 'gemini-search', data: parsed });
        }
      }

      res.json({ success: true, source: 'fallback', data: fallbackNews });
    } catch (error) {
      console.error('Error in fetching university news:', error);
      res.json({ success: true, source: 'fallback-error', data: fallbackNews });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
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
