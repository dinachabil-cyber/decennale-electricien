import React from 'react';
import { Link } from 'react-router-dom';

function PolitiqueConfidentialite() {
  return (
    <>
      <section className="py-8 lg:py-6 bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 scanlines-bg opacity-30"></div>
        <div className="absolute top-5 left-5 floating-animation">
          <i className="fas fa-shield-alt text-yellow-600 text-4xl opacity-30"></i>
        </div>
        <div className="absolute bottom-5 right-5 floating-animation" style={{ animationDelay: '-2s' }}>
          <i className="fas fa-user-secret text-yellow-700 text-5xl opacity-25"></i>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-shield-alt text-2xl text-dark"></i>
            </div>
            <h1 className="text-4xl lg:text-3xl font-bold text-gradient mb-4">Politique de confidentialité</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">1. Collecte des données</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous collectons les données personnelles que vous nous fournissez via notre formulaire de devis, notamment : votre nom, adresse email, numéro de téléphone, nom de votre entreprise et statut juridique.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">2. Utilisation des données</h2>
                <p className="text-gray-700 leading-relaxed">
                  Les données collectées sont utilisées exclusivement pour :
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
                  <li>Vous contacter pour établir un devis d'assurance décennale</li>
                  <li>Analyser votre profil professionnel</li>
                  <li>Comparer les offres d'assurance adaptées à votre activité</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">3. Conservation des données</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vos données personnelles sont conservées pour une durée de 3 ans à compter de notre dernier contact, conformément à la réglementation en vigueur.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">4. Vos droits</h2>
                <p className="text-gray-700 leading-relaxed">
                  Conformément à la loi française n°78-17 du 6 janvier 1978 modifiée et au RGPD, vous disposez des droits d'accès, de rectification, d'effacement et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à : contact@aksam-assurances.fr
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">5. Sécurité</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/" className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all">
                <i className="fas fa-arrow-left mr-2"></i>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PolitiqueConfidentialite;
