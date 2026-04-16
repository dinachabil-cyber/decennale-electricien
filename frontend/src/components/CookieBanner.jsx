import React, { useState, useEffect } from 'react';

function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (document.cookie.indexOf('aksamPerformance') < 0) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    document.cookie = 'aksamPerformance=1; path=/; expires=' + expiryDate.toGMTString();
    setShowBanner(false);
  };

  const rejectCookies = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 bg-surface p-6 rounded-2xl shadow-2xl z-50 max-w-md mx-auto border border-primary/20">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-yellow-100 rounded-xl">
          <i className="fas fa-cookie-bite text-yellow-500 text-xl"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-dark mb-2">Cookies et confidentialité</h4>
          <p className="text-sm text-gray-600 mb-4">www.assurance-decennale-electricien.fr utilise des cookies pour vous offrir le meilleur service.</p>
          <div className="flex space-x-2">
            <button onClick={acceptCookies} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-md">
              <i className="fas fa-check mr-1"></i>J'accepte
            </button>
            <button onClick={rejectCookies} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm transition-all hover:bg-gray-300">
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;