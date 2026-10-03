import React, { useState, useEffect } from 'react';
import { NewsItem, UniversityNewsItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { initialUniversityNews } from '../data/initialData';
import { 
  Search, Eye, Calendar, Tag, ArrowLeft, Newspaper, 
  Globe, RefreshCw, ExternalLink, Sparkles, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsSectionProps {
  news: NewsItem[];
  incrementViews: (id: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, incrementViews }) => {
  const { getText, language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Dual-mode news switcher ('union' = Union News, 'university' = University Website News)
  const [newsType, setNewsType] = useState<'union' | 'university'>('union');
  const [univNews, setUnivNews] = useState<UniversityNewsItem[]>(() => {
    try {
      const cached = localStorage.getItem('pales_union_live_iste_news');
      return cached ? JSON.parse(cached) : initialUniversityNews;
    } catch {
      return initialUniversityNews;
    }
  });
  const [isLoadingUniv, setIsLoadingUniv] = useState(false);
  const [univError, setUnivError] = useState<string | null>(null);
  const [foreignOnly, setForeignOnly] = useState(false);

  // Extract unique categories for Union News in both languages (indexed by original Turkish)
  const uniqueCategories = Array.from(new Set(news.map(item => item.category.tr)));

  const handleNewsClick = (item: NewsItem) => {
    incrementViews(item.id);
    setSelectedNews({ ...item, views: item.views + 1 });
  };

  const fetchUniversityNews = async (forceRefresh = false) => {
    setIsLoadingUniv(true);
    setUnivError(null);
    try {
      const url = forceRefresh ? '/api/university-news?refresh=true' : '/api/university-news';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setUnivNews(json.data);
        try {
          localStorage.setItem('pales_union_live_iste_news', JSON.stringify(json.data));
        } catch (e) {
          console.warn('Could not save to localStorage', e);
        }
      } else if (json.data && Array.isArray(json.data)) {
        setUnivNews(json.data);
      }
    } catch (err: any) {
      console.error('Error fetching university announcements:', err);
      setUnivError(language === 'ar' ? 'تعذر جلب الإعلانات المباشرة حالياً، يتم عرض البيانات المحفوظة.' : 'Canlı duyurular alınamadı, kaydedilen veriler gösteriliyor.');
    } finally {
      setIsLoadingUniv(false);
    }
  };

  // Automatically fetch university news on initial mount and when university tab is activated
  useEffect(() => {
    fetchUniversityNews(false);
  }, []);

  useEffect(() => {
    if (newsType === 'university' && univNews.length === 0) {
      fetchUniversityNews(false);
    }
  }, [newsType]);

  // Filtering for Union News
  const filteredNews = news.filter((item) => {
    const categoryMatch = selectedCategory === 'all' || item.category.tr === selectedCategory;
    const titleMatch = getText(item.title).toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch = getText(item.content).toLowerCase().includes(searchTerm.toLowerCase());
    const tagsMatch = item.tags.some(tag => getText(tag).toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && (titleMatch || contentMatch || tagsMatch);
  });

  // Filtering for University News
  const filteredUnivNews = univNews.filter((item) => {
    if (foreignOnly && !item.isRelevantToForeigners) {
      return false;
    }
    const term = searchTerm.toLowerCase();
    return (
      item.titleTr.toLowerCase().includes(term) ||
      item.titleAr.toLowerCase().includes(term) ||
      item.contentTr.toLowerCase().includes(term) ||
      item.contentAr.toLowerCase().includes(term) ||
      item.categoryTr.toLowerCase().includes(term) ||
      item.categoryAr.toLowerCase().includes(term)
    );
  });

  return (
    <div id="news-section-root" className="space-y-8">
      
      {/* Page Title & Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Newspaper className="w-6 h-6 text-red-600" />
          <span>{t('latestNews')}</span>
        </h2>
        <div className="h-1 w-20 bg-red-600 mx-auto rounded-full"></div>
      </div>

      {/* Modern Toggle Bar Switcher (Union News vs University Official) */}
      <div className="flex justify-center select-none">
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex gap-1">
          <button
            onClick={() => {
              setNewsType('union');
              setSelectedNews(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition flex items-center gap-2 ${
              newsType === 'union'
                ? 'bg-red-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>{language === 'ar' ? 'أخبار ونشاطات التجمع' : 'Topluluk Haberleri'}</span>
          </button>
          <button
            onClick={() => {
              setNewsType('university');
              setSelectedNews(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition flex items-center gap-2 ${
              newsType === 'university'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ar' ? 'إعلانات جامعة İSTE الرسمية' : 'İSTE Resmi Duyuruları'}</span>
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse select-none">Live</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedNews ? (
          <motion.div
            key={`${newsType}-list`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Search & Categories Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
              
              {/* Category Filters (Only shown for Union News) */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {newsType === 'union' ? (
                  <>
                    <button
                      id="category-filter-all"
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        selectedCategory === 'all'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t('allCategories')}
                    </button>
                    {news.length > 0 && uniqueCategories.map((catTr) => {
                      const correspondingNews = news.find(n => n.category.tr === catTr);
                      const catLabel = correspondingNews ? getText(correspondingNews.category) : catTr;
                      return (
                        <button
                          id={`category-filter-${catTr}`}
                          key={catTr}
                          onClick={() => setSelectedCategory(catTr)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                            selectedCategory === catTr
                              ? 'bg-red-700 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {catLabel}
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      id="refresh-univ-news-btn"
                      onClick={() => fetchUniversityNews(true)}
                      disabled={isLoadingUniv}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUniv ? 'animate-spin' : ''}`} />
                      <span>{language === 'ar' ? 'تحديث الإعلانات (Groq AI)' : 'Duyuruları Yenile'}</span>
                    </button>
                    
                    <button
                      id="toggle-foreign-only-btn"
                      onClick={() => setForeignOnly(!foreignOnly)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition border flex items-center gap-1.5 cursor-pointer ${
                        foreignOnly
                          ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'للطلاب الأجانب فقط' : 'Yalnızca Yabancı Öğrenciler'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="news-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>

            </div>

            {/* Render Union News list */}
            {newsType === 'union' && (
              filteredNews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs shadow-sm">
                  {t('noNewsFound')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((item, idx) => (
                    <motion.article
                      id={`news-card-${item.id}`}
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleNewsClick(item)}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-red-600/30 transition duration-200 cursor-pointer flex flex-col group h-full"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video w-full bg-slate-100 relative overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={getText(item.title)}
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md backdrop-blur border border-white/10">
                          {getText(item.category)}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col flex-1 space-y-2.5">
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold select-none">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.date}</span>
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100">
                            <Eye className="w-3 h-3" />
                            <span>{item.views}</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-2 leading-tight">
                          {getText(item.title)}
                        </h3>

                        {/* Content Snippet */}
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">
                          {getText(item.content)}
                        </p>

                        {/* Tags & Read More Action */}
                        <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 select-none">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag, tagIdx) => (
                              <span key={tagIdx} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-bold border border-red-100/55">
                                <Tag className="w-2.5 h-2.5 text-red-600" />
                                <span>{getText(tag)}</span>
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-red-600 group-hover:underline flex items-center gap-0.5">
                            {t('readMore')}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )
            )}

            {/* Render Live University News list */}
            {newsType === 'university' && (
              <div className="space-y-6">
                {isLoadingUniv ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
                    <span className="text-xs text-slate-500 font-bold">
                      {language === 'ar' ? 'جاري الاتصال بموقع جامعة İSTE وسحب الإعلانات والمزامنة والترجمة التلقائية...' : 'İSTE duyuruları çekiliyor, senkronize ediliyor ve yapay zeka ile çevriliyor...'}
                    </span>
                  </div>
                ) : univError ? (
                  <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-sm text-center space-y-3 flex flex-col items-center">
                    <AlertTriangle className="w-8 h-8" />
                    <p className="text-xs font-bold">{univError}</p>
                    <button
                      onClick={fetchUniversityNews}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                    >
                      {language === 'ar' ? 'إعادة المحاولة' : 'Yeniden Dene'}
                    </button>
                  </div>
                ) : filteredUnivNews.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs shadow-sm">
                    {t('noNewsFound')}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredUnivNews.map((item, idx) => (
                      <motion.div
                        id={`univ-news-card-${item.id}`}
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4 hover:shadow-md hover:border-red-600/30 transition duration-200"
                      >
                        {/* Meta & Category Info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-semibold select-none">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.date}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                              {language === 'ar' ? item.categoryAr : item.categoryTr}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.isRelevantToForeigners && (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5 animate-pulse">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                <span>{language === 'ar' ? 'يخص الطلاب الأجانب' : 'Yabancı Öğrencileri İlgilendirir'}</span>
                              </span>
                            )}
                            <span className="bg-red-50 text-red-700 border border-red-100 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-red-600" />
                              <span>AI Translated (bilingual)</span>
                            </span>
                          </div>
                        </div>

                        {/* Bilingual Titles */}
                        <div className="space-y-1.5">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                            <span className="text-red-600 font-extrabold mr-1.5 bg-red-50 px-1 py-0.5 rounded text-[10px]">ar</span>
                            <span>{item.titleAr}</span>
                          </h4>
                          <h5 className="text-xs font-bold text-slate-500 leading-snug" dir="ltr">
                            <span className="text-slate-400 font-extrabold mr-1.5 bg-slate-100 px-1 py-0.5 rounded text-[10px]">tr</span>
                            <span>{item.titleTr}</span>
                          </h5>
                        </div>

                        {/* Bilingual Contents */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed text-justify">
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold text-red-600 bg-red-50/50 px-1.5 py-0.5 rounded select-none uppercase">العربية مترجم</span>
                            <p className="whitespace-pre-wrap leading-relaxed">{item.contentAr}</p>
                          </div>
                          <div className="space-y-1 bg-slate-50/50 p-3 rounded-lg border border-slate-100" dir="ltr">
                            <span className="text-[9px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded select-none uppercase">Türkçe Orijinal</span>
                            <p className="text-slate-500 whitespace-pre-wrap leading-relaxed">{item.contentTr}</p>
                          </div>
                        </div>

                        {/* Direct Link Action */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-semibold">
                            İskenderun Teknik Üniversitesi
                          </span>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition"
                          >
                            <span>{language === 'ar' ? 'عرض الإعلان على موقع الجامعة (iste.edu.tr)' : 'Resmi Duyuruyu İncele (iste.edu.tr)'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </motion.div>
        ) : (
          /* News Detail View (Only applicable to Local Union News) */
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md"
          >
            {/* Header / Back Action */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <button
                id="back-to-news-btn"
                onClick={() => setSelectedNews(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('backToNews')}</span>
              </button>
              <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {getText(selectedNews.category)}
              </span>
            </div>

            {/* Image banner */}
            <div className="aspect-video w-full bg-slate-100 relative">
              <img
                src={selectedNews.image}
                alt={getText(selectedNews.title)}
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Core News Info */}
            <div className="p-6 sm:p-8 space-y-4">
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold border-b border-slate-100 pb-3 select-none">
                <span className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedNews.date}</span>
                </span>
                <span className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedNews.views} {t('newsViews')}</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {getText(selectedNews.title)}
              </h1>

              {/* Content Body */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                {getText(selectedNews.content)}
              </p>

              {/* Tags block */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5 select-none">
                {selectedNews.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold border border-slate-200">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{getText(tag)}</span>
                  </span>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
