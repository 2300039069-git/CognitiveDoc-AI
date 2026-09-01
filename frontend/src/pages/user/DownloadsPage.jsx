import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  MessageSquare,
  CheckCircle2,
  Code,
  FileCode,
  File,
  Sparkles,
  Smartphone,
  QrCode,
  ExternalLink
} from 'lucide-react';
import { docService } from '../../services/docService';
import { aiService } from '../../services/aiService';

export default function DownloadsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await docService.getDocuments();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching docs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const downloadTextFile = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportSummary = async (doc, format = 'txt') => {
    try {
      const summary = await aiService.getDocumentSummary(doc.id);
      let content = '';

      if (format === 'json') {
        content = JSON.stringify({
          document_name: doc.original_name,
          exported_at: new Date().toISOString(),
          summary: summary
        }, null, 2);
        downloadTextFile(`${doc.original_name}_summary.json`, content);
      } else if (format === 'md') {
        content = `# Executive Summary: ${doc.original_name}\n\n` +
          `*Exported on ${new Date().toLocaleDateString()} from CognitiveDoc AI Core*\n\n` +
          `## Executive Narrative\n${summary.executive_summary}\n\n` +
          `## Key Bullet Points\n${(summary.bullet_points || []).map(b => '- ' + b).join('\n')}\n\n` +
          `## Decisive Takeaways & Actions\n${(summary.key_takeaways || []).map(t => '1. ' + t).join('\n')}\n\n` +
          `## Grounding Confidence: ${Math.round((summary.confidence_score || 0.95) * 100)}%\n`;
        downloadTextFile(`${doc.original_name}_summary.md`, content);
      } else {
        // Plain TXT
        content = `EXECUTIVE SUMMARY: ${doc.original_name}\n` +
          `============================================================\n\n` +
          `NARRATIVE:\n${summary.executive_summary}\n\n` +
          `KEY POINTS:\n${(summary.bullet_points || []).map(b => '• ' + b).join('\n')}\n\n` +
          `TAKEAWAYS:\n${(summary.key_takeaways || []).map(t => '→ ' + t).join('\n')}\n`;
        downloadTextFile(`${doc.original_name}_summary.txt`, content);
      }
    } catch {
      alert("No summary available to export for this document.");
    }
  };

  const handleExportChat = async (doc) => {
    try {
      const messages = await aiService.getChatHistory(doc.id);
      if (!messages || messages.length === 0) {
        alert("No chat conversation history to export for this document.");
        return;
      }
      let content = `# RAG Grounded Q&A Transcript: ${doc.original_name}\n\n`;
      messages.forEach((m, idx) => {
        content += `### [${m.sender.toUpperCase()}] (${new Date(m.created_at).toLocaleTimeString()})\n${m.message}\n\n`;
      });
      downloadTextFile(`${doc.original_name}_chat_transcript.md`, content);
    } catch {
      alert("Could not load chat transcript.");
    }
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Exports & Mobile App Downloads</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Get the native Mobile App for your phone or generate structured exports of your documents and Q&A transcripts
        </p>
      </div>

      {/* Mobile App Download Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/20 flex items-center justify-center min-w-[56px]">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">CognitiveDoc.AI Mobile App</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30">
                  Native Android & iOS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Multilingual Voice Ready
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                Access PDF ingestion, multi-lingual RAG chat, and voice synthesis in 12+ Indic languages directly on your phone.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Mobile Installation Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Method 1: Instant PWA/WebAPK Install */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2.5 flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-cyan-400">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">1</span>
                <span>1-Tap Install on Any Phone</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Open <strong className="text-slate-900 dark:text-slate-200">http://10.142.15.17:5173</strong> in your phone's Chrome browser, tap <strong className="text-slate-900 dark:text-slate-200">⋮ (Menu)</strong> and select <strong className="text-brand-600 dark:text-cyan-400">Install App</strong>.
              </p>
            </div>
            <a
              href="http://10.142.15.17:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-brand-600 text-white hover:from-cyan-500 hover:to-brand-500 transition-all shadow-md shadow-brand-500/20"
            >
              <span>Open on Phone (10.142.15.17:5173)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Method 2: Expo Go Instant Native Launch */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2.5 flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[11px]">2</span>
                <span>Native React Native (Expo Go)</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Install free <strong className="text-slate-900 dark:text-slate-200">Expo Go</strong> app on your Android/iPhone, run <strong className="text-brand-600 dark:text-brand-400">start_mobile.bat</strong> on PC, and scan the QR code.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-center text-slate-700 dark:text-slate-300">
              Run: <strong>start_mobile.bat</strong>
            </div>
          </div>

          {/* Method 3: Standalone APK (.apk) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2.5 flex flex-col justify-between shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[11px]">3</span>
                <span>Standalone Android APK (.apk)</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Double-click <strong className="text-emerald-600 dark:text-emerald-400">build_apk.bat</strong> to compile a standalone installable <strong className="text-slate-900 dark:text-slate-200">CognitiveDocAI.apk</strong> file.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-center text-slate-700 dark:text-slate-300">
              Run: <strong>build_apk.bat</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-brand-500/30 shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-brand-600 dark:text-cyan-400 font-bold uppercase text-xs font-mono min-w-[48px]">
                {doc.file_type}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{doc.original_name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {doc.word_count?.toLocaleString()} words • {doc.page_count} pages • Ingested on {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Ready for Export
                  </span>
                </div>
              </div>
            </div>

            {/* Export Format Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleExportSummary(doc, 'txt')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
                title="Export as Text"
              >
                <File className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Summary (.TXT)</span>
              </button>

              <button
                onClick={() => handleExportSummary(doc, 'md')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
                title="Export as Markdown"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Summary (.MD)</span>
              </button>

              <button
                onClick={() => handleExportSummary(doc, 'json')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
                title="Export JSON Metadata"
              >
                <Code className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Summary (.JSON)</span>
              </button>

              <button
                onClick={() => handleExportChat(doc)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white hover:from-cyan-500 hover:to-brand-500 transition-colors shadow-md shadow-brand-500/20"
                title="Export Q&A Conversation"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Transcript</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
