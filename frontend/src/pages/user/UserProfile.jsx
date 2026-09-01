import React from 'react';
import { User, Mail, Building, Shield, Award, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 transition-colors duration-200">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6 shadow-xl dark:shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-brand-500/20">
          {user?.full_name?.charAt(0) || 'U'}
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user?.full_name || 'Enterprise User'}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30 uppercase font-mono">
              {user?.role || 'user'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email || 'user@example.com'}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 justify-center sm:justify-start pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Local Instance License: Active (Unlimited On-Premise)</span>
          </p>
        </div>
      </div>

      {/* Account Details & Organization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200/80 dark:border-white/10 flex items-center gap-2 font-mono">
            <Building className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Organization & Account
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-200/60 dark:border-white/[0.06]">
              <span className="text-slate-500 dark:text-slate-400">Organization:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{user?.organization || 'Apex Global Analytics'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200/60 dark:border-white/[0.06]">
              <span className="text-slate-500 dark:text-slate-400">Tier / License:</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">{user?.tier || 'Enterprise Pro'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200/60 dark:border-white/[0.06]">
              <span className="text-slate-500 dark:text-slate-400">Account ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{user?.id || 'usr-local-default'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active (Verified)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200/80 dark:border-white/10 flex items-center gap-2 font-mono">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Local Resource Allocations
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Local Document Storage</span>
                <span className="font-mono text-brand-600 dark:text-brand-400">3.4 MB / 10 GB</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-white/10">
                <div className="bg-brand-500 h-full rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>RAG Vector Indices</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">Unlimited Local FAISS</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-white/10">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Running native Hugging Face pipelines locally. Zero token usage metering or third-party cost constraints.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
