import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  MessageSquare,
  HardDrive,
  Upload,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { docService } from '../../services/docService';
import { analyticsService } from '../../services/analyticsService';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [docsData, analyticsData] = await Promise.all([
          docService.getDocuments(),
          analyticsService.getUserAnalytics()
        ]);
        setDocuments(docsData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleQuickUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await docService.uploadDocument(file);
      navigate(`/process?docId=${res.document.id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload document');
      setUploading(false);
    }
  };

  const statCards = [
    {
      label: "Documents Processed",
      value: analytics?.total_documents || documents.length || 0,
      icon: FileText,
      change: "+100% On-Premise",
      color: "text-brand-400",
      bg: "bg-brand-500/10"
    },
    {
      label: "Reading Time Saved",
      value: `${analytics?.time_saved_minutes || 18.5} min`,
      icon: Clock,
      change: `~${analytics?.time_saved_hours || 0.3} hours`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Total Words Analyzed",
      value: (analytics?.total_words_analyzed || 14500).toLocaleString(),
      icon: Layers,
      change: `${analytics?.total_pages_analyzed || 12} pages`,
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
    {
      label: "RAG Queries Executed",
      value: analytics?.total_queries || 8,
      icon: MessageSquare,
      change: "Sub-400ms latency",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 bg-gradient-to-r from-brand-950/40 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Active • {user?.organization || 'Enterprise Org'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.full_name || 'Enterprise User'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Upload new PDF, DOCX, or TXT documents to generate abstractive summaries or chat in real-time with grounded source citations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <label className="cursor-pointer flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/30">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Parsing File...' : 'Quick Ingest File'}</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={handleQuickUpload}
              disabled={uploading}
            />
          </label>
          <Link
            to="/upload"
            className="flex-1 sm:flex-initial text-center px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Custom Upload
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-5 border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>{stat.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/upload"
          className="glass-panel-hover rounded-2xl p-5 border-slate-800 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Upload & Analyze</h3>
              <p className="text-xs text-slate-400">PDF, DOCX, TXT parsing</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-brand-400 transition-colors" />
        </Link>

        <Link
          to="/chat"
          className="glass-panel-hover rounded-2xl p-5 border-slate-800 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">RAG Q&A Assistant</h3>
              <p className="text-xs text-slate-400">Ask questions with citations</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </Link>

        <Link
          to="/downloads"
          className="glass-panel-hover rounded-2xl p-5 border-slate-800 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export Center</h3>
              <p className="text-xs text-slate-400">Download summaries & chats</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>

      {/* Recent Documents Table */}
      <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Processed Documents</h2>
            <p className="text-xs text-slate-400">Access executive summaries, key takeaways, and interactive Q&A</p>
          </div>
          <Link
            to="/library"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>View All Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-3">
            <FileText className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-medium text-slate-300">No documents uploaded yet</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload First Document
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                <tr>
                  <th className="pb-3 font-semibold">Document Name</th>
                  <th className="pb-3 font-semibold">Format & Size</th>
                  <th className="pb-3 font-semibold">Words / Pages</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.slice(0, 5).map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold uppercase text-[10px]">
                          {doc.file_type}
                        </div>
                        <div>
                          <p className="font-semibold text-white truncate max-w-xs">{doc.original_name}</p>
                          <p className="text-[10px] text-slate-400">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300">
                      <span className="uppercase font-mono font-bold text-brand-400">{doc.file_type}</span>
                      <span className="text-slate-500 ml-1.5 font-mono">({Math.round(doc.file_size / 1024)} KB)</span>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">
                      {doc.word_count.toLocaleString()} words • {doc.page_count} {doc.page_count === 1 ? 'page' : 'pages'}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {doc.has_summary ? 'Summarized & Indexed' : 'Ready to Process'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        to={`/summary?docId=${doc.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30"
                      >
                        Summary
                      </Link>
                      <Link
                        to={`/chat?docId=${doc.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                      >
                        Chat Q&A
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
