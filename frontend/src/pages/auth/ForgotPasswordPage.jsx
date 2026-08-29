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
  Send,
  Shield
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
      setVerificationCode('');
      setSuccessMsg(`A 6-digit verification code has been sent directly to ${email.trim()}. Please check your email inbox.`);
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
      const res = await authService.resetPassword(email, verificationCode, newPassword);
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
              {step === 'completed' && "Your password has been successfully updated"}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6 shadow-2xl">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 min-w-[16px] mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: REQUEST CODE */}
            {step === 'request' && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-amber-400 font-semibold">Notice:</span> A 6-digit password reset code will be dispatched directly to your registered email address.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25"
                >
                  {loading ? (
                    <span>Sending Code to Email...</span>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP to Email</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: ENTER CODE & NEW PASSWORD */}
            {step === 'verify_and_reset' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-brand-300">
                    <Mail className="w-4 h-4 text-brand-400" />
                    <span>Check Your Email Inbox</span>
                  </div>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    A 6-digit password reset code was sent directly to <strong className="text-white font-mono">{email}</strong>. Please check your inbox and enter the code below.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center block">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[8px] font-mono text-2xl font-bold py-3 bg-slate-950/90 border-2 border-brand-500/50 rounded-xl text-white focus:outline-none focus:border-brand-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">New Password (Min 6 chars)</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full py-3 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Verifying & Updating Password...</span>
                    ) : (
                      <>
                        <span>Confirm Code & Reset Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => { setStep('request'); setError(''); setSuccessMsg(''); }}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Email Address</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: COMPLETED */}
            {step === 'completed' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white">Password Updated Successfully!</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your account password for <strong className="text-brand-400">{email}</strong> has been reset. You can now log in with your new credentials.
                </p>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom Links */}
            <div className="pt-2 text-center border-t border-slate-800/80">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
