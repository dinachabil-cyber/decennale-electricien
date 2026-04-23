import React, { useState, useEffect } from 'react';
import { pagesApi, sectionsApi } from '../../api/cms';
import { getDefaultContent, getSectionLabel, getSectionIcon, getAllSectionTypes } from '../../sections/registry';
import AdminSectionRenderer from '../../components/admin/SectionRenderer';
import FrontendSectionRenderer from '../../components/sections/SectionRenderer';

export default function SectionManager({ page, onBack }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState('hero');
  const [editingSection, setEditingSection] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await pagesApi.getById(page.id);
      setSections(data.sections || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSections(); }, [page.id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await sectionsApi.create(page.id, {
        type: newType,
        content: getDefaultContent(newType),
      });
      loadSections();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (updatedContent) => {
    try {
      // SectionRenderer now passes only content directly
      const contentToSave = updatedContent;
      await sectionsApi.update(editingSection.id, { content: contentToSave });
      loadSections();
      setEditingSection(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette section?')) return;
    try {
      await sectionsApi.delete(id);
      loadSections();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      await sectionsApi.toggle(id);
      loadSections();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReorder = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(newIndex, 0, moved);

    try {
      await sectionsApi.reorder(page.id, newSections.map(s => s.id));
      loadSections();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sections: {page.title}</h2>
          <p className="text-gray-500">/{page.slug}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            ← Retour
          </button>
          <button 
            onClick={() => window.open(`/${page.slug}?preview=true`, '_blank')} 
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            👁️ Aperçu Page
          </button>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500">
            + Ajouter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            index={index}
            total={sections.length}
            onMoveUp={() => handleReorder(index, 'up')}
            onMoveDown={() => handleReorder(index, 'down')}
            onToggle={() => handleToggle(section.id)}
            onEdit={() => setEditingSection(section)}
            onDelete={() => handleDelete(section.id)}
            onPreview={() => setPreviewSection(section)}
          />
        ))}
        {sections.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            Aucune section. Ajoutez votre première section.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Nouvelle Section</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {getAllSectionTypes().map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-400 rounded">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold">
                Modifier: {getSectionLabel(editingSection.type)}
              </h3>
            </div>
            <div className="p-6">
              <AdminSectionRenderer
                section={editingSection}
                onSave={handleUpdate}
                onCancel={() => setEditingSection(null)}
              />
            </div>
          </div>
        </div>
      )}

      {previewSection && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Aperçu: {getSectionLabel(previewSection.type)}
              </h3>
              <button 
                onClick={() => setPreviewSection(null)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
            <div className="p-4">
              <div className="border rounded-lg overflow-hidden">
                <FrontendSectionRenderer section={previewSection} mode="frontend" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ section, index, total, onMoveUp, onMoveDown, onToggle, onEdit, onDelete, onPreview }) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${!section.isEnabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-gray-400">#{index + 1}</span>
          <span className="font-medium">
            {getSectionIcon(section.type)} {getSectionLabel(section.type)}
          </span>
          <span className={`px-2 py-1 text-xs rounded ${section.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
            {section.isEnabled ? 'Actif' : 'Désactivé'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onMoveUp} disabled={index === 0} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">↓</button>
          <button onClick={onToggle} className="px-3 py-1 text-sm rounded">
            {section.isEnabled ? 'Désactiver' : 'Activer'}
          </button>
          <button onClick={onPreview} className="px-3 py-1 text-sm bg-purple-500 text-white rounded">Aperçu</button>
          <button onClick={onEdit} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">Modifier</button>
          <button onClick={onDelete} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Supprimer</button>
        </div>
      </div>
      <ContentPreview section={section} />
    </div>
  );
}

function ContentPreview({ section }) {
  const { type, content } = section;
  
  if (type === 'hero') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Titre:</strong> {content.title || '-'}</p>
        <p><strong>Sous-titre:</strong> {content.subtitle || '-'}</p>
      </div>
    );
  }
  if (type === 'content') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Introduction:</strong> {content.introduction?.substring(0, 100) || '-'}...</p>
      </div>
    );
  }

  if (type === 'faq') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Questions:</strong> {content.items?.length || 0} item(s)</p>
      </div>
    );
  }
  if (type === 'cards') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Cartes:</strong> {content.cards?.length || 0} carte(s)</p>
      </div>
    );
  }
  if (type === 'cta') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Titre:</strong> {content.title || '-'}</p>
      </div>
    );
  }
  if (type === 'steps') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Étapes:</strong> {content.steps?.length || 0} étape(s)</p>
      </div>
    );
  }
  if (type === 'form') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Formulaire:</strong> {content.title || '-'}</p>
        <p><strong>Champs:</strong> {content.fields?.length || 0} champ(s)</p>
      </div>
    );
  }
  if (type === 'footer') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Texte:</strong> {content.text?.substring(0, 50) || '-'}...</p>
        <p><strong>Liens:</strong> {content.links?.length || 0} lien(s)</p>
      </div>
    );
  }
  return null;
}



function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
    </div>
  );
}