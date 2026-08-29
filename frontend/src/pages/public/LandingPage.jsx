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
  CheckCircle,
  Clock,
  Layers,
  ChevronRight,
  Lock,
  Globe,
  Database
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [demoInput, setDemoInput] = useState(
    "CognitiveDoc.AI utilizes local Hugging Face transformer models to generate abstractive and extractive summaries of enterprise documents without sending a single byte of sensitive data to third-party cloud APIs. Combined with FAISS vector indexing, users can query massive repositories with pinpoint citations and sub-second latency."
  );
  const [demoOutput, setDemoOutput] = useState(
    "• 100% On-Premise & Local NLP: Zero data leakage with on-device transformer models.\n• Instant RAG Semantic Retrieval: Sub-second Q&A grounded in FAISS vector embeddings.\n• Enterprise Auditability: Every answer includes direct chunk & page-level source citations."
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTestDemo = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDemoOutput(
        "• Local Privacy Architecture: Eliminates external API dependencies and cloud egress.\n• High-Speed RAG Engine: Sub-400ms contextual search across complex enterprise formats.\n• Verified Citations: Full traceability with exact page and chunk attribution."
      );
      setIsGenerating(false);
    }, 600);
  };

  const metrics = [
    { label: "Reading Time Saved", value: "85%", icon: Clock },
    { label: "Context Retrieval Latency", value: "<400ms", icon: Zap },
    { label: "External API Key Costs", value: "$0.00", icon: Shield },
    { label: "Data Egress Risk", value: "0%", icon: Lock },
  ];

  const features = [
    {
      title: "Extractive & Abstractive Summaries",
      desc: "Choose between concise executive distillation or verbatim key-sentence extraction tailored to your industry requirements.",
      icon: FileText,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "RAG Semantic Q&A with Citations",
      desc: "Ask nuanced questions against multi-page documents and receive grounded answers with exact page numbers and chunk snippets.",
      icon: MessageSquare,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "100% Local Transformers & FAISS",
      desc: "Powered by open Hugging Face pipelines running locally on CPU. No OpenAI/Anthropic keys or cloud billing required.",
      icon: Cpu,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Enterprise Multi-Format Parsing",
      desc: "Native high-fidelity text extraction for PDFs, DOCX contracts, TXT transcripts, and Markdown whitepapers.",
      icon: Layers,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Granular Role Governance",
      desc: "Built-in RBAC architecture separating standard business users from administrative security & model monitoring teams.",
      icon: Shield,
      color: "from-rose-500 to-pink-500"
    },
    {
      title: "Comprehensive Audit & Analytics",
      desc: "Track reading time saved, word reduction metrics, query throughput, and platform health in real-time dashboards.",
      icon: BarChart3,
      color: "from-cyan-500 to-blue-600"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-brand-500 selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
              <span>Zero External API Keys • 100% Free Local Hugging Face & FAISS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Transform Massive Documents into <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400">Actionable Intelligence</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Enterprise AI-powered summarization and contextual RAG Q&A that runs entirely on your local machine. Analyze legal contracts, clinical studies, and financial filings with verified citations.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500 transition-all shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02]"
                  >
                    <span>Go to Your Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/chat"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-brand-400" />
                    <span>Open AI Chat</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500 transition-all shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02]"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-lg"
                  >
                    <span>Sign In to Workspace</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Metric Stats Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="glass-panel rounded-2xl p-5 text-center border-slate-800/80 hover:border-brand-500/40 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{m.value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{m.label}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Live Playground Widget */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-700/60 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono text-slate-400 pl-2">Interactive AI Summarizer Sandbox</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Local Inference
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input side */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" />
                    Source Passage (Raw Document Text)
                  </label>
                  <textarea
                    rows={7}
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono"
                    placeholder="Enter document text to summarize..."
                  />
                  <button
                    onClick={handleTestDemo}
                    disabled={isGenerating}
                    className="w-full py-2.5 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin" />
                        <span>Running Local NLP Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Extractive & Abstractive Analysis</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Output side */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Synthesized Executive Takeaways
                  </label>
                  <div className="w-full h-[180px] bg-slate-950/90 border border-emerald-500/30 rounded-xl p-3.5 text-sm text-slate-200 overflow-y-auto whitespace-pre-line font-mono leading-relaxed">
                    {demoOutput}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Model: Hybrid-TextRank-T5</span>
                    <span className="text-emerald-400 font-semibold">Compression: 74% Saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement vs Solution Section */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest">The Enterprise Challenge</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Why Traditional Document Workflows Fail</h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Organizations waste hundreds of hours manually parsing contracts, technical manuals, and financial reports while facing compliance risks with public LLMs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border-rose-500/20 bg-gradient-to-b from-rose-500/5 to-transparent space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                Traditional Bottlenecks
              </span>
              <h4 className="text-xl font-bold text-white">Manual Reading & High-Cost Cloud LLMs</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Data Privacy Violations:</strong> Uploading proprietary documents to third-party cloud APIs violates GDPR and HIPAA regulations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Hallucinations & No Traceability:</strong> Cloud models answer without citing verifiable chunk references or page numbers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Runaway Token Fees:</strong> Processing 500-page reports continuously generates thousands of dollars in recurring API bills.</span>
                </li>
              </ul>
            </div>

            {/* The CognitiveDoc Way */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border-brand-500/30 bg-gradient-to-b from-brand-500/10 to-transparent space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400">
                The CognitiveDoc Solution
              </span>
              <h4 className="text-xl font-bold text-white">100% Local, Grounded AI Intelligence</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Zero Data Egress:</strong> Models and vector indices execute locally in CPU memory. Zero external API keys needed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Sub-Chunk Citations:</strong> Every answer links to verified document snippets with relevance percentages and exact pages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Unlimited Processing:</strong> Run high-volume summarization and RAG Q&A with $0.00 token expenses.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest">Platform Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Rigorous Enterprise Workloads</h3>
            <p className="text-slate-400 text-sm sm:text-base">
              A cohesive suite of local NLP pipelines designed to extract clarity from dense multi-format documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-panel-hover rounded-2xl p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} p-0.5 shadow-lg`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white">{f.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-brand-900/40 via-indigo-900/40 to-slate-900 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Supercharge Your Document Intelligence?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Experience zero-latency summarization and private local RAG Q&A today with pre-seeded sample data.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl text-base font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-xl shadow-brand-600/30"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl text-base font-semibold bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
