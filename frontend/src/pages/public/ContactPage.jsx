import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Building, ShieldCheck, HelpCircle } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    category: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavbar />

      {/* Header Banner */}
      <section className="py-20 bg-gradient-to-b from-brand-950/30 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Connect with Our Engineering Team
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Have questions about local deployments, model customization, or enterprise integration? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Details Cards */}
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Direct Engineering Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct inquiries regarding local Transformer installation, FAISS memory footprint, and custom fine-tuning.
                </p>
                <p className="text-sm font-mono text-brand-400 font-semibold pt-1">support@cognitivedoc.ai</p>
              </div>

              <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Security & Compliance Audit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Request SOC-2 / HIPAA compliance architecture documentation and zero-egress data verification sheets.
                </p>
                <p className="text-sm font-mono text-emerald-400 font-semibold pt-1">security@cognitivedoc.ai</p>
              </div>

              <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">On-Premises Deployments</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Architecture consulting for high-concurrency clustered Kubernetes installations and air-gapped data centers.
                </p>
                <p className="text-sm font-mono text-purple-400 font-semibold pt-1">enterprise@cognitivedoc.ai</p>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <div className="glass-panel rounded-3xl p-6 sm:p-10 border-slate-800">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">Message Sent Successfully!</h2>
                    <p className="text-slate-300 text-sm max-w-md mx-auto">
                      Thank you for contacting us. A solutions architect will review your message and reply to <strong className="text-brand-400">{formData.email}</strong> shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Jordan Miller"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Work Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. jordan@company.com"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Organization</label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          placeholder="e.g. Acme Health Corp"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Inquiry Topic</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="On-Prem Enterprise Deployment">On-Prem Enterprise Deployment</option>
                          <option value="Model Fine-Tuning & Customization">Model Fine-Tuning & Customization</option>
                          <option value="Security & Compliance">Security & Compliance</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your document volume, use cases, or questions..."
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Inquiry...</span>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
