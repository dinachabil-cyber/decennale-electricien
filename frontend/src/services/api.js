const API_URL = process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api';

export const submitQuote = async (formData) => {
  try {
    console.log('Submitting to:', `${API_URL}/leads`, formData);
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Erreur lors de l\'envoi du formulaire');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};
