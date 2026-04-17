import React from 'react';

const COMPONENTS = {
  hero: React.lazy(() => import('../hero/Hero')),
  content: React.lazy(() => import('../content/Content')),
  features: React.lazy(() => import('../features/Features')),
  pricing: React.lazy(() => import('../pricing/Pricing')),
  faq: React.lazy(() => import('../faq/FAQ')),
  howitworks: React.lazy(() => import('../howitworks/HowItWorks')),
  steps: React.lazy(() => import('../howitworks/HowItWorks')),
  contact: React.lazy(() => import('../contact/Contact')),
  cta: React.lazy(() => import('../cta/CTA')),
  testimonials: React.lazy(() => import('../testimonials/Testimonials')),
  gallery: React.lazy(() => import('../gallery/Gallery')),
};

const Fallback = () => <div className="h-32 bg-gray-100 animate-pulse rounded" />;

export default function SectionRenderer({ section, mode = 'frontend' }) {
  // Guard against invalid section
  if (!section || !section.type) {
    return null;
  }

  const { type, content, id, isEnabled = true } = section;

  if (mode === 'frontend' && isEnabled === false) {
    return null;
  }

  const Component = COMPONENTS[type];

  // Skip unknown section types silently (no error shown)
  if (!Component) {
    return null;
  }

  // Guard: prevent rendering if content is invalid/undefined
  if (content === undefined || content === null) {
    return null;
  }

  return (
    <React.Suspense fallback={<Fallback />}>
      <Component content={content} sectionId={id} />
    </React.Suspense>
  );
}