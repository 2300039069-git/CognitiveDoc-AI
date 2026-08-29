import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Cpu,
  FileText,
  MessageSquare,
  FolderKanban,
  BarChart3,
  History,
  Download,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
  ShieldCheck,
  Bell,
  Languages,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelectionModal from '../common/LanguageSelectionModal';
import ThemeToggle from '../common/ThemeToggle';

export default function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { selectedLanguage, openLanguageModal } = useLanguage();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Document', path: '/upload', icon: Upload },
    { name: 'AI Processing', path: '/process', icon: Cpu },
    { name: 'Summary Result', path: '/summary', icon: FileText },
    { name: 'AI Chat (RAG Q&A)', path: '/chat', icon: MessageSquare },
    { name: 'Document Library', path: '/library', icon: FolderKanban },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'History', path: '/history', icon: History },
    { name: 'Downloads', path: '/downloads', icon: Download },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/summary') return location.pathname.startsWith('/summary');
    if (path === '/chat') return location.pathname.startsWith('/chat');
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar (Desktop Persistent & Mobile Slide-in Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${
          mobileMenuOpen
            ? 'translate-x-0 w-64 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-md shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-500 dark:text-brand-400" />
              </div>
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight truncate">
                CognitiveDoc<span className="text-brand-500 dark:text-brand-400">.AI</span>
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/70'
                }`}
                title={collapsed && !mobileMenuOpen ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 min-w-[20px] ${active ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400'}`} />
                {(!collapsed || mobileMenuOpen) && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
          {isAdmin && (!collapsed || mobileMenuOpen) && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Switch to Admin Portal
            </Link>
          )}

          <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 min-w-[32px] rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              {(!collapsed || mobileMenuOpen) && (
                <div className="overflow-hidden text-left">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.full_name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              )}
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
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
        <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-colors duration-200">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Public Website
            </Link>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">/</span>
            <span className="text-xs sm:text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider truncate">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            {/* Multilingual Language Switcher Button */}
            <button
              onClick={openLanguageModal}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-brand-500/50 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all shadow-sm group"
              title="Click to switch AI language"
            >
              <span className="text-base leading-none">{selectedLanguage?.flag || '🌐'}</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold font-sans text-xs">{selectedLanguage?.native || 'English'}</span>
              <span className="hidden lg:inline text-slate-500 dark:text-slate-400 font-medium text-[11px]">({selectedLanguage?.name})</span>
              <Languages className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition-colors hidden sm:inline" />
            </button>

            <Link
              to="/upload"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-md shadow-brand-600/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono">Multi-Tier AI</span>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Multilingual Modal */}
      <LanguageSelectionModal />
    </div>
  );
}
