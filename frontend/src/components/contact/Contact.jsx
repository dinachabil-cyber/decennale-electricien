import React, { useState } from 'react';
import { submitQuote } from '../../services/api';

function Contact({ content }) {
  const {
    title = 'Contactez-nous',
    subtitle = 'Une question? N\'hésitez pas à nous contacter.',
    buttonText = 'Envoyer'
  } = content || {};

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    tele: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitQuote(formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-dark mb-2">Merci !</h2>
              <p className="text-gray-600">Votre message a été envoyé.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom *"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-light focus:bg-surface"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Votre email *"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-light focus:bg-surface"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="tele"
                  value={formData.tele}
                  onChange={handleChange}
                  placeholder="Téléphone *"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-light focus:bg-surface"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-light focus:bg-surface"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-dark font-bold py-4 px-8 rounded-xl hover:bg-yellow-500"
              >
                {loading ? 'Envoi...' : buttonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;