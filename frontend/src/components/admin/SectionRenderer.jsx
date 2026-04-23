import React, { useState, useEffect } from 'react';
import { loadSectionEditor, getSectionConfig, validateSection } from '../../config/sectionConfig';

export default function SectionRenderer({ section, onSave, onCancel }) {
  const [EditorComponent, setEditorComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Debug
  console.log('🔄 SectionRenderer received section:', section);

  const config = getSectionConfig(section.type);

  useEffect(() => {
    const loadEditor = async () => {
      try {
        setLoading(true);
        setError(null);
        const Component = await loadSectionEditor(section.type);
        setEditorComponent(() => Component);
      } catch (err) {
        setError(`Impossible de charger l'éditeur pour le type "${section.type}": ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (section.type) {
      loadEditor();
    }
  }, [section.type]);

  const handleSave = (content) => {
    console.group('💾 AdminSectionRenderer handleSave');
    console.log('section.type:', section.type);
    console.log('content received:', content);
    console.groupEnd();

    // Validate content before saving
    const validation = validateSection(section.type, content);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});
    // Only pass the updated content to parent
    onSave(content);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Chargement de l'éditeur...
          </h3>
        </div>
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={onCancel}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Fermer
        </button>
      </div>
    );
  }

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

  // Debug: inspect section and content before rendering
  console.log('🔍 SectionRenderer render:', {
    sectionId: section.id,
    sectionType: section.type,
    sectionContentKeys: Object.keys(section.content || {}),
    contentToPass: section.content
  });

  return (
    <div className="bg-white rounded-lg">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Modifier: {config?.label || section.type}
        </h3>
        {config?.description && (
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        )}
      </div>

      <div className="p-6">
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Erreurs de validation:</h4>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>{field}: {error}</li>
              ))}
            </ul>
          </div>
        )}

        <EditorComponent
          content={section.content}
          onSave={handleSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}