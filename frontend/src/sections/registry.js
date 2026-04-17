const SECTION_REGISTRY = {
  hero: {
    label: 'Hero',
    labelFr: 'Hero',
    description: 'Section d\'accueil avec titre et CTA',
    icon: '🟣',
    defaultContent: {
      title: 'Bienvenue',
      subtitle: 'Votre sous-titre ici',
      ctaText: 'Contactez-nous',
      ctaLink: '/contact'
    },
    fieldGroups: [
      { id: 'text', label: 'Texte', fields: ['title', 'subtitle'] },
      { id: 'cta', label: 'Bouton', fields: ['ctaText', 'ctaLink'] }
    ]
  },
  content: {
    label: 'Content',
    labelFr: 'Contenu',
    description: 'Contenu textuel avec sections',
    icon: '📝',
    defaultContent: {
      title: '',
      introduction: '',
      sections: [{ title: 'Mon titre', content: '' }],
      ctaText: 'Contactez-nous',
      ctaLink: '/contact'
    }
  },
  features: {
    label: 'Features',
    labelFr: 'Fonctionnalités',
    description: 'Grille de fonctionnalités',
    icon: '⚡',
    defaultContent: {
      features: [
        { title: 'Feature 1', description: '', icon: 'star' }
      ]
    }
  },
  pricing: {
    label: 'Pricing',
    labelFr: 'Tarifs',
    description: 'Plans tarifaires',
    icon: '💰',
    defaultContent: {
      plans: [
        { name: 'Basique', price: '29€', features: ['Feature 1'], featured: false }
      ]
    }
  },
  faq: {
    label: 'FAQ',
    labelFr: 'FAQ',
    description: 'Questions fréquentes',
    icon: '❓',
    defaultContent: {
      items: [{ question: 'Question?', answer: 'Réponse...' }]
    }
  },
  contact: {
    label: 'Contact',
    labelFr: 'Contact',
    description: 'Informations de contact',
    icon: '📧',
    defaultContent: {
      title: 'Contactez-nous',
      subtitle: 'Nous sommes à votre disposition',
      email: '',
      phone: '',
      address: '',
      showMap: true
    }
  },
  cta: {
    label: 'CTA',
    labelFr: 'Appel à l\'action',
    description: 'Bandeau d\'appel à l\'action',
    icon: '🎯',
    defaultContent: {
      title: 'Prêt à commencer?',
      subtitle: 'Contactez-nous dès aujourd\'hui',
      buttonText: 'Contactez-nous',
      buttonLink: '/contact'
    }
  },
  testimonials: {
    label: 'Testimonials',
    labelFr: 'Témoignages',
    description: 'Témoignages clients',
    icon: '💬',
    defaultContent: {
      testimonials: [
        { name: 'Nom', role: 'Client', quote: 'Excellent service!', avatar: '' }
      ]
    }
  },
  gallery: {
    label: 'Gallery',
    labelFr: 'Galerie',
    description: 'Galerie d\'images',
    icon: '🖼️',
    defaultContent: {
      images: [{ url: '', alt: '', caption: '' }]
    }
  },
  form: {
    label: 'Formulaire',
    labelFr: 'Formulaire',
    description: 'Formulaire de contact ou de demande de devis',
    icon: '📋',
    defaultContent: {
      title: 'Contactez-nous',
      description: 'Remplissez ce formulaire',
      submitText: 'Envoyer',
      email: '',
      fields: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
      ]
    }
  },
  steps: {
    label: 'Steps',
    labelFr: 'Étapes',
    description: 'Section d\'étapes',
    icon: '🔢',
    defaultContent: {
      steps: [
        { number: '01', title: 'Étape 1', description: 'Description de l\'étape' }
      ]
    }
  },
  footer: {
    label: 'Footer',
    labelFr: 'Footer',
    description: 'Pied de page',
    icon: '🦶',
    defaultContent: {
      text: 'Texte du footer',
      links: [
        { label: 'Mentions légales', url: '/mentions-legales' }
      ]
    }
  }
};

export const getSectionConfig = (type) => SECTION_REGISTRY[type];

export const getSectionLabel = (type) => {
  const config = SECTION_REGISTRY[type];
  return config ? config.labelFr : type;
};

export const getSectionIcon = (type) => {
  const config = SECTION_REGISTRY[type];
  return config ? config.icon : '📄';
};

export const getDefaultContent = (type) => {
  const config = SECTION_REGISTRY[type];
  return config ? JSON.parse(JSON.stringify(config.defaultContent)) : {};
};

export const getAllSectionTypes = () => Object.entries(SECTION_REGISTRY).map(([value, config]) => ({
  value,
  label: config.labelFr,
  icon: config.icon,
  description: config.description
}));

export const validateSectionContent = (type, content) => {
  const config = SECTION_REGISTRY[type];
  if (!config) return { valid: false, errors: ['Unknown section type'] };
  
  const errors = [];
  const defaultContent = config.defaultContent;
  
  Object.keys(defaultContent).forEach(key => {
    if (defaultContent[key] && !content[key]) {
      errors.push(`Champ obligatoire manquant: ${key}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
};

export default SECTION_REGISTRY;