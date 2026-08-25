import React, { useState, useMemo } from 'react';
import { DirectoryMember } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, Search, GraduationCap, Tag, Mail, Phone, 
  Linkedin, Calendar, BookOpen, User, Sparkles, 
  ChevronRight, Filter, X, ExternalLink, Award, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DirectorySectionProps {
  members: DirectoryMember[];
}

export const DirectorySection: React.FC<DirectorySectionProps> = ({ members }) => {
  const { t, getText, language, dir } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedMemberModal, setSelectedMemberModal] = useState<DirectoryMember | null>(null);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Extract all unique categories (in current language)
  const categoriesList = useMemo(() => {
    const map = new Map<string, { ar: string; tr: string }>();
    members.forEach(m => {
      const key = m.category.ar || m.category.tr;
      if (key && !map.has(key)) {
        map.set(key, { ar: m.category.ar, tr: m.category.tr });
      }
    });
    return Array.from(map.values());
  }, [members]);

  // Extract all unique majors (in current language)
  const majorsList = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      const val = getText(m.major);
      if (val) set.add(val);
    });
    return Array.from(set);
  }, [members, language]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const name = getText(member.name).toLowerCase();
      const major = getText(member.major).toLowerCase();
      const category = getText(member.category).toLowerCase();
      const role = getText(member.roleTitle).toLowerCase();
      const bio = getText(member.bio).toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || 
        name.includes(query) || 
        major.includes(query) || 
        category.includes(query) || 
        role.includes(query) || 
        bio.includes(query);

      const matchesCategory = selectedCategory === 'all' || 
        member.category.ar === selectedCategory || 
        member.category.tr === selectedCategory;

      const matchesMajor = selectedMajor === 'all' || 
        getText(member.major) === selectedMajor;

      return matchesSearch && matchesCategory && matchesMajor;
    });
  }, [members, searchQuery, selectedCategory, selectedMajor, language]);

  const handleCopyContact = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(type);
    setTimeout(() => setCopiedContact(null), 2500);
  };

  // Helper badge color based on category
  const getCategoryBadgeClass = (categoryText: string) => {
    const lower = categoryText.toLowerCase();
    if (lower.includes('إدارية') || lower.includes('yönetim') || lower.includes('رئيس') || lower.includes('başkan')) {
      return 'bg-burgundy-700 text-white dark:bg-burgundy-600';
    }
    if (lower.includes('ممثلو') || lower.includes('temsilci') || lower.includes('قسم')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50';
    }
    if (lower.includes('متميز') || lower.includes('başarılı') || lower.includes('شرف')) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50';
    }
    if (lower.includes('خريج') || lower.includes('mezun')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50';
    }
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  };

  return (
    <div id="directory-section-root" className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-burgundy-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-burgundy-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold mb-4 shadow-sm">
            <Users className="w-3.5 h-3.5" />
            <span>{t('directoryTitle')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 font-sans">
            {t('directoryTitle')}
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
            {t('directorySub')}
          </p>

          {/* Quick Counter */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{filteredMembers.length} {t('membersCount')}</span>
            </div>
            {categoriesList.length > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 font-medium">
                {categoriesList.length} {language === 'ar' ? 'تصنيفات متوفرة' : 'Mevcut Kategori'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="directory-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchMembersPlaceholder')}
            className="w-full ps-10 pe-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-700 dark:focus:ring-red-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Chips Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-burgundy-700 dark:text-red-400" />
              {t('filterByCategory')}:
            </span>
            {(selectedCategory !== 'all' || selectedMajor !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMajor('all');
                  setSearchQuery('');
                }}
                className="text-burgundy-700 dark:text-red-400 hover:underline text-[11px] font-bold"
              >
                {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Filtreleri Sıfırla'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 select-none ${
                selectedCategory === 'all'
                  ? 'bg-burgundy-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t('allMembers')}
            </button>

            {categoriesList.map((cat, idx) => {
              const catName = getText(cat);
              const isSelected = selectedCategory === cat.ar || selectedCategory === cat.tr;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat[language] || cat.ar)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 select-none ${
                    isSelected
                      ? 'bg-burgundy-700 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Major Filter (if available) */}
        {majorsList.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              {t('filterByMajor')}:
            </span>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-burgundy-700"
            >
              <option value="all">{t('allMajors')}</option>
              {majorsList.map((maj, i) => (
                <option key={i} value={maj}>{maj}</option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* Cards Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMembers.map((member) => {
            const memberName = getText(member.name);
            const memberMajor = getText(member.major);
            const memberCategory = getText(member.category);
            const memberRole = getText(member.roleTitle);
            const memberYear = getText(member.academicYear);
            const memberBio = getText(member.bio);

            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-burgundy-300 dark:hover:border-red-900/50 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Card Top: Image & Badges */}
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={memberName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
                      <User className="w-16 h-16 stroke-[1.2]" />
                      <span className="text-[11px] font-bold mt-1 text-slate-400">
                        {memberName.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Category Pill Tag (Top-End) */}
                  <div className="absolute top-3 end-3 z-10">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm ${getCategoryBadgeClass(memberCategory)}`}>
                      {memberCategory}
                    </span>
                  </div>

                  {/* Academic Year Tag (Top-Start) */}
                  {memberYear && (
                    <div className="absolute top-3 start-3 z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {memberYear}
                      </span>
                    </div>
                  )}

                  {/* Role Title in bottom overlay (if provided) */}
                  {memberRole && (
                    <div className="absolute bottom-2.5 start-3 end-3 z-10">
                      <p className="text-[11px] font-bold text-amber-300 drop-shadow truncate">
                        {memberRole}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Name */}
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-burgundy-700 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                      {memberName}
                    </h3>

                    {/* Major / Specialization */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-burgundy-700 dark:text-red-400 shrink-0" />
                      <span className="truncate">{memberMajor}</span>
                    </div>

                    {/* Bio Snippet */}
                    {memberBio && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                        {memberBio}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom: Category Detail & Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    
                    {/* Category Label */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{memberCategory}</span>
                    </div>

                    {/* View Details / Contact Button */}
                    <button
                      onClick={() => setSelectedMemberModal(member)}
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-burgundy-700 hover:text-white dark:hover:bg-red-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition shrink-0 flex items-center gap-1"
                    >
                      <span>{t('contactMember')}</span>
                      <ChevronRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {t('noMembersFound')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar' 
                ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً وتخصصاً مختلفاً.' 
                : 'Farklı arama kelimeleri deneyin veya filtreleri temizleyin.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedMajor('all');
            }}
            className="px-4 py-2 bg-burgundy-700 text-white rounded-xl text-xs font-bold hover:bg-burgundy-800 transition"
          >
            {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Filtreleri Temizle'}
          </button>
        </div>
      )}

      {/* Member Details & Contact Modal */}
      <AnimatePresence>
        {selectedMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              {/* Modal Top Header */}
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                {selectedMemberModal.image ? (
                  <img
                    src={selectedMemberModal.image}
                    alt={getText(selectedMemberModal.name)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    <User className="w-20 h-20" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <button
                  onClick={() => setSelectedMemberModal(null)}
                  className="absolute top-4 end-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 start-5 end-5 space-y-1">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow ${getCategoryBadgeClass(getText(selectedMemberModal.category))}`}>
                    {getText(selectedMemberModal.category)}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {getText(selectedMemberModal.name)}
                  </h3>
                  {selectedMemberModal.roleTitle && (
                    <p className="text-xs font-bold text-amber-300">
                      {getText(selectedMemberModal.roleTitle)}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                
                {/* Major & Academic Year Details */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {t('specialization')}
                    </span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-burgundy-700 dark:text-red-400 shrink-0" />
                      <span>{getText(selectedMemberModal.major)}</span>
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {t('classification')}
                    </span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{getText(selectedMemberModal.category)}</span>
                    </p>
                  </div>
                </div>

                {/* Bio (if present) */}
                {selectedMemberModal.bio && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {language === 'ar' ? 'نبذة تعريفية' : 'Hakkında'}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {getText(selectedMemberModal.bio)}
                    </p>
                  </div>
                )}

                {/* Contact Channels */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {language === 'ar' ? 'قنوات التواصل' : 'İletişim Kanalları'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMemberModal.email && (
                      <a
                        href={`mailto:${selectedMemberModal.email}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-4 h-4 text-burgundy-700 dark:text-red-400 shrink-0" />
                          <span className="truncate">{selectedMemberModal.email}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {selectedMemberModal.phone && (
                      <a
                        href={`tel:${selectedMemberModal.phone}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{selectedMemberModal.phone}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {selectedMemberModal.linkedin && (
                      <a
                        href={selectedMemberModal.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Linkedin className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">LinkedIn Profile</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </a>
                    )}

                    {!selectedMemberModal.email && !selectedMemberModal.phone && !selectedMemberModal.linkedin && (
                      <div className="col-span-2 text-center py-3 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        {language === 'ar' 
                          ? 'يمكنك التواصل مع العضو من خلال قنوات التجمع الرسمية.' 
                          : 'Topluluk resmi kanalları üzerinden iletişim kurabilirsiniz.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer Close Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedMemberModal(null)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition"
                  >
                    {language === 'ar' ? 'إغلاق البطاقة' : 'Kartı Kapat'}
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
