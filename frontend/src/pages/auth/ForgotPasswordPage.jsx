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
  Send
} from 'lucide-react';
import { authService } from '../../services/authService';
import { auth, sendPasswordResetEmail } from '../../services/firebase';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Workflow State: 'request' | 'verify_and_reset' | 'completed'
  const [step, setStep] = useState('request');

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request 6-digit verification code & official Firebase reset link
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Dispatch Firebase password reset email directly through Google
      try {
        await sendPasswordResetEmail(auth, email.trim());
      } catch (fbErr) {
        console.log('Firebase password reset dispatch note:', fbErr);
      }

      // 2. Dispatch 6-digit OTP code through backend
      const res = await authService.forgotPassword(email.trim());
      if (res.code) {
        setVerificationCode(String(res.code));
        setSuccessMsg(`Verification code: ${res.code} (Auto-filled for instant password reset)`);
      } else {
        setVerificationCode('');
        setSuccessMsg(`A 6-digit verification code has been dispatched to ${email.trim()}. Please check your email inbox.`);
      }
      setStep('verify_and_reset');
    } catch (err) {
      setError(err.response?.data?.detail || "No account found registered with this email address.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit 6-digit code and new password
  const handleResetPassword = async (e) => {
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
      setSuccessMsg(res.message || 'Password successfully updated.');
      setStep('completed');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/20 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Reset Account Password</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {step === 'request' && "Enter your email to receive a 6-digit verification code"}
              {step === 'verify_and_reset' && `Enter the 6-digit code sent to ${email} and your new password`}
              {step === 'completed' && "Password successfully updated!"}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6 shadow-2xl">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {step === 'request' && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white text-xs outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Sending Verification Code...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send 6-Digit Code</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'verify_and_reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Enter 6-Digit Email Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 text-white text-center text-lg tracking-[8px] font-mono outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white text-xs outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white text-xs outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
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

            {step === 'completed' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Password Updated!</h3>
                  <p className="text-xs text-slate-400">
                    Your password has been successfully reset. You can now log in with your new credentials.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all"
                >
                  <span>Sign In Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-400">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-brand-400 font-semibold hover:text-brand-300 transition-colors"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
