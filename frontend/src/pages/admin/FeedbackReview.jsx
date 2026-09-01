import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  Search,
  Star,
  CheckCircle2,
  Clock,
  Filter,
  User,
  Check
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function FeedbackReview() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const data = await adminService.getFeedback();
      setFeedbackList(data);
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleUpdateStatus = async (item, newStatus) => {
    try {
      await adminService.updateFeedbackStatus(item.id, newStatus);
      setFeedbackList(feedbackList.map(f => f.id === item.id ? { ...f, status: newStatus } : f));
    } catch {
      alert("Failed to update status");
    }
  };

  const filtered = feedbackList.filter(f =>
    statusFilter === 'all' || f.status === statusFilter
  );

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Feedback & Model Quality</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review user ratings, summarization fidelity comments, and citation feedback
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 p-1 rounded-2xl shadow-sm">
          {['all', 'pending', 'reviewed', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200/90 dark:border-white/10 space-y-3 shadow-xl">
            <MessageSquareHeart className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-300">No feedback items in this category</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">All submissions have been reviewed or resolved.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-4 hover:border-amber-500/30 shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-white text-xs border border-slate-200 dark:border-white/10">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{item.user_email}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Submitted on {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                      />
                    ))}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    item.status === 'resolved'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : item.status === 'reviewed'
                      ? 'bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/20'
                      : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  Category: {item.category}
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans pt-1">
                  "{item.message}"
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
                {item.status !== 'reviewed' && (
                  <button
                    onClick={() => handleUpdateStatus(item, 'reviewed')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                  >
                    Mark Reviewed
                  </button>
                )}
                {item.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(item, 'resolved')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
