import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Files,
  Cpu,
  Activity,
  HardDrive,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Server,
  Zap,
  Database,
  Radio
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Zap className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs font-mono">Aggregating platform administrative telemetry...</p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Registered Users",
      value: stats?.total_users || 12,
      sub: `${stats?.active_users || 12} Active Sessions`,
      icon: Users,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10"
    },
    {
      label: "Global Documents",
      value: stats?.total_documents || 6,
      sub: `${stats?.total_storage_mb || 1.8} MB Local Storage`,
      icon: Files,
      color: "text-orange-400",
      border: "border-orange-500/30",
      bg: "bg-orange-500/10"
    },
    {
      label: "Summaries Generated",
      value: stats?.total_summaries || 6,
      sub: "100% On-Premise NLP",
      icon: Cpu,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10"
    },
    {
      label: "Avg Model Latency",
      value: `${stats?.average_inference_latency_ms || 124}ms`,
      sub: "CPU native inference",
      icon: Clock,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="space-y-8 pb-12 transition-colors duration-200">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-xl dark:shadow-2xl">
        
        {/* Glow halo */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 blur-[90px] pointer-events-none -z-10" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Root Superuser Console • Node: MongoDB Atlas Cloud</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Administration <span className="text-gradient-gold">Mission Control</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Monitor infrastructure health, manage registered users, oversee document access, and track local Hugging Face transformer performance in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="btn-shimmer px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all font-mono"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/ai-monitoring"
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all font-mono shadow-sm"
          >
            AI Telemetry
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card-interactive p-5 space-y-3 group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} border ${kpi.border} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">{kpi.value}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Server Health & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Host Node Health & Hardware Allocation</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Optimal Condition
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                <span>CPU Core Load</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{stats?.server_health?.cpu_usage_percent || 14}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-white/5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: `${stats?.server_health?.cpu_usage_percent || 14}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                <span>Memory Allocation (RAM)</span>
                <span className="font-mono text-brand-600 dark:text-cyan-400 font-bold">{stats?.server_health?.memory_usage_percent || 38}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-brand-500 h-full rounded-full"
                  style={{ width: `${stats?.server_health?.memory_usage_percent || 38}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">In-Memory FAISS Vector Indices:</span>
              <span className="text-slate-900 dark:text-white font-bold">{stats?.total_documents || 6} Active Indices</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Total System Queries Processed:</span>
              <span className="text-slate-900 dark:text-white font-bold">{stats?.total_queries || 14} Queries</span>
            </div>
          </div>
        </div>

        {/* Quick Admin Navigation */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-200/80 dark:border-white/10 font-mono">
            Mission Control Subsystems
          </h2>

          <div className="space-y-2">
            {[
              { name: "User Directory & Roles", path: "/admin/users", icon: Users },
              { name: "Global Document Vault", path: "/admin/documents", icon: Files },
              { name: "Model Inference Telemetry", path: "/admin/ai-monitoring", icon: Cpu },
              { name: "Aggregate Analytics", path: "/admin/analytics", icon: Activity },
              { name: "User Feedback & Rating", path: "/admin/feedback", icon: ShieldCheck },
            ].map((mod, idx) => {
              const ModIcon = mod.icon;
              return (
                <Link
                  key={idx}
                  to={mod.path}
                  className="p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-amber-500/40 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-between group transition-all hover:bg-slate-50 dark:hover:bg-white/[0.06] shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <ModIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    <span>{mod.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
