import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Lock, LayoutDashboard, LogOut, Award, Menu, X, Bell, BookOpen, Home, Newspaper, Link, Compass, Calendar, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import logoImg from '../assets/images/logo.jpeg';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  logo: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isAdminLoggedIn,
  onLogout,
  onOpenLogin,
  logo
}) => {
  const { language, setLanguage, t, dir } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'tr' : 'ar');
  };

  const menuItems = [
    { id: 'home', label: t('home'), icon: <Home className="w-4 h-4" /> },
    { id: 'news', label: t('news'), icon: <Newspaper className="w-4 h-4" /> },
    { id: 'links', label: t('links'), icon: <Link className="w-4 h-4" /> },
    { id: 'courses', label: t('courses'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'deptAnnouncements', label: t('deptAnnouncements'), icon: <Bell className="w-4 h-4" /> },
    { id: 'activities', label: t('activities'), icon: <Calendar className="w-4 h-4" /> },
    { id: 'pastActivities', label: t('pastActivities'), icon: <Award className="w-4 h-4" /> },
    { id: 'university', label: t('university'), icon: <Compass className="w-4 h-4" /> },
    { id: 'residency', label: t('residency'), icon: <Fingerprint className="w-4 h-4" /> },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsDrawerOpen(false);
  };

  // Prevent background scroll when side drawer is active
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <nav id="app-navbar" className="bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all shadow-sm">
      
      {/* Premium Elegant Burgundy Accent Line */}
      <div className="h-1.5 bg-burgundy-700 w-full" />

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Menu Button + Logo Area */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Slide-out Trigger Button */}
            <button
              id="sidebar-menu-trigger"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-burgundy-700 transition cursor-pointer shrink-0 shadow-sm font-extrabold text-xs"
              title={language === 'ar' ? 'افتح القائمة الجانبية' : 'Menüyü Aç'}
            >
              <Menu className="w-4 h-4 text-burgundy-700 animate-pulse" />
              <span>{language === 'ar' ? 'القائمة' : 'Menü'}</span>
            </button>

            {/* Logo / Title Area */}
            <button
              id="navbar-logo-btn"
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-2.5 text-start focus:outline-none group min-w-0"
            >
              {/* Emblem Logo */}
              <div className="relative w-11 h-11 rounded-xl bg-white flex flex-col items-center justify-center overflow-hidden border border-burgundy-700 shrink-0 shadow-md group-hover:border-burgundy-600 transition-colors duration-300">
                <img
                  src={logo}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col min-w-0 hidden xs:flex">
                <div className="flex items-center gap-1">
                  <h1 className="text-[11px] sm:text-[14px] font-extrabold text-burgundy-700 tracking-tight leading-none uppercase font-sans group-hover:text-burgundy-800 transition truncate">
                    {t('portalTitle')}
                  </h1>
                  <Award className="w-3 h-3 text-amber-500 shrink-0 hidden sm:inline" />
                </div>
                <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold mt-0.5 truncate">
                  {t('universitySubTitle')}
                </p>
              </div>
            </button>
          </div>

          {/* Action Buttons: Lang & Admin Portal */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Language Switcher */}
            <button
              id="desktop-lang-switcher"
              onClick={toggleLanguage}
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold transition duration-150 shadow-sm group cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-burgundy-700 group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline">{t('languageLabel')}</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-200">
                {t('languageCode')}
              </span>
            </button>

            {/* Admin Controls */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-tab-admin-dash"
                  onClick={() => handleTabClick('admin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
                    currentTab === 'admin'
                      ? 'bg-burgundy-700 text-white'
                      : 'bg-burgundy-600 text-white hover:bg-burgundy-700'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t('admin')}</span>
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 rounded-xl border border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50 transition cursor-pointer"
                  title={t('logoutBtn')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">{t('admin')}</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* PERSISTENT ACCENT INDICATOR (To let users see active tab at a glance) */}
      <div className="h-1.5 bg-slate-50 border-t border-b border-slate-100/70 hidden sm:flex items-center justify-center text-[10px] text-slate-400 font-extrabold gap-2 py-3 select-none">
        <span className="text-burgundy-700">✦</span>
        <span>
          {language === 'ar' ? 'الصفحة النشطة حالياً:' : 'Mevcut Aktif Sayfa:'}
        </span>
        <span className="bg-burgundy-50 text-burgundy-700 border border-burgundy-100/50 px-2 py-0.5 rounded font-extrabold">
          {menuItems.find(m => m.id === currentTab)?.label || (currentTab === 'admin' ? t('admin') : t('home'))}
        </span>
        <span className="text-burgundy-700">✦</span>
      </div>

      {/* SLIDING SIDE DRAWER & BACKDROP */}
      {createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                id="sidebar-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[9999] transition-opacity"
              />

              {/* Sliding Sidebar Drawer */}
              <motion.div
                id="sidebar-drawer"
                dir={dir}
                initial={{ x: dir === 'rtl' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: dir === 'rtl' ? '100%' : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`fixed top-0 bottom-0 ${
                  dir === 'rtl' ? 'right-0' : 'left-0'
                } w-[280px] sm:w-[320px] bg-white shadow-2xl z-[9999] flex flex-col justify-between border-l border-r border-slate-150 overflow-hidden`}
              >
                {/* Top Section with Branding & Close Button */}
                <div className="p-5 border-b border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {/* Emblem Icon */}
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-burgundy-700 shadow-sm">
                        <img
                          src={logo}
                          alt="Logo"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-extrabold text-burgundy-700 leading-none">
                        {t('portalTitle')}
                      </span>
                    </div>
                    <button
                      id="sidebar-close-btn"
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Palestine Flag Ribbon background decoration */}
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-white to-red-600 w-full overflow-hidden flex">
                    <div className="h-full w-1/3 bg-black" />
                    <div className="h-full w-1/3 bg-emerald-600" />
                    <div className="h-full w-1/3 bg-red-600" />
                  </div>
                </div>

                {/* Navigation Menu Links */}
                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2 select-none">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-2">
                    {language === 'ar' ? 'أقسام الموقع الرئيسية' : 'Portal Ana Menüsü'}
                  </span>
                  
                  {menuItems.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`sidebar-link-${item.id}`}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-extrabold transition-all relative group ${
                          isActive
                            ? 'bg-burgundy-700 text-white shadow-sm'
                            : 'text-slate-700 hover:bg-burgundy-50 hover:text-burgundy-700 border border-transparent'
                        }`}
                      >
                        <span className={`${isActive ? 'text-white' : 'text-burgundy-700 group-hover:scale-110 transition duration-200'}`}>
                          {item.icon}
                        </span>
                        <span className="flex-1 text-start">{item.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                        )}
                      </button>
                    );
                  })}

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-4 pt-4" />

                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-2">
                    {language === 'ar' ? 'خيارات إضافية' : 'Diğer Seçenekler'}
                  </span>

                  {/* Repeat Controls inside Drawer for UX */}
                  <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition border border-transparent"
                  >
                    <Globe className="w-4 h-4 text-burgundy-700" />
                    <span className="flex-1 text-start">{language === 'ar' ? 'تغيير اللغة (Türkçe)' : 'Dili Değiştir (العربية)'}</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-200">
                      {language === 'ar' ? 'TR' : 'AR'}
                    </span>
                  </button>

                  {isAdminLoggedIn ? (
                    <>
                      <button
                        onClick={() => handleTabClick('admin')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-extrabold transition ${
                          currentTab === 'admin'
                            ? 'bg-burgundy-700 text-white'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-burgundy-700'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-burgundy-700" />
                        <span className="flex-1 text-start">{t('admin')}</span>
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsDrawerOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-extrabold text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="flex-1 text-start">{t('logoutBtn')}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onOpenLogin();
                        setIsDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span className="flex-1 text-start">{language === 'ar' ? 'تسجيل دخول المشرف' : 'Yönetici Girişi'}</span>
                    </button>
                  )}
                </div>

                {/* Bottom Footer or Identity */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center select-none">
                  <span className="text-[10px] font-extrabold text-burgundy-700 block tracking-tight">
                    {language === 'ar' ? 'عاشت فلسطين حرة أبية 🇵🇸' : 'Yaşasın Özgür Filistin 🇵🇸'}
                  </span>
                  <span className="text-[8px] text-slate-400 block mt-0.5 font-bold">
                    İSTE Filistin Öğrenci Birliği
                  </span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </nav>
  );
};
