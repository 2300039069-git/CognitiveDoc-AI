import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Mail, Lock, ArrowRight, AlertCircle, Shield, Eye, EyeOff, Sparkles, CheckCircle2, Cpu, Database, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { auth, googleProvider, signInWithPopup } from '../../services/firebase';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const syncData = await authService.firebaseSync({
        email: fbUser.email,
        full_name: fbUser.displayName || 'Google Verified User',
        organization: 'Enterprise Team',
        firebase_uid: fbUser.uid
      });
      loginWithToken(syncData.access_token, syncData.user);
      if (syncData.user.role === 'admin' && from === '/dashboard') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Google sign-in encountered an issue. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email.trim().toLowerCase(), password.trim());
      if (user.role === 'admin' && from === '/dashboard') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email address or password. Please verify your credentials or register a new account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative overflow-hidden transition-colors duration-200">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[500px] aurora-orb-cyan blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] aurora-orb-purple blur-[140px] pointer-events-none -z-10" />

      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Cyber Showcase Feature Card (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 rounded-3xl bg-white/90 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-950/90 border border-slate-200/90 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-2xl space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Workspace Access</span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                Welcome back to <span className="text-gradient-cyan">CognitiveDoc AI Studio</span>
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Log in to resume zero-latency document analysis, grounded RAG semantic retrieval, and audio text-to-speech briefings.
              </p>

              {/* Feature Highlights list */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-brand-600 dark:text-cyan-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span>Local Hugging Face & FAISS Vector Inference</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <span>MongoDB Atlas Cloud Persistent Synchronized Storage</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span>Air-Gapped Privacy with Zero Third-Party Egress</span>
                </div>
              </div>
            </div>

            {/* Micro Live Telemetry Status Box */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>System Status</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Operational</span>
            </div>
          </div>

          {/* Right Column: High-Spec Login Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2 lg:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-brand-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center lg:mx-0 mx-auto">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-brand-600 dark:text-cyan-400" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Sign In to Your Workspace</h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Enter your credentials to access your autonomous workspace
              </p>
            </div>

            {/* Login Form Panel */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 min-w-[16px] mt-0.5 text-rose-500 dark:text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google 1-Tap Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 bg-white hover:bg-slate-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-cyan-500/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono font-bold tracking-widest">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500">Or use email login</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kancharladhanush2003@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-brand-500 dark:focus:ring-cyan-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
                    <Link to="/forgot-password" className="text-xs text-brand-600 dark:text-cyan-400 hover:text-brand-500 dark:hover:text-cyan-300 font-semibold">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-brand-500 dark:focus:ring-cyan-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white hover:from-cyan-500 hover:to-brand-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 animate-spin" />
                      <span>Authenticating Workspace...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
                New user?{' '}
                <Link to="/register" className="text-brand-600 dark:text-cyan-400 font-bold hover:text-brand-500 dark:hover:text-cyan-300">
                  Create a free account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
