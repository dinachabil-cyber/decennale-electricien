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
  faq: {
    items: [
      { question: 'Question?', answer: 'Réponse...' }
    ]
  },
  carte: {
    title: 'Nous contacter',
    subtitle: 'Retrouvez-nous à notre agence',
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
  }
};

export function getDefaultContent(type) {
  return DEFAULT_CONTENT[type] || {};
}