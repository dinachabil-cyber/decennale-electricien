import React, { useState, useEffect } from 'react';

export default function FormBuilderEditor({ content, onSave, onCancel }) {
  const [formConfig, setFormConfig] = useState({
    steps: content?.steps || [
      {
        key: 'nom',
        title: 'Nom',
        label: 'Quel est votre nom ?',
        type: 'input',
        required: true,
        placeholder: 'Votre Nom *',
        icon: 'fa-user',
        autoFocus: true,
        validation: { required: true }
      }
    ],
    options: content?.options || {
      LEGAL_STATUSES: [
        { value: 'auto-entrepreneur', label: 'Auto-entrepreneur', icon: 'fa-user' }
      ],
      REVENUE_OPTIONS: [
        { value: '0-30k', label: "Moins de 30,000€" }
      ]
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formConfig);
  };

  const addField = () => {
    const newField = {
      key: `field_${Date.now()}`,
      title: 'Nouveau champ',
      label: 'Nouvelle question ?',
      type: 'input',
      required: false,
      placeholder: 'Votre réponse',
      icon: 'fa-question',
      validation: { required: false }
    };

    setFormConfig(prev => ({
      ...prev,
      steps: [...prev.steps, newField]
    }));
  };

  const updateField = (index, updates) => {
    setFormConfig(prev => ({
      ...prev,
      steps: prev.steps.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (index) => {
    setFormConfig(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const moveField = (fromIndex, toIndex) => {
    const newSteps = [...formConfig.steps];
    const [moved] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, moved);

    setFormConfig(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Configuration du formulaire</h3>
      </div>

      <div className="space-y-4">
        {formConfig.steps.map((field, index) => (
          <div key={field.key} className="border border-gray-200 rounded-lg p-4">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-gray-500">Étape {index + 1}</span>
               </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clé du champ
                </label>
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => updateField(index, { key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="nom_du_champ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre (progression)
                </label>
                <input
                  type="text"
                  value={field.title}
                  onChange={(e) => updateField(index, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Nom"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Quelle est votre question ?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="input">Texte</option>
                  <option value="select">Sélection</option>
                  <option value="email">Email</option>
                  <option value="tel">Téléphone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône
                </label>
                <input
                  type="text"
                  value={field.icon}
                  onChange={(e) => updateField(index, { icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="fa-user"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={field.placeholder}
                  onChange={(e) => updateField(index, { placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Votre réponse"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                  className="w-4 h-4 text-yellow-500 rounded"
                />
                <span className="text-sm text-gray-700">Champ obligatoire</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.autoFocus}
                  onChange={(e) => updateField(index, { autoFocus: e.target.checked })}
                  className="w-4 h-4 text-yellow-500 rounded"
                />
                <span className="text-sm text-gray-700">Focus automatique</span>
              </label>
            </div>

            {field.type === 'select' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options de sélection
                </label>
                <select
                  value={field.options || ''}
                  onChange={(e) => updateField(index, { options: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Sélectionner une liste d'options</option>
                  <option value="LEGAL_STATUSES">Statuts juridiques</option>
                  <option value="REVENUE_OPTIONS">Tranches de revenu</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
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
          Enregistrer la configuration
        </button>
      </div>
    </form>
  );
}