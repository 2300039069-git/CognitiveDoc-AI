import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
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
  Sparkles
} from 'lucide-react';
import { authService } from '../../services/authService';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Reset Mode: 'direct' (instant reset) | 'otp' (6-digit email OTP)
  const [resetMode, setResetMode] = useState('direct');
  // Workflow step for OTP mode: 'request' | 'verify'
  const [otpStep, setOtpStep] = useState('request');
  const [completed, setCompleted] = useState(false);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Method 1: Instant Direct Password Reset
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

  // Method 2 (Step 1): Request 6-digit verification code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setVerificationCode('');
      setSuccessMsg(`A 6-digit verification code has been dispatched directly to ${email.trim()}. Please check your email inbox.`);
      setOtpStep('verify');
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Unable to send verification code. You can use 'Instant Direct Reset' above.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Method 2 (Step 2): Submit 6-digit code and new password
  const handleResetWithCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode || verificationCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code received in your email.');
      return;
    }

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
      const res = await authService.resetPassword(email.trim().toLowerCase(), verificationCode.trim(), newPassword);
      setSuccessMsg(res.message || 'Password successfully updated!');
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired verification code. Please check your email or use Instant Reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[22px] flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-brand-600 dark:text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reset Account Password</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {completed
                ? "Password updated! You can now log in."
                : "Update your CognitiveDoc password directly and securely"}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 space-y-6 shadow-2xl">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            {!completed && (
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setResetMode('direct'); setError(''); }}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    resetMode === 'direct'
                      ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-600 dark:to-brand-600 text-brand-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instant Direct Reset</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setResetMode('otp'); setOtpStep('request'); setError(''); }}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    resetMode === 'otp'
                      ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-600 dark:to-brand-600 text-brand-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reset via Email OTP</span>
                </button>
              </div>
            )}

            {/* Form 1: Instant Direct Reset */}
            {!completed && resetMode === 'direct' && (
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

            {/* Form 2: OTP Request Step */}
            {!completed && resetMode === 'otp' && otpStep === 'request' && (
              <form onSubmit={handleRequestCode} className="space-y-4">
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
                      <span>Sending 6-Digit OTP...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send 6-Digit Verification Code</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Form 2: OTP Verification & Reset Step */}
            {!completed && resetMode === 'otp' && otpStep === 'verify' && (
              <form onSubmit={handleResetWithCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Enter 6-Digit Email Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-500 text-slate-900 dark:text-white text-center text-lg tracking-[8px] font-mono outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Password
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

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpStep('request')}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email / Resend</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetMode('direct')}
                    className="text-xs text-brand-600 dark:text-cyan-400 hover:underline font-bold"
                  >
                    Use Instant Reset Instead ⚡
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Verifying & Updating...</span>
                    </span>
                  ) : (
                    <>
                      <span>Verify Code & Reset Password</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Completed Screen */}
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
