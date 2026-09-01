import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  Cpu,
  Layers,
  Star
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        setData(res);
      } catch (err) {
        console.error("Failed to load admin analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#0c8ee9', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Zap className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm font-medium">Aggregating system-wide usage metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="space-y-1 pb-5 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Telemetry & Analytics Hub</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 uppercase">
            Live Stream
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Global inference traffic, local model throughput distribution, and user satisfaction telemetry
        </p>
      </div>

      {/* Traffic & Requests Hourly Curve */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Platform Query Traffic (24-Hour Cycle)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Hourly volume of abstractive summarization and FAISS Q&A requests</p>
          </div>
          <span className="px-3 py-1 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold">
            Live Invocations vs Latency
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.traffic_trends || []}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
                labelStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                name="Inference Queries"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Throughput & Latency */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Model Throughput & Invocations</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total requests processed by local NLP engines</p>
            </div>
            <Cpu className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.model_throughput || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
                <XAxis dataKey="model" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
                />
                <Bar dataKey="queries" name="Total Invocations" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Rating Distributions */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">User Feedback Rating Distribution</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Aggregated user satisfaction ratings</p>
            </div>
            <Star className="w-4 h-4 text-amber-500" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.feedback_breakdown || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="rating" type="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
                />
                <Bar dataKey="count" name="Reviews" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
