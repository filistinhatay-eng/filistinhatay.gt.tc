import { NewsItem, CourseItem, ActivityItem, ImportantLink, UniversityInfo, TopAnnouncement, DeptAnnouncementItem, UniversityNewsItem, DirectoryMember } from '../types';

export const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: {
      ar: "إطلاق الدليل الإرشادي للتسجيل الإلكتروني للفصل الدراسي الجديد",
      tr: "Yeni Dönem Elektronik Kayıt Başvuru Kılavuzu Yayınlandı"
    },
    content: {
      ar: "يسر الهيئة الإدارية لتجمع الطلاب الفلسطينيين في جامعة إسكندرون التقنية إطلاق الدليل الإرشادي المتكامل للتسجيل للطلاب المستجدين والحاليين. يحتوي هذا الدليل على شرح مفصل لخطوات تفعيل القيد واختيار المواد الدراسية وحل المشاكل التقنية في نظام الـ OBS. ندعو جميع الطلاب لمراجعته والتواصل معنا في حال وجود أي استفسار.",
      tr: "İskenderun Teknik Üniversitesi Filistin Öğrenci Topluluğu Yönetim Kurulu, yeni ve mevcut öğrenciler için kapsamlı kayıt kılavuzunu yayınlamaktan mutluluk duyar. Bu kılavuz, OBS sisteminde kayıt yenileme, ders seçimi ve karşılaşılan teknik sorunların çözümü hakkında ayrıntılı bilgiler içermektedir. Tüm öğrencilerin kılavuzu incelemelerini ve soruları için bizimle iletişime geçmelerini rica ederiz."
    },
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
    category: {
      ar: "إعلانات عامة",
      tr: "Genel Duyurular"
    },
    date: "2026-06-25",
    tags: [
      { ar: "تسجيل", tr: "Kayıt" },
      { ar: "جامعة إسكندرون", tr: "İSTE" },
      { ar: "مستجدين", tr: "Yeni Öğrenciler" }
    ],
    views: 142
  },
  {
    id: "news-2",
    title: {
      ar: "تجمع الطلاب ينظم معرض التراث والثقافة الفلسطينية في حرم الجامعة",
      tr: "Öğrenci Topluluğu Kampüste Filistin Kültür ve Miras Sergisi Düzenledi"
    },
    content: {
      ar: "بمشاركة واسعة من رئيس الجامعة وعمداء الكليات والطلاب من مختلف الجنسيات، أقام تجمع الطلاب الفلسطينيين معرضاً ثقافياً متكاملاً شمل زوايا للمطرزات التراثية، والصور التاريخية، والمأكولات الشعبية الفلسطينية مثل الكنافة والمسخن، بالإضافة إلى عروض الدبكة الشعبية التي لاقت تفاعلاً كبيراً من الحضور التركي والدولي، لتعزيز الروابط الثقافية وتوضيح الهوية الفلسطينية الأصيلة.",
      tr: "Rektörümüz, fakülte dekanları ve farklı uyruklardan öğrencilerin yoğun katılımıyla, Filistin Öğrenci Topluluğu kampüste kapsamlı bir kültürel sergi düzenledi. Sergide geleneksel el yapımı nakışlar, tarihi fotoğraflar ve Künefe ile Musahhan gibi Filistin'in meşhur lezzetlerinin yer aldığı köşelerin yanı sıra, Türk ve uluslararası öğrencilerden büyük ilgi gören geleneksel Dabke dans gösterileri de yer aldı. Bu etkinlik kültürel bağları güçlendirmeyi ve Filistin kimliğini tanıtmayı amaçlamaktadır."
    },
    image: "https://images.unsplash.com/photo-1605281317010-fe5fed77a941?w=800&auto=format&fit=crop&q=60",
    category: {
      ar: "أنشطة ثقافية",
      tr: "Kültürel Faaliyetler"
    },
    date: "2026-06-20",
    tags: [
      { ar: "ثقافة", tr: "Kültür" },
      { ar: "معرض", tr: "Sergi" },
      { ar: "تراث فلسطيني", tr: "Filistin Mirası" }
    ],
    views: 289
  },
  {
    id: "news-3",
    title: {
      ar: "تنظيم دورة لغة تركية تقوية مجانية بالتعاون مع مركز اللغات بالجامعة",
      tr: "Üniversite Dil Merkezi İşbirliğiyle Ücretsiz Destekleyici Türkçe Kursu Düzenleniyor"
    },
    content: {
      ar: "يعلن تجمع الطلاب عن بدء التسجيل في دورة المحادثة والكتابة باللغة التركية للمستويين المتوسط والمتقدم. تهدف الدورة إلى مساعدة الطلاب الفلسطينيين والعرب على الاندماج الأكاديمي والاجتماعي بشكل أفضل وتجاوز الصعوبات اللغوية في المحاضرات. سيقدم الدورة أساتذة مختصون من مركز لغات الجامعة في قاعات كلية الهندسة.",
      tr: "Öğrenci Topluluğu, orta ve ileri düzeyler için Türkçe konuşma ve yazma kursu kayıtlarının başladığını duyurur. Kurs, Filistinli ve Arap öğrencilerin akademik ve sosyal entegrasyonunu kolaylaştırmayı ve derslerdeki dil engellerini aşmalarına yardımcı olmayı hedeflemektedir. Kurs, Mühendislik Fakültesi dersliklerinde üniversite dil merkezinden uzman eğitmenler tarafından verilecektir."
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60",
    category: {
      ar: "أكاديمي",
      tr: "Akademik"
    },
    date: "2026-06-18",
    tags: [
      { ar: "لغات", tr: "Diller" },
      { ar: "دورة", tr: "Kurs" },
      { ar: "تركي", tr: "Türkçe" }
    ],
    views: 185
  }
];

export const initialImportantLinks: ImportantLink[] = [
  {
    id: "link-1",
    title: {
      ar: "الموقع الرسمي لجامعة إسكندرون التقنية",
      tr: "İskenderun Teknik Üniversitesi Resmi Web Sitesi"
    },
    description: {
      ar: "البوابة الرئيسية للجامعة للوصول إلى كافة الأخبار، الكليات، والإعلانات الأكاديمية الرسمية.",
      tr: "Üniversitenin tüm resmi haberlerine, fakültelerine ve akademik duyurularına erişim için ana portal."
    },
    url: "https://iste.edu.tr",
    iconName: "Globe"
  },
  {
    id: "link-2",
    title: {
      ar: "نظام شؤون الطلاب والدرجات (OBS)",
      tr: "Öğrenci Bilgi Sistemi (OBS)"
    },
    description: {
      ar: "بوابة الطالب لمتابعة العلامات، الغيابات، اختيار المواد والجدول الدراسي الفصلي.",
      tr: "Notları, devamsızlıkları, ders seçimlerini ve dönem ders programını takip etmek için öğrenci portalı."
    },
    url: "https://obs.iste.edu.tr",
    iconName: "GraduationCap"
  },
  {
    id: "link-3",
    title: {
      ar: "دليل الطالب الدولي - جامعة إسكندرون",
      tr: "İSTE Uluslararası Öğrenci Ofisi"
    },
    description: {
      ar: "موقع مكتب الطلاب الدوليين بالجامعة ويحتوي على شروط القبول، الرسوم الدراسية، ومعلومات الإقامة والفيزا.",
      tr: "Üniversite Uluslararası Öğrenci Ofisi web sitesi; kabul şartları, harç ücretleri, ikamet ve vize bilgilerini içerir."
    },
    url: "https://iste.edu.tr/uio",
    iconName: "FileText"
  },
  {
    id: "link-4",
    title: {
      ar: "بوابة المكتبة الإلكترونية المركزية",
      tr: "Merkez Kütüphane Veritabanı Portal"
    },
    description: {
      ar: "تتيح الوصول المجاني لملايين الكتب الرقمية، الأبحاث العلمية، والمقالات لطلاب الجامعة.",
      tr: "Üniversite öğrencileri için milyonlarca dijital kitaba, bilimsel araştırmaya ve makaleye ücretsiz erişim sağlar."
    },
    url: "https://kutuphane.iste.edu.tr",
    iconName: "BookOpen"
  },
  {
    id: "link-5",
    title: {
      ar: "نظام إدارة التعلم الإلكتروني (İSTE-UBOM)",
      tr: "Öğrenme Yönetim Sistemi (İSTE-UBOM)"
    },
    description: {
      ar: "البوابة الرسمية للمواد التعليمية والدروس الإلكترونية والتعليم عن بُعد.",
      tr: "Çevrimiçi uzaktan eğitim dersleri ve eğitim materyalleri için resmi portal."
    },
    url: "http://ubom.iste.edu.tr/",
    iconName: "Laptop"
  }
];

export const initialCourses: CourseItem[] = [
  {
    id: "course-1",
    title: {
      ar: "خوارزميات وهياكل البيانات - ملخصات ومسائل محلولة",
      tr: "Algoritmalar ve Veri Yapıları - Özetler ve Çözümlü Sorular"
    },
    faculty: {
      ar: "كلية الهندسة والعلوم الطبيعية",
      tr: "Mühendislik ve Doğa Bilimleri Fakültesi"
    },
    department: {
      ar: "هندسة الكمبيوتر",
      tr: "Bilgisayar Mühendisliği"
    },
    category: {
      ar: "هندسة برمجيات",
      tr: "Yazılım Mühendisliği"
    },
    description: {
      ar: "ملف متكامل يحتوي على شرح لأهم مواضيع المادة مثل الأشجار والثنائيات والفرز والبحث، بالإضافة إلى نماذج من امتحانات سابقة محلولة بالتفصيل لمساعدة طلاب السنة الثانية.",
      tr: "Ağaçlar, ikili aramalar, sıralama ve arama gibi konularda özet açıklamaların yanı sıra, ikinci sınıf öğrencilerine yardımcı olmak için ayrıntılı çözümlü eski sınav örneklerini içeren kapsamlı bir dosya."
    },
    pdfUrl: "data:application/pdf;base64,JVBERi0xLjQKJ...", // Mock PDF placeholder
    pdfName: "Algorithms_&_Data_Structures_Guide.pdf",
    pdfFiles: [
      {
        id: "pdf-1-f1",
        name: "Algorithms_&_Data_Structures_Guide.pdf",
        url: "data:application/pdf;base64,JVBERi0xLjQKJ...",
        size: "4.5 MB",
        type: "application/pdf"
      },
      {
        id: "pdf-1-f2",
        name: "Algorithms_Cheatsheet_QuickRef.pdf",
        url: "data:application/pdf;base64,JVBERi0xLjQKJ...",
        size: "1.2 MB",
        type: "application/pdf"
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=RBSGKlAia3M",
    externalUrl: "https://visualgo.net",
    driveUrl: "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j-sample-algorithms",
    dateAdded: "2026-06-22",
    year: { ar: "السنة الثانية", tr: "2. Sınıf" },
    semester: { ar: "الفصل الأول (خريف)", tr: "Güz Dönemi" },
    driveFolders: [
      {
        id: "f1-c1",
        name: {
          ar: "📚 المحاضرات وسلايدات الشرح",
          tr: "📚 Ders Slaytları ve Anlatımlar"
        },
        files: [
          { id: "fi-1-1", name: { ar: "المحاضرة 1: مقدمة في تعقيد الوقت والنمو", tr: "Ders 1: Zaman Karmaşıklığı ve Büyüme Analizi" }, type: "pdf", size: "2.4 MB", url: "#" },
          { id: "fi-1-2", name: { ar: "المحاضرة 2-3: هياكل البيانات الخطية (Arrays, Stack, Queue)", tr: "Ders 2-3: Doğrusal Veri Yapıları (Diziler, Yığın, Kuyruk)" }, type: "pdf", size: "3.8 MB", url: "#" },
          { id: "fi-1-3", name: { ar: "المحاضرة 4-5: الأشجار الثنائية وأشجار البحث (BST)", tr: "Ders 4-5: İkili Ağaçlar ve Arama Ağaçları (BST)" }, type: "pdf", size: "4.1 MB", url: "#" }
        ]
      },
      {
        id: "f1-c2",
        name: {
          ar: "📝 الامتحانات السابقة والحلول النموذجية",
          tr: "📝 Geçmiş Sınav Soruları ve Çؤ°zümleri"
        },
        files: [
          { id: "fi-2-1", name: { ar: "حل الامتحان النصفي (Midterm) لعام 2025", tr: "2025 Vize Sınavı Soruları ve Çözüm Anahtarı" }, type: "pdf", size: "1.5 MB", url: "#" },
          { id: "fi-2-2", name: { ar: "نماذج الامتحان النهائي (Final) مع الأجوبة", tr: "Geçmiş Dönem Final Sınavı Çözümlü Soru Arşivi" }, type: "pdf", size: "2.9 MB", url: "#" }
        ]
      },
      {
        id: "f1-c3",
        name: {
          ar: "💻 كود ومشاريع عملية ومصادر",
          tr: "💻 Pratik Kodlama ve Projeler"
        },
        files: [
          { id: "fi-3-1", name: { ar: "مستودع الأكواد والتمارين التطبيقية بلغة C++", tr: "C++ Pratik Kodlama ve Algoritma Örnekleri" }, type: "zip", size: "1.2 MB", url: "#" },
          { id: "fi-3-2", name: { ar: "رابط مباشر لأداة VisuAlgo لتمثيل الخوارزميات تفاعلياً", tr: "Etkileşimli Algoritma Görselleştirici (VisuAlgo)" }, type: "link", size: "رابط خارgi", url: "https://visualgo.net" }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: {
      ar: "كتاب قواعد اللغة التركية للمستوى الأول والثاني (A1 - A2)",
      tr: "Yabancılar İçin Türkçe Dilbilgisi Kılavuzu (A1 - A2)"
    },
    faculty: {
      ar: "مدرسة اللغات الأجنبية",
      tr: "Yabancı Diller Yüksekokulu"
    },
    department: {
      ar: "المدرسة التحضيرية للغات",
      tr: "Yabancı Diller Yüksekokulu"
    },
    category: {
      ar: "مستندات تعليمية للغات",
      tr: "Dil Eğitim Belgeleri"
    },
    description: {
      ar: "مرجع رائع من إعداد طلاب فلسطينيين متفوقين باللغة التركية، يشرح القواعد الأساسية، لواحق الجمع، أزمنة الأفعال، وحالات الأسماء مع أمثلة باللغتين العربية والتركية.",
      tr: "Türkçe dilinde başarılı olan Filistinli öğrenciler tarafından hazırlanan, temel dilbilgisi kurallarını, çoğul eklerini, fiil zamanlarını ve isim durumlarını Arapça ve Türkçe örneklerle açıklayan harika bir referans."
    },
    pdfUrl: "data:application/pdf;base64,JVBERi0xLjQKJ...",
    pdfName: "Turkish_A1_A2_Grammar_Arabic_Guide.pdf",
    pdfFiles: [
      {
        id: "pdf-2-f1",
        name: "Turkish_A1_A2_Grammar_Arabic_Guide.pdf",
        url: "data:application/pdf;base64,JVBERi0xLjQKJ...",
        size: "2.1 MB",
        type: "application/pdf"
      },
      {
        id: "pdf-2-f2",
        name: "Daily_Turkish_Conversation_Campus_Guide.pdf",
        url: "data:application/pdf;base64,JVBERi0xLjQKJ...",
        size: "1.1 MB",
        type: "application/pdf"
      }
    ],
    externalUrl: "https://www.turkcedersi.com",
    driveUrl: "https://drive.google.com/drive/folders/1x2y3z4a5b6c7d8e9f-sample-turkish",
    dateAdded: "2026-06-15",
    year: { ar: "السنة التحضيرية", tr: "Hazırlık Sınıfı" },
    semester: { ar: "الفصل الأول (خريف)", tr: "Güz Dönemi" },
    driveFolders: [
      {
        id: "f2-c1",
        name: {
          ar: "📖 كتب المنهج المعتمدة والملخصات",
          tr: "📖 Ders Kitapları ve Özetler"
        },
        files: [
          { id: "fi-2-1-1", name: { ar: "منهج إسطنبول لتعليم التركية للأجانب - كتاب الطالب A1", tr: "Yabancılar İçin İstanbul Türkçe Öğretim Seti Ders Kitabı A1" }, type: "pdf", size: "15.4 MB", url: "#" },
          { id: "fi-2-1-2", name: { ar: "منهج إسطنبول لتعليم التركية للأجانب - كتاب التمارين A1", tr: "İstanbul Türkçe Öğretim Seti Çalışma Kitabı A1" }, type: "pdf", size: "8.2 MB", url: "#" },
          { id: "fi-2-1-3", name: { ar: "دليل القواعد المختصر بالأمثلة العربية لطلاب A1-A2", tr: "Arapça Anlatımlı Pratik Türkçe Dilbilgisi Kılavuzu A1-A2" }, type: "pdf", size: "2.1 MB", url: "#" }
        ]
      },
      {
        id: "f2-c2",
        name: {
          ar: "🗣️ محادثات صوتية وتمارين استماع",
          tr: "🗣️ Dinleme ve Pratik Dosyaları"
        },
        files: [
          { id: "fi-2-2-1", name: { ar: "أهم 100 جملة محادثة مستخدمة في الحرم الجامعي", tr: "Kampüste En Çok Kullanılan 100 Pratik Türkçe Kalıp" }, type: "pdf", size: "1.1 MB", url: "#" },
          { id: "fi-2-2-2", name: { ar: "الملفات الصوتية المرفقة بدرس الاستماع الأول", tr: "İstanbul Türkçe Seti A1 Dinleme Dosyaları Arşivi" }, type: "zip", size: "24.5 MB", url: "#" }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: {
      ar: "الرياضيات الهندسية 1 - كالكولاس شرح وتمارين",
      tr: "Genel Matematik I - Calculus Konu Anlatımı ve Soru Çözümleri"
    },
    faculty: {
      ar: "كلية الهندسة والعلوم الطبيعية",
      tr: "Mühendislik ve Doğa Bilimleri Fakültesi"
    },
    department: {
      ar: "الهندسة المدنية",
      tr: "İnşaat Mühendisliği"
    },
    category: {
      ar: "علوم أساسية",
      tr: "Temel Bilimler"
    },
    description: {
      ar: "سلسلة شروحات في التفاضل والتكامل، النهايات، المشتقات، وتطبيقات التكامل، مخصصة لطلاب السنة الأولى في التخصصات الهندسية المختلفة في جامعة إسكندرون التقنية.",
      tr: "İskenderun Teknik Üniversitesi'ndeki farklı mühendislik bölümlerinin birinci sınıf öğrencilerine yönelik limit, türev, integral ve integral uygulamaları konularını içeren ders notları ve çözümlü pratik çalışma soruları."
    },
    pdfUrl: "data:application/pdf;base64,JVBERi0xLjQKJ...",
    pdfName: "Calculus_1_Engineering_Notes.pdf",
    pdfFiles: [
      {
        id: "pdf-3-f1",
        name: "Calculus_1_Engineering_Notes.pdf",
        url: "data:application/pdf;base64,JVBERi0xLjQKJ...",
        size: "3.2 MB",
        type: "application/pdf"
      },
      {
        id: "pdf-3-f2",
        name: "Calculus_Limit_Derivative_Solved_Examples.pdf",
        url: "data:application/pdf;base64,JVBERi0xLjQKJ...",
        size: "1.8 MB",
        type: "application/pdf"
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=W_YgPZ08oOQ",
    driveUrl: "https://drive.google.com/drive/folders/1m2n3o4p5q6r7s8t9u-sample-calculus",
    dateAdded: "2026-06-10",
    year: { ar: "السنة الأولى", tr: "1. Sınıf" },
    semester: { ar: "الفصل الأول (خريف)", tr: "Güz Dönemi" },
    driveFolders: [
      {
        id: "f3-c1",
        name: {
          ar: "📚 دفاتر المادة والمذكرات الورقية",
          tr: "📚 Ders Notları ve Özet Föyler"
        },
        files: [
          { id: "fi-3-1-1", name: { ar: "الباب الأول: النهايات والاتصال وتطبيقاتها", tr: "Bölüm 1: Limit ve Süreklilik Konu Anlatım Defteri" }, type: "pdf", size: "3.2 MB", url: "#" },
          { id: "fi-3-1-2", name: { ar: "الباب الثاني: قواعد الاشتقاق وتطبيقات القيم القصوى", tr: "Bölüm 2: Türev Kuralları ve Maksimum-Minimum Uygulamaları" }, type: "pdf", size: "4.7 MB", url: "#" },
          { id: "fi-3-1-3", name: { ar: "الباب الثالث: التكامل المحدد وغير المحدد وحساب المساحة", tr: "Bölüm 3: Belirli ve Belirsiz İntegral, Alan ve Hacim Hesabı" }, type: "pdf", size: "5.5 MB", url: "#" }
        ]
      },
      {
        id: "f3-c2",
        name: {
          ar: "✍️ تمارين محلولة ونماذج امتحانات سابقة",
          tr: "✍️ Çözümlü Alıştırmalar ve Sınav Arşivi"
        },
        files: [
          { id: "fi-3-2-1", name: { ar: "بنك الأسئلة المعتمد - 150 سؤالاً محلولاً بالتفصيل للامتحان النهائي", tr: "Analiz I Sınavına Hazırlık - 150 Çözümlü Alıştırma Kitapçığı" }, type: "pdf", size: "6.8 MB", url: "#" },
          { id: "fi-3-2-2", name: { ar: "حل نموذج امتحان منتصف الفصل خريف 2024", tr: "Güz 2024 Dönemi Vize Sınavı Çözüm Anahtarı" }, type: "pdf", size: "1.8 MB", url: "#" }
        ]
      }
    ]
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: "activity-1",
    title: {
      ar: "يوم التراث الفلسطيني والقدس في الحرم الجامعي",
      tr: "Kampüste Filistin Miras ve Kudüs Günü Etkinliği"
    },
    description: {
      ar: "يدعوكم تجمع الطلاب الفلسطينيين بالتعاون مع عمادة شؤون الطلاب للمشاركة الفعالة في يوم التراث الفلسطيني. سيتخلل الفعالية معرض فني، سرد لتاريخ القضية، زاوية لارتداء الكوفية والتقاط الصور، تذوق الأكلات الشعبية وفقرات إنشادية تراثية ودبكة جماعية. الحضور مفتوح لجميع الطلاب والمدرسين بالجامعة.",
      tr: "Filistin Öğrenci Topluluğu, Sağlık Kültür ve Spor Daire Başkanlığı işbirliğiyle sizleri Filistin Miras Günü etkinliğine davet ediyor. Etkinlikte sanat sergisi, Filistin davasının tarihi anlatımı, poşu (Keffiyeh) takıp fotoğraf çekilme köşesi, yöresel lezzetlerin ikramı, geleneksel şarkılar ve Dabke halk dansları yer alacaktır. Katılım tüm üniversite öğrencilerine ve akademisyenlerine açıktır."
    },
    date: "2026-07-05",
    time: "12:00 - 16:30",
    location: {
      ar: "القاعة الزرقاء الكبرى والساحة الخارجية - الحرم الرئيسي",
      tr: "Mavi Büyük Salon ve Dış Bahçe - Merkez Kampüs"
    },
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60",
    registrationEnabled: true,
    registeredCount: 47,
    maxSeats: 150,
    registrations: []
  },
  {
    id: "activity-2",
    title: {
      ar: "ورشة عمل: الإرشاد الأكاديمي والتحضير للفصل الدراسي الجديد",
      tr: "Çalıştay: Akademik Rehberlik ve Yeni Döneme Hazırlık"
    },
    description: {
      ar: "ورشة عمل يلقيها نخبة من الطلاب المتميزين في السنوات المتقدمة والخريجين لتقديم النصائح حول كيفية اختيار المواد الدراسية، زيادة المعدل التراكمي (GPA)، وكيفية الاستفادة القصوى من الخدمات المكتبية والمختبرات بالجامعة، إضافةً إلى التوجيه بخصوص السكن والإقامة والمنح المتاحة.",
      tr: "Üst sınıflardaki başarılı öğrenciler ve mezunlar tarafından verilecek bu çalıştayda ders seçimi, genel not ortalamasını (GNO) yükseltme, üniversitenin kütüphane ve laboratuvar imkanlarından en iyi şekilde yararlanma gibi konular ele alınacaktır. Ayrıca barınma, ikamet izni ve burslar hakkında rehberlik sağlanacaktır."
    },
    date: "2026-07-02",
    time: "14:00 - 16:00",
    location: {
      ar: "قاعة الندوات - مكتبة الجامعة المركزية",
      tr: "Seminer Salonu - Merkez Kütüphane"
    },
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60",
    registrationEnabled: true,
    registeredCount: 18,
    maxSeats: 50,
    registrations: []
  },
  {
    id: "activity-3",
    title: {
      ar: "بطولة التجمع السنوية لكرة القدم السباعية",
      tr: "Geleneksel Öğrenci Topluluğu 7'li Halı Saha Futbol Turnuvası"
    },
    description: {
      ar: "ينظم تجمع الطلاب بطولة كرة قدم ودية تجمع فرقاً من مختلف الكليات والجنسيات في الجامعة لتعزيز أواصر الصداقة والترابط الاجتماعي والرياضي. يرجى من قادة الفرق تسجيل بيانات اللاعبين قبل الموعد المحدد. ستُوزع كؤوس وميداليات للفرق الفائزة بالمركزين الأول والثاني.",
      tr: "Öğrenci Topluluğu, dostluk, sosyal kaynaşma ve spor kültürünü pekiştirmek amacıyla üniversitedeki farklı fakülte ve uyruklardan takımları bir araya getiren dostluk futbol turnuvası düzenliyor. Takım kaptanlarının oyuncu bilgilerini belirtilen tarihten önce kaydetmesi rica olunur. Dereceye giren birinci ve ikinci takımlara kupa ve madalyalar verilecektir."
    },
    date: "2026-07-12",
    time: "17:00 - 21:00",
    location: {
      ar: "الملاعب العشبية بالمدينة الرياضية للجامعة",
      tr: "Üniversite Spor Kompleksi Halı Sahaları"
    },
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60",
    registrationEnabled: true,
    registeredCount: 8,
    maxSeats: 16, // number of teams
    registrations: []
  },
  {
    id: "activity-past-1",
    title: {
      ar: "معرض التراث والثقافة الفلسطينية الأول",
      tr: "1. Filistin Miras ve Kültür Sergisi"
    },
    description: {
      ar: "أقام تجمع الطلاب الفلسطينيين معرضاً ثقافياً متكاملاً شمل زوايا للمطرزات التراثية، والصور التاريخية لمدن فلسطين، والمأكولات الشعبية لتعزيز الهوية والوعي الثقافي والوطني.",
      tr: "Öğrenci topluluğumuz, kültürel kimliği pekiştirmek amacıyla geleneksel el sanatları, tarihi şehir resimleri ve yöresel lezzetler içeren kapsamlı bir kültür sergisi düzenlemiştir."
    },
    date: "2025-11-20",
    time: "10:00 - 17:00",
    location: {
      ar: "بهو كلية الهندسة - الحرم الرئيسي",
      tr: "Mühendislik Fakültesi Fuaye Alanı"
    },
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop&q=60",
    registrationEnabled: false,
    registeredCount: 120,
    maxSeats: 150,
    registrations: [],
    isPast: true
  },
  {
    id: "activity-past-2",
    title: {
      ar: "دورة أساسيات البرمجة بالتعاون مع قسم الحاسوب",
      tr: "Bilgisayar Bölümü İşbirliğiyle Temel Programlama Eğitimi"
    },
    description: {
      ar: "سلسلة من ورش العمل التفاعلية لتعليم لغة Python وحل المشكلات البرمجية للطلاب الجدد لتسهيل انطلاقتهم الأكاديمية.",
      tr: "Yeni öğrencilerin akademik başlangıçlarını kolaylaştırmak için Python dili ve algoritma geliştirmeyi amaçlayan etkileşimli bir çalıştay serisi."
    },
    date: "2026-03-10",
    time: "15:00 - 17:00",
    location: {
      ar: "مختبر الحاسوب المركزي - كلية الهندسة",
      tr: "Merkez Bilgisayar Laboratuvarı - Mühendislik Fakültesi"
    },
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    registrationEnabled: false,
    registeredCount: 35,
    maxSeats: 40,
    registrations: [],
    isPast: true
  }
];

export const initialUniversityInfo: UniversityInfo = {
  id: "univ-1",
  description: {
    ar: "تأسست جامعة إسكندرون التقنية (İSTE) في عام 2015 كواحدة من الجامعات الحكومية الرائدة التي تركز بشكل كبير على العلوم التقنية، والتطوير التكنولوجي، والعلوم البحرية في تركيا. تقع الجامعة في مدينة إسكندرون الساحلية الجميلة في محافظة هاتاي، وتتميز ببنيتها التحتية الحديثة ومختبراتها المتطورة وشراكاتها القوية مع القطاعات الصناعية والبحرية.",
    tr: "İskenderun Teknik Üniversitesi (İSTE), 2015 yılında teknik bilimlere, teknolojik gelişmeye ve denizcilik bilimlerine güçlü bir odaklanmayla kurulan öncü devlet üniversitelerinden biridir. Hatay'ın şirin sahil kenti İskenderun'da yer alan üniversite, modern altyapısı, gelişmiş laboratuvarları ve endüstriyel ile denizcilik sektörleriyle kurduğu güçlü işbirlikleri ile dikkat çekmektedir."
  },
  history: {
    ar: "انفصلت الجامعة عن جامعة مصطفى كمال وبدأت مسيرتها كصرح أكاديمي تكنولوجي فريد يهدف لإنتاج المعرفة وتحويلها إلى تكنولوجيا قابلة للتطبيق الصناعي والريادي. تضم الجامعة اليوم آلاف الطلاب الأتراك والدوليين ومنهم العشرات من الطلاب الفلسطينيين الذين يسعون للتميز الأكاديمي في مجالات الهندسة، العمارة، الطيران، والبحار.",
    tr: "Mustafa Kemal Üniversitesi bünyesindeki mühendislik ve denizcilik birimlerinin ayrılmasıyla kurulan İSTE, bilgiyi üretmeyi ve onu endüstriyel ile girişimci uygulanabilir teknolojiye dönüştürmeyi amaçlayan benzersiz bir teknolojik akademik yapı olarak yolculuğuna başladı. Bugün üniversite, mühendislik, mimarlık, havacılık ve denizcilik gibi alanlarda akademik başarıyı hedefleyen onlarca Filistinli öğrenci de dahil olmak üzere binlerce Türk ve uluslararası öğrenciye ev sahipliği yapmaktadır."
  },
  faculties: [
    {
      name: {
        ar: "كلية الهندسة والعلوم الطبيعية",
        tr: "Mühendislik ve Doğa Bilimleri Fakültesi"
      },
      departments: [
        { ar: "هندسة الكمبيوتر", tr: "Bilgisayar Mühendisliği" },
        { ar: "الهندسة الكهربائية والإلكترونية", tr: "Elektrik-Elektronik Mühendisliği" },
        { ar: "الهندسة المدنية", tr: "İnşaat Mühendisliği" },
        { ar: "الهندسة الميكانيكية", tr: "Makine Mühendisliği" },
        { ar: "الهندسة الكيميائية", tr: "Kimya Mühendisliği" },
        { ar: "هندسة المعادن والمواد", tr: "Metalurji ve Malzeme Mühendisliği" },
        { ar: "الهندسة الصناعية", tr: "Endüstri Mühendisliği" }
      ]
    },
    {
      name: {
        ar: "كلية بارباروس خير الدين لبناء السفن والعلوم البحرية",
        tr: "Barbaros Hayrettin Gemi İnşaatı ve Denizcilik Fakültesi"
      },
      departments: [
        { ar: "هندسة بناء السفن والآلات البحرية", tr: "Gemi İnşaatı ve Gemi Makineleri Mühendisliği" },
        { ar: "إدارة النقل البحري واللوجستيات", tr: "Deniz Ulaştırma İşletme Mühendisliği" }
      ]
    },
    {
      name: {
        ar: "كلية الطيران والعلوم الفضائية",
        tr: "Havacılık ve Uzay Bilimleri Fakültesi"
      },
      departments: [
        { ar: "إدارة الطيران", tr: "Havacılık Yönetimi" },
        { ar: "هندسة الطيران والـجوفضاء", tr: "Havacılık ve Uzay Mühendisliği" }
      ]
    },
    {
      name: {
        ar: "كلية العمارة والتصميم",
        tr: "Mimarlık ve Tasarım Fakültesi"
      },
      departments: [
        { ar: "الهندسة المعمارية", tr: "Mimarlık" },
        { ar: "عمارة المناظر الطبيعية (اللاندسكيب)", tr: "Peyzaj Mimarlığı" },
        { ar: "التصميم الصناعي", tr: "Endüstriyel Tasarım" }
      ]
    },
    {
      name: {
        ar: "كلية السياحة",
        tr: "Turizm Fakültesi"
      },
      departments: [
        { ar: "الإرشاد السياحي", tr: "Turist Rehberliği" },
        { ar: "إدارة الفنادق والضيافة", tr: "Turizm İşletmeciliği" },
        { ar: "فن الطهي والطهو", tr: "Gastronomi ve Mutfak Sanatları" }
      ]
    },
    {
      name: {
        ar: "مدرسة اللغات الأجنبية",
        tr: "Yabancı Diller Yüksekokulu"
      },
      departments: [
        { ar: "المدرسة التحضيرية للغات", tr: "Hazırlık Sınıfı" }
      ]
    }
  ],
  contactEmail: "filistin.hatay@gmail.com",
  contactPhone: "+90 (326) 613 56 00",
  address: {
    ar: "شارع مصطفى كمال، الحي المركزي، 31200 إسكندرون، هاتاي، تركيا",
    tr: "Mustafa Kemal Mah. Merkez Kampüs, 31200 İskenderun / Hatay, Türkiye"
  },
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3209.6895318684994!2d36.19502757656641!3d36.56157147229707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152fa979f8b4a2ab%3A0xe54d6a13d1cf50c3!2s%C4%B0skenderun%20Teknik%20%C3%9Cniversitesi%20(%C4%B0STE)!5e0!3m2!1str!2str!4v1719440000000!5m2!1str!2str"
};

export const initialAnnouncements: TopAnnouncement[] = [
  {
    id: "ann-1",
    text: {
      ar: "📢 التسجيل للفصل الدراسي الجديد يبدأ في 1 يوليو - تجمع الطلاب متواجد يومياً في كلية الهندسة لمساعدتكم في الإجراءات وتثبيت القيد.",
      tr: "📢 Yeni dönem ders kayıtları 1 Temmuz'da başlıyor - Öğrenci Topluluğu işlemlerinizde yardımcı olmak için her gün Mühendislik Fakültesinde hazır bulunacaktır."
    },
    type: "info",
    active: true
  },
  {
    id: "ann-2",
    text: {
      ar: "🇵🇸 ترقبوا فعالية 'يوم التراث الفلسطيني والقدس' في حرم الجامعة الرئيسي يوم الأربعاء 5 يوليو. تفاصيل التسجيل متوفرة في قسم الأنشطة.",
      tr: "🇵🇸 Merkez kampüsümüzde düzenlenecek 'Filistin Kültür ve Kudüs Günü' etkinliğimize davetlisiniz. Kayıt detayları Aktiviteler sekmesinde yer almaktadır."
    },
    type: "critical",
    active: true
  },
  {
    id: "ann-3",
    text: {
      ar: "📚 تم رفع ملفات تلخيص وهامش المذاكرة لمادة 'خوارزميات وهياكل البيانات' في قسم المواد التعليمية باللغتين.",
      tr: "📚 Veri Yapıları ve Algoritmalar dersi için hazırlanmış Türkçe ve Arapça özet ve pratik ders çalışma notları Eğitim Materyalleri sekmesine yüklenmiştir."
    },
    type: "warning",
    active: true
  }
];

export const initialDeptAnnouncements: DeptAnnouncementItem[] = [
  {
    id: "dept-ann-1",
    title: {
      ar: "تعديل جدول امتحان مادة هياكل البيانات والبرمجة",
      tr: "Veri Yapıları ve Algoritmalar Sınav Programı Değişikliği"
    },
    faculty: { ar: "كلية الهندسة والعلوم الطبيعية", tr: "Mühendislik ve Doğa Bilimleri Fakültesi" },
    department: { ar: "هندسة الكمبيوتر", tr: "Bilgisayar Mühendisliği" },
    description: {
      ar: "نحيطكم علماً بأنه قد تم نقل موعد امتحان مادة هياكل البيانات والبرمجة ليصبح يوم الإثنين القادم الساعة 10:00 صباحاً في قاعة 204 بدلاً من يوم الأحد بسبب تعارض الجداول المباشر في الكلية.",
      tr: "Ders çakışmaları nedeniyle, Veri Yapıları ve Algoritmalar sınav saati önümüzdeki Pazartesi günü saat 10:00'da Derslik 204 olarak güncellenmiştir."
    },
    dateAdded: "2026-06-25",
    pdfFiles: [],
    externalUrl: ""
  },
  {
    id: "dept-ann-2",
    title: {
      ar: "إعلان هام لطلاب السنة التحضيرية - نموذج امتحان الإعفاء",
      tr: "Hazırlık Sınıfı Öğrencileri İçin Muafiyet Sınavı Örneği"
    },
    faculty: { ar: "مدرسة اللغات الأجنبية", tr: "Yabancı Diller Yüksekokulu" },
    department: { ar: "المدرسة التحضيرية للغات", tr: "Hazırlık Sınıfı" },
    description: {
      ar: "تم رفع ملف يحتوي على النماذج الاسترشادية لامتحان معافاة اللغة الإنجليزية والتركية لطلاب التحضيري الجدد لمساعدتكم في الاستعداد للامتحان القادم.",
      tr: "Yeni kayıtlı hazırlık öğrencileri için İngilizce ve Türkçe muafiyet sınavlarına hazırlık olması amacıyla eski dönem sınav örnekleri ve kılavuzu eklenmiştir."
    },
    dateAdded: "2026-06-24",
    pdfFiles: [
      {
        id: "file-muafiyet-1",
        name: "Yabancı Dil Muafiyet Sınav Kılavuzu.pdf",
        url: "https://iste.edu.tr/ydyo",
        size: "1.4 MB",
        type: "pdf"
      }
    ],
    externalUrl: "https://iste.edu.tr/ydyo"
  },
  {
    id: "dept-ann-3",
    title: {
      ar: "مشروع التخرج الأول لقسم الهندسة الصناعية",
      tr: "Endüstri Mühendisliği Bitirme Projesi I Esasları"
    },
    faculty: { ar: "كلية الهندسة والعلوم الطبيعية", tr: "Mühendislik ve Doğa Bilimleri Fakültesi" },
    department: { ar: "الهندسة الصناعية", tr: "Endüstri Mühendisliği" },
    description: {
      ar: "إلى جميع طلاب السنة الأخيرة في قسم الهندسة الصناعية، يرجى مراجعة الكتيب المرفق الذي يوضح القواعد العامة والمعايير المطلوبة لاختيار وتسليم مقترحات مشاريع التخرج لهذا الفصل الدراسي والمواعيد النهائية للتسليم.",
      tr: "Endüstri Mühendisliği son sınıf öğrencilerinin dikkatine: Bu dönemki bitirme projelerinin konu seçimi ve teslim kriterlerini açıklayan esaslar kılavuzu ekte sunulmuştur."
    },
    dateAdded: "2026-06-26",
    pdfFiles: [
      {
        id: "file-ind-1",
        name: "Endüstri_Muhendisligi_Bitirme_Projesi_Esaslari.pdf",
        url: "#",
        size: "820 KB",
        type: "pdf"
      }
    ],
    externalUrl: ""
  }
];

export const initialUniversityNews: UniversityNewsItem[] = [
  {
    id: 'iste-live-2026-08-14-1',
    titleTr: 'İSKENDERUN TEKNİK ÜNİVERSİTESİ 2026-2027 EĞİTİM-ÖĞRETİM YILI ÖN LİSANS VE LİSANS DÜZEYİNDE 2. ULUSLARARASI ÖĞRENCİ ALIM İLANI',
    titleAr: 'إعلان القبول الثاني للطلاب الدوليين لدرجتي الدبلوم والبكالوريوس للعام الدراسي 2026-2027',
    contentTr: 'Üniversitemiz ön lisans ve lisans programlarına, 2025 veya 2026 yılında yapılmış olan ÖSYM Türkiye Yurt Dışından Öğrenci Kabul Sınavı (TR-YÖS) sınavının sonuçlarına göre uluslararası öğrenci alınacaktır. Başvurular online sistem üzerinden alınacaktır.',
    contentAr: 'أعلنت جامعة إسكندرون التقنية عن فتح باب القبول الثاني للطلاب الدوليين في برامج الدبلوم والبكالوريوس بناءً على نتائج اختبار TR-YÖS لعامي 2025 أو 2026. يتم التقديم إلكترونياً عبر بوابة التسجيل الرسمية.',
    date: '2026-08-14',
    categoryTr: 'Öğrenci İşleri',
    categoryAr: 'شؤون الطلاب والقبول',
    link: 'https://iste.edu.tr/duyuru-merkezi/oidb/2026/08/14/6853',
    isRelevantToForeigners: true
  },
  {
    id: 'iste-live-2026-08-14-2',
    titleTr: 'Af Başvurusunda Bulunacak Öğrencilerin Dikkatine (Geçici 85. Madde)',
    titleAr: 'تنبيه هام للطلاب الراغبين في التقديم على العفو الطلابي وإعادة القيد (المادة 85)',
    contentTr: '2547 Sayılı Yükseköğretim Kanunu\'nun Geçici 85. Maddesi kapsamında yeniden öğrenim hakkı; 9 Ağustos 2026 tarihli Resmi Gazete\'de yayımlanarak yürürlüğe girmiştir. Başvurular enstitü müdürlüklerine yapılacaktır.',
    contentAr: 'تم تفعيل حق إعادة الدراسة بموجب المادة المؤقتة 85 من قانون التعليم العالي رقم 2547 الصادر في الجريدة الرسمية بتاريخ 9 أغسطس 2026. يمكن للطلاب المفصولين والمنقطعين التقديم لدى إدارة الكليات والمعاهد.',
    date: '2026-08-14',
    categoryTr: 'Lisansüstü / Öğrenci İşleri',
    categoryAr: 'دراسات عليا وشؤون الطلاب',
    link: 'https://www.iste.edu.tr/duyuru-merkezi/lee/2026/08/14/6855',
    isRelevantToForeigners: true
  },
  {
    id: 'iste-live-2026-08-03-3',
    titleTr: '2026 YKS Sonuçlarına Göre Yeni Kayıt Yaptıracak Öğrencilerimizin Dikkatine',
    titleAr: 'توجيهات وإرشادات التسجيل للطلبة الجدد المقبولين في جامعة إسكندرون التقنية',
    contentTr: 'Bizi İSTE\'yen ve Tercih Eden Sevgili Öğrencilerimiz, İSTE Ailesine Hoş Geldiniz. 2026 yılı YKS sonuçlarına göre Üniversitemize yerleşen adayların e-devlet üzerinden veya şahsen kayıt tarihleri açıklanmıştır.',
    contentAr: 'ترحب جامعة إسكندرون بالطلبة الجدد. تم الإعلان عن مواعيد وإجراءات تثبيت القيد والتسجيل الإلكتروني عبر بوابة e-Devlet والتسجيل الحضوري للعام الدراسي الجديد.',
    date: '2026-08-03',
    categoryTr: 'Öğrenci İşleri',
    categoryAr: 'شؤون الطلاب والتسجيل',
    link: 'https://iste.edu.tr/duyuru-merkezi/oidb/2026/08/03/6814',
    isRelevantToForeigners: false
  },
  {
    id: 'iste-live-2026-08-04-4',
    titleTr: 'Yabancı Diller Yüksekokulu Muafiyet ve Yeterlilik Sınavı Takvimi',
    titleAr: 'جدول امتحانات الإعفاء وتحديد المستوى في مدرسة اللغات الأجنبية',
    contentTr: '2026-2027 Eğitim Öğretim Yılı Güz Yarıyılı Zorunlu Yabancı Dil Hazırlık Sınıfı Yeterlilik ve Muafiyet Sınavı takvimi ilan edilmiştir.',
    contentAr: 'تم الإعلان عن جدول ومواعيد امتحانات الكفاءة والإعفاء من السنة التحضيرية للغات الأجنبية للفصل الدراسي الخريفي 2026-2027.',
    date: '2026-08-04',
    categoryTr: 'Yabancı Diller',
    categoryAr: 'اللغات الأجنبية والتحضيري',
    link: 'https://iste.edu.tr/duyuru-merkezi/mydk/2026/08/04/6817',
    isRelevantToForeigners: true
  }
];

export const initialDirectoryMembers: DirectoryMember[] = [
  {
    id: "member-1",
    name: {
      ar: "عبد الرحمن أبو دقة",
      tr: "Abdelrahman Abu Daqqa"
    },
    major: {
      ar: "هندسة الكمبيوتر والبرمجيات",
      tr: "Bilgisayar Mühendisliği"
    },
    category: {
      ar: "الهيئة الإدارية",
      tr: "Yönetim Kurulu"
    },
    roleTitle: {
      ar: "رئيس تجمع الطلاب الفلسطينيين",
      tr: "Topluluk Başkanı"
    },
    academicYear: {
      ar: "سنة رابعة",
      tr: "4. Sınıf"
    },
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    email: "filistin.hatay@gmail.com",
    phone: "+90 552 000 00 00",
    linkedin: "https://linkedin.com",
    bio: {
      ar: "مهتم بالأنظمة السحابية والذكاء الاصطناعي، ومسؤول عن تنسيق أنشطة التجمع والربط الأكاديمي مع الجامعة.",
      tr: "Bulut sistemleri ve yapay zeka ile ilgileniyor, topluluk etkinlikleri ve üniversite ile akademik koordinasyondan sorumlu."
    }
  }
];
