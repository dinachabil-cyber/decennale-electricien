import React, { useState } from 'react';

export default function CTAEditor({ content, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    subtitle: content?.subtitle || '',
    buttonText: content?.buttonText || '',
    buttonLink: content?.buttonLink || '#contact',
    backgroundColor: content?.backgroundColor || 'yellow'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
          placeholder="Contactez-nous"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
        <textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
          rows={3}
          placeholder="Une question? N'hésitez pas à nous contacter..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton</label>
          <input
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            placeholder="Contactez-nous"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lien du bouton</label>
          <input
            type="text"
            value={formData.buttonLink}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            placeholder="/contact"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur de fond</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="backgroundColor"
              value="yellow"
              checked={formData.backgroundColor === 'yellow'}
              onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
              className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
            />
            <span className="text-sm text-gray-600">Jaune</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="backgroundColor"
              value="dark"
              checked={formData.backgroundColor === 'dark'}
              onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
              className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
            />
            <span className="text-sm text-gray-600">Foncé</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark rounded-xl hover:shadow-lg transition-all font-medium"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
