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
  cards: {
    title: 'Cartes',
    subtitle: '',
    cards: [
      { 
        title: 'Titre carte 1', 
        subtitle: '',
        bulletPoints: [''],
        buttonText: '',
        buttonLink: '',
        icon: '' 
      }
    ]
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