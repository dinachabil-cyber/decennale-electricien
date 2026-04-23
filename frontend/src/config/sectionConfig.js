// Unified section configuration system
// This centralizes all section definitions, editors, and rendering logic

import React from 'react';
import { FORM_SCHEMA } from './formSchema';

// Dynamic imports for section editors (lazy load for better performance)
const getSectionEditorImport = (type) => {
  const editorMap = {
    hero: () => import('../components/admin/sections/HeroSectionEditor'),
    content: () => import('../components/admin/sections/ContentSectionEditor'),
    faq: () => import('../components/admin/sections/FAQSectionEditor'),
    cards: () => import('../components/admin/sections/CardsSectionEditor'),
    cta: () => import('../components/admin/sections/CTAEditor'),
    form: () => import('../components/admin/sections/FormSectionEditor'),
    steps: () => import('../components/admin/sections/StepsSectionEditor'),
    footer: () => import('../components/admin/sections/FooterSectionEditor'),
  };
  return editorMap[type];
};

// Dynamic imports for section renderers (lazy load for better performance)
const getSectionRendererImport = (type) => {
  const rendererMap = {
    hero: () => import('../components/Hero'),
    content: () => import('../components/sections/ContentSection'),
    faq: () => import('../components/sections/FAQSection'),
    cards: () => import('../components/sections/CardsSection'),
    cta: () => import('../components/sections/CTASection'),
    form: () => import('../components/sections/FormSection'),
    steps: () => import('../components/sections/StepsSection'),
    footer: () => import('../components/sections/FooterSection'),
  };
  return rendererMap[type];
};

// Section configuration
export const SECTION_CONFIG = {
  hero: {
    label: 'Hero',
    icon: '🟣',
    description: 'Section principale avec formulaire multi-étapes',
    category: 'content',
    editor: 'hero',
    renderer: 'hero',
     defaultContent: {
       title: 'Bienvenue',
       subtitle: 'Votre sous-titre ici',
       ctaText: 'Contactez-nous',
       ctaLink: '/contact',
       backgroundImage: '',
       showForm: true,
       formConfig: FORM_SCHEMA
     },
    validation: {
      title: { required: true, minLength: 3 },
      subtitle: { required: false },
      ctaText: { required: true },
      ctaLink: { required: true }, // Allow any non-empty link (including #, /, or full URLs)
    }
  },

  content: {
    label: 'Contenu',
    icon: '📝',
    description: 'Section de contenu avec titre et paragraphes',
    category: 'content',
    editor: 'content',
    renderer: 'content',
    defaultContent: {
      title: '',
      introduction: '',
      sections: [{ title: '', content: '' }],
      ctaText: '',
      ctaLink: '',
    },
    validation: {
      title: { required: true },
      sections: { required: true, minItems: 1 },
    }
  },

  faq: {
    label: 'FAQ',
    icon: '❓',
    description: 'Section de questions fréquemment posées',
    category: 'content',
    editor: 'faq',
    renderer: 'faq',
    defaultContent: {
      title: 'Questions Fréquentes',
      subtitle: 'Trouvez rapidement les réponses à vos questions',
      items: [
        { question: 'Question 1?', answer: 'Réponse 1...' },
        { question: 'Question 2?', answer: 'Réponse 2...' },
      ],
    },
    validation: {
      items: { required: true, minItems: 1 },
    }
  },

  cards: {
    label: 'Cartes',
    icon: '🃏',
    description: 'Section avec cartes informatives',
    category: 'features',
    editor: 'cards',
    renderer: 'cards',
    defaultContent: {
      title: 'Nos Services',
      subtitle: 'Découvrez ce que nous proposons',
      cards: [
        {
          title: 'Service 1',
          subtitle: 'Description courte',
          bulletPoints: ['Avantage 1', 'Avantage 2'],
          buttonText: 'En savoir plus',
          buttonLink: '#contact',
          icon: 'star'
        }
      ]
    },
    validation: {
      title: { required: true },
      cards: { required: true, minItems: 1 },
    }
  },

  cta: {
    label: 'CTA',
    icon: '🎯',
    description: 'Section d\'appel à l\'action',
    category: 'conversion',
    editor: 'cta',
    renderer: 'cta',
    defaultContent: {
      title: 'Prêt à commencer?',
      subtitle: 'Contactez-nous dès aujourd\'hui',
      buttonText: 'Contactez-nous',
      buttonLink: '/contact',
      backgroundColor: 'yellow',
    },
    validation: {
      title: { required: true },
      buttonText: { required: true },
      buttonLink: { required: true },
    }
  },

  form: {
    label: 'Formulaire',
    icon: '📋',
    description: 'Formulaire de contact personnalisé',
    category: 'interaction',
    editor: 'form',
    renderer: 'form',
    defaultContent: {
      title: 'Contactez-nous',
      description: 'Remplissez ce formulaire',
      submitText: 'Envoyer',
      email: '',
      fields: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    },
    validation: {
      title: { required: true },
      fields: { required: true, minItems: 1 },
    }
  },

   formBuilder: {
     label: 'Constructeur de formulaire',
     icon: '🔧',
     description: 'Créer et modifier des formulaires multi-étapes',
     category: 'interaction',
     editor: 'formBuilder',
     renderer: 'form',
     defaultContent: {
       // Start with a minimal form that can be expanded in the editor
       steps: [
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
       options: FORM_SCHEMA.options
     },
     validation: {
       steps: { required: true, minItems: 1 }
     }
   },

  steps: {
    label: 'Étapes',
    icon: '🔢',
    description: 'Processus en étapes',
    category: 'content',
    editor: 'steps',
    renderer: 'steps',
    defaultContent: {
      title: 'Notre Processus',
      steps: [
        { number: '1', title: 'Étape 1', description: 'Description...' },
        { number: '2', title: 'Étape 2', description: 'Description...' },
      ],
    },
    validation: {
      steps: { required: true, minItems: 1 },
    }
  },

  footer: {
    label: 'Footer',
    icon: '🦶',
    description: 'Section de pied de page',
    category: 'structure',
    editor: 'footer',
    renderer: 'footer',
    defaultContent: {
      text: '© 2024 Votre Entreprise',
      links: [
        { label: 'Mentions légales', url: '/legal' },
        { label: 'Contact', url: '/contact' },
      ],
    },
    validation: {
      text: { required: true },
    }
  },
};

// Helper functions
export function getSectionTypes() {
  return Object.keys(SECTION_CONFIG);
}

export function getSectionConfig(type) {
  return SECTION_CONFIG[type] || null;
}

export function getSectionLabel(type) {
  return SECTION_CONFIG[type]?.label || type;
}

export function getSectionIcon(type) {
  return SECTION_CONFIG[type]?.icon || '📄';
}

export function getSectionDescription(type) {
  return SECTION_CONFIG[type]?.description || '';
}

export function getSectionCategory(type) {
  return SECTION_CONFIG[type]?.category || 'other';
}

export function getDefaultContent(type) {
  return JSON.parse(JSON.stringify(SECTION_CONFIG[type]?.defaultContent || {}));
}

export function getSectionValidation(type) {
  return SECTION_CONFIG[type]?.validation || {};
}

// Dynamic component loading
export async function loadSectionEditor(type) {
  const config = getSectionConfig(type);
  if (!config?.editor) {
    throw new Error(`No editor configured for section type: ${type}`);
  }

  const importFn = getSectionEditorImport(config.editor);
  if (!importFn) {
    throw new Error(`No editor import function found for type: ${config.editor}`);
  }

  const module = await importFn();
  return module.default;
}

export async function loadSectionRenderer(type) {
  const config = getSectionConfig(type);
  if (!config?.renderer) {
    throw new Error(`No renderer configured for section type: ${type}`);
  }

  const importFn = getSectionRendererImport(config.renderer);
  if (!importFn) {
    throw new Error(`No renderer import function found for type: ${config.renderer}`);
  }

  const module = await importFn();
  return module.default;
}

// Validation helpers
export function validateSection(type, content) {
  const validationRules = getSectionValidation(type);
  const errors = {};

  // Debug logging
  console.log('Validating section:', type, 'with content:', content);

  Object.entries(validationRules).forEach(([field, rules]) => {
    const value = content[field];
    console.log(`Validating field ${field}:`, value, 'rules:', rules);

    if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
      errors[field] = 'Ce champ est obligatoire';
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = `Minimum ${rules.minLength} caractères requis`;
    }

    if (rules.minItems && Array.isArray(value) && value.length < rules.minItems) {
      errors[field] = `Au moins ${rules.minItems} éléments requis`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors[field] = 'Format invalide';
    }
  });

  console.log('Validation result:', { isValid: Object.keys(errors).length === 0, errors });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Section categories for organization
export const SECTION_CATEGORIES = {
  content: { label: 'Contenu', color: 'blue' },
  features: { label: 'Fonctionnalités', color: 'green' },
  conversion: { label: 'Conversion', color: 'yellow' },
  interaction: { label: 'Interaction', color: 'purple' },
  structure: { label: 'Structure', color: 'gray' },
  other: { label: 'Autre', color: 'gray' },
};

export function getSectionsByCategory() {
  const categorized = {};

  Object.entries(SECTION_CONFIG).forEach(([type, config]) => {
    const category = config.category || 'other';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push({ type, ...config });
  });

  return categorized;
}