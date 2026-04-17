export const DEFAULT_CONTENT = {
  hero: {
    title: 'Bienvenue',
    subtitle: 'Votre sous-titre ici',
    ctaText: 'Contactez-nous',
    ctaLink: '/contact'
  },
  content: {
    title: '',
    introduction: '',
    sections: [
      { title: 'Mon titre', content: '' }
    ],
    ctaText: 'Contactez-nous',
    ctaLink: '/contact'
  },
  features: {
    faqs: [
      { question: "L'assurance décennale est-elle obligatoire pour un électricien ?", answer: "Oui. Tout constructeur doit être assurée..." },
      { question: "Quel est le prix moyen ?", answer: "Le tarif varie entre 600 et 2500€..." }
    ]
  },
  pricing: {
    plans: [
      { name: 'Basique', price: '29€', features: ['Feature 1'], featured: false }
    ]
  },
  faq: {
    items: [
      { question: 'Question?', answer: 'Réponse...' }
    ]
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Nous sommes à votre disposition',
    email: '',
    phone: '',
    address: '',
    showMap: true
  },
  cta: {
    title: 'Prêt à commencer?',
    subtitle: 'Contactez-nous dès aujourd\'hui',
    buttonText: 'Contactez-nous',
    buttonLink: '/contact'
  },
  testimonials: {
    testimonials: [
      { name: 'Nom', role: 'Client', quote: 'Excellent service!', avatar: '' }
    ]
  },
  gallery: {
    images: [
      { url: '', alt: '', caption: '' }
    ]
  }
};

export function getDefaultContent(type) {
  return DEFAULT_CONTENT[type] || {};
}