import React from 'react';
import { Sun, Moon, Palette, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all duration-300 group shadow-sm ${
        theme === 'colorful'
          ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border-fuchsia-400/50 text-fuchsia-300 hover:border-fuchsia-400 shadow-fuchsia-500/20 ring-1 ring-fuchsia-500/30'
          : theme === 'dark'
          ? 'bg-slate-900/90 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-slate-700'
          : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 hover:border-slate-300'
      } ${className}`}
      title={`Current: ${theme.toUpperCase()} Theme (Click to switch)`}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'colorful' ? (
          <Palette className="w-4 h-4 text-fuchsia-400 animate-pulse transform transition-transform duration-300 group-hover:scale-110" />
        ) : theme === 'dark' ? (
          <Moon className="w-4 h-4 text-amber-400 transform transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transform transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>

      <span className="text-xs font-bold font-mono capitalize select-none">
        {theme === 'colorful' ? (
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
            Colorful
          </span>
        ) : theme === 'dark' ? (
          <span className="text-slate-200">Dark</span>
        ) : (
          <span className="text-slate-800">Light</span>
        )}
      </span>
    </button>
  );
}
