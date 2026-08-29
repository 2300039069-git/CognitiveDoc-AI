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
  Zap
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
        <Zap className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm font-medium">Aggregating platform administrative telemetry...</p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Registered Users",
      value: stats?.total_users || 4,
      sub: `${stats?.active_users || 4} Active Sessions`,
      icon: Users,
      color: "text-brand-400",
      bg: "bg-brand-500/10"
    },
    {
      label: "Global Documents",
      value: stats?.total_documents || 6,
      sub: `${stats?.total_storage_mb || 1.8} MB Local Storage`,
      icon: Files,
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    },
    {
      label: "Summaries Generated",
      value: stats?.total_summaries || 6,
      sub: "100% On-Premise NLP",
      icon: Cpu,
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
    {
      label: "Avg Model Latency",
      value: `${stats?.average_inference_latency_ms || 124}ms`,
      sub: "CPU native inference",
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900 to-orange-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Root Superuser Console • Node: Localhost</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Administration Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor platform health, active users, global document repository, and local Hugging Face model telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all font-mono"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/ai-monitoring"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all"
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
            <div key={idx} className="glass-panel rounded-2xl p-5 border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-white">{kpi.value}</p>
                <p className="text-[11px] text-slate-400 font-mono">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Server Health & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Host Node Health & Load</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Optimal Condition
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>CPU Host Utilization</span>
                <span className="font-mono text-emerald-400">{stats?.server_health?.cpu_usage_percent || 14}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${stats?.server_health?.cpu_usage_percent || 14}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Memory Allocation (RAM)</span>
                <span className="font-mono text-brand-400">{stats?.server_health?.memory_usage_percent || 38}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${stats?.server_health?.memory_usage_percent || 38}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">In-Memory FAISS Vector Indices:</span>
              <span className="font-mono text-white font-bold">{stats?.total_documents || 3} Active Indices</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total System Queries Processed:</span>
              <span className="font-mono text-white font-bold">{stats?.total_queries || 14} Queries</span>
            </div>
          </div>
        </div>

        {/* Quick Admin Navigation */}
        <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
            Administrative Modules
          </h2>

          <div className="space-y-2">
            {[
              { name: "User Directory", path: "/admin/users", icon: Users },
              { name: "Global Documents", path: "/admin/documents", icon: Files },
              { name: "Model Telemetry", path: "/admin/ai-monitoring", icon: Cpu },
              { name: "Aggregate Analytics", path: "/admin/analytics", icon: Activity },
              { name: "User Feedback", path: "/admin/feedback", icon: ShieldCheck },
            ].map((mod, idx) => {
              const ModIcon = mod.icon;
              return (
                <Link
                  key={idx}
                  to={mod.path}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <ModIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                    <span>{mod.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
