import React, { useState } from 'react';
import { ImportantLink } from '../types';
import { useLanguage } from '../context/LanguageContext';
import * as Icons from 'lucide-react';
import { 
  ExternalLink, Link2, Share2, Copy, Check, X, Send, 
  MessageCircle, Globe2, Sparkles, CheckCircle2, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImportantLinksProps {
  links: ImportantLink[];
}

// Helper to resolve string icon name to a Lucide icon component
const IconRenderer: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  // @ts-ignore
  const LucideIcon = Icons[name];
  if (!LucideIcon) {
    return <Link2 className={className} />;
  }
  return <LucideIcon className={className} />;
};

export const ImportantLinks: React.FC<ImportantLinksProps> = ({ links }) => {
  const { getText, t, language, dir } = useLanguage();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [shareTargetLink, setShareTargetLink] = useState<ImportantLink | null>(null);

  // Clean canonical portal base URL
  const getBasePortalUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`;
  };

  const basePortalUrl = getBasePortalUrl();
  const linksPageUrl = `${basePortalUrl}?tab=links`;

  const currentShareUrl = shareTargetLink 
    ? `${basePortalUrl}?tab=links#${shareTargetLink.id}` 
    : linksPageUrl;

  const shareTitle = shareTargetLink
    ? `${getText(shareTargetLink.title)} - ${language === 'ar' ? 'بوابة تجمع الطلاب الفلسطينيين بجامعة إسكندرون التقنية' : 'İSTE Filistin Öğrenci Topluluğu'}`
    : (language === 'ar' 
        ? 'دليل الروابط والبوابات الهامة - تجمع الطلاب الفلسطينيين بجامعة إسكندرون التقنية' 
        : 'Önemli Bağlantılar ve Portallar Rehberi - İSTE Filistin Öğrenci Topluluğu');

  const shareDescription = shareTargetLink
    ? `${getText(shareTargetLink.description)} - ${language === 'ar' ? 'تفضل بزيارة موقعنا للاطلاع على كافة الروابط والخدمات الطلابية.' : 'Tüm öğrenci bağlantıları ve hizmetler için web sitemizi ziyaret edin.'}`
    : (language === 'ar'
        ? 'تفضل بزيارة موقعنا للاطلاع على أهم الروابط الأكاديمية وبوابات الطلاب الرسمية لجامعة إسكندرون التقنية (İSTE).'
        : 'İskenderun Teknik Üniversitesi (İSTE) için önemli akademik ve öğrenci portalları rehberi.');

  // Handle native Web Share or open Share Modal
  const handleOpenGeneralShare = async () => {
    setShareTargetLink(null);
    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent.toLowerCase())) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle}\n${shareDescription}`,
          url: linksPageUrl,
        });
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Native share error, falling back to modal:', err);
        }
      }
    }
    setIsShareModalOpen(true);
  };

  const handleOpenCardShare = async (e: React.MouseEvent, link: ImportantLink) => {
    e.preventDefault();
    e.stopPropagation();
    setShareTargetLink(link);

    const cardDirectSiteUrl = `${basePortalUrl}?tab=links#${link.id}`;
    const cardTitle = `${getText(link.title)} - ${language === 'ar' ? 'بوابة تجمع الطلاب الفلسطينيين' : 'İSTE Filistin Portalı'}`;
    const cardText = language === 'ar'
      ? `تفضل بزيارة موقعنا للوصول إلى ${getText(link.title)} وكافة الخدمات الجامعية: ${cardDirectSiteUrl}`
      : `${getText(link.title)} ve tüm öğrenci hizmetleri için web sitemizi ziyaret edin: ${cardDirectSiteUrl}`;

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent.toLowerCase())) {
      try {
        await navigator.share({
          title: cardTitle,
          text: cardText,
          url: cardDirectSiteUrl,
        });
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Native share error, falling back to modal:', err);
        }
      }
    }
    setIsShareModalOpen(true);
  };

  const handleCopyUrl = async (urlToCopy: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const input = document.createElement('input');
        input.value = urlToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const handleQuickCopyCardSiteLink = async (e: React.MouseEvent, link: ImportantLink) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Copy the portal's direct deep-link to drive traffic to our site
      const targetPortalUrl = `${basePortalUrl}?tab=links#${link.id}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(targetPortalUrl);
      }
      setCopiedCardId(link.id);
      setTimeout(() => setCopiedCardId(null), 2200);
    } catch (err) {
      console.warn('Copy card url error:', err);
    }
  };

  // Social share intent links with the site portal URL
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareTitle}\n${shareDescription}\n🔗 ${currentShareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(
    `${shareTitle}\n${shareDescription}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareTitle
  )}&url=${encodeURIComponent(currentShareUrl)}`;

  return (
    <div id="links-section-root" className="space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-extrabold shadow-2xs">
          <Bookmark className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الدليل الطلابي المعتمد' : 'Resmi Öğrenci Rehberi'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center justify-center gap-2">
          <Link2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          <span>{t('usefulPortals')}</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
          {t('portalsSub')}
        </p>

        {/* Action Controls: Share Page Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            id="share-links-page-btn"
            onClick={handleOpenGeneralShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-burgundy-700 dark:hover:bg-burgundy-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
            title={t('shareLinksPage')}
          >
            <Share2 className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>{t('shareLinksPage')}</span>
            <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {language === 'ar' ? 'رابط الموقع' : 'Site Linki'}
            </span>
          </button>
        </div>

        <div className="star-divider !my-4 opacity-50" />
      </div>

      {/* Links Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link, idx) => (
          <motion.div
            id={link.id}
            key={link.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Red-Green Accent Tag on Hover */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-emerald-600 to-amber-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>

            {/* Corner Ornaments */}
            <div className="ornament-tatreez-corner" />

            <div className="space-y-4">
              {/* Header Icon + Quick Share / Copy */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-slate-700 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100 dark:border-slate-600 shadow-inner group-hover:bg-red-700 group-hover:text-white transition duration-300">
                  <IconRenderer name={link.iconName} className="w-5 h-5" />
                </div>

                {/* Actions: Copy Site Link & Share */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleQuickCopyCardSiteLink(e, link)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-xs transition cursor-pointer font-bold"
                    title={language === 'ar' ? 'نسخ رابط الموقع لهذا القسم' : 'Bu Bölümün Site Bağlantısını Kopyala'}
                  >
                    {copiedCardId === link.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">{t('linkCopied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] hidden xs:inline">{language === 'ar' ? 'نسخ للموقع' : 'Site Linki'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => handleOpenCardShare(e, link)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs transition cursor-pointer"
                    title={language === 'ar' ? 'مشاركة رابط الموقع' : 'Site Linkini Paylaş'}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-1.5 relative z-10">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition leading-snug">
                  {getText(link.title)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {getText(link.description)}
                </p>
              </div>
            </div>

            {/* Link Anchor Indicator to External Portal */}
            <div className="border-t border-slate-100 dark:border-slate-700/60 pt-4 mt-5 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-400 select-none relative z-10">
              <span className="truncate max-w-[140px] sm:max-w-[170px] font-mono text-[10px] font-normal text-slate-400 dark:text-slate-400">
                {link.url.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-extrabold text-red-600 dark:text-red-400 hover:underline px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              >
                <span>{t('visitSite')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </motion.div>
        ))}
      </div>

      {/* SHARE MODAL DIALOG */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              dir={dir}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-slate-800 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100 dark:border-slate-700 shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {shareTargetLink 
                        ? (language === 'ar' ? `مشاركة: ${getText(shareTargetLink.title)}` : `Paylaş: ${getText(shareTargetLink.title)}`)
                        : t('shareLinksModalTitle')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ar'
                        ? 'شارك رابط موقعنا الرسمي لجلب الطلاب وتعريفهم بخدمات تجمع الطلاب الفلسطينيين.'
                        : 'Öğrencileri web sitemize davet etmek ve topluluk hizmetlerini tanıtmak için bağlantıyı paylaşın.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Site Link Copy Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    <span>
                      {shareTargetLink 
                        ? (language === 'ar' ? 'رابط الوصول للقسم في موقعنا:' : 'Bu Bölümün Sitemizdeki Bağlantısı:')
                        : (language === 'ar' ? 'رابط صفحة الروابط بموقعنا:' : 'Sitemizdeki Bağlantılar Sayfası:')}
                    </span>
                  </label>
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    {language === 'ar' ? 'يوجه لموقعنا' : 'Sitemize Yönlendirir'}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    readOnly
                    value={currentShareUrl}
                    className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-mono focus:outline-none select-all"
                  />
                  <button
                    id="copy-direct-links-url-btn"
                    onClick={() => handleCopyUrl(currentShareUrl)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs ${
                      copied
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-burgundy-700 dark:hover:bg-burgundy-800 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t('linkCopied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t('copyLink')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Channels Share Grid */}
              <div className="space-y-2.5">
                <span className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'ar' ? 'نشر رابط الموقع في مجموعات الطلاب:' : 'Öğrenci Gruplarında Paylaş:'}
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition group"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                      {t('shareViaWhatsApp')}
                    </span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition group"
                  >
                    <Send className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition" />
                    <span className="text-xs font-bold text-sky-800 dark:text-sky-300 mt-1">
                      {t('shareViaTelegram')}
                    </span>
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750 transition group"
                  >
                    <Globe2 className="w-5 h-5 text-slate-800 dark:text-slate-200 group-hover:scale-110 transition" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {t('shareViaTwitter')}
                    </span>
                  </a>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2.5 text-xs text-red-950 dark:text-red-200">
                <CheckCircle2 className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <span className="text-[11px] leading-relaxed">
                  {language === 'ar' 
                    ? 'الروابط المشتركة تقود الطلاب دائماً للدخول إلى موقع تجمع الطلاب الفلسطينيين والتعرف على كافة الخدمات.' 
                    : 'Paylaşılan bağlantılar öğrencileri doğrudan web sitemize yönlendirir.'}
                </span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
