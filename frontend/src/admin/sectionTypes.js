// Simple section configuration - no complex registry needed
// Just define defaults and labels for each section type

export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero', icon: '🟣' },
  { value: 'content', label: 'Contenu', icon: '📝' },
  { value: 'faq', label: 'FAQ', icon: '❓' },
  { value: 'form', label: 'Formulaire', icon: '📋' },
  { value: 'steps', label: 'Étapes', icon: '🔢' },
  { value: 'footer', label: 'Footer', icon: '🦶' },
  { value: 'carte', label: 'Carte', icon: '📍' },
  { value: 'cta', label: 'CTA', icon: '🎯' },
];

// Default content for each section type
export const SECTION_DEFAULTS = {
  hero: {
    title: 'Bienvenue',
    subtitle: 'Votre sous-titre ici',
    ctaText: 'Contactez-nous',
    ctaLink: '/contact',
    backgroundImage: '',
  },
  content: {
    title: '',
    introduction: '',
    sections: [{ title: '', content: '' }],
    ctaText: '',
    ctaLink: '',
  },
  faq: {
    items: [{ question: 'Question?', answer: 'Réponse...' }],
  },
  carte: {
    title: 'Nous contacter',
    subtitle: 'Retrouvez-nous à notre agence',
    email: '',
    phone: '',
    address: '',
    showMap: true,
  },
  cta: {
    title: 'Prêt à commencer?',
    subtitle: 'Contactez-nous dès aujourd\'hui',
    buttonText: 'Contactez-nous',
    buttonLink: '/contact',
  },
  form: {
    title: 'Contactez-nous',
    description: 'Remplissez ce formulaire',
    submitText: 'Envoyer',
    email: '',
    fields: [{ name: '', label: '', type: 'text', required: false }],
  },
  steps: {
    steps: [{ number: '', title: '', description: '' }],
  },
  footer: {
    text: '',
    links: [{ label: '', url: '' }],
  },
};

export const getDefaultContent = (type) => {
  return JSON.parse(JSON.stringify(SECTION_DEFAULTS[type] || {}));
};

export const getSectionLabel = (type) => {
  const found = SECTION_TYPES.find(t => t.value === type);
  return found ? found.label : type;
};

export const getSectionIcon = (type) => {
  const found = SECTION_TYPES.find(t => t.value === type);
  return found ? found.icon : '📄';
};
