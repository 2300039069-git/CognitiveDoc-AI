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
  Cpu,
  Shield,
  Layers,
  ArrowRight,
  Database
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Format Optical & Text Ingestion Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ingest & Process Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Ingest multi-page PDFs, legal contracts, and whitepapers for 100% local summarization and grounded RAG Q&A.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 min-w-[20px] text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUploadAndProcess} className="space-y-8">
        {/* Hologram Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`glass-panel rounded-3xl p-8 sm:p-12 border-2 border-dashed cursor-pointer text-center transition-all ${
            dragOver
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01] shadow-2xl shadow-cyan-500/20'
              : selectedFile
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-white/15 hover:border-cyan-500/50 hover:bg-slate-900/60'
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
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <FileCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Local Neural Pipeline
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove & Choose Another</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Drag & drop your document here, or browse files</p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports Adobe PDF (.pdf), Microsoft Word (.docx), Plain Text (.txt), Markdown (.md)
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/[0.05] border border-white/10 text-cyan-300">
                  Max Size: 25MB
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/[0.05] border border-white/10 text-emerald-300">
                  Zero Cloud Egress
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Processing Configuration Options */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">AI Summarization Configuration</h2>
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
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    summaryType === 'abstractive'
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-white">Abstractive T5</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Conceptual distillation & narrative synthesis</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSummaryType('extractive')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    summaryType === 'extractive'
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-white">Extractive TextRank</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">High-scoring verbatim sentence extraction</p>
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
                  { id: 'short', name: 'Short', desc: '2-3 key points' },
                  { id: 'medium', name: 'Medium', desc: 'Executive brief' },
                  { id: 'detailed', name: 'Detailed', desc: 'Full section breakdown' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLengthType(l.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      lengthType === l.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-slate-200'
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
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Focus Keywords (Optional Prioritization Booster)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="e.g. liability, termination, revenue, dosage"
                className="w-full bg-slate-950/90 border border-white/10 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
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
                className="w-full bg-slate-950/90 border border-white/10 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">Labels to organize your document library</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className={`btn-shimmer w-full py-4 rounded-2xl text-sm sm:text-base font-bold text-white transition-all flex items-center justify-center gap-2.5 shadow-xl ${
            !selectedFile
              ? 'bg-slate-900 border border-white/10 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-brand-600 to-indigo-600 hover:from-cyan-400 hover:to-brand-500 shadow-cyan-500/25 hover:scale-[1.01] active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <Zap className="w-5 h-5 animate-spin" />
              <span>Executing Local Neural Pipeline...</span>
            </>
          ) : (
            <>
              <Cpu className="w-5 h-5" />
              <span>Ingest Document & Launch AI Extraction</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
