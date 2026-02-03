
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { Sprout, Globe } from 'lucide-react';
import { Language } from '../types';
import { languages, translations } from '../translations';

interface AuthScreenProps {
  onLogin: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, currentLang, onLangChange }) => {
  const [phone, setPhone] = useState('');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const t = translations[currentLang];

  return (
    <div className="h-full flex flex-col px-8 pt-12 pb-12 bg-white relative">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setShowLangPicker(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-700"
        >
          <Globe size={14} />
          {languages.find(l => l.code === currentLang)?.native}
        </button>
      </div>

      <div className="flex flex-col items-center mb-12">
        <div className="p-4 rounded-3xl bg-green-50 mb-6 shadow-sm border border-green-100">
          <Sprout size={64} color={COLORS.primary} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t.welcome}</h1>
        <p className="text-gray-500 mt-2 text-center text-sm">{t.slogan}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.mobile_number}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="00000 00000"
              className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-lg font-bold tracking-wider text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <button
          onClick={onLogin}
          disabled={phone.length < 10}
          className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          style={{ backgroundColor: COLORS.primary }}
        >
          {t.get_started}
        </button>

        <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">
          By continuing, you agree to Krishi-Drishti's Terms of Service and Privacy Policy.
        </p>
      </div>

      {showLangPicker && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">{t.select_language}</h3>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLangChange(lang.code as Language);
                    setShowLangPicker(false);
                  }}
                  className={`py-3 px-4 rounded-2xl text-sm font-bold border transition-all ${
                    currentLang === lang.code 
                    ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100' 
                    : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-green-200'
                  }`}
                >
                  <p className="text-xs opacity-70 mb-0.5 font-medium">{lang.label}</p>
                  <p className="text-base">{lang.native}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;
