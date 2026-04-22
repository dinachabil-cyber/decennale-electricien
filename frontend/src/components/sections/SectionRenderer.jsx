import React from 'react';
import { getSectionConfig } from '../../sections/registry';

const COMPONENTS = {
  hero: React.lazy(() => import('../Hero')),
  content: React.lazy(() => import('../Content')),
  faq: React.lazy(() => import('../FAQ')),
  howitworks: React.lazy(() => import('../HowItWorks')),
  steps: React.lazy(() => import('../HowItWorks')),
  cards: React.lazy(() => import('../Cards')),
  cta: React.lazy(() => import('../CTA')),
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