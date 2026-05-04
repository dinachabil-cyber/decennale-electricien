// Leads API - Dynamic form configuration from backend
const API_URL = process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api';

/**
 * Fetch form configuration from backend API
 * Returns all fields (including hidden ones for admin config)
 */
export async function getConfig() {
  try {
    const response = await fetch(`${API_URL}/leads/config`);
    const data = await response.json();
    
    if (data.success && data.fields) {
      return data.fields;
    }
    
    console.warn('Failed to fetch config:', data.message);
    return [];
  } catch (error) {
    console.error('Error fetching config:', error);
    return [];
  }
}

/**
 * Update form configuration
 * STRICT: Only allows visible, required, order fields to be updated
 */
export async function updateConfig(fields) {
  try {
    const response = await fetch(`${API_URL}/leads/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating config:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Reset configuration to defaults
 */
export async function resetConfig() {
  try {
    const response = await fetch(`${API_URL}/leads/config/reset`, {
      method: 'POST',
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error resetting config:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Submit lead data
 */
export async function submitLead(formData) {
  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
}

/**
 * Get visible fields only (for form rendering)
 */
export async function getVisibleFields() {
  const fields = await getConfig();
  return fields.filter(f => f.visible);
}
