import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/cms';

export default function AdminLayout({ children, activeTab, onTabChange, tabs }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">Admin</h1>
              <div className="flex space-x-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-3 py-2 rounded text-sm font-medium ${activeTab === tab.id ? 'bg-yellow-400 text-dark' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}