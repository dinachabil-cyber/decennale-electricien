import React, { useState } from 'react';

export default function ContentSectionEditor({ content, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    introduction: content?.introduction || '',
    sections: content?.sections || [{ title: '', content: '' }],
    ctaText: content?.ctaText || '',
    ctaLink: content?.ctaLink || '/contact'
  });

  const addSection = () => {
    setFormData({ ...formData, sections: [...formData.sections, { title: '', content: '' }] });
  };

  const removeSection = (index) => {
    setFormData({ ...formData, sections: formData.sections.filter((_, i) => i !== index) });
  };

  const updateSection = (index, field, value) => {
    const updated = [...formData.sections];
    updated[index][field] = value;
    setFormData({ ...formData, sections: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la section</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Mon titre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lien CTA</label>
          <input
            type="text"
            value={formData.ctaLink}
            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="/contact"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
        <textarea
          value={formData.introduction}
          onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          rows={2}
          placeholder="Texte d'introduction..."
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">Blocs de contenu</h4>
        <button
          type="button"
          onClick={addSection}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Ajouter un bloc
        </button>
      </div>

      {formData.sections.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-gray-600">Bloc {index + 1}</span>
            {formData.sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Titre</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Titre du bloc"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Contenu</label>
              <textarea
                value={section.content}
                onChange={(e) => updateSection(index, 'content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={4}
                placeholder="Contenu (séparez les paragraphes par des lignes vides)..."
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