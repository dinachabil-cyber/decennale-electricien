const SECTION_EDITORS = {
  hero: 'HeroSectionEditor',
  content: 'ContentSectionEditor',
  features: 'FeaturesSectionEditor',
  pricing: 'PricingSectionEditor',
  faq: 'FAQSectionEditor',
  contact: 'ContactSectionEditor',
  cta: 'CTAEditor',
  testimonials: 'TestimonialsEditor',
  gallery: 'GalleryEditor'
};

export function getSectionEditor(type) {
  return SECTION_EDITORS[type] || null;
}

export function getSectionLabel(type) {
  const labels = {
    hero: 'Hero',
    content: 'Contenu',
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    faq: 'FAQ',
    contact: 'Contact',
    cta: 'Appel à l\'action',
    testimonials: 'Témoignages',
    gallery: 'Galerie'
  };
  return labels[type] || type;
}

export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'content', label: 'Contenu' },
  { value: 'features', label: 'Fonctionnalités' },
  { value: 'pricing', label: 'Tarifs' },
  { value: 'faq', label: 'FAQ' },
  { value: 'contact', label: 'Contact' },
  { value: 'cta', label: 'Appel à l\'action' },
  { value: 'testimonials', label: 'Témoignages' },
  { value: 'gallery', label: 'Galerie' }
];