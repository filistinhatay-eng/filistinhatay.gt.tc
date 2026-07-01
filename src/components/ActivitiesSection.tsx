import React, { useState } from 'react';
import { ActivityItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2, Ticket, Sparkles, Share2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivitiesSectionProps {
  activities: ActivityItem[];
  registerForActivity: (
    activityId: string, 
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

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities, registerForActivity }) => {
  const { getText, t, dir, language } = useLanguage();
  const [registeringActivity, setRegisteringActivity] = useState<ActivityItem | null>(null);
  
  // Registration Form State (5 specific fields)
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

  const handleOpenShare = (id: string, title: string, type: 'activity' | 'course') => {
    setSharingItem({ id, title, type });
    setCopied(false);
  };

  const getShareUrl = () => {
    if (!sharingItem) return '';
    return `${window.location.origin}?tab=${sharingItem.type === 'activity' ? 'activities' : 'courses'}&id=${sharingItem.id}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenRegistration = (item: ActivityItem) => {
    setRegisteringActivity(item);
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

    if (!registeringActivity) return;

    const registrationData = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      studentId: '',
      email: email.trim(),
      phone: phone.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      major: major.trim()
    };

    const success = registerForActivity(registeringActivity.id, registrationData);
    if (success) {
      setSuccessMessage(true);
    } else {
      setFormError(t('registrationClosed'));
    }
  };

  // Helper to split a date "YYYY-MM-DD" into Month and Day for visual calendar badges
  const parseDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { year: '', month: '', day: '' };
    
    // Month name translation map
    const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const monthsTr = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    const year = parts[0];
    const monthName = dir === 'rtl' ? monthsAr[monthIndex] : monthsTr[monthIndex];

    return { year, month: monthName, day };
  };

  return (
    <div id="activities-section-root" className="space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Ticket className="w-6 h-6 text-red-600" />
          <span>{t('unionEvents')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
          {t('eventsSub')}
        </p>
        <div className="star-divider !my-4 opacity-50" />
      </div>

      {/* Activities Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activities.map((item, idx) => {
          const cal = parseDate(item.date);
          const spotsLeft = item.maxSeats ? item.maxSeats - item.registeredCount : null;
          const isFull = spotsLeft !== null && spotsLeft <= 0;

          return (
            <motion.div
              id={`activity-card-${item.id}`}
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-amber-500/40 hover:shadow-md transition duration-300 flex flex-col sm:flex-row group relative"
            >
              {/* Corner Ornament */}
              <div className="ornament-tatreez-corner" />
              
              {/* Event Image & Calendar Badge Overlay */}
              <div className="relative w-full sm:w-48 aspect-video sm:aspect-auto shrink-0 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={getText(item.title)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                
                {/* Visual Calendar Badge Overlay */}
                <div className={`absolute top-3.5 ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'} bg-white/95 rounded-xl border border-slate-200 shadow-md flex flex-col items-center p-2 min-w-[55px] backdrop-blur`}>
                  <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest">{cal.month}</span>
                  <span className="text-lg font-extrabold text-slate-900 leading-none mt-0.5">{cal.day}</span>
                  <span className="text-[9px] text-slate-400 font-mono mt-1">{cal.year}</span>
                </div>
              </div>

              {/* Event Details Content */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4 relative z-10">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {/* Category Indicator */}
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-red-100">
                      🇵🇸 {language === 'ar' ? 'فعالية فلسطينية' : 'Filistin Etkinliği'}
                    </span>
                    <span className="text-amber-500 text-xs">✦</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-red-600 transition">
                    {getText(item.title)}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 text-justify">
                    {getText(item.description)}
                  </p>
                </div>

                {/* Logistics Badges & Action */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold select-none">
                    <Clock className="w-3.5 h-3.5 text-red-600" />
                    <span>{item.time || '12:00 - 15:00'}</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[10px] text-slate-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{getText(item.location)}</span>
                  </div>

                  {/* Share & Register buttons panel */}
                  <div className="flex gap-2 select-none">
                    {/* Share Button */}
                    <button
                      id={`share-btn-act-${item.id}`}
                      type="button"
                      onClick={() => handleOpenShare(item.id, getText(item.title), 'activity')}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold transition duration-150 cursor-pointer"
                      title={t('share')}
                    >
                      <Share2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{t('share')}</span>
                    </button>

                    {item.registrationEnabled && (
                      <div className="flex-1">
                        {isFull ? (
                          <button
                            id={`reg-btn-closed-${item.id}`}
                            disabled
                            className="w-full text-center py-2 rounded-xl bg-slate-150 text-slate-400 text-xs font-extrabold border border-slate-200 cursor-not-allowed"
                          >
                            {t('registrationClosed')}
                          </button>
                        ) : (
                          <button
                            id={`reg-btn-open-${item.id}`}
                            onClick={() => handleOpenRegistration(item)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold transition duration-150 shadow-sm cursor-pointer hover:shadow-red-700/10 hover:shadow-md"
                          >
                            <span>{t('registerNow')}</span>
                            <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Registration Modal Dialog Overlay with Traditional Arabesque styling */}
      <AnimatePresence>
        {registeringActivity && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            
            <motion.div
              id="registration-modal"
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
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>{t('eventRegistration')}</span>
                  </h3>
                  <p className="text-xs text-red-600 font-extrabold mt-1">
                    {getText(registeringActivity.title)}
                  </p>
                </div>
                <button
                  id="close-reg-modal"
                  onClick={() => setRegisteringActivity(null)}
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
                        {t('registeredSuccess')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {language === 'ar' ? 'قم بمشاركة الفعالية مع أصدقائك وزملائك لحضورها معاً!' : 'Etkinliği arkadaşlarınızla paylaşın ve birlikte katılın!'}
                      </p>
                    </div>

                    <button
                      id="share-after-reg-btn"
                      type="button"
                      onClick={() => {
                        handleOpenShare(registeringActivity.id, getText(registeringActivity.title), 'activity');
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold rounded-xl transition shadow-sm cursor-pointer"
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
                          id="reg-input-first-name"
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
                          id="reg-input-last-name"
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
                        id="reg-input-email"
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
                        id="reg-input-phone"
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
                        id="reg-input-major"
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
                        id="reg-cancel-btn"
                        type="button"
                        onClick={() => setRegisteringActivity(null)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition text-xs"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        id="reg-submit-btn"
                        type="submit"
                        className="px-5 py-2 bg-red-700 hover:bg-red-800 rounded-xl font-bold text-white transition shadow-sm text-xs"
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

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {sharingItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              id="share-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full border-2 border-amber-500/30 shadow-xl overflow-hidden relative p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-red-600" />
                  <span>{t('share')}</span>
                </h3>
                <button
                  id="close-share-modal"
                  onClick={() => setSharingItem(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  {sharingItem.type === 'activity' ? (language === 'ar' ? 'فعالية فلسطينية' : 'Filistin Etkinliği') : (language === 'ar' ? 'درس / مساق دراسي' : 'Ders / Eğitim')}
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
                    id="copy-link-btn"
                    onClick={handleCopyLink}
                    className={`px-4 rounded-xl font-bold text-xs shrink-0 transition flex items-center justify-center gap-1 ${
                      copied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-red-700 hover:bg-red-800 text-white'
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
