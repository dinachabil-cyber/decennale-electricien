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
      ctaLink: '/contact',
      backgroundImage: '',
      showForm: true,
      formConfig: {
        steps: [
          {
            key: 'nom',
            title: 'Nom',
            label: 'Quel est votre nom ?',
            type: 'input',
            required: true,
            placeholder: 'Votre Nom *',
            icon: 'fa-user',
            autoFocus: true,
            validation: {
              required: true,
              minLength: 1,
              custom: (value) => value.trim().length > 0
            }
          },
          {
            key: 'entreprise',
            title: 'Entreprise',
            label: 'Quel est le nom de votre entreprise ?',
            type: 'input',
            required: false,
            placeholder: 'Entreprise / Nom',
            icon: 'fa-building',
            autoFocus: true,
            validation: {
              required: false
            }
          },
          {
            key: 'statut',
            title: 'Statut',
            label: 'Statut Juridique',
            type: 'select',
            required: true,
            options: 'LEGAL_STATUSES',
            validation: {
              required: true,
              minLength: 1
            }
          },
          {
            key: 'chiffreAffaires',
            title: 'Revenu',
            label: 'Chiffre d\'affaires',
            type: 'select',
            required: true,
            options: 'REVENUE_OPTIONS',
            validation: {
              required: true,
              minLength: 1
            }
          },
          {
            key: 'tele',
            title: 'Téléphone',
            label: 'Numéro',
            type: 'input',
            inputType: 'tel',
            required: true,
            placeholder: 'Téléphone *',
            icon: 'fa-phone',
            autoFocus: true,
            consentRequired: true,
            consentText: 'En cliquant sur "Suivant", vous acceptez d\'être contacté par téléphone.',
            validation: {
              required: true,
              pattern: /^[\+]?[0-9\s\-\(\)]+$/,
              minLength: 10
            }
          },
          {
            key: 'email',
            title: 'Email',
            label: 'Votre Email',
            type: 'input',
            inputType: 'email',
            required: true,
            placeholder: 'Email *',
            icon: 'fa-envelope',
            autoFocus: true,
            consentRequired: true,
            consentText: 'En cliquant sur "Obtenir mon devis", vous acceptez d\'être contacté par email.',
            validation: {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            }
          }
        ],
        options: {
          LEGAL_STATUSES: [
            { value: 'auto-entrepreneur', label: 'Auto-entrepreneur', icon: 'fa-user' },
            { value: 'ei', label: 'Entreprise Individuelle', icon: 'fa-building' },
            { value: 'eurl', label: 'EURL', icon: 'fa-building' },
            { value: 'sarl', label: 'SARL', icon: 'fa-users' },
            { value: 'sas', label: 'SAS', icon: 'fa-users' },
          ],
          REVENUE_OPTIONS: [
            { value: '0-30k', label: "Moins de 30,000€" },
            { value: '30-60k', label: "30,000€ - 60,000€" },
            { value: '60-100k', label: "60,000€ - 100,000€" },
            { value: '100k+', label: "Plus de 100,000€" },
          ]
        }
      }
    },
    fieldGroups: [
      { id: 'text', label: 'Texte', fields: ['title', 'subtitle'] },
      { id: 'cta', label: 'Bouton', fields: ['ctaText', 'ctaLink'] },
      { id: 'form', label: 'Formulaire', fields: ['showForm'] }
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
  faq: {
    label: 'FAQ',
    labelFr: 'FAQ',
    description: 'Questions fréquentes',
    icon: '❓',
    defaultContent: {
      items: [{ question: 'Question?', answer: 'Réponse...' }]
    }
  },
  cards: {
    label: 'Cards',
    labelFr: 'Cartes',
    description: 'Grille de cartes avec icône, titre, sous-titre, liste et bouton CTA',
    icon: '🃏',
    defaultContent: {
      title: 'Cartes',
      subtitle: '',
      cards: [
        { 
          title: 'Titre carte 1', 
          subtitle: '',
          bulletPoints: ['Point 1', 'Point 2'],
          buttonText: 'Obtenir mon devis',
          buttonLink: '#contactForm',
          icon: 'star' 
        }
      ]
    }
  },
  cta: {
    label: 'CTA',
    labelFr: 'CTA',
    description: 'Bandeau d\'appel à l\'action',
    icon: '🎯',
    defaultContent: {
      title: 'Prêt à commencer?',
      subtitle: 'Contactez-nous dès aujourd\'hui',
      buttonText: 'Contactez-nous',
      buttonLink: '/contact'
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