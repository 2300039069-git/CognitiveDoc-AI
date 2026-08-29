import React from 'react';
import {
  Cpu,
  Layers,
  Server,
  Code2,
  Database,
  Shield,
  FileCode,
  Zap,
  CheckCircle2
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function TechStackPage() {
  const stackCategories = [
    {
      title: "Frontend Architecture",
      icon: Code2,
      color: "from-cyan-500 to-blue-500",
      description: "Modern, reactive single-page enterprise dashboard built with React and Tailwind CSS.",
      technologies: [
        { name: "React 18", role: "Component UI framework with hooks & state management" },
        { name: "Tailwind CSS", role: "Utility-first design system with dark/light themes" },
        { name: "React Router v6", role: "Role-based protected client routing & guards" },
        { name: "Lucide Icons", role: "Pixel-perfect modern SVG icon library" },
        { name: "Recharts", role: "Composable interactive analytics & telemetry charts" },
        { name: "Axios", role: "HTTP client with JWT authorization interceptors" }
      ]
    },
    {
      title: "Backend Core",
      icon: Server,
      color: "from-emerald-500 to-teal-500",
      description: "High-performance asynchronous REST API powered by FastAPI and Python 3.11.",
      technologies: [
        { name: "FastAPI", role: "Asynchronous Python web framework with OpenAPI specs" },
        { name: "Uvicorn", role: "Lightning-fast ASGI production server" },
        { name: "SQLite", role: "ACID-compliant local database for users, summaries & logs" },
        { name: "Python-Jose & PBKDF2", role: "Cryptographic JWT session & password security" },
        { name: "Pydantic v2", role: "Strict data validation and serialization" }
      ]
    },
    {
      title: "Local NLP & Vector Intelligence",
      icon: Cpu,
      color: "from-purple-500 to-pink-500",
      description: "100% on-device AI pipelines executing without external API keys.",
      technologies: [
        { name: "Hugging Face Transformers", role: "Local T5-Small & BART-Large abstractive models" },
        { name: "FAISS-CPU & NumPy", role: "Sub-millisecond semantic vector similarity index" },
        { name: "TextRank Graph Algorithm", role: "Centrality-based extractive sentence ranking" },
        { name: "Sentence Transformers", role: "Dense semantic embeddings for RAG retrieval" },
        { name: "Context Citation Engine", role: "Grounded chunk locator with page attribution" }
      ]
    },
    {
      title: "Document Ingestion Engines",
      icon: Layers,
      color: "from-amber-500 to-orange-500",
      description: "Multi-format parsers extracting structural hierarchy and textual metadata.",
      technologies: [
        { name: "PyPDF", role: "Stream text extraction, page parsing & layout recovery" },
        { name: "Python-Docx", role: "DOCX paragraphs, headers, and table cellular extraction" },
        { name: "Clean UTF-8 Streamer", role: "TXT and Markdown encoding normalizer" },
        { name: "Semantic Chunk Parser", role: "Sliding window overlap chunker with sentence bounds" }
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
            Open-Source & Native
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Technology Stack & Architecture
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Built entirely with best-of-breed open-source frameworks, zero cloud lock-in, and local execution guarantees.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stackCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="glass-panel rounded-3xl p-7 sm:p-8 border-slate-800 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{cat.title}</h2>
                      <p className="text-xs text-slate-400">{cat.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {cat.technologies.map((tech, tIdx) => (
                      <div key={tIdx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                          <span className="text-sm font-bold text-white font-mono">{tech.name}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-sans">{tech.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
