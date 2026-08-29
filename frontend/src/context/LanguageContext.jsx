import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'Global', flag: '🌐' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India (National)', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Andhra Pradesh & Telangana', flag: '🇮🇳' },
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

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isModalOpen,
        openLanguageModal,
        closeLanguageModal,
        selectLanguage
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
