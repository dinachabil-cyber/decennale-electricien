import React from 'react';
import { Link } from 'react-router-dom';

function MentionsLegales() {
  return (
    <>
      <section className="py-8 lg:py-6 bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 scanlines-bg opacity-30"></div>
        <div className="absolute top-5 left-5 floating-animation">
          <i className="fas fa-gavel text-yellow-600 text-4xl opacity-30"></i>
        </div>
        <div className="absolute bottom-5 right-5 floating-animation" style={{ animationDelay: '-2s' }}>
          <i className="fas fa-balance-scale text-yellow-700 text-5xl opacity-25"></i>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-file-contract text-2xl text-dark"></i>
            </div>
            <h1 className="text-4xl lg:text-3xl font-bold text-gradient mb-4">Mentions légales</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in">
              <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-10 mb-16 border border-primary/10">
                <div className="flex items-start space-x-4">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <i className="fas fa-info-circle text-3xl text-gradient"></i>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-dark mb-6">Conditions juridiques</h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      En envoyant un courrier électronique à la société ou en accédant et/ou utilisant le Site Internet www.assurance-decennale-electricien.fr, chaque personne physique (ci-après « l'Utilisateur ») déclare et garantit qu'elle a pris préalablement connaissances des présentes conditions juridiques, c'est-à-dire des informations légales, des règles applicables à la protection des données à caractère personnelles et des conditions d'utilisation et qu'elle en accepte les termes et conditions sans réserve, modification ou restriction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-20">
                <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                      <i className="fas fa-building text-white text-2xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gradient mb-4">Éditeur</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Le site www.assurance-decennale-electricien.fr est édité par la société
                        <strong> AKSAM ASSURANCES</strong> SARL AU au capital de 10.000 €
                      </p>
                      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li><strong>Siège social :</strong> 10 Rue de Penthièvre 75008 Paris</li>
                          <li><strong>SIRET :</strong> 84065346300033</li>
                          <li><strong>R.C.S Paris :</strong> 840 653 463</li>
                          <li><strong>ORIAS :</strong> 180 074 24</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                      <i className="fas fa-server text-white text-2xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gradient mb-4">Hébergeur</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Le présent Site est hébergé par la société NAMECHEAP.
                      </p>
                      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                        <p className="text-sm text-gray-600">
                          <strong>Adresse :</strong> 4600 E Washington St suite 305, Phoenix, AZ 85034.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-20">
                <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                      <i className="fas fa-shield-alt text-white text-2xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gradient mb-4">Protection des données personnelles</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Les informations personnelles recueillies font l'objet d'un traitement automatisé conformément à la loi française n° 78-17 du 6 janvier 1978.
                      </p>
                      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                        <p className="text-sm text-gray-600">
                          <strong>Contact :</strong> AKSAM ASSURANCES<br />
                          10 Rue de Penthièvre 75008 Paris<br />
                          Email: contact@aksam-assurances.fr
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                      <i className="fas fa-cookie-bite text-white text-2xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gradient mb-4">Utilisation des cookies</h3>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        Nous utilisons des cookies pour améliorer votre expérience sur notre site. Les cookies nous aident à analyser le trafic et à optimiser notre site web.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-12 text-dark text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-scanlines opacity-10"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-dark/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <i className="fas fa-home text-3xl text-dark"></i>
                  </div>
                  <h2 className="text-4xl font-bold mb-6 text-dark">Retour à l'accueil</h2>
                  <p className="text-xl mb-8 text-dark/90 max-w-3xl mx-auto leading-relaxed">
                    Découvrez nos offres d'assurance décennale électricien et obtenez votre devis personnalisé en quelques clics.
                  </p>
                  <Link to="/" className="inline-block bg-dark text-yellow-400 font-bold py-4 px-10 rounded-2xl hover:bg-primary transition-all transform hover:scale-105 shadow-2xl cursor-pointer">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MentionsLegales;
