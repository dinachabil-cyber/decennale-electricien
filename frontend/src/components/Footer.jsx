import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <i className="fas fa-shield-alt mr-2"></i>Aksam Assurance
            </h3>
            <p className="text-dark">
              Entreprise soumise au contrôle de l'ACPR
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mentions-legales" className="text-dark hover:text-primary transition-colors cursor-pointer">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="text-dark hover:text-primary transition-colors cursor-pointer">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-dark">
              <li>10 rue de Penthièvre</li>
              <li>75008 Paris</li>
              <li>01.82.83.48.00</li>
              <li>contact@aksam-assurances.fr</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark/20 mt-8 pt-8 text-center text-dark">
          <p>© 2018 Aksam Assurance. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
