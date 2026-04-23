import React, { useState } from 'react';

export default function StepsSectionEditor({ content, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    subtitle: content?.subtitle || '',
    steps: content?.steps || [{ number: '', title: '', description: '' }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { number: '', title: '', description: '' }]
    }));
  };

  const updateStep = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Titre de la section"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Sous-titre optionnel"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Étapes</label>
          <button
            type="button"
            onClick={addStep}
            className="px-3 py-1 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 text-sm font-medium"
          >
            + Ajouter une étape
          </button>
        </div>

        <div className="space-y-3">
          {formData.steps.map((step, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Numéro</label>
                  <input
                    type="text"
                    value={step.number}
                    onChange={(e) => updateStep(index, 'number', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-center"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Titre</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Titre de l'étape"
                  />
                </div>
                <div className="col-span-6">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Description de l'étape"
                  />
                </div>
                <div className="col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="w-full px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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