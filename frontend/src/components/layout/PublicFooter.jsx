import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Shield, Cpu, Lock, FileText, CheckCircle2, Heart, ArrowUpRight, Sparkles, Database, Activity } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/[0.08] text-slate-400 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-brand-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white">
                CognitiveDoc<span className="text-cyan-400">.AI</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Autonomous AI Document Intelligence platform delivering instant multi-document summarization, RAG semantic search, and grounded Q&A with pinpoint citations powered by local Hugging Face transformers & MongoDB Atlas cloud database.
            </p>

            {/* Live Operational Status Ticker */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">Operational: <strong className="text-emerald-400 font-semibold">99.98% Uptime</strong></span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400 font-semibold">MongoDB Atlas Cloud</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Capabilities</span>
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/features" className="hover:text-cyan-300 transition-colors flex items-center gap-1">AI Summarization Studio <ArrowUpRight className="w-3 h-3 opacity-50" /></Link></li>
              <li><Link to="/features" className="hover:text-cyan-300 transition-colors flex items-center gap-1">RAG Vector Retrieval <ArrowUpRight className="w-3 h-3 opacity-50" /></Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyan-300 transition-colors">Chunk & Page Citations</Link></li>
              <li><Link to="/tech-stack" className="hover:text-cyan-300 transition-colors">FAISS Vector Engine</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-300 transition-colors">Live Workspace Studio</Link></li>
            </ul>
          </div>

          {/* Solutions & Industries */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-brand-400" />
              <span>Industries</span>
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/industries" className="hover:text-brand-300 transition-colors">Legal & Contracts</Link></li>
              <li><Link to="/industries" className="hover:text-brand-300 transition-colors">Healthcare & Clinical</Link></li>
              <li><Link to="/industries" className="hover:text-brand-300 transition-colors">Financial Analysis</Link></li>
              <li><Link to="/industries" className="hover:text-brand-300 transition-colors">HR & Enterprise Policies</Link></li>
              <li><Link to="/industries" className="hover:text-brand-300 transition-colors">Academic Research</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-indigo-400" />
              <span>Platform</span>
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/about" className="hover:text-indigo-300 transition-colors">About the Project</Link></li>
              <li><Link to="/tech-stack" className="hover:text-indigo-300 transition-colors">Architecture Stack</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-300 transition-colors">Security & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-300 transition-colors">Support & Inquiries</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-amber-300 transition-colors">Admin Mission Control</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© 2026 CognitiveDoc AI Autonomous System. Built for Enterprise Research.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1 text-[11px]">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> React + FastAPI + Transformers
            </span>
            <Link to="/faq" className="hover:text-white transition-colors">Privacy Charter</Link>
            <Link to="/about" className="hover:text-white transition-colors">Whitepaper</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
