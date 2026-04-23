// Unified form schema - Single source of truth for form configuration
export const FORM_SCHEMA = {
  // Global form options referenced by steps
  options: {
    LEGAL_STATUSES: [
      { value: 'auto-entrepreneur', label: 'Auto-entrepreneur', icon: 'fa-user' },
      { value: 'ei', label: 'Entreprise Individuelle', icon: 'fa-building' },
      { value: 'eurl', label: 'EURL', icon: 'fa-building' },
      { value: 'sarl', label: 'SARL', icon: 'fa-users' },
      { value: 'sas', label: 'SAS', icon: 'fa-users' },
    ],

    REVENUE_OPTIONS: [
      { value: '0-30k', label: "Moins de 30,000€" },
      { value: '30-60k', label: "30,000€ - 60,000€" },
      { value: '60-100k', label: "60,000€ - 100,000€" },
      { value: '100k+', label: "Plus de 100,000€" },
    ]
  },
  
  // Form steps with full configuration
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
      validation: {
        required: true,
        minLength: 1,
        custom: (value) => value.trim().length > 0
      }
    },
    {
      key: 'entreprise',
      title: 'Entreprise',
      label: 'Quel est le nom de votre entreprise ?',
      type: 'input',
      required: false,
      placeholder: 'Entreprise / Nom',
      icon: 'fa-building',
      autoFocus: true,
      validation: {
        required: false
      }
    },
    {
      key: 'statut',
      title: 'Statut',
      label: 'Statut Juridique',
      type: 'select',
      required: true,
      options: 'LEGAL_STATUSES', // Reference to options array
      validation: {
        required: true,
        minLength: 1
      }
    },
    {
      key: 'chiffreAffaires',
      title: 'Revenu',
      label: 'Chiffre d\'affaires',
      type: 'select',
      required: true,
      options: 'REVENUE_OPTIONS', // Reference to options array
      validation: {
        required: true,
        minLength: 1
      }
    },
    {
      key: 'tele',
      title: 'Téléphone',
      label: 'Numéro',
      type: 'input',
      inputType: 'tel',
      required: true,
      placeholder: 'Téléphone *',
      icon: 'fa-phone',
      autoFocus: true,
      consentRequired: true,
      consentText: 'En cliquant sur "Suivant", vous acceptez d\'être contacté par téléphone.',
      validation: {
        required: true,
        pattern: /^[+]?[0-9\s\-()]+$/,
        minLength: 10
      }
    },
    {
      key: 'email',
      title: 'Email',
      label: 'Votre Email',
      type: 'input',
      inputType: 'email',
      required: true,
      placeholder: 'Email *',
      icon: 'fa-envelope',
      autoFocus: true,
      consentRequired: true,
      consentText: 'En cliquant sur "Obtenir mon devis", vous acceptez d\'être contacté par email.',
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    }
  ]
};

// Helper functions exported for backward compatibility
export function getFormSteps() {
  return FORM_SCHEMA.steps;
}

export function getFieldOptions(fieldKey) {
  const step = FORM_SCHEMA.steps.find(step => step.key === fieldKey);
  if (!step || !step.options) return [];

  // If options is a string, reference the options array in FORM_SCHEMA
  if (typeof step.options === 'string') {
    return FORM_SCHEMA.options[step.options] || [];
  }

  return step.options || [];
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

  // Check required fields
  if (validation.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
    return { isValid: false, error: 'Ce champ est obligatoire' };
  }

  // Check minimum length
  if (validation.minLength && value && value.length < validation.minLength) {
    return { isValid: false, error: `Minimum ${validation.minLength} caractères requis` };
  }

  // Check pattern (for email, phone, etc.)
  if (validation.pattern && value && !validation.pattern.test(value)) {
    if (step.inputType === 'email') {
      return { isValid: false, error: 'Adresse email invalide' };
    }
    if (step.inputType === 'tel') {
      return { isValid: false, error: 'Numéro de téléphone invalide' };
    }
    return { isValid: false, error: 'Format invalide' };
  }

  // Custom validation
  if (validation.custom && typeof validation.custom === 'function') {
    const customResult = validation.custom(value, formData);
    if (!customResult) {
      return { isValid: false, error: 'Valeur invalide' };
    }
  }

  // Check consent requirements
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
  // Map form data to API expected format
  return {
    nom: formData.nom,
    entreprise: formData.entreprise,
    email: formData.email,
    tele: formData.tele,
    statut: formData.statut,
    chiffreAffaires: formData.chiffreAffaires
  };
}