import React, { useState } from 'react';
import { submitQuote } from '../../services/api';

function Hero({ onSuccess }) {
  const handleSubmitSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

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
      handleSubmitSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden">
      <div className="absolute inset-0 scanlines-bg opacity-30"></div>
        <div className="absolute top-10 left-10 floating-animation">
          <i className="fas fa-shield-alt text-yellow-500 text-6xl opacity-30"></i>
        </div>
      <div className="absolute bottom-10 right-10 floating-animation" style={{ animationDelay: '-2s' }}>
        <i className="fas fa-bolt text-yellow-500 text-8xl opacity-25"></i>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="slide-in-left">
            <div className="relative">
              <div className="w-full h-[500px] lg:h-[600px] bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 scanlines-bg opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/images/img.png" alt="Assurance Décennale Électricien" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="lg:hidden mt-6">
                <img src="/images/img.png" alt="Assurance Décennale Électricien" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>

          <div className="slide-in-right">
            <div className="bg-surface rounded-3xl shadow-2xl p-8 card-hover border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-calculator text-2xl text-dark"></i>
                </div>
                <h2 className="text-3xl font-bold text-gradient mb-4">Complétez ce formulaire pour obtenir un tarif</h2>
                <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check text-white text-2xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-dark mb-2">Merci !</h2>
                  <p className="text-gray-600">Votre demande a été envoyée. Un expert vous contactera rapidement.</p>
                </div>
              ) : (
                <form id="contactForm" onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="form-group">
                      <div className="input-group flex">
                        <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                        <i className="fas fa-building text-yellow-500"></i>
                      </span>
                      <input
                        type="text"
                        name="entreprise"
                        value={formData.entreprise}
                        onChange={handleChange}
                        placeholder="Entreprise / Nom"
                        className="flex-1 px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:bg-surface transition-all duration-300 form-input"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <div className="input-group flex">
                        <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                          <i className="fas fa-user text-yellow-500"></i>
                        </span>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          placeholder="Votre Nom *"
                          className="flex-1 px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:bg-surface transition-all duration-300 form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-group flex">
                        <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                          <i className="fas fa-briefcase text-yellow-500"></i>
                        </span>
                        <select
                          name="statut"
                          value={formData.statut}
                          onChange={handleChange}
                          className="flex-1 px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:bg-surface transition-all duration-300 form-input"
                          required
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
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <div className="input-group flex">
                        <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                          <i className="fas fa-phone text-yellow-500"></i>
                        </span>
                        <input
                          type="tel"
                          name="tele"
                          value={formData.tele}
                          onChange={handleChange}
                          placeholder="Téléphone *"
                          className="flex-1 px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:bg-surface transition-all duration-300 form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-group flex">
                        <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                          <i className="fas fa-envelope text-yellow-500"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email *"
                          className="flex-1 px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:bg-surface transition-all duration-300 form-input"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-group flex">
                      <span className="inline-flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                        <i className="fas fa-euro-sign text-yellow-500"></i>
                      </span>
                        <select
                          name="chiffreAffaires"
                          value={formData.chiffreAffaires}
                          onChange={handleChange}
                          className="flex-1 px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:bg-surface transition-all duration-300 form-input"
                        >
                          <option value="">Chiffre d'affaires</option>
                          <option value="0-30k">Moins de 30 000€</option>
                          <option value="30-60k">30 000€ - 60 000€</option>
                          <option value="60-100k">60 000€ - 100 000€</option>
                          <option value="100k+">Plus de 100 000€</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
                      <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 text-yellow-500 rounded focus:ring-2 focus:ring-yellow-500 border-2 border-yellow-300" />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        En cliquant sur "Obtenir mon devis", vous acceptez d'être contacté par nos experts en assurance professionnelle.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-modern w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-8 rounded-xl pulse-animation"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>Traitement en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-calculator mr-2"></i>Obtenir mon devis
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
