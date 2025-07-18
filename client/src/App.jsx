import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage'; // Import the new page

// Placeholder pages for legal documents
const TermsPage = () => <div className="p-8"><h1>Terms of Service</h1><p>Content to be added later.</p></div>;
const PrivacyPage = () => <div className="p-8"><h1>Privacy Policy</h1><p>Content to be added later.</p></div>;

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/" element={<LoginPage />} />

          {/* Private Routes */}
          <Route path='/dashboard' element={<PrivateRoute />}>
            <Route path='/dashboard' element={<DashboardPage />}/>
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
