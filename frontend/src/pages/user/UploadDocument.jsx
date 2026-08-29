import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  FileCheck,
  Sparkles,
  Sliders,
  Tag,
  AlertCircle,
  Zap,
  CheckCircle2,
  X,
  Cpu
} from 'lucide-react';
import { docService } from '../../services/docService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';

export default function UploadDocument() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { selectedLanguage } = useLanguage();

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [summaryType, setSummaryType] = useState('abstractive');
  const [lengthType, setLengthType] = useState('medium');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setError('');
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt', 'md'].includes(ext)) {
      setError(`Unsupported file extension .${ext}. Please select a PDF, DOCX, or TXT document.`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds 25MB maximum size limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadAndProcess = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or drop a document to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Upload & Ingest Document
      const uploadRes = await docService.uploadDocument(selectedFile, tags);
      const docId = uploadRes.document.id;

      // 2. Trigger Summarization with custom options & active language
      const keywordList = focusKeywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      await aiService.summarizeDocument(
        docId,
        summaryType,
        lengthType,
        keywordList,
        selectedLanguage?.code || 'en'
      );

      // 3. Navigate to visual summary
      navigate(`/summary?docId=${docId}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during document processing.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Upload & Analyze Document</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ingest multi-page PDFs, contracts, and transcripts for 100% local summarization and grounded RAG Q&A.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 min-w-[20px] text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUploadAndProcess} className="space-y-8">
        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`glass-panel rounded-3xl p-8 sm:p-12 border-2 border-dashed cursor-pointer text-center transition-all ${
            dragOver
              ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
              : selectedFile
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-slate-700 hover:border-brand-500/50 hover:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx,.doc,.txt,.md"
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Local Extraction
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove & Choose Another</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/10">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Drag & drop your document here, or browse files</p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports Adobe PDF (.pdf), Microsoft Word (.docx), Plain Text (.txt), Markdown (.md)
                </p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                Maximum File Size: 25MB
              </span>
            </div>
          )}
        </div>

        {/* Processing Configuration Options */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white">AI Summarization Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summarization Engine */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Summarization Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSummaryType('abstractive')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    summaryType === 'abstractive'
                      ? 'bg-brand-600/20 border-brand-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-white">Abstractive AI</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Conceptual distillation & executive narrative</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSummaryType('extractive')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    summaryType === 'extractive'
                      ? 'bg-brand-600/20 border-brand-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-white">Extractive TextRank</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Verbatim high-scoring sentence extraction</p>
                </button>
              </div>
            </div>

            {/* Target Length */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Summary Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'short', name: 'Short', desc: '2-3 key takeaways' },
                  { id: 'medium', name: 'Medium', desc: 'Standard executive brief' },
                  { id: 'detailed', name: 'Detailed', desc: 'In-depth multi-section' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLengthType(l.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      lengthType === l.id
                        ? 'bg-brand-600/20 border-brand-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{l.name}</p>
                    <p className="text-[9px] text-slate-400">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Focus Keywords (Optional Booster)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="e.g. liability, termination, revenue, dosage"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-[10px] text-slate-500">Comma-separated terms to prioritize during sentence ranking</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Document Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Legal, Q2-Report, Healthcare"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-[10px] text-slate-500">Labels to organize your document library</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className={`w-full py-4 rounded-2xl text-base font-bold text-white transition-all flex items-center justify-center gap-2 shadow-xl ${
            !selectedFile
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-brand-600/30'
          }`}
        >
          {loading ? (
            <>
              <Zap className="w-5 h-5 animate-spin" />
              <span>Executing Local AI Pipeline...</span>
            </>
          ) : (
            <>
              <Cpu className="w-5 h-5" />
              <span>Ingest & Generate AI Intelligence</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
