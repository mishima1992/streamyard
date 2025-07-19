import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import VideosPage from './pages/VideosPage';
import SSOLoginPage from './pages/SSOLoginPage';
import LogoutPage from './pages.LogoutPage';
import ProfilePage from './pages/ProfilePage';

const TermsPage = () => <div className="p-8"><h1>Terms of Service</h1><p>Content to be added later.</p></div>;
const PrivacyPage = () => <div className="p-8"><h1>Privacy Policy</h1><p>Content to be added later.</p></div>;

const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/logout" element={<LogoutPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const MainRoutes = () => (
  <Routes>
    <Route path="/sso-login" element={<SSOLoginPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes>
);

function App() {
  const hostname = window.location.hostname;
  const authDomain = import.meta.env.VITE_AUTH_DOMAIN;
  
  const AppRoutes = () => {
    if (hostname === authDomain) {
      return <AuthRoutes />;
    }
    return <MainRoutes />;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
