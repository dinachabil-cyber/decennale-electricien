import React, { useState, useEffect } from 'react';
import { getFormSteps, FORM_CONFIG } from '../../../config/formConfig';
import { getSectionConfig } from '../../../config/sectionConfig';

export default function HeroSectionEditor({ content, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('content');

  // Hero content state - merge content with defaults
  const [heroData, setHeroData] = useState(() => {
    const defaults = getSectionConfig('hero')?.defaultContent || {
      title: 'Bienvenue',
      subtitle: 'Votre sous-titre ici',
      ctaText: 'Contactez-nous',
      ctaLink: '/contact',
      backgroundImage: '',
      showForm: true
    };
    return {
      title: content?.title ?? defaults.title,
      subtitle: content?.subtitle ?? defaults.subtitle,
      ctaText: content?.ctaText ?? defaults.ctaText,
      ctaLink: content?.ctaLink ?? defaults.ctaLink,
      backgroundImage: content?.backgroundImage ?? defaults.backgroundImage,
      showForm: content?.showForm ?? defaults.showForm
    };
  });

  // Form configuration state - always initialize with defaults
  const [formConfig, setFormConfig] = useState(() => {
    const defaultSteps = getFormSteps();
    const defaultOptions = {
      LEGAL_STATUSES: FORM_CONFIG.LEGAL_STATUSES,
      REVENUE_OPTIONS: FORM_CONFIG.REVENUE_OPTIONS
    };

    return {
      steps: content?.formConfig?.steps || defaultSteps,
      options: content?.formConfig?.options || defaultOptions
    };
  });

  // Update state when content prop changes
  useEffect(() => {
    const defaults = getSectionConfig('hero')?.defaultContent || {
      title: 'Bienvenue',
      subtitle: 'Votre sous-titre ici',
      ctaText: 'Contactez-nous',
      ctaLink: '/contact',
      backgroundImage: '',
      showForm: true
    };
    setHeroData({
      title: content?.title ?? defaults.title,
      subtitle: content?.subtitle ?? defaults.subtitle,
      ctaText: content?.ctaText ?? defaults.ctaText,
      ctaLink: content?.ctaLink ?? defaults.ctaLink,
      backgroundImage: content?.backgroundImage ?? defaults.backgroundImage,
      showForm: content?.showForm ?? defaults.showForm
    });

    setFormConfig(prev => ({
      ...prev,
      steps: content?.formConfig?.steps || getFormSteps(),
      options: content?.formConfig?.options || {
        LEGAL_STATUSES: FORM_CONFIG.LEGAL_STATUSES,
        REVENUE_OPTIONS: FORM_CONFIG.REVENUE_OPTIONS
      }
    }));
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure we have the latest data
    const combinedData = {
      ...heroData,
      formConfig: formConfig
    };

    // Debug: Log the data being submitted
    console.group('🚀 Hero Section Submit');
    console.log('heroData:', heroData);
    console.log('formConfig:', formConfig);
    console.log('combinedData:', combinedData);
    console.groupEnd();

    onSave(combinedData);
  };

  // Form builder functions
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
    <div className="space-y-6">


      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contenu Hero
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
 
 
 
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'form'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Configuration Formulaire
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Hero Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <input
                  type="checkbox"
                  checked={heroData.showForm}
                  onChange={(e) => setHeroData({ ...heroData, showForm: e.target.checked })}
                  className="w-4 h-4 text-yellow-500 rounded"
                />
                Afficher le formulaire
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Bienvenue sur notre site"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
              <textarea
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                rows={3}
                placeholder="Description de votre entreprise..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={heroData.ctaText}
                  onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Contactez-nous"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien du bouton</label>
                <input
                  type="text"
                  value={heroData.ctaLink}
                  onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="/contact"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image de fond (URL)</label>
              <input
                type="text"
                value={heroData.backgroundImage}
                onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="/images/hero-bg.jpg"
              />
            </div>
          </div>
        )}

        {/* Form Configuration Tab */}
        {activeTab === 'form' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Configuration du formulaire</h3>
              <button
                type="button"
                onClick={addField}
                className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 font-medium"
              >
                + Ajouter un champ
              </button>
            </div>

            <div className="space-y-4">
              {formConfig.steps.map((field, index) => (
                <div key={field.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Étape {index + 1}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => index > 0 && moveField(index, index - 1)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => index < formConfig.steps.length - 1 && moveField(index, index + 1)}
                          disabled={index === formConfig.steps.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <i className="fas fa-chevron-down"></i>
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-3 gap-4 mt-4">
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
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-6 border-t">
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
    </div>
  );
}