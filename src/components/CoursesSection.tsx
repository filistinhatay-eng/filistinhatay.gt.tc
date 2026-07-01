import React, { useState } from 'react';
import { CourseItem, DriveFolder, DriveFile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, BookOpen, Download, FileText, Calendar, CheckCircle, 
  Folder, FolderOpen, ChevronDown, ChevronUp, Cpu, Anchor, 
  Plane, Compass, Globe, Languages, GraduationCap, ChevronLeft, ChevronRight, LayoutGrid, ExternalLink,
  Share2, Mail, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursesSectionProps {
  courses: CourseItem[];
  registerForCourse?: (
    courseId: string, 
    registration: { 
      name: string; 
      studentId: string; 
      phone: string; 
      email: string;
      firstName?: string;
      lastName?: string;
      major?: string;
    }
  ) => boolean;
}

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

const getFacultyIcon = (index: number) => {
  switch (index) {
    case 0: return <Cpu className="w-8 h-8 text-burgundy-700 shrink-0" />;
    case 1: return <Anchor className="w-8 h-8 text-burgundy-700 shrink-0" />;
    case 2: return <Plane className="w-8 h-8 text-burgundy-700 shrink-0" />;
    case 3: return <Compass className="w-8 h-8 text-burgundy-700 shrink-0" />;
    case 4: return <Globe className="w-8 h-8 text-burgundy-700 shrink-0" />;
    case 5: return <Languages className="w-8 h-8 text-burgundy-700 shrink-0" />;
    default: return <GraduationCap className="w-8 h-8 text-burgundy-700 shrink-0" />;
  }
};

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, registerForCourse }) => {
  const { getText, t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Navigation levels
  // 0 = faculties, 1 = departments of selected faculty, 2 = courses of selected department
  const [navStage, setNavStage] = useState<0 | 1 | 2>(0);
  const [selectedFaculty, setSelectedFaculty] = useState<typeof DEFAULT_FACULTIES[number] | null>(null);
  const [selectedDept, setSelectedDept] = useState<{ ar: string; tr: string } | null>(null);

  // File download simulation states (using Records to support multiple parallel downloads)
  const [downloadingFileId, setDownloadingFileId] = useState<Record<string, boolean>>({});
  const [downloadSuccessFileId, setDownloadSuccessFileId] = useState<Record<string, boolean>>({});
  const [downloadingFileObjId, setDownloadingFileObjId] = useState<Record<string, boolean>>({});
  const [downloadSuccessFileObjId, setDownloadSuccessFileObjId] = useState<Record<string, boolean>>({});

  // Expanded folders tracker
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Registration Form State for Courses
  const [registeringCourse, setRegisteringCourse] = useState<CourseItem | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [major, setMajor] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [formError, setFormError] = useState('');

  // Share Modal State
  const [sharingItem, setSharingItem] = useState<{ id: string; title: string; type: 'activity' | 'course' } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOpenShare = (id: string, title: string) => {
    setSharingItem({ id, title, type: 'course' });
    setCopied(false);
  };

  const getShareUrl = () => {
    if (!sharingItem) return '';
    return `${window.location.origin}?tab=courses&id=${sharingItem.id}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenRegistration = (item: CourseItem) => {
    setRegisteringCourse(item);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMajor('');
    setSuccessMessage(false);
    setFormError('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!firstName.trim()) {
      setFormError(t('firstNameRequired'));
      return;
    }
    if (!lastName.trim()) {
      setFormError(t('lastNameRequired'));
      return;
    }
    if (!email.trim()) {
      setFormError(t('emailRequired'));
      return;
    }
    if (!phone.trim()) {
      setFormError(t('phoneRequired'));
      return;
    }
    if (!major.trim()) {
      setFormError(t('majorRequired'));
      return;
    }

    if (!registeringCourse || !registerForCourse) return;

    const registrationData = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      studentId: '',
      email: email.trim(),
      phone: phone.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      major: major.trim()
    };

    const success = registerForCourse(registeringCourse.id, registrationData);
    if (success) {
      setSuccessMessage(true);
    } else {
      setFormError(language === 'ar' ? 'حدث خطأ أثناء محاولة تسجيل حضورك.' : 'Katılım kaydı sırasında bir hata oluştu.');
    }
  };

  const toggleFolder = (courseId: string, folderId: string) => {
    const key = `${courseId}-${folderId}`;
    setExpandedFolders(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDownloadFileObj = (file: { id: string; name: string; url: string; size?: string }) => {
    setDownloadingFileObjId(prev => ({ ...prev, [file.id]: true }));
    setTimeout(() => {
      setDownloadingFileObjId(prev => ({ ...prev, [file.id]: false }));
      setDownloadSuccessFileObjId(prev => ({ ...prev, [file.id]: true }));
      
      try {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("File download error:", err);
      }

      setTimeout(() => {
        setDownloadSuccessFileObjId(prev => ({ ...prev, [file.id]: false }));
      }, 2000);
    }, 1000);
  };

  const handleDownloadFile = (file: DriveFile) => {
    setDownloadingFileId(prev => ({ ...prev, [file.id]: true }));
    
    setTimeout(() => {
      setDownloadingFileId(prev => ({ ...prev, [file.id]: false }));
      setDownloadSuccessFileId(prev => ({ ...prev, [file.id]: true }));
      
      try {
        const content = `[İSTE Filistin Öğrenci Topluluğu / تجمع الطلاب الفلسطينيين]\nالمادة: ${file.name.ar}\nDers: ${file.name.tr}\nSize/الحجم: ${file.size || 'N/A'}\n\nتم تحميل هذا الملف الدراسي المرتّب بنجاح من مجلد الدرايف المشترك الخاص بالمادة.`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = file.url === '#' ? url : file.url;
        link.target = "_blank";
        link.download = `${getText(file.name).replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("File download error:", err);
      }

      setTimeout(() => {
        setDownloadSuccessFileId(prev => ({ ...prev, [file.id]: false }));
      }, 2000);
    }, 1200);
  };

  // Check if a course matches search term (Global Search across all courses)
  const isSearchActive = searchTerm.trim().length > 0;

  const searchedCourses = courses.filter((item) => {
    if (!isSearchActive) return false;
    const term = searchTerm.toLowerCase();
    const titleMatch = getText(item.title).toLowerCase().includes(term);
    const descMatch = getText(item.description).toLowerCase().includes(term);
    const deptMatch = getText(item.department).toLowerCase().includes(term);
    const facultyMatch = item.faculty ? getText(item.faculty).toLowerCase().includes(term) : false;
    return titleMatch || descMatch || deptMatch || facultyMatch;
  });

  // Calculate dynamic stats
  const getFacultyCoursesCount = (facName: { ar: string; tr: string }) => {
    return courses.filter(c => c.faculty && (c.faculty.ar === facName.ar || c.faculty.tr === facName.tr)).length;
  };

  const getDeptCoursesCount = (facName: { ar: string; tr: string }, deptName: { ar: string; tr: string }) => {
    return courses.filter(c => 
      c.faculty && (c.faculty.ar === facName.ar || c.faculty.tr === facName.tr) &&
      c.department && (c.department.ar === deptName.ar || c.department.tr === deptName.tr)
    ).length;
  };

  // Get courses of active selection
  const activeSectionCourses = courses.filter(c => 
    selectedFaculty && c.faculty && (c.faculty.ar === selectedFaculty.name.ar || c.faculty.tr === selectedFaculty.name.tr) &&
    selectedDept && c.department && (c.department.ar === selectedDept.ar || c.department.tr === selectedDept.tr)
  );

  return (
    <div id="courses-section-root" className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Page Title & Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 select-none">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-burgundy-700" />
          <span>{t('academicMaterials')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
          {language === 'ar' ? 'تصفح المقررات الدراسية لجميع الكليات والأقسام وحمّل ملفات المحاضرات والملخصات بسهولة.' : 'Tüm fakülte ve bölümlerin ders materyallerine göz atın, ders dosyalarını ve özetleri kolayca indirin.'}
        </p>
        <div className="star-divider !my-4 opacity-50" />
      </div>

      {/* Global Search input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center relative overflow-hidden">
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-amber-500" />
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <LayoutGrid className="w-4 h-4 text-burgundy-700" />
          <span>
            {isSearchActive 
              ? (language === 'ar' ? `نتائج البحث عن "${searchTerm}":` : `"${searchTerm}" için arama sonuçları:`)
              : (language === 'ar' ? 'الدليل الدراسي الشامل للكليات والأقسام' : 'Fakülteler ve Bölümler Akademik Rehberi')
            }
          </span>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            id="courses-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن مادة، قسم، أو كلية...' : 'Ders, bölüm veya fakülte ara...'}
            className="w-full pr-9 pl-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-600 text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* BREADCRUMBS (Only shown when not searching) */}
      {!isSearchActive && navStage > 0 && (
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-150 select-none">
          <button 
            onClick={() => { setNavStage(0); setSelectedFaculty(null); setSelectedDept(null); }}
            className="hover:text-burgundy-700 transition"
          >
            {language === 'ar' ? 'المكتبة الرقمية' : 'Kütüphane'}
          </button>
          
          {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5 text-slate-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
          
          <button 
            onClick={() => { setNavStage(1); setSelectedDept(null); }}
            className={`hover:text-burgundy-700 transition truncate max-w-[150px] sm:max-w-none ${navStage === 1 ? 'text-burgundy-700 font-extrabold' : ''}`}
            disabled={navStage === 1}
          >
            {selectedFaculty ? getText(selectedFaculty.name) : ''}
          </button>

          {navStage === 2 && selectedDept && (
            <>
              {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5 text-slate-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
              <span className="text-burgundy-700 font-extrabold truncate max-w-[150px] sm:max-w-none">
                {getText(selectedDept)}
              </span>
            </>
          )}
        </nav>
      )}

      {/* MAIN CONTAINER */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* SEARCH RESULTS MODE */}
          {isSearchActive ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {searchedCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-bold">
                  {language === 'ar' ? 'لم يتم العثور على أي مواد مطابقة للبحث.' : 'Arama kriterlerinize uygun ders bulunamadı.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchedCourses.map((item) => (
                    <CourseCard 
                      key={item.id}
                      item={item}
                      getText={getText}
                      language={language}
                      t={t}
                      expandedFolders={expandedFolders}
                      toggleFolder={toggleFolder}
                      downloadingFileId={downloadingFileId}
                      downloadSuccessFileId={downloadSuccessFileId}
                      downloadingFileObjId={downloadingFileObjId}
                      downloadSuccessFileObjId={downloadSuccessFileObjId}
                      handleDownloadFile={handleDownloadFile}
                      handleDownloadFileObj={handleDownloadFileObj}
                      onShare={handleOpenShare}
                      onRegister={registerForCourse ? handleOpenRegistration : undefined}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <>
              {/* STAGE 0: FACULTIES GRID */}
              {navStage === 0 && (
                <motion.div
                  key="stage-faculties"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {DEFAULT_FACULTIES.map((faculty, index) => {
                    const courseCount = getFacultyCoursesCount(faculty.name);
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ y: -4, scale: 1.01 }}
                        onClick={() => {
                          setSelectedFaculty(faculty);
                          setNavStage(1);
                        }}
                        className="bg-white rounded-2xl border-2 border-slate-150 p-6 shadow-xs hover:border-burgundy-700/35 hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                      >
                        <div className="ornament-tatreez-corner" />
                        <div className="space-y-3 relative z-10">
                          <div className="bg-burgundy-50 p-3 rounded-xl w-fit group-hover:bg-burgundy-700 transition-colors duration-300 group-hover:text-white">
                            {getFacultyIcon(index)}
                          </div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 group-hover:text-burgundy-700 transition-colors duration-300 leading-snug">
                            {getText(faculty.name)}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 select-none relative z-10">
                          <span>
                            {language === 'ar' ? `${faculty.departments.length} أقسام` : `${faculty.departments.length} Bölüm`}
                          </span>
                          <span className="bg-burgundy-50 text-burgundy-700 border border-burgundy-100 px-2 py-0.5 rounded-full text-[9px] font-extrabold">
                            {language === 'ar' ? `${courseCount} مواد متوفرة` : `${courseCount} Ders`}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* STAGE 1: DEPARTMENTS LIST */}
              {navStage === 1 && selectedFaculty && (
                <motion.div
                  key="stage-departments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 select-none">
                    <h3 className="text-sm font-extrabold text-slate-800">
                      {language === 'ar' ? 'أقسام وتخصصات الكلية' : 'Fakülte Bölümleri'}
                    </h3>
                    <button 
                      onClick={() => { setNavStage(0); setSelectedFaculty(null); }}
                      className="text-[10px] font-extrabold text-burgundy-700 hover:underline bg-burgundy-50 px-2.5 py-1 rounded-md"
                    >
                      {language === 'ar' ? '← العودة للكليات' : '← Fakültelere Dön'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFaculty.departments.map((dept, idx) => {
                      const courseCount = getDeptCoursesCount(selectedFaculty.name, dept);
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => {
                            setSelectedDept(dept);
                            setNavStage(2);
                          }}
                          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-burgundy-700/20 shadow-xs hover:shadow-sm cursor-pointer transition flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Folder className="w-5 h-5 text-amber-500 shrink-0 group-hover:scale-110 transition duration-300" />
                            <span className="text-xs font-extrabold text-slate-800 group-hover:text-burgundy-700 transition leading-snug truncate">
                              {getText(dept)}
                            </span>
                          </div>
                          <span className="bg-slate-50 border border-slate-150 text-slate-500 font-bold px-2 py-0.5 rounded text-[9px] shrink-0">
                            {language === 'ar' ? `${courseCount} مادة` : `${courseCount} Ders`}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: COURSES LIST */}
              {navStage === 2 && selectedFaculty && selectedDept && (
                <motion.div
                  key="stage-courses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 select-none">
                    <h3 className="text-sm font-extrabold text-slate-800">
                      {language === 'ar' ? 'المواد الدراسية المقررة' : 'Bölüm Dersleri'}
                    </h3>
                    <button 
                      onClick={() => { setNavStage(1); setSelectedDept(null); }}
                      className="text-[10px] font-extrabold text-burgundy-700 hover:underline bg-burgundy-50 px-2.5 py-1 rounded-md"
                    >
                      {language === 'ar' ? '← العودة للأقسام' : '← Bölümlere Dön'}
                    </button>
                  </div>

                  {activeSectionCourses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold">
                      {language === 'ar' ? 'لا يوجد مواد دراسية مرفوعة حالياً في هذا القسم.' : 'Bu bölüme ait henüz ders materyali bulunmamaktadır.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeSectionCourses.map((item) => (
                        <CourseCard 
                          key={item.id}
                          item={item}
                          getText={getText}
                          language={language}
                          t={t}
                          expandedFolders={expandedFolders}
                          toggleFolder={toggleFolder}
                          downloadingFileId={downloadingFileId}
                          downloadSuccessFileId={downloadSuccessFileId}
                          downloadingFileObjId={downloadingFileObjId}
                          downloadSuccessFileObjId={downloadSuccessFileObjId}
                          handleDownloadFile={handleDownloadFile}
                          handleDownloadFileObj={handleDownloadFileObj}
                          onShare={handleOpenShare}
                          onRegister={registerForCourse ? handleOpenRegistration : undefined}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Course Registration Modal Dialog Overlay with Traditional Arabesque styling */}
      <AnimatePresence>
        {registeringCourse && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            
            <motion.div
              id="course-registration-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-md w-full border-2 border-amber-500/30 shadow-xl overflow-hidden relative"
            >
              
              {/* Modal Flag Accent Line */}
              <div className="h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-amber-500 w-full"></div>

              {/* Corner pattern */}
              <div className="absolute top-6 right-6 w-1 h-1 bg-amber-400 rotate-45 pointer-events-none" />

              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-burgundy-700" />
                    <span>{t('courseRegistration')}</span>
                  </h3>
                  <p className="text-xs text-red-600 font-extrabold mt-1">
                    {getText(registeringCourse.title)}
                  </p>
                </div>
                <button
                  id="close-course-reg-modal"
                  onClick={() => setRegisteringCourse(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Modal Body / Form */}
              <div className="p-6">
                {successMessage ? (
                  <div className="text-center py-6 space-y-5">
                    <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-extrabold text-slate-900">
                        {t('registeredCourseSuccess')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {language === 'ar' ? 'قم بمشاركة هذا الدرس مع أصدقائك وزملائك للتسجيل والاستفادة معاً!' : 'Bu dersi arkadaşlarınızla paylaşın ve birlikte katılarak faydalanın!'}
                      </p>
                    </div>

                    <button
                      id="course-share-after-reg-btn"
                      type="button"
                      onClick={() => {
                        handleOpenShare(registeringCourse.id, getText(registeringCourse.title));
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-extrabold rounded-xl transition shadow-sm cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{t('shareAfterReg')}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs sm:text-sm">
                    
                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-extrabold">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {/* First Name */}
                      <div className="space-y-1">
                        <label className="block text-slate-700 font-extrabold text-xs">{t('firstName')}</label>
                        <input
                          id="course-reg-input-first-name"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Ahmad"
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-xs"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-1">
                        <label className="block text-slate-700 font-extrabold text-xs">{t('lastName')}</label>
                        <input
                          id="course-reg-input-last-name"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Al-Saeed"
                          className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-xs"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-slate-700 font-extrabold text-xs">{t('emailAddress')}</label>
                      <input
                        id="course-reg-input-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ahmad@example.com"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-xs"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="block text-slate-700 font-extrabold text-xs">{t('phoneNumber')}</label>
                      <input
                        id="course-reg-input-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 5xx xxx xx xx"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-xs"
                      />
                    </div>

                    {/* Major */}
                    <div className="space-y-1">
                      <label className="block text-slate-700 font-extrabold text-xs">{t('major')}</label>
                      <input
                        id="course-reg-input-major"
                        type="text"
                        required
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="e.g., Computer Engineering"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-xs"
                      />
                    </div>

                    {/* Buttons panel */}
                    <div className="pt-4 flex gap-2 justify-end select-none">
                      <button
                        id="course-reg-cancel-btn"
                        type="button"
                        onClick={() => setRegisteringCourse(null)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition text-xs"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        id="course-reg-submit-btn"
                        type="submit"
                        className="px-5 py-2 bg-burgundy-700 hover:bg-burgundy-800 rounded-xl font-bold text-white transition shadow-sm text-xs"
                      >
                        {t('submitRegistration')}
                      </button>
                    </div>

                  </form>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Share Modal Dialog */}
      <AnimatePresence>
        {sharingItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              id="course-share-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full border-2 border-amber-500/30 shadow-xl overflow-hidden relative p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-burgundy-700" />
                  <span>{t('share')}</span>
                </h3>
                <button
                  id="close-course-share-modal"
                  onClick={() => setSharingItem(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  {language === 'ar' ? 'مساق / مادة دراسية' : 'Ders / Eğitim Materyali'}
                </p>
                <p className="text-xs font-bold text-slate-800 line-clamp-2">
                  {sharingItem.title}
                </p>
              </div>

              {/* Direct share icons */}
              <div className="grid grid-cols-4 gap-2 pt-2 select-none">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(sharingItem.title + ': ' + getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-emerald-50 text-emerald-600 transition group"
                >
                  <span className="p-2 bg-emerald-100 rounded-full group-hover:scale-105 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.004 2c-5.517 0-9.996 4.48-9.996 9.997 0 1.764.462 3.49 1.34 5.011l-1.417 5.176 5.293-1.389a9.92 9.92 0 0 0 4.777 1.205c5.517 0 9.996-4.48 9.996-9.997C22.001 6.48 17.52 2 12.004 2zm0 1.637c4.61 0 8.36 3.75 8.36 8.36 0 4.61-3.75 8.36-8.36 8.36a8.31 8.31 0 0 1-4.26-1.168l-.306-.182-3.167.83.844-3.084-.2-.318A8.307 8.307 0 0 1 3.645 12c0-4.61 3.75-8.36 8.36-8.36zm-3.644 3.6c-.164 0-.437.062-.665.31-.228.248-.87.85-.87 2.072 0 1.222.889 2.404.992 2.541.103.137 1.748 2.67 4.237 3.743.592.255 1.055.408 1.414.523.595.19 1.137.163 1.564.1l.478-.07c.437-.062 1.4-.572 1.597-1.127.197-.555.197-1.03.137-1.127-.058-.098-.228-.16-.478-.284-.25-.124-1.478-.73-1.706-.811-.228-.083-.393-.124-.555.124-.163.248-.633.812-.776.974-.143.163-.285.183-.535.06-.25-.125-1.055-.389-2.01-1.242-.743-.663-1.245-1.48-1.391-1.73-.146-.25-.015-.385.11-.51.112-.112.25-.29.375-.434.124-.145.166-.248.249-.414.083-.165.041-.31-.02-.434-.063-.124-.555-1.34-.761-1.833-.2-.486-.403-.42-.555-.427l-.473-.006z"/>
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(sharingItem.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-sky-50 text-sky-600 transition group"
                >
                  <span className="p-2 bg-sky-100 rounded-full group-hover:scale-105 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.49 1-.74 3.9-1.7 6.51-2.82 7.83-3.37 3.73-1.55 4.5-1.82 5.01-1.83.11 0 .36.03.53.17.14.11.18.27.2.38.02.1.03.28.01.42z"/>
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold">Telegram</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(sharingItem.title + ' ' + getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 text-slate-900 transition group"
                >
                  <span className="p-2 bg-slate-100 rounded-full group-hover:scale-105 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold">Twitter</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(sharingItem.title)}&body=${encodeURIComponent(getShareUrl())}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-50 text-red-600 transition group"
                >
                  <span className="p-2 bg-red-100 rounded-full group-hover:scale-105 transition">
                    <Mail className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold">Email</span>
                </a>
              </div>

              {/* Copy URL Input */}
              <div className="pt-2">
                <label className="block text-[10px] text-slate-400 font-extrabold mb-1">{t('copyLink')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10px] font-mono text-slate-500 focus:outline-none"
                  />
                  <button
                    id="course-copy-link-btn"
                    onClick={handleCopyLink}
                    className={`px-4 rounded-xl font-bold text-xs shrink-0 transition flex items-center justify-center gap-1 ${
                      copied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-burgundy-700 hover:bg-burgundy-800 text-white'
                    }`}
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : null}
                    <span>{copied ? t('linkCopied').split('!')[0] : t('copyLink')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* COURSE CARD SUB-COMPONENT */
interface CourseCardProps {
  item: CourseItem;
  getText: (text: any) => string;
  language: string;
  t: (key: string) => string;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (courseId: string, folderId: string) => void;
  downloadingFileId: Record<string, boolean>;
  downloadSuccessFileId: Record<string, boolean>;
  downloadingFileObjId: Record<string, boolean>;
  downloadSuccessFileObjId: Record<string, boolean>;
  handleDownloadFile: (file: DriveFile) => void;
  handleDownloadFileObj: (file: any) => void;
  onShare: (id: string, title: string) => void;
  onRegister?: (item: CourseItem) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  item, getText, language, t, expandedFolders, toggleFolder,
  downloadingFileId, downloadSuccessFileId, downloadingFileObjId, downloadSuccessFileObjId,
  handleDownloadFile, handleDownloadFileObj, onShare, onRegister
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs hover:border-burgundy-700/30 hover:shadow-sm transition duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group">
      <div className="ornament-tatreez-corner" />
      
      <div className="space-y-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[9px] select-none">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.faculty && (
              <span className="bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded border border-amber-100/50">
                {getText(item.faculty)}
              </span>
            )}
            <span className="bg-burgundy-50 text-burgundy-700 font-extrabold px-2 py-0.5 rounded border border-burgundy-100/50">
              {getText(item.department)}
            </span>
            {item.year && (
              <span className="bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-100/50 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {getText(item.year)}
              </span>
            )}
            {item.semester && (
              <span className="bg-indigo-50 text-indigo-800 font-extrabold px-2 py-0.5 rounded border border-indigo-100/50 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {getText(item.semester)}
              </span>
            )}
          </div>
          <span className="text-burgundy-700 font-bold animate-pulse">✦</span>
        </div>

        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug group-hover:text-burgundy-700 transition-colors">
          {getText(item.title)}
        </h3>

        <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
          {getText(item.description)}
        </p>

        {/* Lesson Files & Folders Container */}
        <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 select-none">
            <FileText className="w-3.5 h-3.5 text-burgundy-700" />
            <span className="text-[10px] font-extrabold text-slate-700">
              {language === 'ar' ? 'الملفات والمستندات الدراسية' : 'Ders Dosyaları ve Belgeler'}
            </span>
          </div>

          {/* Direct uploaded files */}
          {item.pdfFiles && item.pdfFiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-1.5">
              {item.pdfFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-burgundy-700/10 hover:bg-slate-50/50 transition text-[11px]"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1.5">
                    <FileText className="w-3.5 h-3.5 text-burgundy-700 shrink-0" />
                    <span className="truncate font-bold text-slate-700" title={file.name}>
                      {file.name}
                    </span>
                    {file.size && (
                      <span className="text-[9px] text-slate-400 font-mono shrink-0 select-none">
                        ({file.size})
                      </span>
                    )}
                  </div>
                  
                  {file.url && (file.url.startsWith('http://') || file.url.startsWith('https://') || file.type === 'url') ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded text-[9px] font-extrabold flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white transition shrink-0 select-none border border-blue-200/50"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span>{language === 'ar' ? 'فتح الرابط' : 'Bağlantıyı Aç'}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => handleDownloadFileObj(file)}
                      disabled={!!downloadingFileObjId[file.id]}
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 transition shrink-0 select-none ${
                        downloadSuccessFileObjId[file.id]
                          ? 'bg-emerald-50 text-emerald-700'
                          : downloadingFileObjId[file.id]
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-burgundy-50 text-burgundy-700 hover:bg-burgundy-700 hover:text-white'
                      }`}
                    >
                      {downloadSuccessFileObjId[file.id] ? (
                        <>
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>{t('actionSuccess')}</span>
                        </>
                      ) : downloadingFileObjId[file.id] ? (
                        <span className="w-2 h-2 border border-burgundy-700 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Download className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'تحميل' : 'İndir'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Fallback to legacy driveFolders files if any
            item.driveFolders && item.driveFolders.length > 0 ? (
              <div className="space-y-1.5">
                {item.driveFolders.map((folder) => {
                  const isExpanded = expandedFolders[`${item.id}-${folder.id}`];
                  return (
                    <div key={folder.id} className="border border-slate-150 bg-white rounded-lg overflow-hidden transition">
                      <button
                        onClick={() => toggleFolder(item.id, folder.id)}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-50/50 text-start transition text-[11px] font-bold text-slate-700"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isExpanded ? <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" /> : <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          <span className="truncate">{getText(folder.name)}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="border-t border-slate-100 bg-slate-50/30 p-1.5 space-y-1"
                          >
                            {folder.files.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-150 text-[10px] text-slate-700 hover:border-burgundy-700/10 transition">
                                <span className="truncate font-bold pr-1" title={getText(file.name)}>{getText(file.name)}</span>
                                <button
                                  onClick={() => handleDownloadFile(file)}
                                  disabled={!!downloadingFileId[file.id]}
                                  className="px-1.5 py-0.2 bg-burgundy-50 text-burgundy-700 hover:bg-burgundy-700 hover:text-white rounded text-[8px] font-extrabold flex items-center gap-0.5 transition"
                                >
                                  {downloadSuccessFileId[file.id] ? <CheckCircle className="w-2 h-2" /> : <Download className="w-2 h-2" />}
                                  <span>{downloadSuccessFileId[file.id] ? t('actionSuccess') : (language === 'ar' ? 'تحميل' : 'İndir')}</span>
                                </button>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic text-center py-2 select-none">
                {language === 'ar' ? 'لا توجد ملفات مرفوعة لهذا الدرس حالياً.' : 'Bu ders için henüz yüklenmiş dosya bulunmamaktadır.'}
              </p>
            )
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3.5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-[9px] text-slate-400 font-semibold select-none relative z-10">
        <div className="flex gap-2">
          {/* Share Button */}
          <button
            id={`share-btn-course-${item.id}`}
            type="button"
            onClick={() => onShare(item.id, getText(item.title))}
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold transition duration-150 cursor-pointer"
            title={t('share')}
          >
            <Share2 className="w-3.5 h-3.5 text-burgundy-700 shrink-0" />
            <span>{t('share')}</span>
          </button>

          {onRegister && (
            <button
              id={`reg-btn-course-${item.id}`}
              type="button"
              onClick={() => onRegister(item)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-burgundy-700 hover:bg-burgundy-800 text-white text-[10px] font-extrabold transition duration-150 cursor-pointer shadow-sm border border-transparent"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t('registerInCourse')}</span>
            </button>
          )}
        </div>

        <span className="flex items-center gap-1 self-start sm:self-auto text-slate-400 mt-1 sm:mt-0">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{t('addedOn')}: {item.dateAdded}</span>
        </span>
      </div>
    </div>
  );
};
