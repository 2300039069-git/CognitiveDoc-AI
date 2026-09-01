import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Bot,
  RefreshCw,
  Mail,
  Zap,
  Lock,
  Cpu
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error' | 'no_token'
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!token) {
      setStatus('no_token');
      return;
    }

    let isMounted = true;

    const verifyToken = async () => {
      try {
        // Minimum visual delay so user enjoys the sleek verification experience
        const [res] = await Promise.all([
          authService.verifyEmailToken(token.trim()),
          new Promise((resolve) => setTimeout(resolve, 1400))
        ]);

        if (isMounted) {
          loginWithToken(res.access_token, res.user);
          setVerifiedUser(res.user);
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(
            err.response?.data?.detail ||
              'This verification link is invalid, expired, or has already been used. Please register again.'
          );
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token, loginWithToken]);

  // Automatic redirect on success
  useEffect(() => {
    let timer = null;
    if (status === 'success') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (verifiedUser?.role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/dashboard');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, verifiedUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative overflow-hidden transition-colors duration-200">
      
      {/* Dynamic Cyber Auroras */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[550px] aurora-orb-cyan blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] aurora-orb-purple blur-[140px] pointer-events-none -z-10" />

      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-lg space-y-6">
          
          {/* Main Card */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-white/10 shadow-2xl space-y-6 text-center backdrop-blur-2xl">
            
            {/* 1. VERIFYING STATE */}
            {status === 'verifying' && (
              <div className="space-y-6 py-4">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-cyan-500/30 shadow-xl shadow-cyan-500/20">
                    <ShieldCheck className="w-10 h-10 text-brand-600 dark:text-cyan-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>Cryptographic Verification</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Activating Your Account
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Validating secure digital signature and provisioning your private vector workspace...
                  </p>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-cyan-500 via-brand-500 to-indigo-500 h-full rounded-full animate-pulse w-3/4 mx-auto" />
                </div>
              </div>
            )}

            {/* 2. SUCCESS STATE */}
            {status === 'success' && (
              <div className="space-y-6 py-2">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                  <div className="w-full h-full rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xl shadow-emerald-500/30">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Email Successfully Verified</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Welcome to CognitiveDoc AI! 🚀
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Hello <strong className="text-slate-900 dark:text-slate-200">{verifiedUser?.full_name}</strong>, your account (<span className="font-mono text-cyan-600 dark:text-cyan-400">{verifiedUser?.email}</span>) is now fully active in MongoDB Atlas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Redirecting to Workspace:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {countdown}s
                  </span>
                </div>

                <Link
                  to={verifiedUser?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="btn-shimmer w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 hover:from-cyan-500 hover:to-brand-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/25 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Launch Workspace Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* 3. ERROR OR EXPIRED STATE */}
            {status === 'error' && (
              <div className="space-y-6 py-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xl shadow-rose-500/20">
                  <AlertCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold uppercase tracking-wider">
                    <span>Verification Failed</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Invalid or Expired Link
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    {errorMessage}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/register"
                    className="btn-shimmer flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all"
                  >
                    <span>Register New Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all"
                  >
                    <span>Go to Sign In</span>
                  </Link>
                </div>
              </div>
            )}

            {/* 4. NO TOKEN STATE */}
            {status === 'no_token' && (
              <div className="space-y-6 py-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xl shadow-amber-500/20">
                  <Mail className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    No Verification Token Found
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Please open the verification link sent directly to your registered email address.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
            CognitiveDoc AI Enterprise Multi-Tenant &bull; Secured with 256-bit AES
          </p>
        </div>
      </div>
    </div>
  );
}
