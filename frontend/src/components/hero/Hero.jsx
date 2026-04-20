import React, { useState } from 'react';
import { submitQuote } from '../../services/api';

function Hero({ onSuccess }) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    tele: '',
    entreprise: '',
    statut: '',
    chiffreAffaires: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitQuote(formData);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden">

      <div className="absolute inset-0 scanlines-bg opacity-30"></div>

      {/* decorative icons */}
      <div className="absolute top-10 left-10 floating-animation">
        <i className="fas fa-shield-alt text-yellow-500 text-6xl opacity-30"></i>
      </div>

      <div className="absolute bottom-10 right-10 floating-animation" style={{ animationDelay: '-2s' }}>
        <i className="fas fa-bolt text-yellow-500 text-8xl opacity-25"></i>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center">

          {/* FORM */}
          <div className="w-full lg:flex-1 order-1 lg:order-2">

            <div className="bg-surface rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">

              {/* HEADER */}
              <div className="text-center mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-400 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <i className="fas fa-calculator text-xl md:text-2xl text-dark"></i>
                </div>

                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gradient mb-3 md:mb-4 px-2">
                  Complétez ce formulaire pour obtenir un tarif
                </h2>

                <div className="w-16 md:w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>

              {success ? (
                <div className="text-center py-8 md:py-12">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <i className="fas fa-check text-white text-xl md:text-2xl"></i>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-dark mb-2">Merci !</h2>
                  <p className="text-gray-600 text-sm md:text-base px-2">
                    Votre demande a été envoyée. Un expert vous contactera rapidement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">

                  {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* ENTREPRISE */}
                  <div className="flex w-full min-w-0">
                    <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
                      <i className="fas fa-building text-yellow-500"></i>
                    </span>
                    <input
                      type="text"
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleChange}
                      placeholder="Entreprise / Nom"
                      className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>

                  {/* NOM + STATUT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex w-full min-w-0">
                      <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
                        <i className="fas fa-user text-yellow-500"></i>
                      </span>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Votre Nom *"
                        required
                        className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>

                    {/* STATUT FIXED */}
                    <div className="flex w-full min-w-0">
                      <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
                        <i className="fas fa-briefcase text-yellow-500"></i>
                      </span>
                      <select
                        name="statut"
                        value={formData.statut}
                        onChange={handleChange}
                        className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      >
                        <option value="">Statut *</option>
                        <option value="auto-entrepreneur">Auto-entrepreneur</option>
                        <option value="ei">Entreprise Individuelle</option>
                        <option value="eurl">EURL</option>
                        <option value="sarl">SARL</option>
                        <option value="sas">SAS</option>
                      </select>
                    </div>

                  </div>

                  {/* TELEPHONE + EMAIL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex w-full min-w-0">
                      <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
                        <i className="fas fa-phone text-yellow-500"></i>
                      </span>
                      <input
                        type="tel"
                        name="tele"
                        value={formData.tele}
                        onChange={handleChange}
                        placeholder="Téléphone *"
                        required
                        className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>

                    {/* EMAIL FIXED */}
                    <div className="flex w-full min-w-0">
                      <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
                        <i className="fas fa-envelope text-yellow-500"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email *"
                        required
                        className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      />
                    </div>

                  </div>

                  {/* CHIFFRE D'AFFAIRES */}
                  <div className="flex w-full min-w-0">
                    <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
                      <i className="fas fa-euro-sign text-yellow-500"></i>
                    </span>
                    <select
                      name="chiffreAffaires"
                      value={formData.chiffreAffaires}
                      onChange={handleChange}
                      className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    >
                      <option value="">Chiffre d'affaires</option>
                      <option value="0-30k">Moins de 30 000€</option>
                      <option value="30-60k">30 000€ - 60 000€</option>
                      <option value="60-100k">60 000€ - 100 000€</option>
                      <option value="100k+">Plus de 100 000€</option>
                    </select>
                  </div>

                  {/* CHECKBOX */}
                  <div className="flex items-start gap-3 p-4 md:p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5" />
                    <span className="text-xs md:text-sm text-gray-600">
                      En cliquant sur "Obtenir mon devis", vous acceptez d'être contacté.
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-6 rounded-xl"
                  >
                    {loading ? "Traitement..." : "Obtenir mon devis"}
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* IMAGE */}
  <div className="w-full lg:flex-1 order-2 lg:order-1">
  <div className="w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/5] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
    <img
      src="/images/img.png"
      alt="Assurance Décennale Électricien"
      className="w-full h-full object-cover"
    />
  </div>
</div>

        </div>
      </div>
    </section>
  );
}

export default Hero;