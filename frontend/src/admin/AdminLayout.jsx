import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/cms';

export default function AdminLayout({ children, activeTab, onTabChange, tabs }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (  <div className="min-h-screen bg-gray-50">
       <nav className="bg-white shadow-sm border-b">
         <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-16 py-4 md:py-0 gap-4">
             <div className="flex items-center space-x-4 md:space-x-8 w-full md:w-auto">
               <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">Admin</h1>
                <div className="flex overflow-x-auto pb-1 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0">
                  <div className="flex space-x-2">
                   {tabs.map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => onTabChange(tab.id)}
                       className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'bg-yellow-400 text-dark' : 'text-gray-600 hover:bg-gray-100'}`}
                     >
                       {tab.label}
                     </button>
                   ))}
                 </div>
               </div>
             </div>
             <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap w-full md:w-auto">
               Déconnexion
             </button>
           </div>
         </div>
       </nav>
       <div className="container mx-auto px-4 py-8">
         {children}
       </div>
     </div>);
}