import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Files,
  Cpu,
  BarChart3,
  MessageSquareHeart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowLeft,
  Activity,
  Bot,
  Menu,
  X,
  Database,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Document Moderation', path: '/admin/documents', icon: Files },
    { name: 'AI Engine Monitoring', path: '/admin/ai-monitoring', icon: Cpu },
    { name: 'Admin Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'User Feedback', path: '/admin/feedback', icon: MessageSquareHeart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black relative overflow-hidden font-sans transition-colors duration-200">
      
      {/* Background ambient gold/amber mesh */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-[500px] h-[400px] bg-amber-500/10 blur-[160px] pointer-events-none -z-10" />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-md z-40 md:hidden transition-opacity"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border-r border-amber-500/30 dark:border-amber-500/20 transition-all duration-300 flex flex-col shadow-xl dark:shadow-2xl ${
          mobileMenuOpen
            ? 'translate-x-0 w-64 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-amber-500/30 dark:border-amber-500/20 flex items-center justify-between px-4 bg-amber-500/[0.06] dark:bg-amber-500/[0.04]">
          <Link
            to="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 p-[1.5px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight block">
                  Mission Control
                </span>
                <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono tracking-widest uppercase font-bold">Master Admin</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  active
                    ? 'bg-amber-500/15 dark:bg-gradient-to-r dark:from-amber-500/20 dark:to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.05]'
                }`}
                title={collapsed && !mobileMenuOpen ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 min-w-[16px] transition-colors ${active ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300'}`} />
                {(!collapsed || mobileMenuOpen) && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Switcher & Profile */}
        <div className="p-3 border-t border-amber-500/30 dark:border-amber-500/20 bg-slate-100/70 dark:bg-slate-950/60 space-y-2">
          {(!collapsed || mobileMenuOpen) && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to User Studio</span>
            </Link>
          )}

          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 min-w-[32px] rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black uppercase shadow-md shadow-amber-500/20">
                👑
              </div>
              {(!collapsed || mobileMenuOpen) && (
                <div className="overflow-hidden text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.full_name || 'Admin'}</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono uppercase tracking-widest font-bold">Super Administrator</p>
                </div>
              )}
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-amber-500/30 dark:border-amber-500/20 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-amber-500/30 bg-white dark:bg-white/[0.04] text-amber-600 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-white/10 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm">
              Admin Zone
            </span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate font-mono">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono shadow-sm">
              <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">MongoDB Atlas</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
