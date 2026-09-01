import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { authService } from '../../services/authService';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [pageState, setPageState] = useState('validating'); // 'validating' | 'ready' | 'invalid' | 'completed'
  const [targetEmail, setTargetEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      setErrorMessage('No password reset token was provided in the link. Please request a new link.');
      return;
    }

    let isMounted = true;

    const validateToken = async () => {
      try {
        const res = await authService.verifyResetToken(token.trim());
        if (isMounted) {
          setTargetEmail(res.email || '');
          setPageState('ready');
        }
      } catch (err) {
        if (isMounted) {
          setPageState('invalid');
          setErrorMessage(
            err.response?.data?.detail ||
              'This password reset link is invalid, expired, or has already been used. Please request a fresh reset link.'
          );
        }
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(newPassword);

  const strengthLabels = ['Weak', 'Fair', 'Strong', 'Cyber-Armor'];
  const strengthColors = [
    'bg-rose-500 text-rose-500',
    'bg-amber-500 text-amber-500',
    'bg-cyan-500 text-cyan-500',
    'bg-emerald-500 text-emerald-500'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (newPassword.length < 6) {
      setSubmitError('Password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    try {
      await authService.confirmResetPassword(token.trim(), newPassword);
      setPageState('completed');
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail ||
          'Failed to update password. This link may have expired. Please request a new link.'
      );
    } finally {
      setSubmitting(false);
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
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-600 via-brand-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-brand-600 dark:text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {pageState === 'completed' ? 'Password Updated!' : 'Set New Password'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {pageState === 'ready' && targetEmail && (
                <span>
                  Updating account for <strong className="font-mono text-cyan-600 dark:text-cyan-400">{targetEmail}</strong>
                </span>
              )}
              {pageState === 'validating' && 'Verifying secure password reset signature...'}
              {pageState === 'invalid' && 'Reset Link Issue'}
              {pageState === 'completed' && 'Your database credentials have been updated.'}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-2xl space-y-6 backdrop-blur-2xl">
            
            {/* 1. VALIDATING TOKEN */}
            {pageState === 'validating' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
                  Authenticating reset token...
                </p>
              </div>
            )}

            {/* 2. READY TO RESET FORM */}
            {pageState === 'ready' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white text-xs outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-500 dark:text-slate-400">Strength:</span>
                        <span className={`font-bold ${strengthColors[strengthScore - 1]?.split(' ')[1] || 'text-slate-500'}`}>
                          {strengthScore > 0 ? strengthLabels[strengthScore - 1] : 'Too Short'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-full rounded-full transition-all duration-300 ${
                              strengthScore >= level
                                ? strengthColors[strengthScore - 1]?.split(' ')[0]
                                : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white text-xs outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword && newPassword === confirmPassword && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passwords match perfectly</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 hover:from-cyan-500 hover:to-brand-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Updating Database Password...</span>
                    </span>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 3. COMPLETED STATE */}
            {pageState === 'completed' && (
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Password Updated Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your password hash has been updated in MongoDB Atlas. You can now log into your account with your new credentials.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 hover:from-cyan-500 hover:to-brand-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/25 transition-all"
                >
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* 4. INVALID / EXPIRED STATE */}
            {pageState === 'invalid' && (
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xl shadow-rose-500/20">
                  <ShieldAlert className="w-10 h-10" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Link Expired or Invalid
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {errorMessage}
                  </p>
                </div>

                <Link
                  to="/forgot-password"
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all"
                >
                  <span>Request New Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Remembered your credentials?{' '}
            <Link
              to="/login"
              className="text-brand-600 dark:text-cyan-400 font-bold hover:underline"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
