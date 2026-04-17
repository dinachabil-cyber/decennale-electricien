import { useState, useCallback, useEffect } from 'react';
import { cmsApi } from '../services/cmsApi';

export function usePageEditor(pageId) {
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadPage = useCallback(async () => {
    if (!pageId) return;
    
    try {
      setLoading(true);
      const data = await cmsApi.loadPageWithSections(pageId);
      setPage(data);
      setSections(data.sections || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const addSection = useCallback(async (type) => {
    setSaving(true);
    try {
      const newSection = await cmsApi.addSection(pageId, { type });
      setSections(prev => [...prev, newSection]);
      return newSection;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [pageId]);

  const updateSection = useCallback(async (sectionId, content) => {
    setSaving(true);
    try {
      await cmsApi.updateSection(sectionId, content);
      setSections(prev => prev.map(s => 
        s.id === sectionId ? { ...s, content } : s
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteSection = useCallback(async (sectionId) => {
    try {
      await cmsApi.deleteSection(sectionId);
      setSections(prev => prev.filter(s => s.id !== sectionId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleSection = useCallback(async (sectionId) => {
    try {
      const updated = await cmsApi.toggleSection(sectionId);
      setSections(prev => prev.map(s => 
        s.id === sectionId ? { ...s, isEnabled: updated.isEnabled } : s
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const reorderSections = useCallback(async (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    
    setSections(newSections);
    
    try {
      const sectionIds = newSections.map(s => s.id);
      await cmsApi.reorderSections(pageId, sectionIds);
    } catch (err) {
      setError(err.message);
      loadPage();
    }
  }, [sections, pageId, loadPage]);

  const moveSectionUp = useCallback((index) => {
    if (index > 0) {
      reorderSections(index, index - 1);
    }
  }, [reorderSections]);

  const moveSectionDown = useCallback((index) => {
    if (index < sections.length - 1) {
      reorderSections(index, index + 1);
    }
  }, [reorderSections]);

  return {
    page,
    sections,
    loading,
    error,
    saving,
    addSection,
    updateSection,
    deleteSection,
    toggleSection,
    moveSectionUp,
    moveSectionDown,
    refresh: loadPage
  };
}

export default usePageEditor;