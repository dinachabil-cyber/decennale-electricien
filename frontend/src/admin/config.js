export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero', icon: '🟣' },
  { value: 'content', label: 'Contenu', icon: '📝' },
  { value: 'faq', label: 'FAQ', icon: '❓' },
  { value: 'form', label: 'Formulaire', icon: '📋' },
  { value: 'steps', label: 'Étapes', icon: '🔢' },
  { value: 'footer', label: 'Footer', icon: '🦶' },
  { value: 'cards', label: 'Cartes', icon: '🃏' },
  { value: 'cta', label: 'CTA', icon: '🎯' },
];

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
  cards: {
    title: 'Cartes',
    subtitle: '',
    cards: [
      { 
        title: 'Titre carte 1', 
        subtitle: 'Sous-titre optionnel',
        bulletPoints: ['Point 1', 'Point 2'],
        buttonText: 'Obtenir mon devis',
        buttonLink: '#contactForm',
        icon: 'star' 
      }
    ]
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

export function getDefaultContent(type) {
  return JSON.parse(JSON.stringify(SECTION_DEFAULTS[type] || {}));
}

export function getSectionLabel(type) {
  return SECTION_TYPES.find(t => t.value === type)?.label || type;
}

export function getSectionIcon(type) {
  return SECTION_TYPES.find(t => t.value === type)?.icon || '📄';
}