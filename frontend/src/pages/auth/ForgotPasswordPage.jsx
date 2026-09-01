import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Zap,
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { authService } from '../../services/authService';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Mode: 'link' (send email reset link) | 'direct' (instant reset on-screen)
  const [mode, setMode] = useState('link');
  const [linkSent, setLinkSent] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Resend Countdown
  useEffect(() => {
    let interval = null;
    if (linkSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [linkSent, resendTimer]);

  // Method 1: Send Password Reset Link to Email
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await authService.forgotPasswordLink(email.trim().toLowerCase());
      setLinkSent(true);
      setResendTimer(30);
      setCanResend(false);
      setSuccessMsg(`A password reset link has been dispatched to ${email.trim()}.`);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Unable to dispatch reset link. Please check your email or use Instant Reset.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend Link
  const handleResendLink = async () => {
    if (!canResend || loading) return;
    setError('');
    setLoading(true);

    try {
      await authService.forgotPasswordLink(email.trim().toLowerCase());
      setResendTimer(30);
      setCanResend(false);
      setSuccessMsg(`A fresh password reset link has been sent to ${email.trim()}.`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend link.');
    } finally {
      setLoading(false);
    }
  };

  // Method 2: Instant Direct Password Reset On-Screen
  const handleDirectReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.directResetPassword(email.trim().toLowerCase(), newPassword);
      setSuccessMsg(res.message || 'Password successfully updated in database!');
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative overflow-hidden transition-colors duration-200">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[500px] aurora-orb-cyan blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] aurora-orb-purple blur-[140px] pointer-events-none -z-10" />

      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[22px] flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-brand-600 dark:text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Reset Account Password
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {linkSent
                ? 'Check your email for the password reset link'
                : completed
                ? 'Your password has been updated'
                : 'Enter your email to receive a secure password reset link'}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 space-y-6 shadow-2xl backdrop-blur-2xl">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Mode Switcher */}
            {!linkSent && !completed && (
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setMode('link'); setError(''); }}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'link'
                      ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-600 dark:to-brand-600 text-brand-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Reset Link ✉️</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('direct'); setError(''); }}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'direct'
                      ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-600 dark:to-brand-600 text-brand-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Direct Reset ⚡</span>
                </button>
              </div>
            )}

            {/* View 1: Send Reset Link Form */}
            {!linkSent && !completed && mode === 'link' && (
              <form onSubmit={handleSendResetLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white text-xs outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 hover:from-cyan-500 hover:to-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Dispatching Reset Link...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send Password Reset Link</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* View 2: Reset Link Dispatched Confirmation */}
            {linkSent && !completed && (
              <div className="space-y-5 text-center py-2">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-xl animate-pulse" />
                  <div className="w-full h-full rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-2xl shadow-cyan-500/20">
                    <Mail className="w-10 h-10 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Reset Link Dispatched! ✉️
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    We dispatched a secure password reset link to <strong className="font-mono text-cyan-600 dark:text-cyan-400">{email}</strong>. Open the link to set your new password in the database.
                  </p>
                </div>

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

                  <div className="flex items-center justify-between px-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setLinkSent(false)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResendLink}
                      disabled={!canResend || loading}
                      className="flex items-center gap-1.5 text-brand-600 dark:text-cyan-400 hover:underline disabled:text-slate-400 font-semibold transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>{canResend ? 'Resend Email' : `Resend in ${resendTimer}s`}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Direct Reset Form */}
            {!linkSent && !completed && mode === 'direct' && (
              <form onSubmit={handleDirectReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white text-xs outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white text-xs outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white text-xs outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 hover:from-cyan-500 hover:to-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Updating Password in Database...</span>
                    </span>
                  ) : (
                    <>
                      <span>Reset Password Directly</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* View 4: Completed Screen */}
            {completed && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/15">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Password Updated Successfully!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your new password has been stored in MongoDB Atlas database. You can now log in immediately.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 hover:from-cyan-500 hover:to-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all"
                >
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-brand-600 dark:text-cyan-400 font-bold hover:underline transition-colors"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
