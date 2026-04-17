import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { pagesApi } from '../api/cms';
import SectionRenderer from '../components/sections/SectionRenderer';

function Loading() {
  return (
    <div className="py-20 text-center">
      <div className="inline-block w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Page non trouvée</h2>
      <p className="text-gray-500">Cette page n'existe pas.</p>
    </div>
  );
}

function Error({ message }) {
  return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

function Empty() {
  return (
    <div className="py-20 text-center text-gray-500">
      Aucun contenu pour cette page.
    </div>
  );
}

export default function DynamicPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageSlug = slug || 'home';
  const isPreview = searchParams.get('preview') === 'true';

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (isPreview) {
          data = await pagesApi.getBySlug(pageSlug);
        } else {
          data = await pagesApi.getBySlug(pageSlug);
        }
        setPage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [pageSlug, isPreview]);

  const sections = useMemo(() => {
    if (!page?.sections) return [];
    return page.sections
      .filter(s => s.isEnabled !== false)
      .sort((a, b) => a.position - b.position);
  }, [page?.sections]);

  if (loading) return <Loading />;
  if (error) {
    if (error.includes('not found')) return <NotFound />;
    return <Error message={error} />;
  }
  if (!page) return <NotFound />;

  return (
    <main data-page-id={page.id} data-page-slug={page.slug}>
      {sections.length === 0 ? (
        <Empty />
      ) : (
        sections.map(section => (
          <SectionRenderer key={section.id} section={section} mode="frontend" />
        ))
      )}
    </main>
  );
}