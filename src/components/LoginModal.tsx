import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Lock, User, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple Admin or Assistant Credentials
    setTimeout(() => {
      const inputUser = username.trim();
      let isValid = false;
      let loggedInUser = 'filistin.hatay@gmail.com';

      if (inputUser.toLowerCase() === 'filistin.hatay@gmail.com' && password === '31hatay31') {
        isValid = true;
      } else {
        const storedAssistantsRaw = localStorage.getItem('pales_union_assistant_accounts');
        if (storedAssistantsRaw) {
          try {
            const assistants = JSON.parse(storedAssistantsRaw);
            const matched = assistants.find((acc: any) => acc.username.toLowerCase() === inputUser.toLowerCase() && acc.password === password);
            if (matched) {
              isValid = true;
              loggedInUser = matched.username;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      if (isValid) {
        localStorage.setItem('pales_union_admin_username', loggedInUser);
        onLoginSuccess();
        onClose();
      } else {
        setError(t('invalidCredentials'));
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="login-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            id="login-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden"
          >
            {/* Visual Red-Green Accent Line */}
            <div className="h-1 bg-burgundy-700 w-full"></div>

            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 select-none">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-burgundy-700" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                  {t('adminLoginHeader')}
                </h3>
              </div>
              <button
                id="close-login-btn"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              {error && (
                <div className="p-2.5 bg-burgundy-50 border border-burgundy-200 text-burgundy-700 rounded font-bold">
                  {error}
                </div>
              )}

              {/* Username */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">{t('username')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="login-username-input"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=""
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">{t('password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-600"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2 select-none">
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-burgundy-700 hover:bg-burgundy-800 text-white font-extrabold rounded-lg shadow transition"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{t('loginBtn')}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
