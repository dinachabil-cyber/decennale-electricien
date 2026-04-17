import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cmsApi } from '../services/cmsApi';
import { SectionRenderer } from '../sections/SectionRenderer';

const PageLoadingFallback = () => (
  <div className="py-20 text-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
  </div>
);

const PageErrorFallback = ({ error, onRetry }) => (
  <div className="py-20 text-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
    <p className="text-gray-600 mb-4">{error}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500"
      >
        Réessayer
      </button>
    )}
  </div>
);

const EmptyPageFallback = () => (
  <div className="py-20 text-center">
    <p className="text-gray-600">Aucun contenu pour cette page.</p>
  </div>
);

function DynamicPage({ slug: propSlug }) {
  const navigate = useNavigate();
  const urlSlug = useParams().slug;
  const slug = propSlug || urlSlug;
  
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPage = useCallback(async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await cmsApi.fetchPageBySlug(slug);
      setPage(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const sections = useMemo(() => {
    if (!page?.sections) return [];
    return page.sections
      .filter(section => section.isEnabled !== false)
      .sort((a, b) => a.position - b.position);
  }, [page?.sections]);

  if (loading) return <PageLoadingFallback />;
  
  if (error) {
    if (error.includes('not found') || error.includes('Page not found')) {
      return (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Page non trouvée</h2>
          <p className="text-gray-500 text-sm">Cette page n'existe pas.</p>
        </div>
      );
    }
    return <PageErrorFallback error={error} onRetry={loadPage} />;
  }

  if (!page) return null;

  return (
    <div className="dynamic-page" data-page-id={page.id} data-page-slug={page.slug}>
      {sections.length === 0 ? (
        <EmptyPageFallback />
      ) : (
        sections.map((section, index) => (
          <SectionRenderer
            key={`${section.type}-${section.id}-${index}`}
            section={section}
            mode="frontend"
          />
        ))
      )}
    </div>
  );
}

export default DynamicPage;