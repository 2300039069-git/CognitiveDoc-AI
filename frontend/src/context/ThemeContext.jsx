import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'colorful') {
      root.classList.add('colorful');
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.classList.remove('colorful');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.classList.remove('colorful');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'colorful';
      return 'light';
    });
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'colorful') {
      setThemeState(newTheme);
    }
  };

  const isDark = theme === 'dark' || theme === 'colorful';
  const isColorful = theme === 'colorful';

  return (
    <ThemeContext.Provider value={{ theme, isDark, isColorful, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
