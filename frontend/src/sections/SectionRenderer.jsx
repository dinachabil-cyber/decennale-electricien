import React from 'react';
import { getSectionConfig } from './registry';

const COMPONENTS = {
  hero: React.lazy(() => import('../components/Hero')),
  content: React.lazy(() => import('../components/Content')),
  faq: React.lazy(() => import('../components/FAQ')),
  howitworks: React.lazy(() => import('../components/HowItWorks')),
  steps: React.lazy(() => import('../components/HowItWorks')),
  cards: React.lazy(() => import('../components/Cards')),
  cta: React.lazy(() => import('../components/CTA')),
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

  // Skip unknown section types silently
  if (!Component) {
    return null;
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