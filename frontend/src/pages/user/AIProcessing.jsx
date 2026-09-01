import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Cpu,
  CheckCircle2,
  Layers,
  Database,
  FileText,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { docService } from '../../services/docService';

export default function AIProcessing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const docId = searchParams.get('docId');

  const [docDetails, setDocDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { title: "Document Stream Ingestion", desc: "Extracting raw text tokens and page hierarchies" },
    { title: "Semantic Boundary Chunking", desc: "Splitting text into overlapping contextual blocks" },
    { title: "FAISS Vector Embedding", desc: "Building local in-memory semantic similarity index" },
    { title: "Abstractive & Extractive Synthesis", desc: "Generating executive brief and key takeaways" }
  ];

  useEffect(() => {
    if (!docId) {
      navigate('/library');
      return;
    }

    const runSimulationAndFetch = async () => {
      try {
        const doc = await docService.getDocument(docId);
        setDocDetails(doc);
      } catch (err) {
        console.error("Error fetching doc details:", err);
      }

      // Step animation progression
      const t1 = setTimeout(() => setCurrentStep(1), 400);
      const t2 = setTimeout(() => setCurrentStep(2), 900);
      const t3 = setTimeout(() => setCurrentStep(3), 1400);
      const t4 = setTimeout(() => {
        setCurrentStep(4);
        setCompleted(true);
      }, 1900);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    };

    runSimulationAndFetch();
  }, [docId, navigate]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 transition-colors duration-200">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-200/90 dark:border-white/10 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/25 flex items-center justify-center">
          {completed ? (
            <CheckCircle2 className="w-8 h-8 text-white" />
          ) : (
            <Cpu className="w-8 h-8 text-white animate-pulse" />
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {completed ? "AI Processing Completed" : "Running Local NLP Pipeline"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Document: <strong className="text-brand-600 dark:text-cyan-400 font-mono">{docDetails?.original_name || 'Uploaded File'}</strong>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto bg-slate-100 dark:bg-slate-950 rounded-full h-3 p-0.5 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-cyan-500 via-brand-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Checklist */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200/80 dark:border-white/10 font-mono">
          Pipeline Execution Telemetry
        </h2>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 shadow-sm ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-700 dark:text-slate-200'
                    : isCurrent
                    ? 'bg-brand-500/10 border-brand-500/40 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-mono font-bold">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-spin" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isDone || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-xl ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : isCurrent
                    ? 'bg-brand-500/20 text-brand-700 dark:text-brand-400 font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'QUEUED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Action Buttons */}
      {completed && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to={`/summary?docId=${docId}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
          >
            <FileText className="w-4 h-4" />
            <span>View Executive Summary</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/chat?docId=${docId}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Launch RAG Q&A Chat</span>
          </Link>
        </div>
      )}
    </div>
  );
}
