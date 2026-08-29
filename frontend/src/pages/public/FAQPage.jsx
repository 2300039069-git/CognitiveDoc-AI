import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, Shield, Cpu, Lock, Sparkles } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const faqs = [
    {
      category: "Privacy & Security",
      q: "Are any external API keys (e.g. OpenAI, Anthropic) required?",
      a: "No. CognitiveDoc runs 100% locally on your machine using open Hugging Face transformers, PyPDF, and in-memory FAISS vector indexing. No external API keys or cloud subscriptions are needed."
    },
    {
      category: "Privacy & Security",
      q: "Does my document data ever leave the server/machine?",
      a: "Never. All parsing, text chunking, embedding generation, summarization, and RAG Q&A inference execute strictly within the local environment. It meets strict GDPR and HIPAA compliance mandates."
    },
    {
      category: "AI & Models",
      q: "What is the difference between Extractive and Abstractive summarization?",
      a: "Extractive summarization uses the graph-based TextRank algorithm to score and extract the most important original sentences verbatim. Abstractive summarization uses Transformer architectures (like T5/BART) to synthesize new, cohesive executive takeaways."
    },
    {
      category: "AI & Models",
      q: "How does the RAG Q&A citation grounding work?",
      a: "When you ask a question, the local vector engine finds the closest semantic chunks in the document. The system then quotes the answer while referencing the exact chunk ID, page number, and similarity confidence percentage."
    },
    {
      category: "Files & Formats",
      q: "Which document file formats are supported?",
      a: "The system natively supports PDF files (.pdf), Microsoft Word documents (.docx, .doc), plain text (.txt), Markdown (.md), and CSV data files up to 25MB."
    },
    {
      category: "Deployment & Admin",
      q: "How does Role-Based Access Control (RBAC) work?",
      a: "The system provides two distinct roles: User and Admin. Users can upload, summarize, and chat with their documents, while Admins have full visibility to manage users, monitor AI telemetry, review feedback, and inspect system health."
    }
  ];

  const categories = ['All', 'Privacy & Security', 'AI & Models', 'Files & Formats', 'Deployment & Admin'];

  const filteredFaqs = faqs.filter(f => {
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch = f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavbar />

      {/* Header Banner */}
      <section className="py-20 bg-gradient-to-b from-brand-950/30 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400">
            Frequently Asked Questions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Answers to Common Inquiries
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Everything you need to know about our local NLP architecture, privacy guarantees, and summarization pipelines.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQ questions..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Filter Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-brand-500/40 shadow-lg shadow-brand-500/5'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 min-w-[20px] ${isOpen ? 'text-brand-400' : 'text-slate-500'}`} />
                      <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-400' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 pl-12">
                      <p>{faq.a}</p>
                      <span className="inline-block mt-3 px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-800 text-slate-400">
                        Category: {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <p className="text-base font-medium text-slate-300">No matching questions found.</p>
                <p className="text-xs">Try adjusting your search terms or filter category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
