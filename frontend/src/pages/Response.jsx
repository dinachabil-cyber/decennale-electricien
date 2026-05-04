import React from 'react';

const Response = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden py-20 lg:py-32">
      {/* Animated background orbs */}
      <div className="absolute inset-0 scanlines-bg opacity-30"></div>
      
      <div className="absolute w-96 h-96 bg-yellow-300/25 rounded-full blur-3xl top-20 left-10 animate-float-slow"></div>
      <div className="absolute w-80 h-80 bg-blue-300/20 rounded-full blur-3xl bottom-20 right-10 animate-float-medium" style={{ animationDelay: '-2.5s' }}></div>
      <div className="absolute w-60 h-60 bg-green-300/15 rounded-full blur-2xl top-1/2 left-1/3 animate-float-fast" style={{ animationDelay: '-1.8s' }}></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 transition-all duration-1000 delay-200 opacity-30">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center floating-animation">
          <i className="fas fa-shield-alt text-yellow-600 text-2xl"></i>
        </div>
      </div>
      <div className="absolute top-20 right-20 transition-all duration-1000 delay-400 opacity-25" style={{ animationDelay: '-2s' }}>
        <div className="w-20 h-20 bg-blue-400 rounded-full shadow-lg flex items-center justify-center floating-animation">
          <i className="fas fa-bolt text-blue-500 text-2xl"></i>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/4 transition-all duration-1000 delay-600 opacity-20" style={{ animationDelay: '-4s' }}>
        <div className="w-12 h-12 bg-green-400 rounded-lg shadow-lg flex items-center justify-center floating-animation">
          <i className="fas fa-plug text-green-500 text-lg"></i>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fas fa-check text-white text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-6">Merci !</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Votre demande a été envoyée. Un expert vous contactera rapidement.
          </p>
          <div className="mt-10">
             <a href="/" className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-8 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105 gradient-shine">
               <i className="fas fa-home mr-2"></i> Retour à l'accueil
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Response;
