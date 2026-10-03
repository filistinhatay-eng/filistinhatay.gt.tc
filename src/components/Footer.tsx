import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Sparkles, Linkedin, ExternalLink, ShieldCheck } from 'lucide-react';
import { UniversityInfo } from '../types';

interface FooterProps {
  logo: string;
  univInfo?: UniversityInfo;
}

export const Footer: React.FC<FooterProps> = ({ logo, univInfo }) => {
  const { t, language, getText } = useLanguage();

  const developerLinkedInUrl = "https://www.linkedin.com/in/abdulrahman-abudaqqa-b90581323";

  return (
    <footer id="app-footer" className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-2 border-burgundy-700/50 mt-auto select-none relative overflow-hidden">
      
      {/* Background Subtle Stars Ornament */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="footerGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 30 60 M 0 30 L 60 30" fill="none" stroke="#f59e0b" strokeWidth="0.5"/>
            <polygon points="30,25 35,30 30,35 25,30" fill="#f59e0b" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#footerGrid)" />
        </svg>
      </div>

      {/* Decorative Golden/Burgundy Premium Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-burgundy-700 to-amber-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          
          {/* Column 1: Info and Slogan */}
          <div className="space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-xl bg-white flex flex-col items-center justify-center overflow-hidden border border-burgundy-700 shrink-0">
                <img
                  src={logo}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase block">
                  {t('portalTitle')}
                </span>
                <span className="text-[10px] text-amber-500 font-bold block mt-0.5">✦ {language === 'ar' ? 'تجمع الطلاب الفلسطينيين في هاتاي' : 'Hatay Filistin Öğrenci Topluluğu'} ✦</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm text-justify">
              {t('footerDesc')}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-burgundy-400 hover:text-burgundy-300 font-extrabold text-[11px] tracking-wide rounded-xl border border-slate-800 transition shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('palesIdentity')}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Useful Contacts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-amber-500">✦</span>
              <span>{t('contactTitle')}</span>
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block font-bold text-slate-300">{t('contactAddress')}</span>
                  <span className="text-slate-400">
                    {univInfo ? getText(univInfo.address) : t('contactAddress')}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block font-bold text-slate-300">{t('contactPhone')}</span>
                  <span className="text-slate-400 font-mono" dir="ltr">
                    {univInfo ? univInfo.contactPhone : "+90 (326) 613 56 00"}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block font-bold text-slate-300">{t('contactEmail')}</span>
                  <span className="text-slate-400 break-all">
                    {univInfo ? univInfo.contactEmail : "filistin.hatay@gmail.com"}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: University Info Brief */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-amber-500">✦</span>
              <span>{t('university')}</span>
            </h3>
            <div className="text-xs text-slate-400 leading-relaxed space-y-2">
              <p>
                <strong className="text-white">İskenderun Teknik Üniversitesi (İSTE)</strong>
              </p>
              <p className="text-slate-400">
                A state university built with a strong focus on technology, innovation, and maritime fields. Located in Hatay, İskenderun.
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Established: 2015 | Campus: Merkez (Central)
              </p>
            </div>
          </div>

        </div>

        {/* Traditional Line Divider */}
        <div className="star-divider !my-8 opacity-30" />

        {/* Full Copyright & Rights Attribution Section */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-amber-500/20 shadow-inner flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Rights Attribution for Abdulrahman Abudaqqa */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 text-center sm:text-start">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-200 font-extrabold tracking-tight">
                {t('websiteRights')}
              </span>
            </div>
            <a
              id="developer-profile-link"
              href={developerLinkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 font-extrabold text-xs sm:text-sm rounded-xl border border-amber-500/30 hover:border-amber-400/70 transition duration-200 shadow-md group"
              title="Abdulrahman Abudaqqa - LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Abdulrahman Abudaqqa</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
            </a>
          </div>

          {/* Direct LinkedIn Button */}
          <div className="flex items-center justify-center">
            <a
              id="footer-linkedin-btn"
              href={developerLinkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-950/70 hover:bg-blue-900 text-blue-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-blue-800/80 hover:border-blue-500 transition duration-200 shadow-md group cursor-pointer"
            >
              <Linkedin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>{t('linkedinProfile')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-white transition" />
            </a>
          </div>
        </div>

        {/* Bottom Rights Notice */}
        <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            {t('rightsReserved')}
          </p>
          
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 select-none">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mr-1.5">
              {language === 'ar' ? 'البوابة الرسمية 2026' : 'Resmi Portal 2026'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          </div>
        </div>

      </div>
    </footer>
  );
};
