// Form configuration system for dynamic multi-step forms
// Delegates to unified form schema for backward compatibility
import { FORM_SCHEMA } from './formSchema';

export const FORM_CONFIG = {
  ...FORM_SCHEMA
};

// Helper functions for form configuration
export function getFormSteps() {
  return FORM_CONFIG.steps;
}

export function getStepByIndex(index) {
  return FORM_CONFIG.steps[index];
}

export function getStepByKey(key) {
  return FORM_CONFIG.steps.find(step => step.key === key);
}

export function getFieldOptions(fieldKey) {
  const step = getStepByKey(fieldKey);
  if (!step || !step.options) return [];

  // If options is a string, reference the options array in FORM_CONFIG
  if (typeof step.options === 'string') {
    return FORM_CONFIG[step.options] || [];
  }

  return step.options || [];
}

export function initializeFormData() {
  const formData = {};
  FORM_CONFIG.steps.forEach(step => {
    formData[step.key] = '';
  });
  return formData;
}

export function validateField(stepIndex, value, formData = {}) {
  const step = getStepByIndex(stepIndex);
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
  const step = getStepByIndex(stepIndex);
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