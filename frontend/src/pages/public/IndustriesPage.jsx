import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Stethoscope,
  TrendingUp,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function IndustriesPage() {
  const industries = [
    {
      id: "legal",
      name: "Legal & Contracts",
      icon: Scale,
      color: "from-amber-500 to-orange-500",
      headline: "Accelerate Contract Due Diligence by 80%",
      problem: "Legal teams spend countless hours reviewing 100+ page Master Services Agreements, indemnification clauses, and non-disclosure obligations.",
      solution: "CognitiveDoc extracts critical liability caps, termination clauses, and non-competes in seconds with exact paragraph citations.",
      sampleQuery: "What is the maximum aggregate liability cap and SLA uptime requirement in this agreement?",
      sampleAnswer: "According to Section 5, total aggregate liability is capped at the fees paid in the preceding 12 months. System uptime is guaranteed at 99.95% (Page 2).",
      benefits: [
        "Instant indemnification & liability extraction",
        "Redline comparison & key term flags",
        "100% privilege preservation with zero cloud egress"
      ]
    },
    {
      id: "healthcare",
      name: "Healthcare & Life Sciences",
      icon: Stethoscope,
      color: "from-emerald-500 to-teal-500",
      headline: "Rapid Synthesis of Clinical Trials & Medical Journals",
      problem: "Physicians, researchers, and biotech analysts must digest complex randomized clinical trials, dosage protocols, and biomarker data.",
      solution: "Automatic summarization of Phase I-III studies, adverse event frequency categorization, and semantic retrieval over FDA filings.",
      sampleQuery: "What was the statistically significant reduction in cognitive decline observed in the NST-409 cohort?",
      sampleAnswer: "The active cohort demonstrated a 34.2% reduction in cognitive decline progression (p < 0.001) with a 22.8% decrease in CSF p-tau217 (Page 1).",
      benefits: [
        "HIPAA-compliant local analysis with zero data egress",
        "Biomarker and adverse event extraction",
        "Rapid literature reviews across clinical databases"
      ]
    },
    {
      id: "finance",
      name: "Financial Services & Banking",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      headline: "Deconstruct 10-K Filings & Earnings Reports in Seconds",
      problem: "Portfolio managers and credit analysts must sift through hundreds of pages of SEC filings, EBITDA tables, and risk factor disclosures.",
      solution: "Automated executive briefings detailing ARR growth, margin expansions, segment revenues, and revised forward guidance.",
      sampleQuery: "What was the revised full-year revenue guidance and operating margin expansion?",
      sampleAnswer: "Management increased full-year guidance to $595M-$610M (+26% YoY). Operating margin expanded by 420 bps to 22.8% (Page 1).",
      benefits: [
        "Automated extraction of financial ratios and guidance",
        "Multi-quarter earnings comparative analysis",
        "Strict compliance with non-public material information protocols"
      ]
    },
    {
      id: "hr",
      name: "Human Resources & Operations",
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
      headline: "Interactive Company Policies & Employee Handbooks",
      problem: "Employees struggle to find specific PTO, healthcare, and remote work rules buried in 80-page employee handbooks.",
      solution: "Turn static policy PDFs into an interactive RAG assistant that answers HR questions accurately with direct policy citations.",
      sampleQuery: "What is the parental leave policy and eligibility requirement for remote employees?",
      sampleAnswer: "Full-time employees after 6 months of tenure are eligible for 16 weeks of fully paid parental leave, applicable across all remote jurisdictions (Handbook Section 4.2).",
      benefits: [
        "Reduces repetitive HR inquiry volume by 70%",
        "Immediate onboarding clarification for new hires",
        "Consistent policy interpretation without ambiguity"
      ]
    },
    {
      id: "academic",
      name: "Academic Research & Higher Ed",
      icon: GraduationCap,
      color: "from-cyan-500 to-blue-500",
      headline: "Deep Synthesis of Multi-Disciplinary Literature",
      problem: "Academics and graduate students must survey hundreds of whitepapers to synthesize related work, methodologies, and benchmarks.",
      solution: "Generates structured extractive summaries, key takeaways, and methodology matrices across scientific preprints.",
      sampleQuery: "What baseline models were evaluated and what was the BLEU score improvement?",
      sampleAnswer: "The proposed architecture outperformed standard T5-Small baselines by +4.8 BLEU points while reducing parameter footprint by 35% (Page 4).",
      benefits: [
        "Accelerates literature reviews and meta-analyses",
        "Pinpoint citation finding for bibliography creation",
        "Structured comparison of experimental results"
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState("legal");
  const selected = industries.find((i) => i.id === activeTab) || industries[0];
  const Icon = selected.icon;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavbar />

      {/* Header Banner */}
      <section className="py-20 bg-gradient-to-b from-brand-950/30 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400">
            Tailored Industry Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Specialized AI Intelligence for High-Stakes Domains
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            See how CognitiveDoc delivers domain-specific accuracy, auditable citations, and compliance across your industry.
          </p>
        </div>
      </section>

      {/* Interactive Industry Explorer */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Sector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4">
            {industries.map((ind) => {
              const TabIcon = ind.icon;
              const isSelected = activeTab === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveTab(ind.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{ind.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Industry Showcase Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border-slate-800 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selected.color} p-0.5 shadow-xl`}>
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{selected.name}</h2>
                  <p className="text-brand-400 font-semibold text-sm">{selected.headline}</p>
                </div>
              </div>

              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-md shadow-brand-600/25 self-start md:self-auto"
              >
                <span>Try {selected.name} Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Problem & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  The Industry Bottleneck
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.problem}</p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-6 border border-brand-500/20 space-y-3">
                <div className="flex items-center gap-2 text-brand-400 text-sm font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  CognitiveDoc AI Solution
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.solution}</p>
              </div>
            </div>

            {/* Live Sample Q&A Grounding Preview */}
            <div className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Simulated Grounded Q&A Interaction
              </h3>

              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                  <span className="text-brand-400 font-bold">Question: </span>
                  {selected.sampleQuery}
                </div>

                <div className="p-3.5 rounded-xl bg-brand-950/30 border border-brand-500/30 text-slate-200 space-y-2">
                  <div>
                    <span className="text-emerald-400 font-bold">Answer: </span>
                    {selected.sampleAnswer}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-brand-400 font-sans">
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">98% Match</span>
                    <span>Citation: Chunk #2 (Verified Grounding)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Domain Advantages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selected.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 min-w-[16px]" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
