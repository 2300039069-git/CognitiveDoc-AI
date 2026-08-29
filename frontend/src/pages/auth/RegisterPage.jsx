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
  KeyRound,
  RefreshCw,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { auth, googleProvider, signInWithPopup } from '../../services/firebase';
import { authService } from '../../services/authService';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Input details, 2: Enter 6-digit email OTP
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');

  // OTP Verification States
  const [otpCode, setOtpCode] = useState('');
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

  // Step 1: Send 6-Digit OTP to user email
  const handleSendOTP = async (e) => {
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
      await api.post('/auth/send-registration-otp', {
        email: email.trim().toLowerCase(),
        full_name: fullName.trim()
      });

      setStep(2);
      setResendTimer(30);
      setCanResend(false);
      setSuccessMsg(`A 6-digit verification code has been sent directly to ${email}. Please check your email inbox.`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm 6-Digit OTP and Activate Account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-registration-otp', {
        email: email.trim().toLowerCase(),
        code: otpCode.trim(),
        password: password,
        full_name: fullName.trim(),
        organization: organization.trim() || 'Enterprise Team'
      });

      const { access_token, user } = res.data;
      loginWithToken(access_token, user);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired verification code. Please check your email or click Resend.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend || loading) return;
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/send-registration-otp', {
        email: email.trim().toLowerCase(),
        full_name: fullName.trim()
      });

      setResendTimer(30);
      setCanResend(false);
      setSuccessMsg(`A new 6-digit verification code has been sent to ${email}.`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend code.');
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
              {step === 1 ? <Bot className="w-6 h-6 text-white" /> : <KeyRound className="w-6 h-6 text-brand-400" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {step === 1 ? 'Create Your Account' : 'Verify Email Address'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {step === 1
                ? 'Step 1 of 2: Enter details to receive your 6-digit verification code'
                : `Step 2 of 2: Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6 shadow-2xl">
            {step === 1 && (
              <>
                {/* Google 1-Click Fast Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-sm transition-all shadow-lg hover:shadow-brand-500/10"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-950 px-4 text-slate-500 font-semibold tracking-wider">
                      Or verify with email OTP
                    </span>
                  </div>
                </div>
              </>
            )}

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

            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dhanush Kancharla"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white text-xs outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Work / Personal Email
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Organization / University
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Cognitive Enterprise Team"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white text-xs outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white text-xs outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm Password
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
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
                      <span>Send 6-Digit Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndRegister} className="space-y-5">
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
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-brand-500 text-white text-center text-lg tracking-[8px] font-mono outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 text-center">
                    Check your email inbox or spam folder for your 6-digit code.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResend || loading}
                    className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 disabled:text-slate-600 transition-colors font-semibold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>{canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}</span>
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
                      <span>Verifying & Creating Account...</span>
                    </span>
                  ) : (
                    <>
                      <span>Verify Code & Launch Workspace</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-400 font-semibold hover:text-brand-300 transition-colors"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
