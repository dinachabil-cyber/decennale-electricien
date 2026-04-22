import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark py-4 sticky top-0 z-50 shadow-2xl border-b-2 border-yellow-600">
        <div className="container mx-auto px-2">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4 slide-in-left">
              <div className="w-12 h-12 bg-dark/20 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-shield-alt text-2xl text-dark"></i>
              </div>
              <div>
                <div className="hidden lg:block">
                  <h1 className="text-lg font-semibold text-dark">Assurance Décennale Électricien</h1>
                  <p className="text-xs text-dark/80">Devis en quelques clics</p>
                </div>
                <div className="lg:hidden">
                  <h1 className="text-sm font-semibold text-dark">Devis Décennale Électricien</h1>
                  <p className="text-xs text-dark/80">Devis gratuit</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 slide-in-right">
              <div className="p-4 bg-white/40 rounded-2xl icon-bounce shadow-lg">
                <i className="fas fa-phone text-2xl text-dark"></i>
              </div>
              <div>
                <span className="text-sm text-dark/80 block">Conseil personnalisé</span>
                <a href="tel:0182834800" className="text-2xl font-bold text-dark hover:text-primary transition-colors duration-300">
                  01 82 83 48 00</a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
