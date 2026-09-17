import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslation, TRANSLATIONS } from '../utils/translations';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'Global', flag: '🌐' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Andhra Pradesh & Telangana', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India (National)', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu & Puducherry', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala & Lakshadweep', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'Maharashtra & Goa', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'West Bengal & Tripura', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', region: 'Odisha', flag: '🇮🇳' }
];

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const saved = localStorage.getItem('preferred_language');
    if (saved) {
      const found = SUPPORTED_LANGUAGES.find(l => l.code === saved);
      if (found) return found;
    }
    return SUPPORTED_LANGUAGES[0]; // Default English
  });

  const [hasPrompted, setHasPrompted] = useState(() => {
    return localStorage.getItem('has_selected_language') === 'true';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Synchronize document language tag
  useEffect(() => {
    if (selectedLanguage?.code) {
      document.documentElement.lang = selectedLanguage.code;
    }
  }, [selectedLanguage]);

  // Automatically prompt language selection modal on first login / session
  useEffect(() => {
    const prompted = localStorage.getItem('has_selected_language');
    if (!prompted) {
      setIsModalOpen(true);
    }
  }, []);

  const selectLanguage = (langObj) => {
    setSelectedLanguage(langObj);
    localStorage.setItem('preferred_language', langObj.code);
    localStorage.setItem('has_selected_language', 'true');
    setHasPrompted(true);
    setIsModalOpen(false);
  };

  const openLanguageModal = () => setIsModalOpen(true);
  const closeLanguageModal = () => setIsModalOpen(false);

  // Translation helper
  const t = useCallback((key, fallback = '') => {
    return getTranslation(selectedLanguage?.code || 'en', key, fallback);
  }, [selectedLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        currentLang: selectedLanguage?.code || 'en',
        supportedLanguages: SUPPORTED_LANGUAGES,
        isModalOpen,
        openLanguageModal,
        closeLanguageModal,
        selectLanguage,
        t,
        translations: TRANSLATIONS
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
