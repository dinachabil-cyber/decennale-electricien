// DEPRECATED - This file is kept for backward compatibility
// Use dynamic API configuration instead: src/api/leadsApi.js and src/config/formConfig.js
// The form now fetches configuration from /api/leads/config

export const FORM_SCHEMA = {
  // Global form options referenced by steps
  options: {
    LEGAL_STATUSES: [
      { value: 'auto-entrepreneur', label: 'Auto-entrepreneur' },
      { value: 'ei', label: 'Entreprise Individuelle' },
      { value: 'eurl', label: 'EURL' },
      { value: 'sarl', label: 'SARL' },
      { value: 'sas', label: 'SAS' },
    ],

    REVENUE_OPTIONS: [
      { value: '0-30k', label: "Moins de 30,000€" },
      { value: '30-60k', label: "30,000€ - 60,000€" },
      { value: '60-100k', label: "60,000€ - 100,000€" },
      { value: '100k+', label: "Plus de 100,000€" },
    ],

    INSURED_OPTIONS: [
      { value: 'yes', label: 'Oui' },
      { value: 'no', label: 'Non' },
    ],

    RESILIATION_OPTIONS: [
      { value: 'yes', label: 'Oui' },
      { value: 'no', label: 'Non' },
    ],

    RESILIATION_REASONS: [
      { value: 'sinistre', label: 'Sinistre' },
      { value: 'non_paiement', label: 'Non paiement' },
      { value: 'suspension_paiement', label: 'Suspension de paiement' },
      { value: 'fausse_declaration', label: 'Fausse déclaration' },
      { value: 'echeance', label: 'Échéance' },
      { value: 'autre', label: 'Autre' }
    ],

    YES_NO_OPTIONS: [
      { value: 'oui', label: 'Oui' },
      { value: 'non', label: 'Non' }
    ]
  },
  
  // Form steps with full configuration
  // Type must match FieldRenderer: 'input', 'select', 'textarea', 'date', 'consent'
  steps: [
    {
      key: 'nom',
      label: 'Nom',
      type: 'input',
      required: false,
      visible: true,
      placeholder: 'Votre nom',
      icon: 'fa-user',
      inputType: 'text',
      order: 1,
      validation: {
        required: false
      }
    },
    {
      key: 'prenom',
      label: 'Prénom',
      type: 'input',
      required: true,
      visible: true,
      placeholder: 'Votre prénom',
      icon: 'fa-user',
      inputType: 'text',
      order: 2,
      validation: {
        required: true,
        minLength: 1
      }
    },
    {
      key: 'raisonSociale',
      label: 'Raison Sociale',
      type: 'input',
      required: false,
      visible: true,
      placeholder: 'Raison sociale',
      icon: 'fa-building',
      inputType: 'text',
      order: 3,
      validation: {
        required: false
      }
    },
    {
      key: 'demarrageActivite',
      label: 'Démarrée activité ?',
      type: 'select',
      required: false,
      visible: true,
      options: 'YES_NO_OPTIONS',
      placeholder: 'Sélectionnez une option',
      icon: 'fa-calendar',
      order: 4,
      validation: {
        required: false
      }
    },
    {
      key: 'tele',
      label: 'Téléphone',
      type: 'input',
      required: true,
      visible: true,
      placeholder: 'Votre numéro',
      icon: 'fa-phone',
      inputType: 'tel',
      consentRequired: true,
      consentText: 'J\'accepte d\'être contacté par téléphone.',
      order: 5,
      validation: {
        required: true,
        pattern: /^[\d\s\+\-\(\)]{8,20}$/,
        minLength: 8
      }
    },
    {
      key: 'email',
      label: 'Email',
      type: 'input',
      required: true,
      visible: true,
      placeholder: 'Votre email',
      icon: 'fa-envelope',
      inputType: 'email',
      consentRequired: true,
      consentText: 'J\'accepte d\'être contacté par email.',
      order: 6,
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      key: 'activiteAssuree',
      label: 'Êtes-vous actuellement assuré ?',
      type: 'select',
      required: false,
      visible: true,
      options: 'INSURED_OPTIONS',
      placeholder: 'Sélectionnez une option',
      icon: 'fa-shield-alt',
      order: 7,
      validation: {
        required: false
      }
    },
    {
      key: 'assuranceResilie',
      label: 'Avez-vous déjà résilié une assurance ?',
      type: 'select',
      required: false,
      visible: true,
      options: 'RESILIATION_OPTIONS',
      placeholder: 'Sélectionnez une option',
      icon: 'fa-file-alt',
      order: 8,
      validation: {
        required: false
      }
    },
    {
      key: 'motifResiliation',
      label: 'Motif de résiliation',
      type: 'select',
      required: false,
      visible: true,
      options: 'RESILIATION_REASONS',
      placeholder: 'Sélectionnez un motif',
      icon: 'fa-comment',
      order: 9,
      validation: {
        required: false
      }
    },
    {
      key: 'codePostal',
      label: 'Code postal',
      type: 'input',
      required: false,
      visible: true,
      placeholder: 'Votre code postal',
      icon: 'fa-map-marker-alt',
      inputType: 'text',
      order: 10,
      validation: {
        required: false
      }
    },
    // System field - hidden from form
    {
      key: 'createdAt',
      label: 'Date de création',
      type: 'datetime',
      required: false,
      visible: false,
      order: 11,
      validation: {
        required: false
      }
    }
  ]
};

// Export helper functions
export function getVisibleFields() {
  return FORM_SCHEMA.steps
    .filter(step => step.visible)
    .sort((a, b) => (a.order || 999) - (b.order || 999));
}

export function getAllFields() {
  return FORM_SCHEMA.steps;
}

export function getFieldOptions(fieldKey) {
  const step = FORM_SCHEMA.steps.find(step => step.key === fieldKey);
  if (!step || !step.options) return [];
  
  if (typeof step.options === 'string') {
    return FORM_SCHEMA.options[step.options] || [];
  }
  
  return step.options || [];
}

export function getFieldConfig(key) {
  return FORM_SCHEMA.steps.find(step => step.key === key);
}

export function initializeFormData() {
  const formData = {};
  FORM_SCHEMA.steps.forEach(step => {
    formData[step.key] = '';
  });
  return formData;
}

export function validateField(stepIndex, value, formData = {}) {
  const step = FORM_SCHEMA.steps[stepIndex];
  if (!step) return { isValid: false, error: 'Step not found' };

  const validation = step.validation || {};

  // Required check
  if (validation.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
    return { isValid: false, error: `${step.label} est obligatoire` };
  }

  // Min length
  if (validation.minLength && value && value.length < validation.minLength) {
    return { isValid: false, error: `Minimum ${validation.minLength} caractères requis` };
  }

  // Pattern matching
  if (validation.pattern && value && !validation.pattern.test(value)) {
    if (step.inputType === 'email') {
      return { isValid: false, error: 'Adresse email invalide' };
    }
    if (step.inputType === 'tel') {
      return { isValid: false, error: 'Numéro de téléphone invalide' };
    }
    return { isValid: false, error: 'Format invalide' };
  }

  // Consent check
  if (step.consentRequired) {
    const consentKey = `agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`;
    if (!formData[consentKey]) {
      return { isValid: false, error: 'Vous devez accepter les conditions' };
    }
  }

  return { isValid: true };
}

export function canProceedToStep(stepIndex, formData) {
  const step = FORM_SCHEMA.steps[stepIndex];
  if (!step) return false;

  const fieldValue = formData[step.key];
  const validation = validateField(stepIndex, fieldValue, formData);

  return validation.isValid;
}

export function prepareSubmitData(formData) {
  // Map form data directly to database columns (using French field names)
  return {
    nom: formData.nom,
    prenom: formData.prenom,
    raisonSociale: formData.raisonSociale,
    demarrageActivite: formData.demarrageActivite,
    activiteAssuree: formData.activiteAssuree,
    assuranceResilie: formData.assuranceResilie,
    motifResiliation: formData.motifResiliation,
    codePostal: formData.codePostal,
    email: formData.email,
    tele: formData.tele,
  };
}