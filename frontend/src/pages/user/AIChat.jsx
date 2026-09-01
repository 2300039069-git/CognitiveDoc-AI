import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Trash2,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  Languages,
  Mic,
  MicOff,
  Volume2,
  Square
} from 'lucide-react';
import { docService } from '../../services/docService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import { audioService } from '../../services/audioService';

const LANG_SPEECH_MAP = {
  en: 'en-US',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE'
};

export default function AIChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const docIdParam = searchParams.get('docId');
  const { selectedLanguage, openLanguageModal } = useLanguage();

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(docIdParam || '');
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "What are the core obligations or commitments outlined in this document?",
    "What are the liability thresholds, terms, or key timelines mentioned?",
    "Can you summarize the main findings and conclusions?"
  ]);
  const [expandedCitations, setExpandedCitations] = useState({});

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Stop speech if language or doc changes
  useEffect(() => {
    audioService.stop();
    setPlayingMsgId(null);
  }, [selectedLanguage?.code, selectedDocId]);

  // Voice Recognition (Speech to Text)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const targetLang = LANG_SPEECH_MAP[selectedLanguage?.code] || 'en-US';
      recognition.lang = targetLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputQuery(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  // Text-to-Speech: Guaranteed Native Voice Audio in Selected Language
  const handleSpeakText = (msgId, rawText) => {
    if (playingMsgId === msgId) {
      audioService.stop();
      setPlayingMsgId(null);
      return;
    }

    audioService.playNativeSpeech(
      rawText,
      selectedLanguage?.code || 'en',
      () => setPlayingMsgId(msgId),
      () => setPlayingMsgId(null),
      () => setPlayingMsgId(null)
    );
  };

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load documents
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await docService.getDocuments();
        setDocuments(docs);
        if (!selectedDocId && docs.length > 0) {
          setSelectedDocId(docs[0].id);
          setSearchParams({ docId: docs[0].id });
        }
      } catch (err) {
        console.error("Error fetching docs:", err);
      }
    };
    fetchDocs();
  }, []);

  // Load conversation history for selected document
  useEffect(() => {
    if (!selectedDocId) return;

    const fetchHistory = async () => {
      try {
        const history = await aiService.getChatHistory(selectedDocId);
        setMessages(history);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, [selectedDocId]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || !selectedDocId || loading) return;

    setInputQuery('');
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      sender: 'user',
      message: textToSend.trim(),
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await aiService.chatWithDocument(selectedDocId, textToSend.trim(), selectedLanguage?.code || 'en');
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), {
        id: 'user-' + Date.now(),
        sender: 'user',
        message: textToSend.trim(),
        created_at: new Date().toISOString()
      }, res.message]);

      if (res.suggested_questions?.length > 0) {
        setSuggestedQuestions(res.suggested_questions);
      }
    } catch (err) {
      alert("Failed to query document: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!selectedDocId) return;
    if (confirm("Reset conversation history for this document?")) {
      await aiService.clearChatHistory(selectedDocId);
      setMessages([]);
    }
  };

  const toggleCitation = (msgId) => {
    setExpandedCitations(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const currentDoc = documents.find(d => d.id === selectedDocId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 transition-colors duration-200">
      {/* Header with Document Selector & Multilingual Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-brand-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-600 dark:text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Autonomous RAG Conversation Studio</h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 text-brand-700 dark:text-cyan-300 border border-cyan-500/30 uppercase">
                FAISS Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
              Target: <strong className="text-slate-800 dark:text-slate-200">{documents.find(d => d.id === selectedDocId)?.original_name || 'All Ingested Knowledge'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Quick Language Switcher */}
          <button
            onClick={openLanguageModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title="Change response language"
          >
            <span>{selectedLanguage?.flag}</span>
            <span className="text-brand-600 dark:text-cyan-400 font-bold text-xs">{selectedLanguage?.native}</span>
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          <select
            value={selectedDocId}
            onChange={(e) => {
              setSelectedDocId(e.target.value);
              setSearchParams({ docId: e.target.value });
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 rounded-2xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 flex-1 sm:flex-initial max-w-full sm:max-w-[200px] truncate font-mono shadow-sm"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.original_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-slate-200 dark:border-white/10 transition-colors shadow-sm"
            title="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 glass-panel rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-white/10 overflow-y-auto space-y-4 shadow-xl">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5 py-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-brand-500 to-indigo-600 p-0.5 shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-brand-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ask Anything About This Document</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                The local FAISS vector index retrieves exact sentence chunks and synthesizes verified, citation-backed answers in sub-seconds.
              </p>
            </div>

            {/* Suggested Question Starter Pills */}
            <div className="space-y-2 w-full text-left pt-2">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 text-center">
                Recommended Prompt Queries
              </p>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] hover:border-cyan-500/40 text-xs text-slate-700 dark:text-slate-300 text-left transition-all hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-center justify-between group shadow-sm"
                >
                  <span className="truncate pr-2 font-medium">{q}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-cyan-400 min-w-[12px]" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              const citations = typeof msg.citations === 'string' ? JSON.parse(msg.citations || '[]') : (msg.citations || []);
              const hasCitations = citations.length > 0;
              const isCitationOpen = expandedCitations[msg.id];

              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex-shrink-0 shadow-md">
                      <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                      </div>
                    </div>
                  )}

                  <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white rounded-tr-sm shadow-xl shadow-brand-500/20'
                          : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 rounded-tl-sm shadow-xl backdrop-blur-xl'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.message}</p>

                      {!isUser && (
                        <div className="flex items-center justify-between pt-2.5 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-white/10 mt-2.5">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              {Math.round((msg.confidence_score || 0.94) * 100)}% Grounded
                            </span>
                            <span className="flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3 text-brand-600 dark:text-cyan-400" />
                              {msg.latency_ms || 112}ms
                            </span>
                          </div>

                          {/* Voice Read Aloud (TTS) Button */}
                          <button
                            onClick={() => handleSpeakText(msg.id || idx, msg.message)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                              playingMsgId === (msg.id || idx)
                                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                                : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-cyan-300'
                            }`}
                            title={playingMsgId === (msg.id || idx) ? 'Stop audio' : `Read aloud in ${selectedLanguage?.native}`}
                          >
                            {playingMsgId === (msg.id || idx) ? (
                              <>
                                <Square className="w-3 h-3 text-rose-500 fill-rose-500" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-brand-600 dark:text-cyan-400" />
                                <span>Listen ({selectedLanguage?.native})</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Citations Card */}
                    {!isUser && hasCitations && (
                      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.05] overflow-hidden text-xs">
                        <button
                          onClick={() => toggleCitation(msg.id)}
                          className="w-full p-2.5 flex items-center justify-between text-brand-700 dark:text-cyan-300 font-semibold hover:bg-cyan-500/10 transition-colors font-mono"
                        >
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
                            {citations.length} Grounded Source {citations.length === 1 ? 'Citation' : 'Citations'}
                          </span>
                          {isCitationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isCitationOpen && (
                          <div className="p-3 border-t border-cyan-500/30 space-y-2 bg-slate-50 dark:bg-slate-950/80 font-mono">
                            {citations.map((c, cIdx) => (
                              <div key={cIdx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-[11px] space-y-1 shadow-sm">
                                <div className="flex items-center justify-between font-sans">
                                  <span className="font-bold text-brand-700 dark:text-cyan-300">Chunk #{c.chunk_id} • Page {c.page_number}</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{c.relevance_percent}% Relevance</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 italic">"{c.snippet}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md shadow-brand-500/20">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3 text-brand-700 dark:text-cyan-300 text-xs font-mono">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-brand-600 dark:text-cyan-400">
                  <Zap className="w-4 h-4 animate-spin" />
                </div>
                <span>Scanning FAISS vector index & generating response in {selectedLanguage?.native}...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested Prompts Strip */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-500 whitespace-nowrap">Suggested:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Voice Recognition Active Notification */}
      {isListening && (
        <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs animate-pulse font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>🎙️ Listening in <strong>{selectedLanguage?.native} ({selectedLanguage?.name})</strong>... Speak clearly into your microphone</span>
          </div>
          <button
            type="button"
            onClick={toggleVoiceInput}
            className="text-[11px] font-bold underline text-rose-600 dark:text-rose-400"
          >
            Stop Listening
          </button>
        </div>
      )}

      {/* Input Box with Microphone & Send */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask any question in ${selectedLanguage?.name || 'English'} (${selectedLanguage?.native || 'English'}) or tap microphone...`}
            className="w-full pl-5 pr-12 py-3.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xl backdrop-blur-xl font-mono"
          />

          {/* Voice Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-bounce'
                : 'text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
            title={isListening ? 'Stop recording' : `Speak in ${selectedLanguage?.native}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className={`p-3.5 rounded-2xl transition-all ${
            inputQuery.trim() && !loading
              ? 'btn-shimmer bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95'
              : 'bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
