import React from 'react';
import { getSectionConfig, getSectionLabel } from '../sections/registry';

const EDITORS = {
  hero: React.lazy(() => import('../components/admin/sections/HeroSectionEditor')),
  content: React.lazy(() => import('../components/admin/sections/ContentSectionEditor')),
  features: React.lazy(() => import('../components/admin/sections/FeaturesSectionEditor')),
  pricing: React.lazy(() => import('../components/admin/sections/PricingSectionEditor')),
  faq: React.lazy(() => import('../components/admin/sections/FAQSectionEditor')),
  contact: React.lazy(() => import('../components/admin/sections/ContactSectionEditor')),
  cta: React.lazy(() => import('../components/admin/sections/CTAEditor')),
  testimonials: React.lazy(() => import('../components/admin/sections/TestimonialsEditor')),
  gallery: React.lazy(() => import('../components/admin/sections/GalleryEditor')),
};

const EditorFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
  </div>
);

export const SectionEditor = React.memo(function SectionEditor({ section, onSave, onCancel }) {
  const { type, id } = section;
  const config = getSectionConfig(type);
  
  if (!config) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Type d'éditeur non trouvé: {type}</p>
        <button
          onClick={onCancel}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Fermer
        </button>
      </div>
    );
  }

  const EditorComponent = EDITORS[type];
  
  if (!EditorComponent) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Composant éditeur non trouvé: {type}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Modifier: {getSectionLabel(type)}
        </h3>
      </div>
      <div className="p-6">
        <React.Suspense fallback={<EditorFallback />}>
          <EditorComponent
            content={section.content}
            onSave={onSave}
            onCancel={onCancel}
            sectionId={id}
          />
        </React.Suspense>
      </div>
    </div>
  );
});

export function getEditorComponent(type) {
  return EDITORS[type] || null;
}

export default SectionEditor;