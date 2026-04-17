import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('app_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('app_lang', language);
    // Handle RTL
    const direction = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key, params) => {
    let text = translations[language][key] || key;
    
    // Support functional translations (like rakats)
    if (typeof text === 'function' && params) {
      if (Array.isArray(params)) return text(...params);
      return text(params);
    }
    
    return text;
  };

  const isRTL = language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
