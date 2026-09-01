import React, { useState } from 'react';
import { Languages, Check, Search, Sparkles, X, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSelectionModal() {
  const { selectedLanguage, supportedLanguages, isModalOpen, closeLanguageModal, selectLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedLanguage);

  if (!isModalOpen) return null;

  const filteredLanguages = supportedLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.native.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    if (tempSelected) {
      selectLanguage(tempSelected);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-brand-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-brand-950/40 dark:to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Languages className="w-5 h-5 text-brand-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Select Your Preferred Language</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-700 dark:text-cyan-400 border border-brand-500/30">
                  AI Multilingual Core
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The AI assistant and document Q&A will communicate strictly in your selected language.
              </p>
            </div>
          </div>
          <button
            onClick={closeLanguageModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by language (e.g. Telugu, Hindi, Tamil, English)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLanguage?.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  selectLanguage(lang);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative flex items-start justify-between group hover:scale-[1.01] active:scale-[0.99] ${
                  isSelected
                    ? 'bg-cyan-500/15 dark:bg-brand-600/20 border-brand-500 shadow-md shadow-brand-500/15 ring-1 ring-brand-500/50'
                    : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-brand-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{lang.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-700 dark:text-brand-400 border border-brand-500/30">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-base font-semibold text-brand-600 dark:text-cyan-400 tracking-wide font-sans">
                    {lang.native}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {lang.region}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                      : 'border border-slate-300 dark:border-slate-700 text-transparent group-hover:border-slate-500'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Currently Active: <strong className="text-brand-600 dark:text-cyan-400 text-sm font-bold ml-1">{selectedLanguage?.flag} {selectedLanguage?.native} ({selectedLanguage?.name})</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={closeLanguageModal}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Done</span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
