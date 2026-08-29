import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Cpu,
  Layers,
  BarChart3,
  Download,
  ShieldCheck,
  Search,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: FileText,
      tag: "Summarization",
      title: "Extractive & Abstractive Dual Engine",
      desc: "Switch dynamically between verbatim sentence ranking via graph-based TextRank and high-level conceptual distillation via Transformer pipelines.",
      bullets: [
        "Configurable length presets (Short, Medium, Comprehensive)",
        "Key takeaways and action item auto-detection",
        "Entity & financial metric extraction clouds"
      ]
    },
    {
      icon: MessageSquare,
      tag: "RAG Q&A",
      title: "Context-Grounded Question Answering",
      desc: "Query complex documents using natural language. The system retrieves relevant chunks via FAISS embeddings and generates precise, grounded responses.",
      bullets: [
        "Pinpoint citations with exact page numbers and chunk IDs",
        "Relevance confidence scores for full audibility",
        "Interactive suggested prompt recommendations"
      ]
    },
    {
      icon: Layers,
      tag: "Extraction",
      title: "Multi-Format Enterprise Ingestion",
      desc: "Robust local parsers handle PDF page hierarchies, DOCX paragraph/table structures, and clean text/markdown encoding seamlessly.",
      bullets: [
        "Native PyPDF text stream normalization",
        "DOCX table & paragraph structure preservation",
        "Instant character, word count, and reading time computation"
      ]
    },
    {
      icon: Sliders,
      tag: "Customization",
      title: "Keyword Focus & Parameter Tuning",
      desc: "Fine-tune summarization focus by supplying domain keywords, adjusting chunk sizes, and tuning compression ratios.",
      bullets: [
        "Custom focus keyword weighting booster",
        "Dynamic chunk overlap and boundary controls",
        "Real-time compression percentage calculations"
      ]
    },
    {
      icon: BarChart3,
      tag: "Analytics",
      title: "Productivity & Telemetry Dashboards",
      desc: "Visualize personal reading time saved, total pages processed, and system-wide inference latency metrics in real-time charts.",
      bullets: [
        "Reading time saved calculations (based on 200 wpm baseline)",
        "Format distribution and activity heatmaps",
        "AI inference latency telemetry and model health monitoring"
      ]
    },
    {
      icon: Download,
      tag: "Export Center",
      title: "Multi-Format Export & Downloads",
      desc: "Export executive summaries and Q&A conversation transcripts into standardized enterprise formats with one click.",
      bullets: [
        "Download formatted TXT, Markdown, and JSON files",
        "Copy to clipboard with pre-formatted markdown syntax",
        "Batch export support for document collections"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavbar />

      {/* Header Banner */}
      <section className="py-20 bg-gradient-to-b from-brand-950/30 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400">
            Enterprise Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Deep-Dive Feature Matrix
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Discover the technical features powering our 100% local, zero-API key document intelligence platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="glass-panel-hover rounded-3xl p-7 border-slate-800 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{f.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-800/80">
                    {f.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 min-w-[14px] mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Strip */}
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border-brand-500/30 text-center space-y-6 bg-gradient-to-r from-brand-950/40 via-slate-900 to-indigo-950/40">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Experience All Features in Action</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Test summarization, semantic search, and citation grounding right now on your browser.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/upload"
                className="px-6 py-3 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/30"
              >
                Upload a Document
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
