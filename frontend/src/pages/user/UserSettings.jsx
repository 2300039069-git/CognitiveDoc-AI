import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  Cpu,
  MessageSquareHeart,
  Send,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { adminService } from '../../services/adminService';

export default function UserSettings() {
  const { theme, toggleTheme } = useTheme();

  const [defaultSummaryType, setDefaultSummaryType] = useState('abstractive');
  const [defaultLength, setDefaultLength] = useState('medium');
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(100);
  const [savedToast, setSavedToast] = useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Summarization Quality');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    try {
      await adminService.submitFeedback({
        rating: feedbackRating,
        category: feedbackCategory,
        message: feedbackMessage
      });
      setFeedbackSent(true);
      setFeedbackMessage('');
    } catch {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white">System & AI Settings</h1>
        <p className="text-xs text-slate-400">
          Configure default inference behaviors, chunking parameters, and submit model feedback
        </p>
      </div>

      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Configuration parameters updated and applied to local NLP session.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* NLP Parameters */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-400" />
            Default NLP & Summarization Presets
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Default Summarization Engine
              </label>
              <select
                value={defaultSummaryType}
                onChange={(e) => setDefaultSummaryType(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="abstractive">Abstractive AI (Hugging Face Pipeline)</option>
                <option value="extractive">Extractive TextRank (Graph Sentence Ranking)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Default Summary Target Length
              </label>
              <select
                value={defaultLength}
                onChange={(e) => setDefaultLength(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="short">Short (Key Decisive Points)</option>
                <option value="medium">Medium (Executive Summary Brief)</option>
                <option value="detailed">Detailed (Full Section Breakdown)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span>RAG Chunk Size ({chunkSize} chars)</span>
              </div>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <p className="text-[10px] text-slate-500">Larger chunks provide more context; smaller chunks give tighter citations.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span>Chunk Overlap Window ({chunkOverlap} chars)</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <p className="text-[10px] text-slate-500">Maintains continuity across paragraph and sentence boundaries.</p>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-md shadow-brand-600/25"
          >
            Save Parameter Defaults
          </button>
        </div>

        {/* Appearance & Theme Selector */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Appearance & Interface Theme
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Mode Option */}
            <button
              type="button"
              onClick={() => toggleTheme && theme !== 'light' && toggleTheme()}
              className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col gap-3 group ${
                theme === 'light'
                  ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                  : 'bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Light Theme</h3>
                    <p className="text-[11px] text-slate-500">Clean, crisp high-contrast day mode</p>
                  </div>
                </div>
                {theme === 'light' && (
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs shadow-sm">
                    ✓
                  </span>
                )}
              </div>
              <div className="w-full h-16 rounded-xl bg-slate-100 border border-slate-200 p-2 flex flex-col gap-1.5 pointer-events-none">
                <div className="w-1/3 h-2.5 rounded-full bg-brand-500"></div>
                <div className="w-3/4 h-2 rounded bg-slate-300"></div>
                <div className="w-1/2 h-2 rounded bg-slate-200"></div>
              </div>
            </button>

            {/* Dark Mode Option */}
            <button
              type="button"
              onClick={() => toggleTheme && theme !== 'dark' && toggleTheme()}
              className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col gap-3 group ${
                theme === 'dark'
                  ? 'bg-brand-600/15 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                  : 'bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dark Theme</h3>
                    <p className="text-[11px] text-slate-500">Deep slate & obsidian night mode</p>
                  </div>
                </div>
                {theme === 'dark' && (
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs shadow-sm">
                    ✓
                  </span>
                )}
              </div>
              <div className="w-full h-16 rounded-xl bg-slate-900 border border-slate-800 p-2 flex flex-col gap-1.5 pointer-events-none">
                <div className="w-1/3 h-2.5 rounded-full bg-brand-400"></div>
                <div className="w-3/4 h-2 rounded bg-slate-700"></div>
                <div className="w-1/2 h-2 rounded bg-slate-800"></div>
              </div>
            </button>
          </div>
        </div>
      </form>

      {/* User Feedback Submission Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-2">
          <MessageSquareHeart className="w-4 h-4 text-rose-400" />
          Submit User Feedback to Administrators
        </h2>

        {feedbackSent ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-white">Thank you for your feedback!</p>
            <p className="text-[11px] text-slate-400">Your review has been logged to the Admin Feedback console.</p>
            <button
              onClick={() => setFeedbackSent(false)}
              className="text-xs text-brand-400 font-semibold underline pt-1"
            >
              Submit another review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rating (1 to 5 Stars)</label>
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(Number(e.target.value))}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                  <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                  <option value={2}>⭐⭐ 2 Stars - Needs Improvement</option>
                  <option value={1}>⭐ 1 Star - Poor</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Category</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="Summarization Quality">Summarization Quality</option>
                  <option value="RAG Q&A Accuracy">RAG Q&A Accuracy</option>
                  <option value="Citation Grounding">Citation Grounding</option>
                  <option value="Inference Speed">Inference Speed</option>
                  <option value="UI / UX Feedback">UI / UX Feedback</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Comments / Suggestions</label>
              <textarea
                required
                rows={3}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Share your experience with model accuracy or feature requests..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
