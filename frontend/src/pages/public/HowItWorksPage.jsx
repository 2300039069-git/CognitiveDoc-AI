import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Layers,
  Database,
  Cpu,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  FileCheck
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: "01",
      name: "Document Ingestion",
      icon: Upload,
      headline: "Multi-Format Parsing & Text Extraction",
      desc: "The system accepts PDF, DOCX, TXT, or Markdown documents. Native parsers extract raw text streams, calculate page hierarchies, and remove artifacts while preserving structure.",
      codeSnippet: `// Step 1: Document Parsing
const parsed = await extract_text_and_metadata(file);
console.log({
  pages: parsed.page_count,
  words: parsed.word_count,
  clean_text: parsed.text.slice(0, 100)
});`,
      details: [
        "PyPDF page-level text extraction",
        "DOCX table & paragraph structure preservation",
        "Character, word count, and reading time estimation"
      ]
    },
    {
      stepNumber: "02",
      name: "Semantic Chunking",
      icon: Layers,
      headline: "Sentence Boundary & Overlap Windowing",
      desc: "Dense text is split into semantic chunks (default ~500 characters) with a 100-character overlap window, ensuring context is never truncated across chunk boundaries.",
      codeSnippet: `// Step 2: Semantic Chunking
const chunks = chunk_text(text, {
  chunkSize: 500,
  overlap: 100,
  preserveSentenceBoundaries: true
});
// Generates chunks with page & offset metadata`,
      details: [
        "Grammatical sentence boundary detection",
        "Configurable overlap ratio to prevent context clipping",
        "Page and paragraph metadata tagging for every chunk"
      ]
    },
    {
      stepNumber: "03",
      name: "Local Vector Indexing",
      icon: Database,
      headline: "FAISS & Cosine Similarity Matrix Generation",
      desc: "Each chunk is converted into semantic vector embeddings locally. A FAISS-compatible vector store is constructed in memory, enabling sub-millisecond similarity lookups.",
      codeSnippet: `// Step 3: Local Vector Indexing
const index = new LocalVectorIndex(chunks);
index.buildVocabularyAndTFIDF();
// Ready for sub-400ms cosine semantic retrieval`,
      details: [
        "100% on-device vector computation",
        "Sub-word n-gram and TF-IDF weighted semantic embeddings",
        "Zero data transmission to external vector cloud databases"
      ]
    },
    {
      stepNumber: "04",
      name: "Dual-Engine Summarization",
      icon: Cpu,
      headline: "Extractive Ranking + Abstractive Synthesis",
      desc: "The summarizer executes TextRank sentence graph ranking to select top-scoring facts and synthesizes an executive summary, bullet points, and key takeaways.",
      codeSnippet: `// Step 4: Summarization Generation
const summary = generate_summary(text, {
  type: "abstractive", // or "extractive"
  length: "medium",
  focusKeywords: ["liability", "uptime"]
});`,
      details: [
        "Graph-based TextRank sentence centrality scoring",
        "Lead position and entity booster algorithms",
        "Key takeaways, action items, and entity cloud extraction"
      ]
    },
    {
      stepNumber: "05",
      name: "RAG Q&A & Citation Grounding",
      icon: MessageSquare,
      headline: "Context Retrieval with Pinpoint Snippets",
      desc: "When a user asks a question, the vector store retrieves the top K matching chunks and synthesizes an answer with exact page and chunk citations.",
      codeSnippet: `// Step 5: RAG Semantic Q&A
const result = answer_rag_question(docId, text, query);
console.log({
  answer: result.answer,
  citations: result.citations, // [{ chunk_id: 1, page: 2, score: 0.97 }]
  confidence: result.confidence_score
});`,
      details: [
        "Semantic nearest-neighbor retrieval",
        "Direct chunk snippet and page attribution",
        "Interactive suggested follow-up questions"
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
            Pipeline Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            How the Local AI Pipeline Works
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            A step-by-step breakdown of how CognitiveDoc ingests, chunks, embeds, summarizes, and grounds enterprise documents.
          </p>
        </div>
      </section>

      {/* Interactive Step-by-Step Flow */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Step Selector Horizontal Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-brand-600/10 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-brand-400' : 'text-slate-500'}`}>
                      {s.stepNumber}
                    </span>
                    <StepIcon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold truncate">{s.name}</p>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Explanatory Text */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-brand-400 font-mono">
                    {steps[activeStep].stepNumber}
                  </span>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {steps[activeStep].name}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {steps[activeStep].headline}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {steps[activeStep].desc}
                </p>

                <div className="space-y-2.5 pt-2">
                  {steps[activeStep].details.map((d, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 min-w-[16px]" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  {activeStep > 0 && (
                    <button
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      ← Previous Stage
                    </button>
                  )}
                  {activeStep < steps.length - 1 && (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all flex items-center gap-1.5"
                    >
                      <span>Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Code / Pipeline Simulation Snippet */}
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800/80 shadow-2xl font-mono text-xs sm:text-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse"></span>
                    <span>Pipeline Execution Simulator</span>
                  </div>
                  <span className="text-[11px] text-emerald-400">Status: In Memory</span>
                </div>
                <pre className="text-brand-300 overflow-x-auto p-2 leading-relaxed whitespace-pre-wrap">
                  {steps[activeStep].codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
