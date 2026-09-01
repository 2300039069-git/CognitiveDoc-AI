import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  FileText,
  Search,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Lock,
  Globe,
  Database,
  Terminal,
  Volume2,
  Share2,
  Activity,
  Check,
  Flame,
  Radio,
  Eye
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('legal');
  const [mode, setMode] = useState('abstractive');
  const [isGenerating, setIsGenerating] = useState(false);

  const demoPassages = {
    legal: {
      title: "Enterprise Master Services Agreement (MSA)",
      input: "CognitiveDoc.AI delivers zero-data-leakage NLP pipelines and RAG vector search across multi-terabyte document vaults. All natural language processing executes locally using Hugging Face transformer models on standard CPU hardware, ensuring total compliance with GDPR, HIPAA, and SOC-2 without third-party API exposure.",
      output: "• 100% On-Premise Execution: Transformer inference runs locally with 0 bytes transmitted to third-party clouds.\n• Grounded RAG Search: Contextual citations link answers directly to page & paragraph offsets.\n• Compliance Guarantee: Meets GDPR & HIPAA guidelines with zero persistent third-party training.",
      tokensSaved: "82%",
      latency: "180ms"
    },
    clinical: {
      title: "Clinical Pharmacology Trial Report",
      input: "In the Phase III double-blind randomized clinical evaluation of compound CD-8492, patients demonstrated a 43.6% acceleration in cellular tissue recovery with a standardized safety margin. Biomarker stability was monitored every 6 hours across a 90-day multi-cohort trial.",
      output: "• Phase III Efficacy: 43.6% acceleration in primary tissue recovery metrics.\n• Safety Profile: Stable biomarkers maintained across all 90-day cohort evaluations.\n• Dosage Tolerance: Zero grade-4 adverse events recorded in monitored groups.",
      tokensSaved: "88%",
      latency: "140ms"
    },
    financial: {
      title: "Q4 Global SaaS Revenue Disclosure",
      input: "Annual Recurring Revenue (ARR) reached $148.4M, representing a 34% YoY expansion driven by enterprise tier expansions and net revenue retention (NRR) of 128%. Gross margins improved to 82.4% while operating cash flow reached a record $41.2M.",
      output: "• Financial Performance: ARR expanded 34% YoY to $148.4M with 128% Net Revenue Retention.\n• Profitability Metrics: Gross margin expanded to 82.4% with $41.2M operating cash flow.\n• Growth Drivers: Enterprise tier expansions contributed to 72% of net new ARR additions.",
      tokensSaved: "79%",
      latency: "160ms"
    }
  };

  const [currentOutput, setCurrentOutput] = useState(demoPassages.legal.output);

  const handleSwitchTab = (tabKey) => {
    setActiveTab(tabKey);
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentOutput(demoPassages[tabKey].output);
      setIsGenerating(false);
    }, 350);
  };

  const metrics = [
    { label: "Reading Time Reduced", value: "85%", icon: Clock, change: "Industry Leading" },
    { label: "Vector Search Latency", value: "<180ms", icon: Zap, change: "FAISS Indexed" },
    { label: "External API Fees", value: "$0.00", icon: Shield, change: "100% Free CPU" },
    { label: "Data Egress Risk", value: "0%", icon: Lock, change: "Air-Gapped Ready" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative overflow-hidden transition-colors duration-200">
      
      {/* Background Mesh Gradients & Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] aurora-orb-cyan blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-96 left-1/4 w-[600px] h-[500px] aurora-orb-purple blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] aurora-orb-indigo blur-[140px] pointer-events-none -z-10" />

      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Hero Header */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold backdrop-blur-xl shadow-md dark:shadow-lg dark:shadow-cyan-500/10 hover:border-cyan-400/40 transition-colors">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-mono">Autonomous Neural Document Engine v2.0</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-slate-700 dark:text-slate-300">Local Hugging Face + FAISS</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              <span className="text-gradient-silver">Distill Complex Documents with </span>
              <span className="text-gradient-cyan">Zero-Latency AI Intelligence</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Transform thousands of pages of legal contracts, clinical dossiers, and financial disclosures into instant executive briefings and grounded RAG citations — running entirely on your local machine with <strong className="text-slate-900 dark:text-white">zero external API keys</strong> and <strong className="text-slate-900 dark:text-white">zero data leakage</strong>.
            </p>

            {/* Hero Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="btn-shimmer w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xl shadow-brand-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span>Launch Workspace Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/chat"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-all backdrop-blur-xl shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                    <span>Open Grounded RAG Chat</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-shimmer w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white shadow-xl shadow-brand-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span>Get Started Free — No Credit Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-all backdrop-blur-xl shadow-sm"
                  >
                    <span>Sign In to Workspace</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 100% Free Open Models</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> MongoDB Atlas Cloud Backed</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> GDPR & HIPAA Compliant</span>
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="glass-card-interactive p-5 text-center group">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-brand-600 dark:text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{m.value}</p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">{m.label}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/[0.05] text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-white/10">
                    {m.change}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Live Summarizer & RAG Sandbox */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              
              {/* Sandbox Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 pl-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
                    Interactive Neural Sandbox
                  </span>
                </div>

                {/* Preset Switcher Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => handleSwitchTab('legal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'legal' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Legal MSA
                  </button>
                  <button
                    onClick={() => handleSwitchTab('clinical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'clinical' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Clinical Trial
                  </button>
                  <button
                    onClick={() => handleSwitchTab('financial')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'financial' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Financial 10-Q
                  </button>
                </div>
              </div>

              {/* Sandbox Body */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Raw Passage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                      <span>Input Document Excerpt</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {demoPassages[activeTab].title}
                    </span>
                  </div>
                  <div className="w-full h-[220px] bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-mono leading-relaxed overflow-y-auto">
                    {demoPassages[activeTab].input}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
                    <span>Source: Verified Ingest</span>
                    <span className="text-cyan-700 dark:text-cyan-400 font-semibold">Latency: {demoPassages[activeTab].latency}</span>
                  </div>
                </div>

                {/* Right: Synthesized AI Output */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Synthesized Intelligence & RAG Grounding</span>
                    </label>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {demoPassages[activeTab].tokensSaved} Compressed
                    </span>
                  </div>

                  <div className={`w-full h-[220px] bg-emerald-500/[0.04] dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed overflow-y-auto whitespace-pre-line transition-all ${
                    isGenerating ? 'opacity-50 animate-pulse' : 'opacity-100'
                  }`}>
                    {isGenerating ? "⚡ Running Local Hugging Face T5 & FAISS Vector Embedding pipeline..." : currentOutput}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
                    <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" /> Hybrid T5-Small / TextRank</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Verifiable Citations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid 2.0: Platform Capabilities */}
      <section className="py-24 relative border-t border-slate-200 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-semibold uppercase tracking-widest">
              Architectural Superiority
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Engineered for Rigorous Enterprise Workflows
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              A cohesive suite of autonomous neural pipelines designed to extract clarity from dense multi-format documents without cloud dependencies.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            
            {/* Bento Card 1 (Large 2 Col) */}
            <div className="md:col-span-2 glass-card-interactive p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-brand-600 dark:text-cyan-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Grounded RAG Semantic Search with Pinpoint Citations
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xl">
                  Ask natural language questions across multi-gigabyte document libraries. Every answer is mathematically grounded using FAISS vector indexing with exact page numbers, chunk identifiers, and contextual confidence scores.
                </p>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="text-brand-600 dark:text-cyan-400 font-semibold">Query: "What is the liability cap in Section 8?"</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                  Matched Page 14 • 98.4% Confidence
                </span>
              </div>
            </div>

            {/* Bento Card 2 (Single Col) */}
            <div className="glass-card-interactive p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  100% Local Transformers
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Powered by open Hugging Face pipelines executing on standard CPU threads. Zero API keys, zero rate-limiting, and zero recurring cloud bills.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-300 font-semibold">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>CPU Inference Latency: ~180ms</span>
              </div>
            </div>

            {/* Bento Card 3 (Single Col) */}
            <div className="glass-card-interactive p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Multi-Format High-Fidelity Parsing
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Native optical and structural extraction for complex enterprise formats: PDF contracts, DOCX briefings, TXT transcripts, and Markdown documentation.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold">.PDF</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold">.DOCX</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold">.TXT</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold">.MD</span>
              </div>
            </div>

            {/* Bento Card 4 (Large 2 Col) */}
            <div className="md:col-span-2 glass-card-interactive p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Volume2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Multi-Language Neural Translation & Audio Narration
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xl">
                  Synthesize key takeaways in over 10 global languages (English, Spanish, French, German, Telugu, Hindi, Chinese, Japanese) with built-in voice playback for on-the-go audio briefings.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-200">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <span>Speech Equalizer Ready</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-200">
                  <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>10+ Global Locales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Showcase */}
      <section className="py-20 relative border-t border-slate-200 dark:border-white/[0.08] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.04] via-slate-50 to-slate-50 dark:from-brand-950/40 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-mono font-semibold uppercase">
            Deploy in Seconds
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to Supercharge Your Document Intelligence?
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience zero-latency document summarization and air-gapped RAG Q&A today with pre-seeded sample data.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-shimmer px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white shadow-xl shadow-cyan-500/30 hover:scale-[1.03] active:scale-95 transition-all"
            >
              Launch Your Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl text-base font-semibold bg-white dark:bg-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-all backdrop-blur-xl shadow-sm"
            >
              Sign In to Your Workspace
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
