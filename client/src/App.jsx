import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} /> {/* Default to login */}

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
