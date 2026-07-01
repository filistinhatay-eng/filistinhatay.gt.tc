import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, MultilingualText } from '../types';

interface LanguageContextType {
  language: Language;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ar']) => string;
  getText: (text: MultilingualText | undefined | null) => string;
}

const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    news: "الأخبار والإعلانات",
    links: "روابط هامة",
    courses: "المواد والمساقات",
    deptAnnouncements: "إعلانات الأقسام",
    activities: "الأنشطة والفعاليات",
    pastActivities: "الأنشطة السابقة",
    university: "عن الجامعة (İSTE)",
    admin: "لوحة التحكم",
    adminPanelTitle: "بوابة الإدارة المشتركة",
    languageLabel: "Türkçe",
    languageCode: "TR",

    // Banner & Headers
    announcementsTitle: "إعلانات عاجلة",
    portalTitle: "تجمع الطلاب الفلسطينيين",
    universitySubTitle: "جامعة إسكندرون التقنية",
    welcomeHeader: "صوت الطلاب ورابطة الثقافة الأكاديمية في İSTE",
    welcomeSub: "نعمل على دعم مسيرتكم الأكاديمية والاحتفاظ بالهوية الثقافية الفلسطينية وتسهيل اندماجكم في الحياة الجامعية التركية.",
    learnMore: "استكشف المزيد",
    viewAll: "عرض الكل",
    searchPlaceholder: "ابحث عن أخبار، مواد، فعاليات...",
    searchBtn: "بحث",

    // News Section
    latestNews: "آخر مستجدات وأخبار التجمع",
    newsCategories: "التصنيفات",
    newsTags: "الوسوم",
    newsViews: "مشاهدة",
    allCategories: "كل التصنيفات",
    noNewsFound: "لم يتم العثور على أخبار تطابق بحثك.",
    readMore: "اقرأ التفاصيل",
    backToNews: "العودة للأخبار",

    // Links Section
    usefulPortals: "البوابات والمواقع الرسمية الهامة",
    portalsSub: "روابط سريعة وموثوقة تهم الطالب خلال مسيرته الجامعية اليومية والأكاديمية.",
    visitSite: "زيارة الموقع الرسمي",

    // Courses Section
    academicMaterials: "المكتبة الرقمية والمواد التعليمية",
    materialsSub: "ملخصات، كتب ومحاضرات مساعدة من إعداد طلاب متفوقين ومصنفة حسب الأقسام.",
    deptAnnouncementsSub: "تصفح الإعلانات والتنبيهات الرسمية الموجهة لكل تخصص وقسم في الجامعة.",
    noDeptAnnouncementsFound: "لا توجد إعلانات منشورة لهذا القسم حالياً.",
    filterDepartment: "تصفية حسب القسم",
    allDepartments: "كل الأقسام والمستويات",
    downloadPdf: "تحميل الملف (PDF)",
    watchVideo: "شرح مرئي (فيديو)",
    externalResource: "مصدر خارجي إضافي",
    noCoursesFound: "لا توجد مواد تعليمية تطابق التصفية الحالية.",
    addedOn: "أُضيف بتاريخ",
    openDriveFolder: "فتح مجلد Google Drive للمادة 📂",
    driveFoldersTitle: "ملفات الدرايف المرتّبة والمنظمة داخل المادة",
    viewDriveFiles: "استعراض ملفات ومجلدات الدرايف 📁",
    driveVirtualStorage: "سحابة الملفات الدرايف المشتركة",
    fileSize: "الحجم",

    // Activities Section
    unionEvents: "أنشطة وفعاليات التجمع الجامعية",
    eventsSub: "شارك معنا في فعالياتنا الثقافية، الأكاديمية والرياضية. احجز مقعدك الآن وسجل بياناتك.",
    eventDate: "التاريخ",
    eventTime: "الوقت",
    eventLocation: "المكان",
    eventRegistration: "تسجيل المشاركة في الفعالية",
    registerNow: "سجل حضورك الآن",
    registrationClosed: "عذراً، التسجيل مغلق أو اكتمل العدد",
    registeredSuccess: "تهانينا! تم تسجيل حضورك بنجاح.",
    seatsLeft: "مقعداً متبقياً فقط",
    fullName: "الاسم الكامل",
    studentId: "الرقم الجامعي",
    emailAddress: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    submitRegistration: "تأكيد تسجيل الحضور",
    cancel: "إلغاء",
    spotsRegistered: "المسجلين",
    noActivitiesFound: "لا توجد فعاليات معلنة حالياً تطابق بحثك.",

    // University Section
    aboutIste: "حول جامعة إسكندرون التقنية (İSTE)",
    aboutIsteSub: "اكتشف الكليات التقنية الرائدة وتفاصيل الحرم الجامعي في قلب مدينة إسكندرون الساحلية.",
    historyTitle: "رؤية الجامعة ونشأتها",
    facultiesTitle: "كليات ومعاهد الجامعة الفنية",
    facultiesSub: "تتميز الجامعة بتركيزها الهندسي والتكنولوجي والبحري الفريد.",
    departmentsTitle: "التخصصات المتوفرة",
    contactTitle: "معلومات الاتصال والموقع الجغرافي",
    contactEmail: "البريد الإلكتروني للأجانب",
    contactPhone: "رقم هاتف البدالة الرئيسي",
    contactAddress: "العنوان الأكاديمي الرئيسي",
    findOnMap: "موقع الحرم الجامعي على الخارطة",

    // Admin UI
    adminLoginHeader: "تسجيل دخول الهيئة الإدارية",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    loginBtn: "دخول آمن",
    invalidCredentials: "خطأ في اسم المستخدم أو كلمة المرور!",
    logoutBtn: "تسجيل الخروج",
    adminDashboard: "لوحة إدارة محتوى البوابة",
    adminWelcome: "أهلاً بك، المشرف الأكاديمي",
    tabNews: "إدارة الأخبار",
    tabCourses: "إدارة المواد الدراسية",
    tabDeptAnnouncements: "إدارة إعلانات الأقسام",
    tabActivities: "الأنشطة والمسجلين",
    tabLinks: "الروابط الهامة",
    tabUniv: "معلومات الجامعة والاتصال",
    tabAnnouncements: "العناوين العاجلة",

    // Admin Operations
    addNew: "إضافة جديد",
    editBtn: "تعديل",
    deleteBtn: "حذف",
    saveBtn: "حفظ التغييرات",
    titleAr: "العنوان باللغة العربية",
    titleTr: "العنوان باللغة التركية",
    contentAr: "المحتوى باللغة العربية",
    contentTr: "المحتوى باللغة التركية",
    categoryAr: "التصنيف بالعربية",
    categoryTr: "التصنيف بالتركية",
    tagsAr: "الوسوم بالعربية (مفصولة بفاصلة)",
    tagsTr: "الوسوم بالتركية (مفصولة بفاصلة)",
    deptAr: "القسم بالعربية",
    deptTr: "القسم بالتركية",
    descAr: "الوصف بالعربية",
    descTr: "الوصف بالتركية",
    imageUrl: "رابط الصورة التوضيحية",
    pdfUpload: "ملف الـ PDF المرفق",
    videoUrlLabel: "رابط فيديو الشرح (YouTube)",
    externalUrlLabel: "رابط خارجي إضافي",
    locAr: "الموقع بالعربية",
    locTr: "الموقع بالتركية",
    maxSeatsLabel: "الحد الأقصى للمقاعد (اختياري)",
    activeStatus: "نشط حالياً",
    annType: "نوع التنبيه",
    registeredListTitle: "قائمة الطلاب المسجلين لحضور هذه الفعالية",
    noRegistrationsYet: "لا يوجد مسجلين حتى الآن لهذه الفعالية.",
    confirmDelete: "هل أنت متأكد من عملية الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
    fileAttachmentPlaceholder: "اكتب اسم الملف أو ارفع ملفاً تجريبياً (PDF)...",
    
    // New fields & share button translations (Arabic)
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    major: "التخصص الدراسي",
    share: "مشاركة",
    copyLink: "نسخ الرابط",
    linkCopied: "تم نسخ الرابط بنجاح!",
    courseRegistration: "التسجيل في المادة / الدرس",
    registerInCourse: "سجل حضورك في هذا الدرس",
    registeredCourseSuccess: "تهانينا! تم تسجيل حضورك في هذا الدرس بنجاح.",
    registeredCourseListTitle: "قائمة الطلاب المسجلين لحضور هذا الدرس",
    viewRegistrants: "عرض الطلاب المسجلين",
    shareAfterReg: "مشاركة الحدث مع زملائك",
    firstNameRequired: "الاسم الأول مطلوب",
    lastNameRequired: "اسم العائلة مطلوب",
    emailRequired: "البريد الإلكتروني مطلوب",
    phoneRequired: "رقم الهاتف مطلوب",
    majorRequired: "التخصص الدراسي مطلوب",

    // Toast Messages
    actionSuccess: "تمت العملية بنجاح!",
    actionDeleted: "تم الحذف بنجاح!",
    
    // Footer
    footerDesc: "المنصة الرسمية للتمثيل الطلابي والثقافي للطلاب الفلسطينيين في هاتاي بجامعة إسكندرون التقنية. نعمل على مد جسور التواصل الأكاديمي ودعم وتوجيه طلابنا.",
    rightsReserved: "جميع الحقوق محفوظة © تجمع الطلاب الفلسطينيين في هاتاي - جامعة إسكندرون التقنية",
    palesIdentity: "فلسطينُ في القلوبِ نبضٌ، وفي الغربةِ وطنٌ لا يغيب 🇵🇸"
  },
  tr: {
    // Navigation
    home: "Anasayfa",
    news: "Haberler & Duyurular",
    links: "Önemli Linkler",
    courses: "Eğitim Materyalleri",
    deptAnnouncements: "Bölüm Duyuruları",
    activities: "Aktiviteler",
    pastActivities: "Geçmiş Etkinlikler",
    university: "Üniversite Hakkında (İSTE)",
    admin: "Yönetim Paneli",
    adminPanelTitle: "Yönetici Giriş Kapısı",
    languageLabel: "العربية",
    languageCode: "AR",

    // Banner & Headers
    announcementsTitle: "Son Dakika",
    portalTitle: "Filistin Öğrenci Topluluğu",
    universitySubTitle: "İskenderun Teknik Üniversitesi",
    welcomeHeader: "İSTE'deki Filistin Kültür ve Akademik Temsilciliği",
    welcomeSub: "Akademik yolculuğunuzu desteklemek, Filistin kültürel mirasını korumak ve üniversite yaşamına uyum sağlamanızı kolaylaştırmak için çalışıyoruz.",
    learnMore: "Daha Fazla Keşfet",
    viewAll: "Hepsini Gör",
    searchPlaceholder: "Haber, ders veya aktivite arayın...",
    searchBtn: "Ara",

    // News Section
    latestNews: "Topluluğumuzdan En Son Haberler ve Gelişmeler",
    newsCategories: "Kategoriler",
    newsTags: "Etiketler",
    newsViews: "Okunma",
    allCategories: "Tüm Kategoriler",
    noNewsFound: "Aramanıza uygun haber bulunamadı.",
    readMore: "Detayları Oku",
    backToNews: "Haberlere Dön",

    // Links Section
    usefulPortals: "Önemli ve Resmi Web Portalları",
    portalsSub: "Öğrencilerin günlük akademik yaşamlarında ihtiyaç duyduğu hızlı ve güvenilir bağlantılar.",
    visitSite: "Resmi Siteden Ziyaret Et",

    // Courses Section
    academicMaterials: "Dijital Kütüphane & Eğitim Materyalleri",
    materialsSub: "Başarılı öğrencilerimiz tarafından hazırlanan ders özetleri, kitaplar ve yardımcı notlar.",
    deptAnnouncementsSub: "Her bölüme ve programa özel yayınlanmış resmi duyurulara ve bildirimlere göz atın.",
    noDeptAnnouncementsFound: "Bu bölüme ait henüz yayınlanmış bir duyuru bulunmamaktadır.",
    filterDepartment: "Bölüme Göre Filtrele",
    allDepartments: "Tüm Bölümler ve Seviyeler",
    downloadPdf: "Dosyayı İndir (PDF)",
    watchVideo: "Görüntülü Anlatım (Video)",
    externalResource: "Ek Dış Kaynak",
    noCoursesFound: "Mevcut filtrelemeye uygun ders notu bulunamadı.",
    addedOn: "Eklenme Tarihi",
    openDriveFolder: "Dersin Google Drive Klasörünü Aç 📂",
    driveFoldersTitle: "Düzenli Drive Klasörleri & Dosyalar",
    viewDriveFiles: "Drive Dosyalarına Göz At 📁",
    driveVirtualStorage: "Ortak Bulut Dosya Alanı",
    fileSize: "Boyut",

    // Activities Section
    unionEvents: "Topluluğumuzun Düzenlediği Kampüs Faaliyetleri",
    eventsSub: "Kültürel, akademik ve sportif etkinliklerimize katılın. Koltuğunuzu ayırtın ve kaydolun.",
    eventDate: "Tarih",
    eventTime: "Saat",
    eventLocation: "Mekan",
    eventRegistration: "Etkinlik Katılım Kaydı",
    registerNow: "Hemen Kaydol",
    registrationClosed: "Üzgünüz, kayıtlar kapandı veya kontenjan doldu",
    registeredSuccess: "Tebrikler! Katılım kaydınız başarıyla tamamlandı.",
    seatsLeft: "kalan kontenjan",
    fullName: "Ad Soyad",
    studentId: "Öğrenci Numarası",
    emailAddress: "E-posta Adresi",
    phoneNumber: "Telefon Numarası",
    submitRegistration: "Kayıt Onayla",
    cancel: "İptal",
    spotsRegistered: "Kayıtlı",
    noActivitiesFound: "Aramanıza uygun etkinlik bulunamadı.",

    // University Section
    aboutIste: "İskenderun Teknik Üniversitesi (İSTE) Hakkında",
    aboutIsteSub: "İskenderun'un eşsiz sahil kıyısında yer alan teknoloji odaklı devlet üniversitesini keşfedin.",
    historyTitle: "Üniversitenin Vizyonu ve Kuruluşu",
    facultiesTitle: "Teknik Fakülteler ve Yüksekokullar",
    facultiesSub: "Üniversite mühendislik, teknoloji ve denizcilik alanlarında güçlü odağıyla bilinmektedir.",
    departmentsTitle: "Mevcut Bölümler",
    contactTitle: "İletişim Bilgileri & Kampüs Konumu",
    contactEmail: "Uluslararası Ofis E-postası",
    contactPhone: "Santral Telefon Numarası",
    contactAddress: "Resmi Kampüs Adresi",
    findOnMap: "Harita Üzerinde Kampüs Konumu",

    // Admin UI
    adminLoginHeader: "Yönetici Giriş Sistemi",
    username: "Kullanıcı Adı",
    password: "Şifre",
    loginBtn: "Güvenli Giriş",
    invalidCredentials: "Kullanıcı adı veya şifre hatalı!",
    logoutBtn: "Oturumu Kapat",
    adminDashboard: "İçerik Yönetim Paneli",
    adminWelcome: "Hoş geldiniz, Akademik Yönetici",
    tabNews: "Haber Yönetimi",
    tabCourses: "Eğitim Materyalleri",
    tabDeptAnnouncements: "Bölüm Duyuruları Yönetimi",
    tabActivities: "Etkinlik & Katılımcılar",
    tabLinks: "Önemli Linkler",
    tabUniv: "Üniversite ve İletişim Bilgileri",
    tabAnnouncements: "Kayan Duyurular",

    // Admin Operations
    addNew: "Yeni Ekle",
    editBtn: "Düzenle",
    deleteBtn: "Sil",
    saveBtn: "Değişiklikleri Kaydet",
    titleAr: "Arapça Başlık",
    titleTr: "Türkçe Başlık",
    contentAr: "Arapça İçerik",
    contentTr: "Türkçe İçerik",
    categoryAr: "Arapça Kategori",
    categoryTr: "Türkçe Kategori",
    tagsAr: "Arapça Etiketler (virgülle ayırın)",
    tagsTr: "Türkçe Etiketler (virgülle ayırın)",
    deptAr: "Arapça Bölüm",
    deptTr: "Türkçe Bölüm",
    descAr: "Arapça Açıklama",
    descTr: "Türkçe Açıklama",
    imageUrl: "Görsel URL'si",
    pdfUpload: "Ekli PDF Dosyası",
    videoUrlLabel: "Anlatım Video Bağlantısı (YouTube)",
    externalUrlLabel: "Ek Dış Kaynak Linki",
    locAr: "Arapça Konum",
    locTr: "Türkçe Konum",
    maxSeatsLabel: "Kontenjan Limiti (İsteğe bağlı)",
    activeStatus: "Şu an aktif",
    annType: "Duyuru Türü",
    registeredListTitle: "Bu Etkinliğe Kayıt Olan Öğrencilerin Listesi",
    noRegistrationsYet: "Bu etkinlik için henüz kayıt yaptıran öğrenci bulunmamaktadır.",
    confirmDelete: "Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    fileAttachmentPlaceholder: "Dosya adı yazın veya demo yükleme yapın (PDF)...",

    // New fields & share button translations (Turkish)
    firstName: "Ad",
    lastName: "Soyad",
    major: "Bölüm / Uzmanlık",
    share: "Paylaş",
    copyLink: "Bağlantıyı Kopyala",
    linkCopied: "Bağlantı başarıyla kopyalandı!",
    courseRegistration: "Ders Katılım Kaydı",
    registerInCourse: "Bu Derse Katılımını Kaydet",
    registeredCourseSuccess: "Tebrikler! Bu derse katılım kaydınız başarıyla tamamlandı.",
    registeredCourseListTitle: "Bu Derse Katılım Kaydı Yaptıran Öğrencilerin Listesi",
    viewRegistrants: "Kayıtlı Öğrencileri Görüntüle",
    shareAfterReg: "Etkinliği Arkadaşlarınla Paylaş",
    firstNameRequired: "Ad alanı zorunludur",
    lastNameRequired: "Soyad alanı zorunludur",
    emailRequired: "E-posta zorunludur",
    phoneRequired: "Telefon numarası zorunludur",
    majorRequired: "Bölüm alanı zorunludur",

    // Toast Messages
    actionSuccess: "İşlem başarıyla gerçekleştirildi!",
    actionDeleted: "Başarıyla silindi!",

    // Footer
    footerDesc: "İskenderun Teknik Üniversitesi'ndeki Filistinli öğrencilerin resmi akademik ve kültürel temsil platformudur (Hatay Filistin Öğrenci Topluluğu). Öğrencilerimize rehberlik sağlamak için çalışıyoruz.",
    rightsReserved: "Tüm hakları saklıdır © Hatay Filistin Öğrenci Topluluğu - İskenderun Teknik Üniversitesi",
    palesIdentity: "Filistin kalbimizde bir çarpan nabız, gurbette ise hiç sönmeyen vatanımızdır 🇵🇸"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pales_union_lang');
    return (saved === 'ar' || saved === 'tr') ? saved : 'ar';
  });

  const [dir, setDir] = useState<'rtl' | 'ltr'>(language === 'ar' ? 'rtl' : 'ltr');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pales_union_lang', lang);
  };

  useEffect(() => {
    const currentDir = language === 'ar' ? 'rtl' : 'ltr';
    setDir(currentDir);
    document.documentElement.dir = currentDir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof translations['ar']): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key] || translations['ar'][key] || String(key);
  };

  const getText = (text: MultilingualText | undefined | null): string => {
    if (!text) return '';
    return text[language] || text['ar'] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage, t, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
