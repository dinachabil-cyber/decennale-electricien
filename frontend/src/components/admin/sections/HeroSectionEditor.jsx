import React, { useState, useEffect } from 'react';
import { getFormSteps, FORM_CONFIG } from '../../../config/formConfig';
import { getSectionConfig } from '../../../config/sectionConfig';

// Extract actual hero data from potentially wrapped section object
function extractHeroData(input) {
  if (!input) return {};

  // If it's a string, try to parse
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input);
    } catch (e) {
      console.error('Failed to parse hero content string', e);
      return {};
    }
  }

  // If the input looks like a full section object (has id/type/position/isEnabled and a nested 'content'), extract it
  if (input && typeof input === 'object') {
    if ('id' in input && 'type' in input && 'content' in input && 'position' in input && 'isEnabled' in input) {
      console.log('🔍 Detected full section object, extracting inner content');
      return input.content || {};
    }
  }

  return input;
}

// Normalize legacy hero content to new format
function normalizeHeroContent(content) {
  // First extract the actual hero data if wrapped in section object
  const extracted = extractHeroData(content);
  console.log('✅ Extracted hero data:', extracted);

  if (!extracted || typeof extracted !== 'object') return {};

  const normalized = { ...extracted };

  // Map old field names to new ones (only if target not already set)
  if (normalized.formTitle && !normalized.title) {
    normalized.title = normalized.formTitle;
  }
  if (normalized.buttonText && !normalized.ctaText) {
    normalized.ctaText = normalized.buttonText;
  }
  if (normalized.image && !normalized.backgroundImage) {
    normalized.backgroundImage = normalized.image;
  }

  // Ensure required fields have non-empty defaults
  if (!normalized.ctaText || typeof normalized.ctaText !== 'string' || normalized.ctaText.trim() === '') {
    normalized.ctaText = 'Contactez-nous';
  }
  if (!normalized.ctaLink || typeof normalized.ctaLink !== 'string' || normalized.ctaLink.trim() === '') {
    normalized.ctaLink = '/contact';
  }
  if (!normalized.title || typeof normalized.title !== 'string' || normalized.title.trim() === '') {
    normalized.title = 'Bienvenue';
  }
  if (typeof normalized.showForm === 'undefined') {
    normalized.showForm = true;
  }
  if (!normalized.formConfig) {
    normalized.formConfig = {
      steps: getFormSteps(),
      options: {
        LEGAL_STATUSES: FORM_CONFIG.LEGAL_STATUSES,
        REVENUE_OPTIONS: FORM_CONFIG.REVENUE_OPTIONS
      }
    };
  }

  return normalized;
}

export default function HeroSectionEditor({ content, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('content');

  // Debug: Log incoming content prop
  console.log('🏗️ HeroSectionEditor mounted/updated with raw content:', content);

  // Normalize content (handle legacy formats)
  const normalizedContent = normalizeHeroContent(content);
  console.log('✅ Normalized content:', normalizedContent);

  // Get defaults
  const heroDefaults = getSectionConfig('hero')?.defaultContent || {
    title: 'Bienvenue',
    subtitle: 'Votre sous-titre ici',
    ctaText: 'Contactez-nous',
    ctaLink: '/contact',
    backgroundImage: '',
    showForm: true
  };

  // Hero content state - merge normalized content with defaults
  const [heroData, setHeroData] = useState(() => {
    console.log('🎯 Initializing heroData with normalizedContent:', normalizedContent);
    return {
      title: normalizedContent?.title ?? heroDefaults.title,
      subtitle: normalizedContent?.subtitle ?? heroDefaults.subtitle,
      ctaText: normalizedContent?.ctaText ?? heroDefaults.ctaText,
      ctaLink: normalizedContent?.ctaLink ?? heroDefaults.ctaLink,
      backgroundImage: normalizedContent?.backgroundImage ?? heroDefaults.backgroundImage,
      showForm: normalizedContent?.showForm ?? heroDefaults.showForm
    };
  });

  // Form configuration state - always initialize with defaults based on normalized content
  const [formConfig, setFormConfig] = useState(() => {
    const normalized = normalizeHeroContent(content);
    const defaultSteps = getFormSteps();
    const defaultOptions = {
      LEGAL_STATUSES: FORM_CONFIG.LEGAL_STATUSES,
      REVENUE_OPTIONS: FORM_CONFIG.REVENUE_OPTIONS
    };

    return {
      steps: normalized?.formConfig?.steps || defaultSteps,
      options: normalized?.formConfig?.options || defaultOptions
    };
  });

  // Update state when content prop changes
  useEffect(() => {
    const normalized = normalizeHeroContent(content);
    const defaults = getSectionConfig('hero')?.defaultContent || {
      title: 'Bienvenue',
      subtitle: 'Votre sous-titre ici',
      ctaText: 'Contactez-nous',
      ctaLink: '/contact',
      backgroundImage: '',
      showForm: true
    };
    setHeroData({
      title: normalized?.title ?? defaults.title,
      subtitle: normalized?.subtitle ?? defaults.subtitle,
      ctaText: normalized?.ctaText ?? defaults.ctaText,
      ctaLink: normalized?.ctaLink ?? defaults.ctaLink,
      backgroundImage: normalized?.backgroundImage ?? defaults.backgroundImage,
      showForm: normalized?.showForm ?? defaults.showForm
    });

    setFormConfig(prev => ({
      ...prev,
      steps: normalized?.formConfig?.steps || getFormSteps(),
      options: normalized?.formConfig?.options || {
        LEGAL_STATUSES: FORM_CONFIG.LEGAL_STATUSES,
        REVENUE_OPTIONS: FORM_CONFIG.REVENUE_OPTIONS
      }
    }));
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the hero content object
    const heroContent = {
      ...heroData,
      formConfig: formConfig
    };

    // Keep formTitle in sync with title for backward compatibility with frontend
    if (heroData.title) {
      heroContent.formTitle = heroData.title;
    }

    // Debug: Log the data being submitted
    console.group('🚀 Hero Section Submit');
    console.log('heroData:', heroData);
    console.log('formConfig steps count:', formConfig?.steps?.length);
    console.log('formConfig steps:', formConfig?.steps?.map(s => s.key));
    console.log('heroContent:', heroContent);
    console.groupEnd();

    onSave(heroContent);
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