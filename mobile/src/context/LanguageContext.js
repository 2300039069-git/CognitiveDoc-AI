import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', region: 'Global / Standard' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', region: 'Andhra Pradesh & Telangana' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', region: 'India (National Official)' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', region: 'Tamil Nadu & Puducherry' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', region: 'Kerala' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', region: 'Maharashtra' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', region: 'West Bengal' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', region: 'Gujarat' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', region: 'Spain & Latin America' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', region: 'France & Global' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', region: 'Germany & Europe' }
];

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('mobile_lang').then((savedCode) => {
      if (savedCode) {
        const found = SUPPORTED_LANGUAGES.find(l => l.code === savedCode);
        if (found) setSelectedLanguage(found);
      }
    });
  }, []);

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setIsModalOpen(false);
    AsyncStorage.setItem('mobile_lang', lang.code);
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isModalOpen,
        openLanguageModal: () => setIsModalOpen(true),
        closeLanguageModal: () => setIsModalOpen(false),
        selectLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
