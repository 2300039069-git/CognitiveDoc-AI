import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Shield, Cpu, Lock, FileText, CheckCircle2, Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                CognitiveDoc<span className="text-brand-400">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Enterprise-Grade AI Document Intelligence platform delivering instant multi-document summarization, RAG semantic search, and grounded Q&A powered by high-speed LLM inference and local FAISS vector indexing.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Data Egress • Enterprise AI Document Intelligence</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/features" className="hover:text-brand-400 transition-colors">AI Summarization</Link></li>
              <li><Link to="/features" className="hover:text-brand-400 transition-colors">RAG Semantic Search</Link></li>
              <li><Link to="/how-it-works" className="hover:text-brand-400 transition-colors">Chunk Citations</Link></li>
              <li><Link to="/tech-stack" className="hover:text-brand-400 transition-colors">FAISS Vector Index</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Live User Portal</Link></li>
            </ul>
          </div>

          {/* Solutions & Industries */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Industries</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/industries" className="hover:text-brand-400 transition-colors">Legal & Contracts</Link></li>
              <li><Link to="/industries" className="hover:text-brand-400 transition-colors">Healthcare & Clinical</Link></li>
              <li><Link to="/industries" className="hover:text-brand-400 transition-colors">Financial Analysis</Link></li>
              <li><Link to="/industries" className="hover:text-brand-400 transition-colors">HR & Policies</Link></li>
              <li><Link to="/industries" className="hover:text-brand-400 transition-colors">Academic Research</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/tech-stack" className="hover:text-brand-400 transition-colors">Architecture Stack</Link></li>
              <li><Link to="/faq" className="hover:text-brand-400 transition-colors">FAQ & Security</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-brand-400 transition-colors">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 CognitiveDoc AI System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> React + FastAPI + Transformers
            </span>
            <Link to="/faq" className="hover:text-slate-300">Privacy Charter</Link>
            <Link to="/about" className="hover:text-slate-300">Security Whitepaper</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
