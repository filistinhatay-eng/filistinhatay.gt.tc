import React, { useState } from 'react';
import { NewsItem, CourseItem, DeptAnnouncementItem, ActivityItem, ImportantLink, UniversityInfo, TopAnnouncement } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Plus, Edit2, Trash2, Save, FileText, Newspaper, BookOpen, Bell,
  Ticket, Link2, Building2, Megaphone, CheckCircle2, AlertTriangle, Users, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import logoImg from '../assets/images/hatay_palestine_students_logo_1782669469763.jpg';

interface AdminPanelProps {
  news: NewsItem[];
  courses: CourseItem[];
  deptAnnouncements: DeptAnnouncementItem[];
  activities: ActivityItem[];
  links: ImportantLink[];
  univInfo: UniversityInfo;
  announcements: TopAnnouncement[];
  logo: string;
  onSaveLogo: (logo: string) => void;
  
  onSaveNews: (item: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  
  onSaveCourse: (item: CourseItem) => void;
  onDeleteCourse: (id: string) => void;

  onSaveDeptAnn: (item: DeptAnnouncementItem) => void;
  onDeleteDeptAnn: (id: string) => void;
  
  onSaveActivity: (item: ActivityItem) => void;
  onDeleteActivity: (id: string) => void;
  
  onSaveLink: (item: ImportantLink) => void;
  onDeleteLink: (id: string) => void;
  
  onSaveUnivInfo: (item: UniversityInfo) => void;
  
  onSaveAnn: (item: TopAnnouncement) => void;
  onDeleteAnn: (id: string) => void;
  assistants: any[];
  onSaveAssistants: (updated: any[]) => void;
}

type AdminTab = 'news' | 'courses' | 'deptAnnouncements' | 'activities' | 'links' | 'univ' | 'announcements' | 'logo' | 'assistants';

const DEFAULT_FACULTIES = [
  {
    name: { ar: "كلية الهندسة والعلوم الطبيعية", tr: "Mühendislik ve Doğa Bilimleri Fakültesi" },
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
    name: { ar: "كلية بارباروس خير الدين لبناء السفن والعلوم البحرية", tr: "Barbaros Hayrettin Gemi İnşaatı ve Denizcilik Fakültesi" },
    departments: [
      { ar: "هندسة بناء السفن والآلات البحرية", tr: "Gemi İnşaatı ve Gemi Makineleri Mühendisliği" },
      { ar: "إدارة النقل البحري واللوجستيات", tr: "Deniz Ulaştırma İşletme Mühendisliği" }
    ]
  },
  {
    name: { ar: "كلية الطيران والعلوم الفضائية", tr: "Havacılık ve Uzay Bilimleri Fakültesi" },
    departments: [
      { ar: "إدارة الطيران", tr: "Havacılık Yönetimi" },
      { ar: "هندسة الطيران والـجوفضاء", tr: "Havacılık ve Uzay Mühendisliği" }
    ]
  },
  {
    name: { ar: "كلية العمارة والتصميم", tr: "Mimarlık ve Tasarım Fakültesi" },
    departments: [
      { ar: "الهندسة المعمارية", tr: "Mimarlık" },
      { ar: "عمارة المناظر الطبيعية (اللاندسكيب)", tr: "Peyzaj Mimarlığı" },
      { ar: "التصميم الصناعي", tr: "Endüstriyel Tasarım" }
    ]
  },
  {
    name: { ar: "كلية السياحة", tr: "Turizm Fakültesi" },
    departments: [
      { ar: "الإرشاد السياحي", tr: "Turist Rehberliği" },
      { ar: "إدارة الفنادق والضيافة", tr: "Turizm İşletmeciliği" },
      { ar: "فن الطهي والطهو", tr: "Gastronomi ve Mutfak Sanatları" }
    ]
  },
  {
    name: { ar: "مدرسة اللغات الأجنبية", tr: "Yabancı Diller Yüksekokulu" },
    departments: [
      { ar: "المدرسة التحضيرية للغات", tr: "Hazırlık Sınıfı" }
    ]
  }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  news, courses, deptAnnouncements, activities, links, univInfo, announcements, logo, onSaveLogo,
  onSaveNews, onDeleteNews,
  onSaveCourse, onDeleteCourse,
  onSaveDeptAnn, onDeleteDeptAnn,
  onSaveActivity, onDeleteActivity,
  onSaveLink, onDeleteLink,
  onSaveUnivInfo,
  onSaveAnn, onDeleteAnn,
  assistants: propsAssistants,
  onSaveAssistants
}) => {
  const { t, getText, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('news');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Assistant account state
  const [assistants, setAssistants] = useState<any[]>(() => {
    return propsAssistants || [];
  });

  React.useEffect(() => {
    if (propsAssistants) {
      setAssistants(propsAssistants);
    }
  }, [propsAssistants]);

  const [newAssUsername, setNewAssUsername] = useState('');
  const [newAssPassword, setNewAssPassword] = useState('');
  const [assError, setAssError] = useState('');

  const handleAddAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    setAssError('');
    const user = newAssUsername.trim().toLowerCase();
    const pass = newAssPassword;

    if (!user || !pass) {
      setAssError(language === 'ar' ? 'يرجى ملء جميع الحقول!' : 'Lütfen tüm alanları doldurun!');
      return;
    }

    if (user === 'filistin.hatay@gmail.com' || user === 'admin') {
      setAssError(language === 'ar' ? 'لا يمكن إنشاء حساب بهذا الاسم!' : 'Bu kullanıcı adıyla hesap oluşturulamaz!');
      return;
    }

    const exists = assistants.some(acc => acc.username.toLowerCase() === user);
    if (exists) {
      setAssError(language === 'ar' ? 'اسم المستخدم موجود بالفعل!' : 'Bu kullanıcı adı zaten mevcut!');
      return;
    }

    const newAss = {
      id: `ass-${Date.now()}`,
      username: newAssUsername.trim(),
      password: pass,
      createdAt: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'tr-TR')
    };

    const updated = [...assistants, newAss];
    setAssistants(updated);
    localStorage.setItem('pales_union_assistant_accounts', JSON.stringify(updated));
    onSaveAssistants(updated);
    setNewAssUsername('');
    setNewAssPassword('');
    triggerToast(language === 'ar' ? 'تم إضافة الحساب بنجاح!' : 'Hesap başarıyla eklendi!');
  };

  const handleDeleteAssistant = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الحساب؟' : 'Bu hesabı silmek istediğinizden emin misiniz?')) {
      const updated = assistants.filter(acc => acc.id !== id);
      setAssistants(updated);
      localStorage.setItem('pales_union_assistant_accounts', JSON.stringify(updated));
      onSaveAssistants(updated);
      triggerToast(language === 'ar' ? 'تم حذف الحساب بنجاح!' : 'Hesap başarıyla silindi!');
    }
  };

  // Editing states (null means creating new or not editing, otherwise holds the item being edited)
  const [editNewsItem, setEditNewsItem] = useState<Partial<NewsItem> | null>(null);
  const [editCourseItem, setEditCourseItem] = useState<Partial<CourseItem> | null>(null);
  const [editDeptAnnItem, setEditDeptAnnItem] = useState<Partial<DeptAnnouncementItem> | null>(null);
  const [editActivityItem, setEditActivityItem] = useState<Partial<ActivityItem> | null>(null);
  const [editLinkItem, setEditLinkItem] = useState<Partial<ImportantLink> | null>(null);
  const [editUnivInfo, setEditUnivInfo] = useState<UniversityInfo | null>(null);
  const [editAnnItem, setEditAnnItem] = useState<Partial<TopAnnouncement> | null>(null);

  // Selected Activity to view Registrants
  const [viewRegistrantsActivityId, setViewRegistrantsActivityId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (imgUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // NEWS CRUD
  const handleStartEditNews = (item?: NewsItem) => {
    if (item) {
      setEditNewsItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditNewsItem({
        id: `news-${Date.now()}`,
        title: { ar: '', tr: '' },
        content: { ar: '', tr: '' },
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        category: { ar: 'إعلانات عامة', tr: 'Genel Duyurular' },
        date: new Date().toISOString().split('T')[0],
        tags: [{ ar: 'جامعة', tr: 'Üniversite' }],
        views: 0
      });
    }
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNewsItem || !editNewsItem.id) return;
    onSaveNews(editNewsItem as NewsItem);
    setEditNewsItem(null);
    triggerToast(t('actionSuccess'));
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteNews(id);
      triggerToast(t('actionDeleted'));
    }
  };

  // COURSES CRUD
  const handleStartEditCourse = (item?: CourseItem) => {
    if (item) {
      setEditCourseItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditCourseItem({
        id: `course-${Date.now()}`,
        title: { ar: '', tr: '' },
        faculty: { ar: '', tr: '' },
        department: { ar: '', tr: '' },
        description: { ar: '', tr: '' },
        pdfFiles: [],
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseItem || !editCourseItem.id) return;
    onSaveCourse(editCourseItem as CourseItem);
    setEditCourseItem(null);
    triggerToast(t('actionSuccess'));
  };

  const handleCourseFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editCourseItem) return;
    
    const existingFiles = editCourseItem.pdfFiles || [];
    const loadedFiles = [...existingFiles];
    let loadedCount = 0;
    
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          loadedFiles.push({
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: event.target.result,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: file.type
          });
          
          loadedCount++;
          if (loadedCount === files.length) {
            setEditCourseItem({
              ...editCourseItem,
              pdfFiles: loadedFiles
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveCourseFile = (fileId: string) => {
    if (!editCourseItem) return;
    const existingFiles = editCourseItem.pdfFiles || [];
    setEditCourseItem({
      ...editCourseItem,
      pdfFiles: existingFiles.filter(f => f.id !== fileId)
    });
  };

  const handleStartEditDeptAnn = (item?: DeptAnnouncementItem) => {
    if (item) {
      setEditDeptAnnItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditDeptAnnItem({
        id: `dept-ann-${Date.now()}`,
        title: { ar: '', tr: '' },
        faculty: { ar: '', tr: '' },
        department: { ar: '', tr: '' },
        description: { ar: '', tr: '' },
        pdfFiles: [],
        externalUrl: '',
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleSaveDeptAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDeptAnnItem || !editDeptAnnItem.id) return;
    onSaveDeptAnn(editDeptAnnItem as DeptAnnouncementItem);
    setEditDeptAnnItem(null);
    triggerToast(t('actionSuccess'));
  };

  const handleDeptAnnFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editDeptAnnItem) return;
    
    const existingFiles = editDeptAnnItem.pdfFiles || [];
    const loadedFiles = [...existingFiles];
    let loadedCount = 0;
    
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          loadedFiles.push({
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: event.target.result,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: file.type
          });
          
          loadedCount++;
          if (loadedCount === files.length) {
            setEditDeptAnnItem({
              ...editDeptAnnItem,
              pdfFiles: loadedFiles
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDeptAnnFile = (fileId: string) => {
    if (!editDeptAnnItem) return;
    const existingFiles = editDeptAnnItem.pdfFiles || [];
    setEditDeptAnnItem({
      ...editDeptAnnItem,
      pdfFiles: existingFiles.filter(f => f.id !== fileId)
    });
  };

  const handleDeleteDeptAnn = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteDeptAnn(id);
      triggerToast(t('actionDeleted'));
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteCourse(id);
      triggerToast(t('actionDeleted'));
    }
  };

  // ACTIVITIES CRUD
  const handleStartEditActivity = (item?: ActivityItem) => {
    if (item) {
      setEditActivityItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditActivityItem({
        id: `activity-${Date.now()}`,
        title: { ar: '', tr: '' },
        description: { ar: '', tr: '' },
        date: new Date().toISOString().split('T')[0],
        time: '12:00 - 14:00',
        location: { ar: '', tr: '' },
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        registrationEnabled: true,
        registeredCount: 0,
        maxSeats: 100,
        registrations: []
      });
    }
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editActivityItem || !editActivityItem.id) return;
    onSaveActivity(editActivityItem as ActivityItem);
    setEditActivityItem(null);
    triggerToast(t('actionSuccess'));
  };

  const handleDeleteActivity = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteActivity(id);
      triggerToast(t('actionDeleted'));
    }
  };

  // LINKS CRUD
  const handleStartEditLink = (item?: ImportantLink) => {
    if (item) {
      setEditLinkItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditLinkItem({
        id: `link-${Date.now()}`,
        title: { ar: '', tr: '' },
        description: { ar: '', tr: '' },
        url: '',
        iconName: 'Globe'
      });
    }
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLinkItem || !editLinkItem.id) return;
    onSaveLink(editLinkItem as ImportantLink);
    setEditLinkItem(null);
    triggerToast(t('actionSuccess'));
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteLink(id);
      triggerToast(t('actionDeleted'));
    }
  };

  // UNIVERSITY INFO CRUD
  const handleStartEditUniv = () => {
    setEditUnivInfo(JSON.parse(JSON.stringify(univInfo)));
  };

  const handleSaveUniv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUnivInfo) return;
    onSaveUnivInfo(editUnivInfo);
    setEditUnivInfo(null);
    triggerToast(t('actionSuccess'));
  };

  // ANNOUNCEMENTS CRUD
  const handleStartEditAnn = (item?: TopAnnouncement) => {
    if (item) {
      setEditAnnItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditAnnItem({
        id: `ann-${Date.now()}`,
        text: { ar: '', tr: '' },
        type: 'info',
        active: true
      });
    }
  };

  const handleSaveAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAnnItem || !editAnnItem.id) return;
    onSaveAnn(editAnnItem as TopAnnouncement);
    setEditAnnItem(null);
    triggerToast(t('actionSuccess'));
  };

  const handleDeleteAnn = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      onDeleteAnn(id);
      triggerToast(t('actionDeleted'));
    }
  };

  const currentUsername = localStorage.getItem('pales_union_admin_username') || 'filistin.hatay@gmail.com';
  const isMasterAdmin = currentUsername.toLowerCase() === 'filistin.hatay@gmail.com';

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'news', label: t('tabNews'), icon: <Newspaper className="w-4 h-4" /> },
    { id: 'courses', label: t('tabCourses'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'deptAnnouncements', label: t('tabDeptAnnouncements'), icon: <Bell className="w-4 h-4" /> },
    { id: 'activities', label: t('tabActivities'), icon: <Ticket className="w-4 h-4" /> },
    { id: 'links', label: t('tabLinks'), icon: <Link2 className="w-4 h-4" /> },
    { id: 'univ', label: t('tabUniv'), icon: <Building2 className="w-4 h-4" /> },
    { id: 'announcements', label: t('tabAnnouncements'), icon: <Megaphone className="w-4 h-4" /> },
    ...(isMasterAdmin ? [
      { id: 'logo' as AdminTab, label: language === 'ar' ? 'شعار التجمع' : 'Topluluk Logosu', icon: <Save className="w-4 h-4" /> },
      { id: 'assistants' as AdminTab, label: language === 'ar' ? 'الحسابات المساعدة' : 'Yardımcı Hesaplar', icon: <Users className="w-4 h-4" /> }
    ] : [])
  ];

  return (
    <div id="admin-panel-root" className="space-y-6">
      
      {/* Visual Header / Toast Alert Overlay */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-600 rounded-full"></span>
            <span>{t('adminDashboard')}</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            {t('adminWelcome')} ({currentUsername})
          </p>
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{showToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Admin Horizontal Tabs Grid */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 select-none">
        {tabs.map(tab => (
          <button
            id={`admin-tab-${tab.id}`}
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // reset internal forms
              setEditNewsItem(null);
              setEditCourseItem(null);
              setEditDeptAnnItem(null);
              setEditActivityItem(null);
              setEditLinkItem(null);
              setEditUnivInfo(null);
              setEditAnnItem(null);
              setViewRegistrantsActivityId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition duration-150 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* RENDER FORMS OR RENDER LISTINGS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 min-h-[400px]">

        {/* 1. NEWS TAB */}
        {activeTab === 'news' && (
          <div id="admin-tab-news-content">
            {editNewsItem ? (
              <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center select-none">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {editNewsItem.title?.ar ? t('editBtn') : t('addNew')} {t('news')}
                  </h3>
                  <button type="button" onClick={() => setEditNewsItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleAr')}</label>
                    <input
                      id="news-form-title-ar"
                      type="text" required
                      value={editNewsItem.title?.ar || ''}
                      onChange={(e) => setEditNewsItem({ ...editNewsItem, title: { ...editNewsItem.title!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleTr')}</label>
                    <input
                      id="news-form-title-tr"
                      type="text" required
                      value={editNewsItem.title?.tr || ''}
                      onChange={(e) => setEditNewsItem({ ...editNewsItem, title: { ...editNewsItem.title!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('contentAr')}</label>
                    <textarea rows={4} required
                      value={editNewsItem.content?.ar || ''}
                      onChange={(e) => setEditNewsItem({ ...editNewsItem, content: { ...editNewsItem.content!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('contentTr')}</label>
                    <textarea rows={4} required
                      value={editNewsItem.content?.tr || ''}
                      onChange={(e) => setEditNewsItem({ ...editNewsItem, content: { ...editNewsItem.content!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('categoryAr')}</label>
                    <input
                      id="news-form-cat-ar"
                      type="text" required
                      value={editNewsItem.category?.ar || ''}
                      onChange={(e) => setEditNewsItem({ ...editNewsItem, category: { ...editNewsItem.category!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('categoryTr')}</label>
                    <input
                      id="news-form-cat-tr"
                      type="text" required
                      value={editNewsItem.category?.tr || ''}
                      onChange={(e) => setEditNewsItem({ ...editNewsItem, category: { ...editNewsItem.category!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('imageUrl')}</label>
                    <div className="flex gap-2">
                      <input
                        id="news-form-img"
                        type="text" required
                        value={editNewsItem.image || ''}
                        onChange={(e) => setEditNewsItem({ ...editNewsItem, image: e.target.value })}
                        className="flex-1 p-2 border border-slate-200 rounded-lg text-xs"
                        placeholder="https://..."
                      />
                      <label className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold px-3 py-2 rounded-lg cursor-pointer text-center flex items-center justify-center text-xs shrink-0 select-none">
                        <span>{language === 'ar' ? 'رفع صورة' : 'Fotoğraf Yükle'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, (url) => setEditNewsItem({ ...editNewsItem, image: url }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 select-none">
                  <button type="button" onClick={() => setEditNewsItem(null)} className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 hover:bg-red-800 font-bold text-white rounded-lg flex items-center gap-1"><Save className="w-4 h-4"/>{t('saveBtn')}</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs text-slate-400 font-semibold">{news.length} {t('news')}</span>
                  <button id="admin-news-add-btn" onClick={() => handleStartEditNews()} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-xs text-white font-bold rounded-lg shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>{t('addNew')}</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {news.map(item => (
                    <div id={`admin-news-row-${item.id}`} key={item.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                      <div className="truncate flex-1">
                        <span className="font-extrabold text-slate-900 block truncate">{getText(item.title)}</span>
                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100">{getText(item.category)}</span>
                        <span className="text-[10px] text-slate-400 ml-2">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 select-none">
                        <button id={`admin-news-edit-${item.id}`} onClick={() => handleStartEditNews(item)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded" title={t('editBtn')}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button id={`admin-news-delete-${item.id}`} onClick={() => handleDeleteNews(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title={t('deleteBtn')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. COURSES TAB */}
        {activeTab === 'courses' && (
          <div id="admin-tab-courses-content">
            {editCourseItem ? (
              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center select-none">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {editCourseItem.title?.ar ? t('editBtn') : t('addNew')} {t('courses')}
                  </h3>
                  <button type="button" onClick={() => setEditCourseItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleAr')}</label>
                    <input
                      id="course-form-title-ar"
                      type="text" required
                      value={editCourseItem.title?.ar || ''}
                      onChange={(e) => setEditCourseItem({ ...editCourseItem, title: { ...editCourseItem.title!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleTr')}</label>
                    <input
                      id="course-form-title-tr"
                      type="text" required
                      value={editCourseItem.title?.tr || ''}
                      onChange={(e) => setEditCourseItem({ ...editCourseItem, title: { ...editCourseItem.title!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descAr')}</label>
                    <textarea rows={3} required
                      value={editCourseItem.description?.ar || ''}
                      onChange={(e) => setEditCourseItem({ ...editCourseItem, description: { ...editCourseItem.description!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descTr')}</label>
                    <textarea rows={3} required
                      value={editCourseItem.description?.tr || ''}
                      onChange={(e) => setEditCourseItem({ ...editCourseItem, description: { ...editCourseItem.description!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {language === 'ar' ? 'الكلية' : 'Fakülte'}
                    </label>
                    <select
                      id="course-form-faculty-select"
                      required
                      value={DEFAULT_FACULTIES.findIndex(f => f.name.ar === editCourseItem.faculty?.ar || f.name.tr === editCourseItem.faculty?.tr)}
                      onChange={(e) => {
                        const idx = parseInt(e.target.value);
                        if (idx >= 0) {
                          const selected = DEFAULT_FACULTIES[idx];
                          setEditCourseItem({
                            ...editCourseItem,
                            faculty: selected.name,
                            department: { ar: '', tr: '' }
                          });
                        } else {
                          setEditCourseItem({
                            ...editCourseItem,
                            faculty: { ar: '', tr: '' },
                            department: { ar: '', tr: '' }
                          });
                        }
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="">{language === 'ar' ? 'اختر الكلية...' : 'Fakülte Seçin...'}</option>
                      {DEFAULT_FACULTIES.map((f, i) => (
                        <option key={i} value={i}>{getText(f.name)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {language === 'ar' ? 'القسم / التخصص' : 'Bölüm'}
                    </label>
                    <select
                      id="course-form-dept-select"
                      required
                      disabled={!editCourseItem.faculty?.ar}
                      value={editCourseItem.department?.ar || ''}
                      onChange={(e) => {
                        const deptAr = e.target.value;
                        const facultyIdx = DEFAULT_FACULTIES.findIndex(f => f.name.ar === editCourseItem.faculty?.ar);
                        if (facultyIdx >= 0) {
                          const deptObj = DEFAULT_FACULTIES[facultyIdx].departments.find(d => d.ar === deptAr);
                          if (deptObj) {
                            setEditCourseItem({
                              ...editCourseItem,
                              department: deptObj
                            });
                          }
                        }
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">{language === 'ar' ? 'اختر القسم...' : 'Bölüm Seçin...'}</option>
                      {(() => {
                        const facultyIdx = DEFAULT_FACULTIES.findIndex(f => f.name.ar === editCourseItem.faculty?.ar);
                        if (facultyIdx >= 0) {
                          return DEFAULT_FACULTIES[facultyIdx].departments.map((d, i) => (
                            <option key={i} value={d.ar}>{getText(d)}</option>
                          ));
                        }
                        return null;
                      })()}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 text-xs sm:text-sm">
                    {language === 'ar' ? 'ملفات الدروس المرفقة (PDF, Word, Zip...)' : 'Ekli Ders Dosyaları (PDF, Word, Zip...)'}
                  </label>
                  
                  {/* Drag & Drop Upload Zone */}
                  <div className="border-2 border-dashed border-slate-200 hover:border-red-500/50 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-4 transition text-center cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.zip,.txt,.xls,.xlsx,.ppt,.pptx"
                      onChange={handleCourseFileUpload}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="space-y-1.5 pointer-events-none select-none">
                      <Plus className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        {language === 'ar' ? 'اضغط هنا أو اسحب الملفات لرفعها' : 'Dosya yüklemek için tıklayın veya sürükleyin'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {language === 'ar' ? 'يدعم ملفات PDF والمستندات والملفات المضغوطة والـ Word' : 'PDF, Dokümanlar, Word ve Zip dosyalarını destekler'}
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {editCourseItem.pdfFiles && editCourseItem.pdfFiles.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {language === 'ar' ? 'الملفات المرفقة حالياً للدرس:' : 'Mevcut Ekli Ders Dosyaları:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {editCourseItem.pdfFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs shadow-xs">
                            <div className="flex items-center gap-1.5 min-w-0 pr-2">
                              <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              <span className="truncate font-bold text-slate-800 text-[11px]" title={file.name}>
                                {file.name}
                              </span>
                              {file.size && (
                                <span className="text-[9px] text-slate-400 font-mono shrink-0">
                                  ({file.size})
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCourseFile(file.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                              title="Remove File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 select-none">
                  <button type="button" onClick={() => setEditCourseItem(null)} className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 hover:bg-red-800 font-bold text-white rounded-lg flex items-center gap-1"><Save className="w-4 h-4"/>{t('saveBtn')}</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs text-slate-400 font-semibold">{courses.length} {t('courses')}</span>
                  <button id="admin-courses-add-btn" onClick={() => handleStartEditCourse()} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-xs text-white font-bold rounded-lg shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>{t('addNew')}</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {courses.map(item => (
                    <div id={`admin-course-row-${item.id}`} key={item.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                      <div className="truncate flex-1">
                        <span className="font-extrabold text-slate-900 block truncate">{getText(item.title)}</span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {item.faculty && getText(item.faculty) ? `${getText(item.faculty)} - ` : ''}{getText(item.department)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 select-none">
                        <button id={`admin-course-edit-${item.id}`} onClick={() => handleStartEditCourse(item)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded" title={t('editBtn')}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button id={`admin-course-delete-${item.id}`} onClick={() => handleDeleteCourse(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title={t('deleteBtn')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2.5. DEPARTMENT ANNOUNCEMENTS TAB */}
        {activeTab === 'deptAnnouncements' && (
          <div id="admin-tab-dept-anns-content">
            {editDeptAnnItem ? (
              <form onSubmit={handleSaveDeptAnn} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center select-none">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {editDeptAnnItem.title?.ar ? t('editBtn') : t('addNew')} {t('deptAnnouncements')}
                  </h3>
                  <button type="button" onClick={() => setEditDeptAnnItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleAr')}</label>
                    <input
                      id="dept-ann-form-title-ar"
                      type="text" required
                      value={editDeptAnnItem.title?.ar || ''}
                      onChange={(e) => setEditDeptAnnItem({ ...editDeptAnnItem, title: { ...editDeptAnnItem.title!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleTr')}</label>
                    <input
                      id="dept-ann-form-title-tr"
                      type="text" required
                      value={editDeptAnnItem.title?.tr || ''}
                      onChange={(e) => setEditDeptAnnItem({ ...editDeptAnnItem, title: { ...editDeptAnnItem.title!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descAr')}</label>
                    <textarea rows={4} required
                      value={editDeptAnnItem.description?.ar || ''}
                      onChange={(e) => setEditDeptAnnItem({ ...editDeptAnnItem, description: { ...editDeptAnnItem.description!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descTr')}</label>
                    <textarea rows={4} required
                      value={editDeptAnnItem.description?.tr || ''}
                      onChange={(e) => setEditDeptAnnItem({ ...editDeptAnnItem, description: { ...editDeptAnnItem.description!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {language === 'ar' ? 'الكلية' : 'Fakülte'}
                    </label>
                    <select
                      id="dept-ann-form-faculty-select"
                      required
                      value={DEFAULT_FACULTIES.findIndex(f => f.name.ar === editDeptAnnItem.faculty?.ar || f.name.tr === editDeptAnnItem.faculty?.tr)}
                      onChange={(e) => {
                        const idx = parseInt(e.target.value);
                        if (idx >= 0) {
                          const selected = DEFAULT_FACULTIES[idx];
                          setEditDeptAnnItem({
                            ...editDeptAnnItem,
                            faculty: selected.name,
                            department: { ar: '', tr: '' }
                          });
                        } else {
                          setEditDeptAnnItem({
                            ...editDeptAnnItem,
                            faculty: { ar: '', tr: '' },
                            department: { ar: '', tr: '' }
                          });
                        }
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="">{language === 'ar' ? 'اختر الكلية...' : 'Fakülte Seçin...'}</option>
                      {DEFAULT_FACULTIES.map((f, i) => (
                        <option key={i} value={i}>{getText(f.name)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {language === 'ar' ? 'القسم / التخصص' : 'Bölüm'}
                    </label>
                    <select
                      id="dept-ann-form-dept-select"
                      required
                      disabled={!editDeptAnnItem.faculty?.ar}
                      value={editDeptAnnItem.department?.ar || ''}
                      onChange={(e) => {
                        const deptAr = e.target.value;
                        const facultyIdx = DEFAULT_FACULTIES.findIndex(f => f.name.ar === editDeptAnnItem.faculty?.ar);
                        if (facultyIdx >= 0) {
                          const deptObj = DEFAULT_FACULTIES[facultyIdx].departments.find(d => d.ar === deptAr);
                          if (deptObj) {
                            setEditDeptAnnItem({
                              ...editDeptAnnItem,
                              department: deptObj
                            });
                          }
                        }
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">{language === 'ar' ? 'اختر القسم...' : 'Bölüm Seçin...'}</option>
                      {(() => {
                        const facultyIdx = DEFAULT_FACULTIES.findIndex(f => f.name.ar === editDeptAnnItem.faculty?.ar);
                        if (facultyIdx >= 0) {
                          return DEFAULT_FACULTIES[facultyIdx].departments.map((d, i) => (
                            <option key={i} value={d.ar}>{getText(d)}</option>
                          ));
                        }
                        return null;
                      })()}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {language === 'ar' ? 'رابط خارجي (إن وجد)' : 'Harici Bağlantı (Varsa)'}
                    </label>
                    <input
                      id="dept-ann-form-url"
                      type="url"
                      placeholder="https://..."
                      value={editDeptAnnItem.externalUrl || ''}
                      onChange={(e) => setEditDeptAnnItem({ ...editDeptAnnItem, externalUrl: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 text-xs sm:text-sm">
                    {language === 'ar' ? 'ملفات الإعلان المرفقة (PDF, Word, الصور...)' : 'Ekli Duyuru Dosyaları (PDF, Word, Görsel...)'}
                  </label>
                  
                  {/* Drag & Drop Upload Zone */}
                  <div className="border-2 border-dashed border-slate-200 hover:border-red-500/50 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-4 transition text-center cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.zip,.txt,.png,.jpg,.jpeg"
                      onChange={handleDeptAnnFileUpload}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="space-y-1.5 pointer-events-none select-none">
                      <Plus className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        {language === 'ar' ? 'اضغط هنا أو اسحب الملفات لرفعها' : 'Dosya yüklemek için tıklayın veya sürükleyin'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {language === 'ar' ? 'يدعم ملفات PDF، المستندات، الصور والملفات المضغوطة' : 'PDF, Dokümanlar, Görsel ve Zip dosyalarını destekler'}
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {editDeptAnnItem.pdfFiles && editDeptAnnItem.pdfFiles.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {language === 'ar' ? 'الملفات المرفقة حالياً للإعلان:' : 'Mevcut Ekli Duyuru Dosyaları:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {editDeptAnnItem.pdfFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs shadow-xs">
                            <div className="flex items-center gap-1.5 min-w-0 pr-2">
                              <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              <span className="truncate font-bold text-slate-800 text-[11px]" title={file.name}>
                                {file.name}
                              </span>
                              {file.size && (
                                <span className="text-[9px] text-slate-400 font-mono shrink-0">
                                  ({file.size})
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDeptAnnFile(file.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                              title="Remove File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 select-none">
                  <button type="button" onClick={() => setEditDeptAnnItem(null)} className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 hover:bg-red-800 font-bold text-white rounded-lg flex items-center gap-1"><Save className="w-4 h-4"/>{t('saveBtn')}</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs text-slate-400 font-semibold">{deptAnnouncements.length} {t('deptAnnouncements')}</span>
                  <button id="admin-dept-anns-add-btn" onClick={() => handleStartEditDeptAnn()} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-xs text-white font-bold rounded-lg shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>{t('addNew')}</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {deptAnnouncements.map(item => (
                    <div id={`admin-dept-ann-row-${item.id}`} key={item.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                      <div className="truncate flex-1">
                        <span className="font-extrabold text-slate-900 block truncate">{getText(item.title)}</span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {item.faculty && getText(item.faculty) ? `${getText(item.faculty)} - ` : ''}{getText(item.department)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 select-none">
                        <button id={`admin-dept-ann-edit-${item.id}`} onClick={() => handleStartEditDeptAnn(item)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded" title={t('editBtn')}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button id={`admin-dept-ann-delete-${item.id}`} onClick={() => handleDeleteDeptAnn(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title={t('deleteBtn')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div id="admin-tab-activities-content">
            {editActivityItem ? (
              <form onSubmit={handleSaveActivity} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center select-none">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {editActivityItem.title?.ar ? t('editBtn') : t('addNew')} {t('activities')}
                  </h3>
                  <button type="button" onClick={() => setEditActivityItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleAr')}</label>
                    <input
                      id="act-form-title-ar"
                      type="text" required
                      value={editActivityItem.title?.ar || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, title: { ...editActivityItem.title!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleTr')}</label>
                    <input
                      id="act-form-title-tr"
                      type="text" required
                      value={editActivityItem.title?.tr || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, title: { ...editActivityItem.title!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descAr')}</label>
                    <textarea rows={3} required
                      value={editActivityItem.description?.ar || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, description: { ...editActivityItem.description!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descTr')}</label>
                    <textarea rows={3} required
                      value={editActivityItem.description?.tr || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, description: { ...editActivityItem.description!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('eventDate')} (YYYY-MM-DD)</label>
                    <input
                      id="act-form-date"
                      type="date" required
                      value={editActivityItem.date || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, date: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('eventTime')}</label>
                    <input
                      id="act-form-time"
                      type="text" required
                      value={editActivityItem.time || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, time: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('maxSeatsLabel')}</label>
                    <input
                      id="act-form-seats"
                      type="number"
                      value={editActivityItem.maxSeats || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, maxSeats: parseInt(e.target.value, 10) })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('locAr')}</label>
                    <input
                      id="act-form-loc-ar"
                      type="text" required
                      value={editActivityItem.location?.ar || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, location: { ...editActivityItem.location!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('locTr')}</label>
                    <input
                      id="act-form-loc-tr"
                      type="text" required
                      value={editActivityItem.location?.tr || ''}
                      onChange={(e) => setEditActivityItem({ ...editActivityItem, location: { ...editActivityItem.location!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {language === 'ar' ? 'تصنيف الفعالية' : 'Etkinlik Sınıflandırması'}
                    </label>
                    <select
                      id="act-form-is-past"
                      value={editActivityItem.isPast ? 'past' : 'upcoming'}
                      onChange={(e) => {
                        const isPastVal = e.target.value === 'past';
                        setEditActivityItem({
                          ...editActivityItem,
                          isPast: isPastVal,
                          registrationEnabled: isPastVal ? false : editActivityItem.registrationEnabled
                        });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
                    >
                      <option value="upcoming">
                        {language === 'ar' ? 'فعالية قادمة (للتقديم والتسجيل)' : 'Gelecek Etkinlik (Başvuruya Açık)'}
                      </option>
                      <option value="past">
                        {language === 'ar' ? 'فعالية سابقة (تمت مشاركتها للمشاهدة والأرشيف)' : 'Geçmiş Etkinlik (Arşiv / Paylaşım)'}
                      </option>
                    </select>
                  </div>

                  {!editActivityItem.isPast && (
                    <div className="flex items-center gap-2 pt-5 select-none">
                      <input
                        id="act-form-reg-enabled"
                        type="checkbox"
                        checked={editActivityItem.registrationEnabled || false}
                        onChange={(e) => setEditActivityItem({ ...editActivityItem, registrationEnabled: e.target.checked })}
                        className="w-4 h-4 text-red-600 border-slate-200 rounded"
                      />
                      <label htmlFor="act-form-reg-enabled" className="font-bold text-slate-700">
                        {t('activeStatus')} ({t('eventRegistration')})
                      </label>
                    </div>
                  )}
                </div>

                {/* Highly Polished Image Management block */}
                <div className="space-y-2 border border-slate-150 p-3.5 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    {editActivityItem.image && (
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
                        <img src={editActivityItem.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500">
                      <span className="font-bold text-slate-700 block text-xs">
                        {language === 'ar' ? 'صورة الفعالية' : 'Etkinlik Görseli'}
                      </span>
                      {language === 'ar' ? 'اختر صورة من جهازك أو ضع رابط ويب مباشرة.' : 'Cihazınızdan bir görsel seçin veya doğrudan bir URL girin.'}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">
                        {language === 'ar' ? 'رفع ملف صورة جديد' : 'Yeni Fotoğraf Dosyası Yükle'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setEditActivityItem({ ...editActivityItem, image: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">
                        {language === 'ar' ? 'أو ضع رابط صورة ويب مباشر' : 'Veya Doğrudan Görsel Bağlantısı (URL)'}
                      </label>
                      <input
                        id="act-form-img-url"
                        type="text"
                        required
                        value={editActivityItem.image || ''}
                        onChange={(e) => setEditActivityItem({ ...editActivityItem, image: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 select-none">
                  <button type="button" onClick={() => setEditActivityItem(null)} className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 hover:bg-red-800 font-bold text-white rounded-lg flex items-center gap-1"><Save className="w-4 h-4"/>{t('saveBtn')}</button>
                </div>
              </form>
            ) : viewRegistrantsActivityId ? (
              /* View registered students list */
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none border-b border-slate-150 pb-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800">{t('registeredListTitle')}</h3>
                    <p className="text-[10px] text-red-600 font-bold">
                      {getText(activities.find(a => a.id === viewRegistrantsActivityId)?.title)}
                    </p>
                  </div>
                  <button type="button" onClick={() => setViewRegistrantsActivityId(null)} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700 transition">
                    &larr; {t('backToNews').replace('news', 'activities')}
                  </button>
                </div>

                {(() => {
                  const activity = activities.find(a => a.id === viewRegistrantsActivityId);
                  const list = activity?.registrations || [];
                  if (list.length === 0) {
                    return <p className="text-slate-400 text-center py-6 text-xs">{t('noRegistrationsYet')}</p>;
                  }
                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-2.5 font-bold text-slate-700">{t('fullName')}</th>
                            <th className="p-2.5 font-bold text-slate-700">{t('studentId')}</th>
                            <th className="p-2.5 font-bold text-slate-700">{t('emailAddress')}</th>
                            <th className="p-2.5 font-bold text-slate-700">{t('phoneNumber')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {list.map((reg, regIdx) => (
                            <tr key={regIdx} className="hover:bg-slate-50/50">
                              <td className="p-2.5 text-slate-900 font-bold">{reg.name}</td>
                              <td className="p-2.5 text-slate-500 font-mono">{reg.studentId}</td>
                              <td className="p-2.5 text-slate-500">{reg.email}</td>
                              <td className="p-2.5 text-slate-500 font-mono" dir="ltr">{reg.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs text-slate-400 font-semibold">{activities.length} {t('activities')}</span>
                  <button id="admin-activities-add-btn" onClick={() => handleStartEditActivity()} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-xs text-white font-bold rounded-lg shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>{t('addNew')}</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {activities.map(item => (
                    <div id={`admin-activity-row-${item.id}`} key={item.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 block truncate">{getText(item.title)}</span>
                          {item.isPast ? (
                            <span className="bg-slate-100 text-slate-700 font-bold text-[8px] px-1.5 py-0.5 rounded border border-slate-200 uppercase shrink-0">
                              {language === 'ar' ? 'فعالية سابقة' : 'Geçmiş'}
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 font-bold text-[8px] px-1.5 py-0.5 rounded border border-emerald-100 uppercase shrink-0">
                              {language === 'ar' ? 'فعالية قادمة' : 'Gelecek'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{item.date} | {getText(item.location)}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 select-none">
                        {item.registrationEnabled && (
                          <button
                            id={`admin-activity-view-regs-${item.id}`}
                            onClick={() => setViewRegistrantsActivityId(item.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded flex items-center gap-1 font-bold text-[10px]"
                            title="View Registrants"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>({item.registeredCount})</span>
                          </button>
                        )}
                        <button id={`admin-activity-edit-${item.id}`} onClick={() => handleStartEditActivity(item)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded" title={t('editBtn')}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button id={`admin-activity-delete-${item.id}`} onClick={() => handleDeleteActivity(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title={t('deleteBtn')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. IMPORTANT LINKS TAB */}
        {activeTab === 'links' && (
          <div id="admin-tab-links-content">
            {editLinkItem ? (
              <form onSubmit={handleSaveLink} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center select-none">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {editLinkItem.title?.ar ? t('editBtn') : t('addNew')} {t('links')}
                  </h3>
                  <button type="button" onClick={() => setEditLinkItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleAr')}</label>
                    <input
                      id="link-form-title-ar"
                      type="text" required
                      value={editLinkItem.title?.ar || ''}
                      onChange={(e) => setEditLinkItem({ ...editLinkItem, title: { ...editLinkItem.title!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('titleTr')}</label>
                    <input
                      id="link-form-title-tr"
                      type="text" required
                      value={editLinkItem.title?.tr || ''}
                      onChange={(e) => setEditLinkItem({ ...editLinkItem, title: { ...editLinkItem.title!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descAr')}</label>
                    <textarea rows={2} required
                      value={editLinkItem.description?.ar || ''}
                      onChange={(e) => setEditLinkItem({ ...editLinkItem, description: { ...editLinkItem.description!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descTr')}</label>
                    <textarea rows={2} required
                      value={editLinkItem.description?.tr || ''}
                      onChange={(e) => setEditLinkItem({ ...editLinkItem, description: { ...editLinkItem.description!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">URL</label>
                    <input
                      id="link-form-url"
                      type="url" required
                      placeholder="https://..."
                      value={editLinkItem.url || ''}
                      onChange={(e) => setEditLinkItem({ ...editLinkItem, url: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">Icon Name (Lucide Icon, e.g. Globe, BookOpen, GraduationCap, Laptop, FileText)</label>
                    <input
                      id="link-form-icon"
                      type="text" required
                      placeholder="Globe"
                      value={editLinkItem.iconName || ''}
                      onChange={(e) => setEditLinkItem({ ...editLinkItem, iconName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 select-none">
                  <button type="button" onClick={() => setEditLinkItem(null)} className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 hover:bg-red-800 font-bold text-white rounded-lg flex items-center gap-1"><Save className="w-4 h-4"/>{t('saveBtn')}</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs text-slate-400 font-semibold">{links.length} {t('links')}</span>
                  <button id="admin-links-add-btn" onClick={() => handleStartEditLink()} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-xs text-white font-bold rounded-lg shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>{t('addNew')}</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {links.map(item => (
                    <div id={`admin-link-row-${item.id}`} key={item.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                      <div className="truncate flex-1">
                        <span className="font-extrabold text-slate-900 block truncate">{getText(item.title)}</span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">{item.url}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 select-none">
                        <button id={`admin-link-edit-${item.id}`} onClick={() => handleStartEditLink(item)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded" title={t('editBtn')}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button id={`admin-link-delete-${item.id}`} onClick={() => handleDeleteLink(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title={t('deleteBtn')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. UNIVERSITY INFO TAB */}
        {activeTab === 'univ' && (
          <div id="admin-tab-univ-content">
            {editUnivInfo ? (
              <form onSubmit={handleSaveUniv} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center select-none">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {t('editBtn')} {t('university')}
                  </h3>
                  <button type="button" onClick={() => setEditUnivInfo(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descAr')}</label>
                    <textarea rows={4} required
                      value={editUnivInfo.description.ar}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, description: { ...editUnivInfo.description, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descTr')}</label>
                    <textarea rows={4} required
                      value={editUnivInfo.description.tr}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, description: { ...editUnivInfo.description, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('historyTitle')} (العربية)</label>
                    <textarea rows={4} required
                      value={editUnivInfo.history.ar}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, history: { ...editUnivInfo.history, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('historyTitle')} (Türkçe)</label>
                    <textarea rows={4} required
                      value={editUnivInfo.history.tr}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, history: { ...editUnivInfo.history, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('contactEmail')}</label>
                    <input
                      id="univ-form-email"
                      type="email" required
                      value={editUnivInfo.contactEmail}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, contactEmail: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('contactPhone')}</label>
                    <input
                      id="univ-form-phone"
                      type="text" required
                      value={editUnivInfo.contactPhone}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, contactPhone: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('contactAddress')} (العربية)</label>
                    <input
                      id="univ-form-addr-ar"
                      type="text" required
                      value={editUnivInfo.address.ar}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, address: { ...editUnivInfo.address, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('contactAddress')} (Türkçe)</label>
                    <input
                      id="univ-form-addr-tr"
                      type="text" required
                      value={editUnivInfo.address.tr}
                      onChange={(e) => setEditUnivInfo({ ...editUnivInfo, address: { ...editUnivInfo.address, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 select-none">
                  <button type="button" onClick={() => setEditUnivInfo(null)} className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 hover:bg-red-800 font-bold text-white rounded-lg flex items-center gap-1"><Save className="w-4 h-4"/>{t('saveBtn')}</button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{t('portalTitle')} - {t('university')}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed max-w-2xl mt-1">{getText(univInfo.description)}</p>
                  </div>
                  <div className="flex gap-4 text-[10px] text-slate-500 font-bold select-none">
                    <span>Email: {univInfo.contactEmail}</span>
                    <span>Tel: {univInfo.contactPhone}</span>
                  </div>
                </div>
                <div className="select-none">
                  <button id="admin-univ-edit-btn" onClick={() => handleStartEditUniv()} className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-xs text-white font-bold rounded-lg shadow-sm">
                    <Edit2 className="w-4 h-4" />
                    <span>{t('editBtn')} {t('university')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. ANNOUNCEMENTS / TOP BAR TAB */}
        {activeTab === 'announcements' && (
          <div id="admin-tab-ann-content">
            {editAnnItem ? (
              <form onSubmit={handleSaveAnn} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center select-none">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {editAnnItem.text?.ar ? t('editBtn') : t('addNew')} {t('announcementsTitle')}
                  </h3>
                  <button type="button" onClick={() => setEditAnnItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descAr')} (العنوان العاجل)</label>
                    <textarea rows={2} required
                      value={editAnnItem.text?.ar || ''}
                      onChange={(e) => setEditAnnItem({ ...editAnnItem, text: { ...editAnnItem.text!, ar: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('descTr')} (Kayan Duyuru Metni)</label>
                    <textarea rows={2} required
                      value={editAnnItem.text?.tr || ''}
                      onChange={(e) => setEditAnnItem({ ...editAnnItem, text: { ...editAnnItem.text!, tr: e.target.value } })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">{t('annType')}</label>
                    <select
                      id="ann-form-type"
                      value={editAnnItem.type || 'info'}
                      onChange={(e) => setEditAnnItem({ ...editAnnItem, type: e.target.value as 'info' | 'warning' | 'critical' })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="info">Info (Green)</option>
                      <option value="warning">Warning (Amber)</option>
                      <option value="critical">Critical (Red)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-4 select-none">
                    <input
                      id="ann-form-active"
                      type="checkbox"
                      checked={editAnnItem.active || false}
                      onChange={(e) => setEditAnnItem({ ...editAnnItem, active: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-slate-200 rounded"
                    />
                    <label htmlFor="ann-form-active" className="font-bold text-slate-700">
                      {t('activeStatus')}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 select-none">
                  <button type="button" onClick={() => setEditAnnItem(null)} className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">{t('cancel')}</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 hover:bg-red-800 font-bold text-white rounded-lg flex items-center gap-1"><Save className="w-4 h-4"/>{t('saveBtn')}</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs text-slate-400 font-semibold">{announcements.length} {t('announcementsTitle')}</span>
                  <button id="admin-ann-add-btn" onClick={() => handleStartEditAnn()} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-xs text-white font-bold rounded-lg shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>{t('addNew')}</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {announcements.map(item => (
                    <div id={`admin-ann-row-${item.id}`} key={item.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                      <div className="truncate flex-1">
                        <span className="font-extrabold text-slate-900 block truncate">{getText(item.text)}</span>
                        <div className="flex items-center gap-2 mt-1 select-none">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.type === 'critical' ? 'bg-red-50 text-red-700 border border-red-100' :
                            item.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                          <span className={`text-[9px] font-bold ${item.active ? 'text-red-600' : 'text-slate-400'}`}>
                            {item.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 select-none">
                        <button id={`admin-ann-edit-${item.id}`} onClick={() => handleStartEditAnn(item)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded" title={t('editBtn')}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button id={`admin-ann-delete-${item.id}`} onClick={() => handleDeleteAnn(item.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title={t('deleteBtn')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. LOGO MANAGEMENT TAB */}
        {activeTab === 'logo' && isMasterAdmin && (
          <div id="admin-tab-logo-content" className="space-y-6 max-w-lg">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 mb-1">
                {language === 'ar' ? 'تعديل شعار التجمع' : 'Topluluk Logosunu Değiştir'}
              </h3>
              <p className="text-slate-500 text-xs">
                {language === 'ar' ? 'تغيير شعار التجمع الرسمي المعروض في الهيدر والفوتر واللوحة.' : 'Portal üst bilgisi, alt bilgisi ve panellerde görünen resmi logoyu güncelleyin.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                <img src={logo} alt="Current Logo" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 text-xs w-full">
                <span className="font-bold text-slate-700 block">
                  {language === 'ar' ? 'معاينة الشعار الحالي' : 'Mevcut Logo Önizlemesi'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {language === 'ar' ? 'يدعم الملفات من نوع PNG, JPG أو روابط ويب مباشرة.' : 'PNG, JPG dosyalarını veya doğrudan web bağlantılarını destekler.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="block text-slate-700 font-bold mb-1">
                  {language === 'ar' ? 'رفع ملف شعار جديد' : 'Yeni Logo Dosyası Yükle'}
                </label>
                <input
                  id="logo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          onSaveLogo(reader.result);
                          triggerToast(language === 'ar' ? 'تم تحديث الشعار بنجاح!' : 'Logo başarıyla güncellendi!');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                />
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 font-bold select-none text-[10px] uppercase">
                  {language === 'ar' ? 'أو' : 'VEYA'}
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="block text-slate-700 font-bold mb-1">
                  {language === 'ar' ? 'رابط الشعار المباشر' : 'Doğrudan Logo Bağlantısı (URL)'}
                </label>
                <div className="flex gap-2">
                  <input
                    id="logo-url-input"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={logo.startsWith('data:') ? '' : logo}
                    onChange={(e) => {
                      if (e.target.value) {
                        onSaveLogo(e.target.value);
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-xs"
                  />
                  <button
                    id="logo-save-url-btn"
                    onClick={() => {
                      if (!logo.startsWith('data:')) {
                        triggerToast(language === 'ar' ? 'تم حفظ الرابط بنجاح!' : 'Bağlantı başarıyla kaydedildi!');
                      }
                    }}
                    className="px-3 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 font-bold transition shrink-0"
                  >
                    {language === 'ar' ? 'حفظ الرابط' : 'Bağlantıyı Kaydet'}
                  </button>
                </div>
              </div>

              <div className="pt-2 select-none">
                <button
                  id="logo-reset-btn"
                  onClick={() => {
                    onSaveLogo(logoImg);
                    triggerToast(language === 'ar' ? 'تمت إعادة الشعار الافتراضي!' : 'Varsayılan logo geri yüklendi!');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition"
                >
                  {language === 'ar' ? 'إعادة تعيين للشعار الافتراضي' : 'Varsayılan Logoya Sıfırla'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. ASSISTANT ACCOUNTS TAB */}
        {activeTab === 'assistants' && isMasterAdmin && (
          <div id="admin-tab-assistants-content" className="space-y-6">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 mb-1">
                {language === 'ar' ? 'إدارة الحسابات المساعدة' : 'Yardımcı Hesap Yönetimi'}
              </h3>
              <p className="text-slate-500 text-xs">
                {language === 'ar' ? 'يمكنك إضافة حسابات مساعدة للهيئة الإدارية للمساعدة في تعديل محتوى الموقع مع إمكانية إزالتها في أي وقت.' : 'Sitenin içeriğini düzenlemeye yardımcı olacak yardımcı idari hesaplar ekleyebilir ve istediğiniz zaman kaldırabilirsiniz.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form to Create */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                  {language === 'ar' ? 'إضافة حساب جديد' : 'Yeni Hesap Ekle'}
                </h4>
                
                {assError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-bold">
                    {assError}
                  </div>
                )}

                <form onSubmit={handleAddAssistant} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block text-slate-700 font-bold">
                      {language === 'ar' ? 'اسم المستخدم' : 'Kullanıcı Adı'}
                    </label>
                    <input
                      id="assistant-username-input"
                      type="text"
                      required
                      value={newAssUsername}
                      onChange={(e) => setNewAssUsername(e.target.value)}
                      placeholder="e.g. user_help"
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-700 font-bold">
                      {language === 'ar' ? 'كلمة المرور' : 'Şifre'}
                    </label>
                    <input
                      id="assistant-password-input"
                      type="text"
                      required
                      value={newAssPassword}
                      onChange={(e) => setNewAssPassword(e.target.value)}
                      placeholder="e.g. pass123"
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <button
                    id="assistant-add-submit-btn"
                    type="submit"
                    className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg transition"
                  >
                    {language === 'ar' ? 'إضافة الحساب المساعد' : 'Yardımcı Hesabı Ekle'}
                  </button>
                </form>
              </div>

              {/* List of assistants */}
              <div className="lg:col-span-2 border border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                  {language === 'ar' ? 'الحسابات المساعدة النشطة' : 'Aktif Yardımcı Hesaplar'}
                </h4>

                {assistants.length === 0 ? (
                  <p className="text-slate-400 text-xs py-8 text-center italic">
                    {language === 'ar' ? 'لا توجد حسابات مساعدة حالياً.' : 'Henüz yardımcı hesap eklenmemiş.'}
                  </p>
                ) : (
                  <div className="divide-y divide-slate-150">
                    {assistants.map((acc) => (
                      <div id={`assistant-row-${acc.id}`} key={acc.id} className="py-3 flex justify-between items-center text-xs gap-4">
                        <div>
                          <span className="font-extrabold text-slate-900 block">{acc.username}</span>
                          <span className="text-[10px] text-slate-500 block">
                            {language === 'ar' ? `تاريخ الإنشاء: ${acc.createdAt}` : `Oluşturulma Tarihi: ${acc.createdAt}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {acc.password}
                          </span>
                          <button
                            id={`assistant-delete-${acc.id}`}
                            onClick={() => handleDeleteAssistant(acc.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                            title={language === 'ar' ? 'حذف الحساب' : 'Hesabı Kaldır'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
