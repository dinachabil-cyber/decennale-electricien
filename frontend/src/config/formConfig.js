// Form configuration system - Dynamic fetch from API
import { getConfig, getVisibleFields } from '../api/leadsApi';

// Cache for form config
let cachedConfig = null;

// Default static steps (fallback when API unavailable)
const DEFAULT_STEPS = [
  { key: 'nom', label: 'Nom', type: 'input', required: false, visible: true, placeholder: 'Votre nom', inputType: 'text', order: 1 },
  { key: 'prenom', label: 'Prénom', type: 'input', required: true, visible: true, placeholder: 'Votre prénom', inputType: 'text', order: 2 },
  { key: 'raisonSociale', label: 'Raison Sociale', type: 'input', required: false, visible: true, placeholder: 'Raison sociale', inputType: 'text', order: 3 },
  { key: 'demarrageActivite', label: 'Démarrée activité ?', type: 'select', required: false, visible: true, options: [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }], order: 4 },
  { key: 'tele', label: 'Téléphone', type: 'input', required: true, visible: true, placeholder: 'Votre numéro', inputType: 'tel', consentRequired: true, consentText: "J'accepte d'être contacté par téléphone.", order: 5 },
  { key: 'email', label: 'Email', type: 'input', required: true, visible: true, placeholder: 'Votre email', inputType: 'email', consentRequired: true, consentText: "J'accepte d'être contacté par email.", order: 6 },
  { key: 'activiteAssuree', label: 'Êtes-vous actuellement assuré ?', type: 'select', required: false, visible: true, options: [{ value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' }], order: 7 },
  { key: 'assuranceResilie', label: 'Avez-vous déjà résilié une assurance ?', type: 'select', required: false, visible: true, options: [{ value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' }], order: 8 },
  { key: 'motifResiliation', label: 'Motif de résiliation', type: 'select', required: false, visible: true, options: [{ value: 'sinistre', label: 'Sinistre' }, { value: 'non_paiement', label: 'Non paiement' }, { value: 'autre', label: 'Autre' }], order: 9 },
  { key: 'codePostal', label: 'Code postal', type: 'input', required: false, visible: true, placeholder: 'Votre code postal', inputType: 'text', order: 10 },
];

/**
 * FORM_OPTIONS - Backward compatibility export
 */
export const FORM_OPTIONS = {
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
  YES_NO_OPTIONS: [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
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
    { value: 'autre', label: 'Autre' },
  ],
};

/**
 * Get FORM_CONFIG for backward compatibility
 * Returns a promise that resolves to config structure compatible with old usage
 */
export async function getFORM_CONFIG() {
  const fields = await getVisibleFields();
  return {
    steps: fields,
    options: FORM_OPTIONS,
  };
}

/**
 * Default static config for backward compatibility
 * Uses DEFAULT_STEPS as fallback
 */
export const FORM_CONFIG = {
  steps: DEFAULT_STEPS.filter(f => f.visible),
  options: FORM_OPTIONS,
};

/**
 * Load all fields from API
 */
export async function loadFormConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }
  
  cachedConfig = await getConfig();
  return cachedConfig;
}

/**
 * Get visible fields for form rendering
 */
export async function getFormConfig() {
  const fields = await getVisibleFields();
  
  // Sort by order
  return fields.sort((a, b) => (a.order || 999) - (b.order || 999));
}

/**
 * Get form steps (visible fields only)
 * Falls back to DEFAULT_STEPS when API unavailable
 */
export function getFormSteps() {
  // Return cached if available, otherwise use default steps
  if (cachedConfig && cachedConfig.length > 0) {
    return cachedConfig.filter(f => f.visible);
  }
  return DEFAULT_STEPS.filter(f => f.visible);
}

/**
 * Get step by index
 */
export function getStepByIndex(index) {
  const steps = getFormSteps();
  return steps[index];
}

/**
 * Get step by key
 */
export function getStepByKey(key) {
  const steps = getFormSteps();
  return steps.find(s => s.key === key);
}

/**
 * Get all fields (including hidden ones)
 */
export function getAllFields() {
  if (cachedConfig && cachedConfig.length > 0) {
    return cachedConfig;
  }
  return DEFAULT_STEPS;
}

/**
 * Get field options for select fields
 */
export function getFieldOptions(fieldKey) {
  const step = getStepByKey(fieldKey);
  if (!step || !step.options) return [];
  
  // If options is a string, reference the options array
  if (typeof step.options === 'string') {
    const optionsMap = {
      YES_NO_OPTIONS: [
        { value: 'oui', label: 'Oui' },
        { value: 'non', label: 'Non' },
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
        { value: 'autre', label: 'Autre' },
      ],
    };
    return optionsMap[step.options] || [];
  }
  
  return step.options || [];
}

/**
 * Initialize form data with all visible fields
 */
export function initializeFormData() {
  const steps = getFormSteps();
  const formData = {};
  
  steps.forEach(step => {
    formData[step.key] = '';
    
    // Handle consent fields
    if (step.consentRequired) {
      formData[`agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`] = false;
    }
  });
  
  return formData;
}

/**
 * Validate a single field
 */
export function validateField(step, value, formData = {}) {
  if (!step) return { isValid: false, error: 'Step not found' };

  // Required check
  if (step.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
    return { isValid: false, error: `${step.label} est obligatoire` };
  }

  // Input type validation
  if (value && step.inputType) {
    if (step.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { isValid: false, error: 'Adresse email invalide' };
    }
    if (step.inputType === 'tel' && !/^[\d\s\+\-\(\)]{8,20}$/.test(value)) {
      return { isValid: false, error: 'Numéro de téléphone invalide' };
    }
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

/**
 * Check if can proceed to next step
 */
export function canProceedToStep(stepIndex, formData) {
  const steps = getFormSteps();
  const step = steps[stepIndex];
  
  if (!step) return false;
  
  const fieldValue = formData[step.key];
  const validation = validateField(step, fieldValue, formData);
  
  return validation.isValid;
}

/**
 * Prepare data for submission (map field keys to database columns)
 */
export function prepareSubmitData(formData) {
  const steps = getFormSteps();
  const submitData = {};
  
  steps.forEach(step => {
    if (formData.hasOwnProperty(step.key)) {
      submitData[step.key] = formData[step.key];
    }
  });
  
  return submitData;
}
