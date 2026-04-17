import React, { useState } from 'react';

export default function FeaturesSectionEditor({ content, onSave, onCancel }) {
  const [faqs, setFaqs] = useState(
    content?.faqs || [{ question: '', answer: '' }]
  );

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ faqs });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">Questions/Réponses (FAQ)</h4>
        <button
          type="button"
          onClick={addFaq}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Ajouter une question
        </button>
      </div>

      {faqs.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
            {faqs.length > 1 && (
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Question</label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="La question?"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Réponse</label>
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="La réponse..."
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 font-medium"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}