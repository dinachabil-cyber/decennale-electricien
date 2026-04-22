const SECTION_EDITORS = {
  hero: 'HeroSectionEditor',
  content: 'ContentSectionEditor',
  faq: 'FAQSectionEditor',
  carte: 'CarteSectionEditor',
  cta: 'CTAEditor',
};

export function getSectionEditor(type) {
  return SECTION_EDITORS[type] || null;
}

export function getSectionLabel(type) {
  const labels = {
    hero: 'Hero',
    content: 'Contenu',
    faq: 'FAQ',
    cta: 'CTA',
  };
  return labels[type] || type;
}

export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'content', label: 'Contenu' },
  { value: 'faq', label: 'FAQ' },
  { value: 'carte', label: 'Carte' },
  { value: 'cta', label: 'CTA' },
];