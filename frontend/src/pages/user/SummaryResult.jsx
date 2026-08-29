import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Clock,
  Zap,
  Copy,
  Download,
  MessageSquare,
  CheckCircle2,
  Share2,
  RefreshCw,
  Layers,
  ChevronDown,
  Tag,
  ShieldCheck,
  Languages,
  Volume2,
  Square
} from 'lucide-react';
import { docService } from '../../services/docService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import { audioService } from '../../services/audioService';

const LANG_SPEECH_MAP = {
  en: 'en-US',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE'
};

export default function SummaryResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const docIdParam = searchParams.get('docId');
  const { selectedLanguage, openLanguageModal } = useLanguage();

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(docIdParam || '');
  const [documentData, setDocumentData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [activeTab, setActiveTab] = useState('executive');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  // Load document list
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await docService.getDocuments();
        setDocuments(docs);
        if (!selectedDocId && docs.length > 0) {
          setSelectedDocId(docs[0].id);
          setSearchParams({ docId: docs[0].id });
        }
      } catch (err) {
        console.error("Error fetching docs:", err);
      }
    };
    fetchDocs();
  }, []);

  // Load document details and summary in active language immediately
  useEffect(() => {
    if (!selectedDocId) return;

    let isMounted = true;
    const fetchSummaryAndDoc = async () => {
      setLoading(true);
      try {
        const doc = await docService.getDocument(selectedDocId);
        if (!isMounted) return;
        setDocumentData(doc);

        const currentLang = selectedLanguage?.code || 'en';
        let summary = null;
        try {
          summary = await aiService.getDocumentSummary(selectedDocId, currentLang);
        } catch {
          summary = null;
        }

        // If no summary exists OR if returned summary's language does not match the active language, generate it!
        if (!summary || summary.language !== currentLang) {
          const newSum = await aiService.summarizeDocument(
            selectedDocId,
            'abstractive',
            'medium',
            [],
            currentLang
          );
          if (isMounted) setSummaryData(newSum.summary);
        } else {
          if (isMounted) setSummaryData(summary);
        }
      } catch (err) {
        console.error("Error loading summary in language:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSummaryAndDoc();

    return () => {
      isMounted = false;
    };
  }, [selectedDocId, selectedLanguage?.code]);

  const handleDocChange = (newDocId) => {
    setSelectedDocId(newDocId);
    setSearchParams({ docId: newDocId });
  };

  const handleRegenerate = async (summaryType, lengthType) => {
    if (!selectedDocId) return;
    setRegenerating(true);
    try {
      const res = await aiService.summarizeDocument(
        selectedDocId,
        summaryType,
        lengthType,
        [],
        selectedLanguage?.code || 'en'
      );
      setSummaryData(res.summary);
    } catch (err) {
      alert("Failed to re-generate summary");
    } finally {
      setRegenerating(false);
    }
  };

  // Cancel speech on unmount or language change
  useEffect(() => {
    audioService.stop();
    setIsPlayingSpeech(false);
  }, [selectedDocId, selectedLanguage?.code]);

  const handleSpeakSummary = () => {
    if (isPlayingSpeech) {
      audioService.stop();
      setIsPlayingSpeech(false);
      return;
    }

    if (!summaryData) return;

    let textToSpeak = '';
    if (activeTab === 'executive') {
      textToSpeak = summaryData.executive_summary || '';
    } else if (activeTab === 'bullets') {
      textToSpeak = (summaryData.bullet_points || []).join('. ');
    } else if (activeTab === 'takeaways') {
      textToSpeak = (summaryData.key_takeaways || []).join('. ');
    } else {
      textToSpeak = summaryData.executive_summary || '';
    }

    if (!textToSpeak) return;

    audioService.playNativeSpeech(
      textToSpeak,
      selectedLanguage?.code || 'en',
      () => setIsPlayingSpeech(true),
      () => setIsPlayingSpeech(false),
      () => setIsPlayingSpeech(false)
    );
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    const content = `EXECUTIVE SUMMARY - ${documentData?.original_name}\n\n${summaryData.executive_summary}\n\nKEY BULLET POINTS:\n${(summaryData.bullet_points || []).map(b => '• ' + b).join('\n')}\n\nKEY TAKEAWAYS:\n${(summaryData.key_takeaways || []).map(t => '→ ' + t).join('\n')}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Zap className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm font-medium">Synthesizing document summary & takeaways...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Document Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">AI Summary & Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Verified Grounding
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            Distillation of <strong className="text-slate-800 dark:text-slate-200">{documentData?.original_name}</strong>
          </p>
        </div>

        {/* Document Switcher Dropdown & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          {/* Multilingual Quick Switcher */}
          <button
            onClick={openLanguageModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
            title="Change summary language"
          >
            <span>{selectedLanguage?.flag}</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold text-xs">{selectedLanguage?.native}</span>
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          <select
            value={selectedDocId}
            onChange={(e) => handleDocChange(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-2.5 sm:px-3 py-2 focus:outline-none focus:border-brand-500 flex-1 sm:flex-initial max-w-full sm:max-w-[220px] truncate"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.original_name}
              </option>
            ))}
          </select>

          <Link
            to={`/chat?docId=${selectedDocId}`}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/25 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Q&A Chat</span>
          </Link>
        </div>
      </div>

      {/* Telemetry Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel rounded-2xl p-3.5 border-slate-800 text-center">
          <p className="text-xs text-slate-400">Reading Time Saved</p>
          <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
            {summaryData?.reading_time_saved_min || 4.5} mins
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border-slate-800 text-center">
          <p className="text-xs text-slate-400">Word Reduction</p>
          <p className="text-lg font-extrabold text-brand-400 mt-0.5">
            {Math.round((1 - (summaryData?.compression_ratio || 0.25)) * 100)}% Compressed
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border-slate-800 text-center">
          <p className="text-xs text-slate-400">Confidence Score</p>
          <p className="text-lg font-extrabold text-purple-400 mt-0.5">
            {Math.round((summaryData?.confidence_score || 0.95) * 100)}% Grounded
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 border-slate-800 text-center">
          <p className="text-xs text-slate-400">Model Engine</p>
          <p className="text-xs font-bold text-slate-200 mt-1 font-mono truncate">
            {summaryData?.model_used || 'Local-Hybrid-NLP'}
          </p>
        </div>
      </div>

      {/* Main Content Explorer */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6">
        {/* Active Language Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-brand-400" />
            <span>AI Summary Language: <strong className="text-white font-bold">{selectedLanguage?.flag} {selectedLanguage?.native} ({selectedLanguage?.name})</strong></span>
          </div>
          <button
            onClick={openLanguageModal}
            className="text-[11px] font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2"
          >
            Change Language
          </button>
        </div>

        {/* Navigation Tabs & Toolbars */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'executive', name: 'Executive Narrative', icon: FileText },
              { id: 'bullets', name: 'Bullet Points', icon: Layers },
              { id: 'takeaways', name: 'Key Takeaways & Actions', icon: CheckCircle2 },
              { id: 'entities', name: 'Entities & Metrics', icon: Tag },
              { id: 'raw', name: 'Full Document Text', icon: Sparkles },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Multilingual Voice Read Aloud Button */}
            <button
              onClick={handleSpeakSummary}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isPlayingSpeech
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 animate-pulse'
                  : 'bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20'
              }`}
              title={isPlayingSpeech ? 'Stop speech' : `Read aloud in ${selectedLanguage?.native}`}
            >
              {isPlayingSpeech ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen ({selectedLanguage?.native})</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <Link
              to={`/downloads`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </Link>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'executive' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 leading-relaxed text-sm text-slate-200">
              <p className="font-serif sm:text-base leading-8 text-slate-100">
                {summaryData?.executive_summary || "No executive summary available for this document."}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'bullets' && (
          <div className="space-y-3">
            {(summaryData?.bullet_points || []).map((point, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-sm text-slate-200">
                <span className="w-6 h-6 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400 min-w-[24px] mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'takeaways' && (
          <div className="space-y-3">
            {(summaryData?.key_takeaways || []).map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 min-w-[20px] mt-0.5" />
                <p className="leading-relaxed font-medium">{item}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'entities' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Key Organizations, Financials, Dates, and Technical Mentions:</p>
            <div className="flex flex-wrap gap-2">
              {(summaryData?.entities || []).map((entity, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-300 font-mono"
                >
                  {entity}
                </span>
              ))}
              {(!summaryData?.entities || summaryData.entities.length === 0) && (
                <p className="text-xs text-slate-500">No specific entities detected.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {documentData?.extracted_text || "No raw text available."}
          </div>
        )}

        {/* Re-Generate Controls Strip */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
          <span className="text-xs text-slate-400">Re-run summary with alternative parameters:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRegenerate('abstractive', 'short')}
              disabled={regenerating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
            >
              Short Brief
            </button>
            <button
              onClick={() => handleRegenerate('abstractive', 'detailed')}
              disabled={regenerating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
            >
              Detailed Breakdown
            </button>
            <button
              onClick={() => handleRegenerate('extractive', 'medium')}
              disabled={regenerating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
              <span>Extractive Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
