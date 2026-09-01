import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  MessageSquare,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { docService } from '../../services/docService';

export default function HistoryPage() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await docService.getDocuments();
        setDocuments(data);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const filteredHistory = documents.filter((d) =>
    d.original_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Activity & History Log</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological audit trail of all generated summaries and RAG conversations
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-brand-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past logs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono shadow-sm"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
            <History className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">No activity history found</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ingest a document or start a conversation to create audit records.</p>
          </div>
        ) : (
          filteredHistory.map((item, idx) => (
            <div
              key={item.id || idx}
              className="glass-panel rounded-3xl p-5 border border-slate-200/90 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-500/40 shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-brand-600 dark:text-cyan-400 font-bold uppercase text-xs font-mono min-w-[40px] mt-0.5">
                  {item.file_type}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.original_name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{item.preview_text || "Document summarized and indexed into FAISS vector space."}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.uploaded_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{item.word_count?.toLocaleString()} words</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.has_summary ? 'Summary Active' : 'Ready'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Link
                  to={`/summary?docId=${item.id}`}
                  className="px-3.5 py-2 rounded-2xl text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-brand-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-sm"
                >
                  View Summary
                </Link>
                <Link
                  to={`/chat?docId=${item.id}`}
                  className="px-3.5 py-2 rounded-2xl text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>Re-Open Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
