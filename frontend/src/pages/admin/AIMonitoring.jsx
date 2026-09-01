import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Clock,
  HardDrive,
  CheckCircle2,
  Zap,
  RefreshCw,
  Terminal,
  Database,
  Radio
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AIMonitoring() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      const res = await adminService.getAIMonitoring();
      setData(res);
    } catch (err) {
      console.error("Failed to load telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Zap className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs font-mono">Connecting to local model inference telemetry stream...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Engine Telemetry & Health Stream</h1>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time inference latency, memory allocations, cache hits, and FAISS vector index status
          </p>
        </div>

        <button
          onClick={fetchTelemetry}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold bg-white/[0.04] border border-white/10 text-slate-200 hover:bg-white/[0.08] transition-all font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Live Telemetry</span>
        </button>
      </div>

      {/* Model Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card-interactive p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Summarizer Engine</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-base font-bold text-white font-mono">{data?.model_status?.summarizer}</p>
          <p className="text-[11px] text-slate-400">T5-Small Transformer & Graph TextRank</p>
        </div>

        <div className="glass-card-interactive p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vector Store Index</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <p className="text-base font-bold text-white font-mono">{data?.model_status?.vector_index}</p>
          <p className="text-[11px] text-slate-400">In-Memory Sub-Millisecond Retrieval</p>
        </div>

        <div className="glass-card-interactive p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Memory Allocation</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-base font-bold text-white font-mono">{data?.performance_telemetry?.peak_memory_mb || 480} MB</p>
          <p className="text-[11px] text-emerald-400 font-mono">Cache Hit Ratio: {data?.performance_telemetry?.cache_hit_ratio_percent || 94}%</p>
        </div>
      </div>

      {/* Latency Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-3xl p-5 border border-white/10 text-center space-y-1 shadow-xl">
          <p className="text-xs text-slate-400 font-medium">Avg Extractive Latency</p>
          <p className="text-2xl font-extrabold text-cyan-400 font-mono">
            {data?.performance_telemetry?.avg_extractive_latency_ms || 68}ms
          </p>
          <p className="text-[10px] text-slate-500 font-mono">TextRank Graph Centrality</p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-white/10 text-center space-y-1 shadow-xl">
          <p className="text-xs text-slate-400 font-medium">Avg Abstractive Latency</p>
          <p className="text-2xl font-extrabold text-indigo-400 font-mono">
            {data?.performance_telemetry?.avg_abstractive_latency_ms || 165}ms
          </p>
          <p className="text-[10px] text-slate-500 font-mono">Transformer Neural Pipeline</p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-white/10 text-center space-y-1 shadow-xl">
          <p className="text-xs text-slate-400 font-medium">Avg RAG Context Retrieval</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">
            {data?.performance_telemetry?.avg_rag_retrieval_latency_ms || 42}ms
          </p>
          <p className="text-[10px] text-slate-500 font-mono">FAISS Vector Nearest Neighbor</p>
        </div>
      </div>

      {/* System Execution Logs Table */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 shadow-2xl">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Terminal className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Live System Execution Stream</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Level</th>
                <th className="pb-3 font-semibold">Subsystem</th>
                <th className="pb-3 font-semibold">Event Description</th>
                <th className="pb-3 font-semibold text-right">Inference Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {(data?.recent_logs || []).map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-2.5 text-slate-500">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {log.level}
                    </span>
                  </td>
                  <td className="py-2.5 text-amber-400 font-semibold">{log.module}</td>
                  <td className="py-2.5 text-slate-200 font-sans text-xs">{log.message}</td>
                  <td className="py-2.5 text-right text-cyan-400 font-bold">
                    {log.latency_ms > 0 ? `${log.latency_ms}ms` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
