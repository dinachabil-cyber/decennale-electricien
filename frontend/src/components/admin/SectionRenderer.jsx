import React from 'react';
import {
  HeroSectionEditor,
  ContentSectionEditor,
  FeaturesSectionEditor,
  PricingSectionEditor,
  FAQSectionEditor,
  ContactSectionEditor,
  CTAEditor,
  TestimonialsEditor,
  GalleryEditor,
  getSectionLabel
} from './sections';

const EDITORS = {
  hero: HeroSectionEditor,
  content: ContentSectionEditor,
  features: FeaturesSectionEditor,
  pricing: PricingSectionEditor,
  faq: FAQSectionEditor,
  contact: ContactSectionEditor,
  cta: CTAEditor,
  testimonials: TestimonialsEditor,
  gallery: GalleryEditor
};

export default function SectionRenderer({ section, onSave, onCancel }) {
  const EditorComponent = EDITORS[section.type];

  if (!EditorComponent) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Type d'éditeur non trouvé: {section.type}</p>
        <button
          onClick={onCancel}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Modifier: {getSectionLabel(section.type)}
        </h3>
      </div>
      <div className="p-6">
        <EditorComponent
          content={section.content}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}