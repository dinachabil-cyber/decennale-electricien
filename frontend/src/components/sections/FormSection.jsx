import React, { useState } from 'react';

export default function FormSection({ content }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!content) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Message envoyé !</h3>
            <p className="text-green-700">Nous vous contacterons bientôt.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {content.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-center text-dark mb-4">
                {content.title}
              </h2>
            )}

            {content.description && (
              <p className="text-gray-600 text-center mb-8">
                {content.description}
              </p>
            )}

             <form onSubmit={handleSubmit} className="space-y-6">
               {content.fields
                 ?.filter(field => field.visible !== false) // Only show visible fields
                 .map((field, index) => (
                   <div key={index}>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       {field.label} {field.required && <span className="text-red-500">*</span>}
                     </label>

                     {field.type === 'textarea' ? (
                       <textarea
                         value={formData[field.name] || ''}
                         onChange={(e) => handleFieldChange(field.name, e.target.value)}
                         required={field.required && field.visible !== false} // Only required if visible
                         rows={4}
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                         placeholder={`Votre ${field.label.toLowerCase()}`}
                       />
                     ) : (
                       <input
                         type={field.type || 'text'}
                         value={formData[field.name] || ''}
                         onChange={(e) => handleFieldChange(field.name, e.target.value)}
                         required={field.required && field.visible !== false} // Only required if visible
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                         placeholder={`Votre ${field.label.toLowerCase()}`}
                       />
                     )}
                   </div>
                 ))}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-dark font-bold py-4 px-8 rounded-xl transition-colors duration-200"
                >
                  {loading ? 'Envoi...' : (content.submitText || 'Envoyer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}