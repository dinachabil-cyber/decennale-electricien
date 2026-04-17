// Simple section configuration - no complex registry needed
// Just define defaults and labels for each section type

export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero', icon: '🟣' },
  { value: 'content', label: 'Contenu', icon: '📝' },
  { value: 'features', label: 'Fonctionnalités', icon: '⚡' },
  { value: 'pricing', label: 'Tarifs', icon: '💰' },
  { value: 'faq', label: 'FAQ', icon: '❓' },
  { value: 'form', label: 'Formulaire', icon: '📋' },
  { value: 'steps', label: 'Étapes', icon: '🔢' },
  { value: 'footer', label: 'Footer', icon: '🦶' },
  { value: 'contact', label: 'Contact', icon: '📧' },
  { value: 'cta', label: 'Appel à l\'action', icon: '🎯' },
  { value: 'testimonials', label: 'Témoignages', icon: '💬' },
  { value: 'gallery', label: 'Galerie', icon: '🖼️' },
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
  features: {
    features: [{ title: 'Feature', description: '', icon: 'star' }],
  },
  pricing: {
    plans: [{ name: 'Basique', price: '99€', features: ['Feature 1'], featured: false, description: '' }],
  },
  faq: {
    items: [{ question: 'Question?', answer: 'Réponse...' }],
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Nous sommes à votre disposition',
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
  testimonials: {
    testimonials: [{ name: 'Client', role: 'Client', quote: 'Excellent service!', avatar: '' }],
  },
  gallery: {
    images: [{ url: '', alt: '', caption: '' }],
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
