import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPageBySlug } from '../api/cms';
import Hero from '../components/hero/Hero';
import Features from '../components/features/Features';
import FAQ from '../components/faq/FAQ';
import Content from '../components/content/Content';
import Pricing from '../components/pricing/Pricing';
import CTA from '../components/cta/CTA';
import Testimonials from '../components/testimonials/Testimonials';
import Contact from '../components/contact/Contact';
import Gallery from '../components/gallery/Gallery';

const SECTION_COMPONENTS = {
  hero: Hero,
  features: Features,
  faq: FAQ,
  content: Content,
  pricing: Pricing,
  cta: CTA,
  testimonials: Testimonials,
  contact: Contact,
  gallery: Gallery
};

function DynamicPage({ slug: propSlug }) {
  const urlSlug = useParams().slug;
  const slug = propSlug || urlSlug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPageBySlug(slug);
        setPage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page non trouvée</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  const renderSections = () => {
    if (!page.sections || page.sections.length === 0) {
      return (
        <div className="py-20 text-center">
          <p className="text-gray-600">Aucun contenu pour cette page.</p>
        </div>
      );
    }

    return page.sections
      .sort((a, b) => a.position - b.position)
      .filter(section => section.isEnabled !== false)
      .map((section) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) {
          return (
            <div key={section.id} className="py-8">
              <p>Type de section inconnu: {section.type}</p>
            </div>
          );
        }
        return <Component key={section.id} content={section.content} />;
      });
  };

  return (
    <div className="dynamic-page">
      {renderSections()}
    </div>
  );
}

export default DynamicPage;