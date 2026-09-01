import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Zap,
  Cpu,
  Database,
  Shield,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { auth, googleProvider, signInWithPopup } from '../../services/firebase';
import { authService } from '../../services/authService';

export default function RegisterPage() {
  // Step 1: Input details | Step 2: Verification Email Dispatched
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');

  const [verificationUrl, setVerificationUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  // Resend Countdown Timer
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const syncData = await authService.firebaseSync({
        email: fbUser.email,
        full_name: fbUser.displayName || 'Google Verified User',
        organization: organization.trim() || 'Enterprise Team',
        firebase_uid: fbUser.uid
      });
      loginWithToken(syncData.access_token, syncData.user);
      if (syncData.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Google registration encountered an issue. Please try email verification.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send Verification Link to User's Email
  const handleRegisterAndSendLink = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.registerSendLink({
        email: email.trim().toLowerCase(),
        password: password,
        full_name: fullName.trim() || 'CognitiveDoc User',
        organization: organization.trim() || 'Enterprise Team'
      });

      setVerificationUrl(res.verification_url || '');
      setStep(2);
      setResendTimer(30);
      setCanResend(false);
      setSuccessMsg(`A verification link has been dispatched to ${email.trim()}.`);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to send verification link. Please verify your email or use Instant Activate.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Email
  const handleResendLink = async () => {
    if (!canResend || loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await authService.registerSendLink({
        email: email.trim().toLowerCase(),
        password: password,
        full_name: fullName.trim() || 'CognitiveDoc User',
        organization: organization.trim() || 'Enterprise Team'
      });

      setVerificationUrl(res.verification_url || '');
      setResendTimer(30);
      setCanResend(false);
      setSuccessMsg(`A fresh verification link has been dispatched to ${email.trim()}.`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend verification link.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Fallback (if user wants to skip email wait)
  const handleDirectActivate = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await authService.register({
        email: email.trim().toLowerCase(),
        password: password,
        full_name: fullName.trim() || 'CognitiveDoc User',
        organization: organization.trim() || 'Enterprise Team'
      });

      loginWithToken(data.access_token, data.user);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to activate account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative overflow-hidden transition-colors duration-200">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[500px] aurora-orb-cyan blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] aurora-orb-purple blur-[140px] pointer-events-none -z-10" />

      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Cyber Benefits Card (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-white/90 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-950/90 border border-slate-200/90 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-2xl space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Link-Verified Security</span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                Join the <span className="text-gradient-cyan">CognitiveDoc AI</span> Ecosystem
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Empower your workflow with private, high-speed document synthesis and RAG vector intelligence.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-brand-600 dark:text-cyan-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span>Instant Multi-Tenant MongoDB Atlas Integration</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <span>FAISS Dense In-Memory Semantic Indexing</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span>1-Click Email Verification Activation</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/[0.06] border border-cyan-500/20 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <span className="text-brand-600 dark:text-cyan-400 font-bold block font-mono">Enterprise Level SLA</span>
              <p>Full 256-bit encryption for all uploaded PDF, DOCX, and text corpora.</p>
            </div>
          </div>

          {/* Right Column: Registration Form / Verification Status */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-center space-y-2 lg:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-brand-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center lg:mx-0 mx-auto">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                  {step === 1 ? <Bot className="w-6 h-6 text-brand-600 dark:text-cyan-400" /> : <Mail className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-pulse" />}
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {step === 1 ? 'Create Your Account' : 'Check Your Email'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {step === 1
                  ? 'Sign up to receive your secure account activation link'
                  : `We sent an activation link to ${email}`}
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              
              {step === 1 && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 bg-white hover:bg-slate-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Instant Register with Google</span>
                  </button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-mono font-bold tracking-wider">
                      <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500">
                        Or register with email verification link
                      </span>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500 dark:text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500 dark:text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Step 1: Registration Form */}
              {step === 1 && (
                <form onSubmit={handleRegisterAndSendLink} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dhanush Kancharla"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-brand-500 dark:focus:ring-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm outline-none transition-all font-mono shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. kancharladhanush2003@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-brand-500 dark:focus:ring-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm outline-none transition-all font-mono shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                      Organization / University
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Enterprise Research Team"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-brand-500 dark:focus:ring-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm outline-none transition-all font-mono shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-brand-500 dark:focus:ring-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm outline-none transition-all font-mono shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-brand-500 dark:focus:ring-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm outline-none transition-all font-mono shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-shimmer w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4 animate-spin" />
                          <span>Sending Verification Link...</span>
                        </span>
                      ) : (
                        <>
                          <span>Create Account & Send Verification Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Verification Email Dispatched View (Strict Email Link Only) */}
              {step === 2 && (
                <div className="space-y-6 text-center py-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-xl animate-pulse" />
                    <div className="w-full h-full rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-2xl shadow-cyan-500/20">
                      <Mail className="w-12 h-12 animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Verification Link Sent! ✉️
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      We have dispatched a secure account activation link to <strong className="font-mono text-cyan-600 dark:text-cyan-400">{email}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 space-y-2 text-left">
                    <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span>Next Steps to Activate Your Account:</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                      <li>Open your email inbox or check your <strong className="text-slate-700 dark:text-slate-300">Spam/Junk</strong> folder.</li>
                      <li>Click the <strong className="text-slate-700 dark:text-slate-300">"Verify & Activate Account"</strong> button in the email.</li>
                      <li>Your account will be instantly verified and redirected to your workspace.</li>
                    </ol>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shimmer w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/25 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <span>Open Gmail Inbox</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <div className="flex items-center justify-between px-2 pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResendLink}
                        disabled={!canResend || loading}
                        className="flex items-center gap-1.5 text-brand-600 dark:text-cyan-400 hover:underline disabled:text-slate-400 font-semibold transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{canResend ? 'Resend Verification Email' : `Resend in ${resendTimer}s`}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-brand-600 dark:text-cyan-400 font-bold hover:text-brand-500 dark:hover:text-cyan-300 transition-colors"
                >
                  Sign In Here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
