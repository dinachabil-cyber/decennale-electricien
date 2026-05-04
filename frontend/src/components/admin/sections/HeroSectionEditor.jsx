import React, { useState, useEffect } from 'react';
import { getAllFields, getFormSteps, FORM_CONFIG } from '../../../config/formConfig';
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
        <nav className="flex overflow-x-auto -mx-4 px-4 scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
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
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
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

{/* Form Configuration Tab - CONTROLLED: visibility + editable label/placeholder */}
        {activeTab === 'form' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Configuration du formulaire</h3>
              <span className="text-sm text-gray-500">
                Champs fixes
              </span>
            </div>

            {/* Use local formConfig state - editable with working visibility toggle */}
            <div className="space-y-4">
              {formConfig.steps.map((field, index) => (
                <div key={field.key} className={`border rounded-lg p-4 ${field.visible ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Étape {index + 1}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {field.key}
                      </span>
                    </div>
                    {/* Visibility Toggle - WORKS via local state */}
                    <button
                      type="button"
                      onClick={() => {
                        // Toggle visibility in local state - immediately effective
                        setFormConfig(prev => ({
                          ...prev,
                          steps: prev.steps.map(s => s.key === field.key ? { ...s, visible: !s.visible } : s)
                        }));
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        field.visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}
                      title={field.visible ? 'Masquer le champ' : 'Afficher le champ'}
                    >
                      <i className={`fas ${field.visible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const newLabel = e.target.value;
                          setFormConfig(prev => ({
                            ...prev,
                            steps: prev.steps.map(s => s.key === field.key ? { ...s, label: newLabel } : s)
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => {
                          const newPlaceholder = e.target.value;
                          setFormConfig(prev => ({
                            ...prev,
                            steps: prev.steps.map(s => s.key === field.key ? { ...s, placeholder: newPlaceholder } : s)
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Votre réponse..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          setFormConfig(prev => ({
                            ...prev,
                            steps: prev.steps.map(s => s.key === field.key ? { ...s, required: e.target.checked } : s)
                          }));
                        }}
                        className="w-4 h-4 text-yellow-500 rounded"
                      />
                      <span className="text-sm text-gray-700">Obligatoire</span>
                    </label>

                    <span className={`text-sm ${field.visible ? 'text-green-600' : 'text-gray-400'}`}>
                      {field.visible ? '✓ Visible' : '✗ Masqué'}
                    </span>
                  </div>
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