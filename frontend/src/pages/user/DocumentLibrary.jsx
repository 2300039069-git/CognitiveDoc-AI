import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Search,
  FileText,
  Upload,
  MessageSquare,
  Download,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Database
} from 'lucide-react';
import { docService } from '../../services/docService';

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const data = await docService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Error loading library:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (docId, name) => {
    if (confirm(`Are you sure you want to delete "${name}"? All associated summaries and chat history will also be removed.`)) {
      try {
        await docService.deleteDocument(docId);
        setDocuments(documents.filter(d => d.id !== docId));
      } catch (err) {
        alert("Failed to delete document");
      }
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && JSON.stringify(doc.tags).toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFormat = formatFilter === 'all' || doc.file_type.toLowerCase() === formatFilter.toLowerCase();
    return matchesSearch && matchesFormat;
  });

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Enterprise Neural Knowledge Vault</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 uppercase">
              {documents.length} Files
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Manage, summarize, and query all ingested organizational files securely on-premise
          </p>
        </div>

        <Link
          to="/upload"
          className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white hover:scale-105 transition-all shadow-lg shadow-brand-500/25 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Ingest Document</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-3xl p-4 border border-slate-200/90 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-600 dark:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, tags, content..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 dark:focus:border-cyan-500 font-mono shadow-sm"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 p-1 rounded-2xl">
            {['all', 'pdf', 'docx', 'txt'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all font-mono ${
                  formatFilter === fmt
                    ? 'bg-gradient-to-r from-cyan-600 to-brand-600 dark:from-cyan-500 dark:to-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-colors ${viewMode === 'table' ? 'bg-cyan-500/15 text-brand-600 dark:text-cyan-300 border border-cyan-500/30' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/15 text-brand-600 dark:text-cyan-300 border border-cyan-500/30' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content View: Table or Grid */}
      {filteredDocs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200/90 dark:border-white/10 space-y-4 shadow-2xl">
          <FolderKanban className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching documents found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query or upload a new file.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-white/10 font-mono">
              <tr>
                <th className="pb-3 font-semibold">Document Title</th>
                <th className="pb-3 font-semibold">Format & Size</th>
                <th className="pb-3 font-semibold">Volume</th>
                <th className="pb-3 font-semibold">Tags</th>
                <th className="pb-3 font-semibold">Indexed Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-white/[0.06]">
              {filteredDocs.map((doc) => {
                const tagList = Array.isArray(doc.tags) ? doc.tags : [];
                return (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-brand-600 dark:text-cyan-400 font-bold uppercase text-xs font-mono">
                          {doc.file_type}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white max-w-xs truncate">{doc.original_name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            Ingested {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300">
                      <span className="uppercase font-mono font-bold text-brand-600 dark:text-cyan-400">{doc.file_type}</span>
                      <span className="text-slate-400 dark:text-slate-500 ml-1.5 font-mono">({Math.round(doc.file_size / 1024)} KB)</span>
                    </td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300 font-mono">
                      {doc.word_count?.toLocaleString()} words • {doc.page_count} pgs
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {tagList.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-cyan-700 dark:text-cyan-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        FAISS Grounded
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-1.5">
                      <Link
                        to={`/summary?docId=${doc.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-brand-700 dark:text-cyan-300 hover:bg-cyan-500/25 inline-block transition-all shadow-sm"
                        title="View Summary"
                      >
                        Summary
                      </Link>
                      <Link
                        to={`/chat?docId=${doc.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 inline-block transition-all shadow-sm"
                        title="Open Chat"
                      >
                        Chat
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id, doc.original_name)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 inline-block transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="glass-card-interactive p-6 space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold uppercase bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                    {doc.file_type}
                  </span>
                  <button
                    onClick={() => handleDelete(doc.id, doc.original_name)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors">{doc.original_name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.preview_text || "Document processed and indexed into local vector memory."}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-white/10">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>{doc.word_count?.toLocaleString()} words</span>
                  <span>{doc.page_count} {doc.page_count === 1 ? 'page' : 'pages'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/summary?docId=${doc.id}`}
                    className="py-2 rounded-xl text-center text-xs font-bold bg-cyan-500/15 border border-cyan-500/30 text-brand-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-sm"
                  >
                    Summary
                  </Link>
                  <Link
                    to={`/chat?docId=${doc.id}`}
                    className="py-2 rounded-xl text-center text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 transition-all shadow-sm"
                  >
                    Q&A Chat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
