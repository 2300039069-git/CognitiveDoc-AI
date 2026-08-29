import React, { useState, useEffect } from 'react';
import {
  Files,
  Search,
  Trash2,
  FileText,
  User,
  HardDrive,
  CheckCircle2,
  Calendar,
  Layers,
  X
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchDocs = async () => {
    try {
      const data = await adminService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load global documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (docId, name) => {
    if (confirm(`Admin Action: Permanently purge "${name}" and all related vector indices?`)) {
      try {
        await adminService.deleteDocument(docId);
        setDocuments(documents.filter(d => d.id !== docId));
        if (previewDoc?.id === docId) setPreviewDoc(null);
      } catch (err) {
        alert("Failed to purge document");
      }
    }
  };

  const filteredDocs = documents.filter(d =>
    d.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.user_email && d.user_email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Global Document Moderation</h1>
          <p className="text-xs text-slate-400">
            Audit, inspect, and moderate all enterprise documents ingested across tenant workspaces
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name or owner email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Global Document Table */}
      <div className="glass-panel rounded-3xl p-6 border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
            <tr>
              <th className="pb-3 font-semibold">Document</th>
              <th className="pb-3 font-semibold">Owner</th>
              <th className="pb-3 font-semibold">Format & Size</th>
              <th className="pb-3 font-semibold">Word Count</th>
              <th className="pb-3 font-semibold">Ingestion Date</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 uppercase text-[10px] font-mono">
                      {doc.file_type}
                    </div>
                    <div>
                      <p className="font-bold text-white max-w-xs truncate">{doc.original_name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {doc.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 text-slate-300">
                  <p className="font-semibold text-white">{doc.user_name || 'Enterprise User'}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{doc.user_email || 'user@example.com'}</p>
                </td>
                <td className="py-3.5 text-slate-300 font-mono">
                  <span className="uppercase font-bold text-amber-400">{doc.file_type}</span> • {Math.round(doc.file_size / 1024)} KB
                </td>
                <td className="py-3.5 text-slate-300 font-mono">
                  {doc.word_count?.toLocaleString()} words
                </td>
                <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                  {new Date(doc.uploaded_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 text-right space-x-1.5">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.original_name)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Purge Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Document Preview Drawer */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-700 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">{previewDoc.original_name}</h2>
                <p className="text-xs text-slate-400 font-mono">Owner: {previewDoc.user_email}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto leading-relaxed">
              {previewDoc.preview || previewDoc.extracted_text || "No preview snippet available."}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
