import React from 'react';
import { getSectionConfig } from './registry';

const COMPONENTS = {
  hero: React.lazy(() => import('../components/hero/Hero')),
  content: React.lazy(() => import('../components/content/Content')),
  features: React.lazy(() => import('../components/features/Features')),
  pricing: React.lazy(() => import('../components/pricing/Pricing')),
  faq: React.lazy(() => import('../components/faq/FAQ')),
  contact: React.lazy(() => import('../components/contact/Contact')),
  cta: React.lazy(() => import('../components/cta/CTA')),
  testimonials: React.lazy(() => import('../components/testimonials/Testimonials')),
  gallery: React.lazy(() => import('../components/gallery/Gallery')),
};

export const SectionRenderer = React.memo(function SectionRenderer({ section, mode = 'frontend', options = {} }) {
  const { type, content, id, isEnabled = true } = section;
  const config = getSectionConfig(type);

  if (!config) {
    return (
      <div className="py-8 px-4 bg-red-50 border border-red-200">
        <p className="text-red-600">Type de section inconnu: {type}</p>
      </div>
    );
  }

  if (mode === 'frontend' && isEnabled === false) {
    return null;
  }

  const Component = COMPONENTS[type];

  if (!Component) {
    return (
      <div className="py-8 px-4">
        <p className="text-gray-500">Composant non trouvé: {type}</p>
      </div>
    );
  }

  const renderProps = {
    content,
    sectionId: id,
    ...options
  };

  return (
    <React.Suspense fallback={
      mode === 'frontend' ? null : (
        <div className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>
      )
    }>
      <Component {...renderProps} />
    </React.Suspense>
  );
});

export function getRendererComponent(type) {
  return COMPONENTS[type] || null;
}

export default SectionRenderer;