import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import CookieBanner from './components/CookieBanner';
import DynamicPage from './pages/DynamicPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/layout/Footer';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Login from './pages/Login';
import { verifyToken, logout } from './api/cms';
import './index.css';

function ProtectedAdminRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const result = await verifyToken();
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

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<DynamicPage slug="home" />} />
            <Route path="/page/:slug" element={<DynamicPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
