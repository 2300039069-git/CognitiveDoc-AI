import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(null);

export const darkColors = {
  background: '#020617', // slate-950
  card: '#0f172a',       // slate-900
  cardBorder: '#1e293b', // slate-800
  text: '#f8fafc',       // slate-50
  textMuted: '#94a3b8',  // slate-400
  primary: '#0284c7',    // brand-600 (cyan-600)
  primaryLight: '#38bdf8',
  accent: '#6366f1',     // indigo-500
  success: '#10b981',    // emerald-500
  danger: '#f43f5e',     // rose-500
  warning: '#f59e0b',    // amber-500
  inputBg: '#090d16',
  inputBorder: '#334155'
};

export const lightColors = {
  background: '#f8fafc', // slate-50
  card: '#ffffff',
  cardBorder: '#e2e8f0', // slate-200
  text: '#0f172a',       // slate-900
  textMuted: '#64748b',  // slate-500
  primary: '#0284c7',
  primaryLight: '#0369a1',
  accent: '#4f46e5',
  success: '#059669',
  danger: '#e11d48',
  warning: '#d97706',
  inputBg: '#ffffff',
  inputBorder: '#cbd5e1'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem('mobile_theme').then((saved) => {
      if (saved) setTheme(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    AsyncStorage.setItem('mobile_theme', next);
  };

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
