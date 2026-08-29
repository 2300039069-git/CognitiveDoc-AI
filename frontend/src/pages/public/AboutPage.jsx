import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Cpu, Users, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function AboutPage() {
  const principles = [
    {
      title: "Zero Data Egress",
      desc: "Every document, embedding, and summary is generated on your dedicated machine without external API leaks.",
      icon: Lock
    },
    {
      title: "Auditable Grounding",
      desc: "Every insight and generated answer is grounded in exact source document text with chunk citations.",
      icon: Target
    },
    {
      title: "Democratized NLP",
      desc: "Leveraging state-of-the-art open-source Hugging Face architectures free of proprietary vendor lock-in.",
      icon: Cpu
    },
    {
      title: "Enterprise Governance",
      desc: "Built-in role-based access control, system telemetry, and document moderation.",
      icon: Shield
    }
  ];

  const teamMembers = [
    { name: "Dr. Elena Rostova", role: "Chief AI Architect", bio: "Former researcher in Transformer distillation and local edge NLP models." },
    { name: "Marcus Vance", role: "Lead Systems Engineer", bio: "Specialist in FAISS vector indexes, high-throughput retrieval, and FastAPI." },
    { name: "Aria Chen", role: "Product & Privacy Lead", bio: "Advocate for zero-egress data privacy, HIPAA/GDPR enterprise compliance." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavbar />

      {/* Header Banner */}
      <section className="py-20 bg-gradient-to-b from-brand-950/40 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400">
            Our Mission & Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Pioneering Privacy-First Document Intelligence
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            CognitiveDoc was engineered to solve a fundamental dilemma: how can enterprises harness the power of modern NLP without compromising confidential intellectual property?
          </p>
        </div>
      </section>

      {/* Core Mission Story */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border-slate-800 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The Genesis of CognitiveDoc</h2>
            <p className="text-slate-300 leading-relaxed">
              In an era where organizations deal with thousands of pages of contracts, regulatory filings, clinical trials, and technical documentation daily, reliance on public cloud APIs poses grave risks of confidential data leakage, prohibitive recurring costs, and non-transparent hallucinations.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We engineered CognitiveDoc from first principles: combining open-source Hugging Face transformer pipelines, PyPDF text extraction, FAISS vector indexing, and a modern React + FastAPI architecture into a turnkey, 100% self-hosted system that runs entirely on standard hardware with zero external API dependencies.
            </p>
          </div>

          {/* Core Principles */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Core Engineering Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{p.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research & Engineering Team */}
          <div className="space-y-6 pt-8">
            <h3 className="text-2xl font-bold text-white text-center">Research & Development Leads</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((m, idx) => (
                <div key={idx} className="glass-panel rounded-2xl p-6 border-slate-800 text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                    {m.name.charAt(0)}
                  </div>
                  <h4 className="text-base font-bold text-white">{m.name}</h4>
                  <p className="text-xs text-brand-400 font-semibold">{m.role}</p>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
