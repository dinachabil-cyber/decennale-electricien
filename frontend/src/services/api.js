import { submitLead } from '../api/leadsApi';

const API_URL = process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api';

/**
 * Submit quote - delegates to leadsApi for form submissions
 */
export const submitQuote = async (formData) => {
  try {
    return await submitLead(formData);
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};

/**
 * Legacy API URL export for backward compatibility
 */
export { API_URL };
