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
  ExternalLink
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Document Repository</h1>
          <p className="text-xs text-slate-400">
            Manage, summarize, and query all ingested organizational files ({documents.length} total)
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-md shadow-brand-600/25 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
            {['all', 'pdf', 'docx', 'txt'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                  formatFilter === fmt
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content View: Table or Grid */}
      {filteredDocs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border-slate-800 space-y-4">
          <FolderKanban className="w-12 h-12 mx-auto text-slate-600" />
          <h2 className="text-base font-bold text-slate-300">No matching documents found</h2>
          <p className="text-xs text-slate-500">Try adjusting your filters or upload a new file.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel rounded-3xl p-6 border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="pb-3 font-semibold">Document Title</th>
                <th className="pb-3 font-semibold">Format & Size</th>
                <th className="pb-3 font-semibold">Volume</th>
                <th className="pb-3 font-semibold">Tags</th>
                <th className="pb-3 font-semibold">Indexed Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.map((doc) => {
                const tagList = Array.isArray(doc.tags) ? doc.tags : [];
                return (
                  <tr key={doc.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold uppercase text-xs font-mono">
                          {doc.file_type}
                        </div>
                        <div>
                          <p className="font-bold text-white max-w-xs truncate">{doc.original_name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300">
                      <span className="uppercase font-mono font-bold text-brand-400">{doc.file_type}</span>
                      <span className="text-slate-500 ml-1.5 font-mono">({Math.round(doc.file_size / 1024)} KB)</span>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">
                      {doc.word_count?.toLocaleString()} words • {doc.page_count} pgs
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {tagList.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Indexed
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-1.5">
                      <Link
                        to={`/summary?docId=${doc.id}`}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30 inline-block"
                        title="View Summary"
                      >
                        Summary
                      </Link>
                      <Link
                        to={`/chat?docId=${doc.id}`}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 inline-block"
                        title="Open Chat"
                      >
                        Chat
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id, doc.original_name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 inline-block"
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
            <div key={doc.id} className="glass-panel-hover rounded-3xl p-6 border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {doc.file_type}
                  </span>
                  <button
                    onClick={() => handleDelete(doc.id, doc.original_name)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-1">{doc.original_name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.preview_text || "Document processed and indexed into local vector memory."}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{doc.word_count?.toLocaleString()} words</span>
                  <span>{doc.page_count} {doc.page_count === 1 ? 'page' : 'pages'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/summary?docId=${doc.id}`}
                    className="py-2 rounded-xl text-center text-xs font-bold bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30 transition-all"
                  >
                    Summary
                  </Link>
                  <Link
                    to={`/chat?docId=${doc.id}`}
                    className="py-2 rounded-xl text-center text-xs font-bold bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-all"
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
