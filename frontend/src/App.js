import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieBanner from './components/CookieBanner';
import DynamicPage from './pages/DynamicPage';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import { authApi } from './api/cms';
import './index.css';

function ProtectedAdminRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const result = await authApi.verify();
      if (!result) {
        navigate('/login');
      } else {
        setIsValid(true);
      }
    }
    checkAuth();
  }, [navigate]);

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Vérification...</div>
      </div>
    );
  }

  return isValid ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<DynamicPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/:slug" element={<DynamicPage />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
}