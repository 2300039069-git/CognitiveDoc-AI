import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Shield, Menu, X, ArrowRight, LayoutDashboard, ShieldCheck, LogOut, Cpu, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Industries', path: '/industries' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Tech Stack', path: '/tech-stack' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl sm:rounded-full transition-all duration-500 ${
          scrolled
            ? 'bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/50'
            : 'bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.07] shadow-md shadow-slate-900/5 dark:shadow-lg dark:shadow-black/20'
        }`}>
          
          {/* Ambient Glow behind Navbar */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-brand-500/10 to-indigo-500/10 blur-xl pointer-events-none -z-10" />

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-brand-500 to-indigo-600 p-[1.5px] shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-600 dark:text-cyan-400 group-hover:text-brand-500 transition-colors" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors">
                  CognitiveDoc<span className="text-brand-600 dark:text-cyan-400">.AI</span>
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 uppercase tracking-widest">
                  v2.0
                </span>
              </div>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                Autonomous Intelligence Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-white/[0.03] p-1 rounded-full border border-slate-200/80 dark:border-white/[0.06]">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    active
                      ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth & Utility Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="btn-shimmer flex items-center gap-2 px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500 transition-all shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-95"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Workspace</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl sm:rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl sm:rounded-full border border-slate-200 dark:border-white/10 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                  title="Sign Out / Lock Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.08] dark:border-white/[0.08] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold bg-gradient-to-r from-cyan-600 via-brand-600 to-indigo-600 dark:from-cyan-500 dark:via-brand-600 dark:to-indigo-600 text-white hover:shadow-cyan-500/30 transition-all shadow-lg shadow-brand-600/30 hover:scale-[1.03] active:scale-95"
                >
                  <span>Launch Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto px-4 mt-2">
          <div className="glass-panel rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-xs">
                    <span className="text-slate-600 dark:text-slate-400">User: <strong className="text-slate-900 dark:text-white">{user?.full_name || 'User'}</strong></span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/30 uppercase">
                      {user?.role || 'user'}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Open Workspace Studio
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Mission Control (Admin)
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out / Lock Session
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-brand-600 dark:from-cyan-500 dark:to-brand-600 text-white hover:from-cyan-500 hover:to-brand-500 shadow-md shadow-cyan-500/20 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
