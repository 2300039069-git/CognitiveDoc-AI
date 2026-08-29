import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import IndustriesPage from './pages/public/IndustriesPage';
import FeaturesPage from './pages/public/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import TechStackPage from './pages/public/TechStackPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// User Portal Pages
import UserDashboard from './pages/user/UserDashboard';
import UploadDocument from './pages/user/UploadDocument';
import AIProcessing from './pages/user/AIProcessing';
import SummaryResult from './pages/user/SummaryResult';
import AIChat from './pages/user/AIChat';
import DocumentLibrary from './pages/user/DocumentLibrary';
import UserAnalytics from './pages/user/UserAnalytics';
import HistoryPage from './pages/user/HistoryPage';
import DownloadsPage from './pages/user/DownloadsPage';
import UserProfile from './pages/user/UserProfile';
import UserSettings from './pages/user/UserSettings';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DocumentManagement from './pages/admin/DocumentManagement';
import AIMonitoring from './pages/admin/AIMonitoring';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import FeedbackReview from './pages/admin/FeedbackReview';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/tech-stack" element={<TechStackPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* 2. Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* 3. Protected User Portal Routes */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/process" element={<AIProcessing />} />
          <Route path="/summary" element={<SummaryResult />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/library" element={<DocumentLibrary />} />
          <Route path="/analytics" element={<UserAnalytics />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<UserSettings />} />
        </Route>

        {/* 4. Protected Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="documents" element={<DocumentManagement />} />
          <Route path="ai-monitoring" element={<AIMonitoring />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="feedback" element={<FeedbackReview />} />
        </Route>

        {/* Catch-all Wildcard Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
