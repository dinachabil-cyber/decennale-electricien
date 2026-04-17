import React, { useState, useEffect } from 'react';
import { pagesApi, sectionsApi } from '../../api/cms';
import { getDefaultContent, getSectionLabel, getSectionIcon, getAllSectionTypes } from '../../sections/registry';
import SectionRenderer from '../../components/sections/SectionRenderer';

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

  const handleUpdate = async (content) => {
    try {
      await sectionsApi.update(editingSection.id, { content });
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
              <SectionEditor
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
                <SectionRenderer section={previewSection} mode="admin" />
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
  if (type === 'features') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Features:</strong> {content.features?.length || 0} item(s)</p>
      </div>
    );
  }
  if (type === 'pricing') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Plans:</strong> {content.plans?.length || 0} item(s)</p>
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
  if (type === 'contact') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Email:</strong> {content.email || '-'}</p>
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
  if (type === 'testimonials') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Témoignages:</strong> {content.testimonials?.length || 0} item(s)</p>
      </div>
    );
  }
  if (type === 'gallery') {
    return (
      <div className="border-t pt-3 text-sm text-gray-600">
        <p><strong>Images:</strong> {content.images?.length || 0} item(s)</p>
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

function SectionEditor({ section, onSave, onCancel }) {
  const [content, setContent] = useState(section.content || {});

  const handleChange = (key, value) => {
    setContent({ ...content, [key]: value });
  };

  const handleNestedChange = (parentKey, index, key, value) => {
    const items = [...(content[parentKey] || [])];
    items[index] = { ...items[index], [key]: value };
    setContent({ ...content, [parentKey]: items });
  };

  const addItem = (parentKey, defaultItem) => {
    const items = [...(content[parentKey] || []), defaultItem];
    setContent({ ...content, [parentKey]: items });
  };

  const removeItem = (parentKey, index) => {
    const items = [...(content[parentKey] || [])];
    items.splice(index, 1);
    setContent({ ...content, [parentKey]: items });
  };

  const handleSave = () => onSave(content);

  return (
    <div>
      {section.type === 'hero' && (
        <div className="space-y-4">
          <Input label="Titre" value={content.title || ''} onChange={(v) => handleChange('title', v)} />
          <Input label="Sous-titre" value={content.subtitle || ''} onChange={(v) => handleChange('subtitle', v)} />
          <Input label="Texte bouton" value={content.ctaText || ''} onChange={(v) => handleChange('ctaText', v)} />
          <Input label="Lien bouton" value={content.ctaLink || ''} onChange={(v) => handleChange('ctaLink', v)} />
          <Input label="Image fond (URL)" value={content.backgroundImage || ''} onChange={(v) => handleChange('backgroundImage', v)} />
        </div>
      )}

      {section.type === 'content' && (
        <div className="space-y-4">
          <Input label="Titre" value={content.title || ''} onChange={(v) => handleChange('title', v)} />
          <Textarea label="Introduction" value={content.introduction || ''} onChange={(v) => handleChange('introduction', v)} />
          <div>
            <label className="block text-sm font-medium mb-2">Sections</label>
            {(content.sections || []).map((s, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded mb-2">
                <Input label="Titre" value={s.title || ''} onChange={(v) => handleNestedChange('sections', i, 'title', v)} />
                <Textarea label="Contenu" value={s.content || ''} onChange={(v) => handleNestedChange('sections', i, 'content', v)} />
                <button onClick={() => removeItem('sections', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
              </div>
            ))}
            <button onClick={() => addItem('sections', { title: '', content: '' })} className="text-blue-500 text-sm">+ Ajouter</button>
          </div>
        </div>
      )}

      {section.type === 'features' && (
        <div>
          <label className="block text-sm font-medium mb-2">Fonctionnalités</label>
          {(content.features || []).map((f, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded mb-2">
              <Input label="Titre" value={f.title || ''} onChange={(v) => handleNestedChange('features', i, 'title', v)} />
              <Input label="Description" value={f.description || ''} onChange={(v) => handleNestedChange('features', i, 'description', v)} />
              <Input label="Icône" value={f.icon || ''} onChange={(v) => handleNestedChange('features', i, 'icon', v)} />
              <button onClick={() => removeItem('features', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
            </div>
          ))}
          <button onClick={() => addItem('features', { title: '', description: '', icon: 'star' })} className="text-blue-500 text-sm">+ Ajouter</button>
        </div>
      )}

      {section.type === 'pricing' && (
        <div>
          <label className="block text-sm font-medium mb-2">Plans</label>
          {(content.plans || []).map((p, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded mb-2">
              <Input label="Nom" value={p.name || ''} onChange={(v) => handleNestedChange('plans', i, 'name', v)} />
              <Input label="Prix" value={p.price || ''} onChange={(v) => handleNestedChange('plans', i, 'price', v)} />
              <Input label="Description" value={p.description || ''} onChange={(v) => handleNestedChange('plans', i, 'description', v)} />
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={p.featured || false} onChange={(v) => handleNestedChange('plans', i, 'featured', v.target.checked)} />
                Mis en avant
              </label>
              <button onClick={() => removeItem('plans', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
            </div>
          ))}
          <button onClick={() => addItem('plans', { name: '', price: '', features: [], featured: false })} className="text-blue-500 text-sm">+ Ajouter</button>
        </div>
      )}

      {section.type === 'faq' && (
        <div>
          <label className="block text-sm font-medium mb-2">Questions</label>
          {(content.items || []).map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded mb-2">
              <Input label="Question" value={item.question || ''} onChange={(v) => handleNestedChange('items', i, 'question', v)} />
              <Textarea label="Réponse" value={item.answer || ''} onChange={(v) => handleNestedChange('items', i, 'answer', v)} />
              <button onClick={() => removeItem('items', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
            </div>
          ))}
          <button onClick={() => addItem('items', { question: '', answer: '' })} className="text-blue-500 text-sm">+ Ajouter</button>
        </div>
      )}

      {section.type === 'contact' && (
        <div className="space-y-4">
          <Input label="Titre" value={content.title || ''} onChange={(v) => handleChange('title', v)} />
          <Input label="Sous-titre" value={content.subtitle || ''} onChange={(v) => handleChange('subtitle', v)} />
          <Input label="Email" value={content.email || ''} onChange={(v) => handleChange('email', v)} />
          <Input label="Téléphone" value={content.phone || ''} onChange={(v) => handleChange('phone', v)} />
          <Input label="Adresse" value={content.address || ''} onChange={(v) => handleChange('address', v)} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={content.showMap || false} onChange={(v) => handleChange('showMap', v.target.checked)} />
            Afficher carte
          </label>
        </div>
      )}

      {section.type === 'cta' && (
        <div className="space-y-4">
          <Input label="Titre" value={content.title || ''} onChange={(v) => handleChange('title', v)} />
          <Input label="Sous-titre" value={content.subtitle || ''} onChange={(v) => handleChange('subtitle', v)} />
          <Input label="Texte bouton" value={content.buttonText || ''} onChange={(v) => handleChange('buttonText', v)} />
          <Input label="Lien bouton" value={content.buttonLink || ''} onChange={(v) => handleChange('buttonLink', v)} />
        </div>
      )}

      {section.type === 'testimonials' && (
        <div>
          <label className="block text-sm font-medium mb-2">Témoignages</label>
          {(content.testimonials || []).map((t, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded mb-2">
              <Input label="Nom" value={t.name || ''} onChange={(v) => handleNestedChange('testimonials', i, 'name', v)} />
              <Input label="Rôle" value={t.role || ''} onChange={(v) => handleNestedChange('testimonials', i, 'role', v)} />
              <Textarea label="Citation" value={t.quote || ''} onChange={(v) => handleNestedChange('testimonials', i, 'quote', v)} />
              <button onClick={() => removeItem('testimonials', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
            </div>
          ))}
          <button onClick={() => addItem('testimonials', { name: '', role: '', quote: '', avatar: '' })} className="text-blue-500 text-sm">+ Ajouter</button>
        </div>
      )}

      {section.type === 'gallery' && (
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          {(content.images || []).map((img, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded mb-2">
              <Input label="URL" value={img.url || ''} onChange={(v) => handleNestedChange('images', i, 'url', v)} />
              <Input label="Alt" value={img.alt || ''} onChange={(v) => handleNestedChange('images', i, 'alt', v)} />
              <Input label="Légende" value={img.caption || ''} onChange={(v) => handleNestedChange('images', i, 'caption', v)} />
              <button onClick={() => removeItem('images', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
            </div>
          ))}
          <button onClick={() => addItem('images', { url: '', alt: '', caption: '' })} className="text-blue-500 text-sm">+ Ajouter</button>
        </div>
      )}

      {section.type === 'steps' && (
        <div>
          <label className="block text-sm font-medium mb-2">Étapes</label>
          {(content.steps || []).map((step, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded mb-2">
              <Input label="Numéro" value={step.number || ''} onChange={(v) => handleNestedChange('steps', i, 'number', v)} />
              <Input label="Titre" value={step.title || ''} onChange={(v) => handleNestedChange('steps', i, 'title', v)} />
              <Textarea label="Description" value={step.description || ''} onChange={(v) => handleNestedChange('steps', i, 'description', v)} />
              <button onClick={() => removeItem('steps', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
            </div>
          ))}
          <button onClick={() => addItem('steps', { number: '', title: '', description: '' })} className="text-blue-500 text-sm">+ Ajouter</button>
        </div>
      )}

      {section.type === 'form' && (
        <div className="space-y-4">
          <Input label="Titre" value={content.title || ''} onChange={(v) => handleChange('title', v)} />
          <Textarea label="Description" value={content.description || ''} onChange={(v) => handleChange('description', v)} />
          <Input label="Texte du bouton" value={content.submitText || ''} onChange={(v) => handleChange('submitText', v)} />
          <Input label="Email destinataire" value={content.email || ''} onChange={(v) => handleChange('email', v)} />
          <div>
            <label className="block text-sm font-medium mb-2">Champs du formulaire</label>
            {(content.fields || []).map((field, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded mb-2">
                <Input label="Nom du champ" value={field.name || ''} onChange={(v) => handleNestedChange('fields', i, 'name', v)} />
                <Input label="Label" value={field.label || ''} onChange={(v) => handleNestedChange('fields', i, 'label', v)} />
                <select value={field.type || 'text'} onChange={(e) => handleNestedChange('fields', i, 'type', e.target.value)} className="w-full px-3 py-2 border rounded">
                  <option value="text">Texte</option>
                  <option value="email">Email</option>
                  <option value="tel">Téléphone</option>
                  <option value="textarea">Zone de texte</option>
                </select>
                <label className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={field.required || false} onChange={(e) => handleNestedChange('fields', i, 'required', e.target.checked)} />
                  Champ obligatoire
                </label>
                <button onClick={() => removeItem('fields', i)} className="text-red-500 text-sm mt-2">Supprimer</button>
              </div>
            ))}
            <button onClick={() => addItem('fields', { name: '', label: '', type: 'text', required: false })} className="text-blue-500 text-sm">+ Ajouter un champ</button>
          </div>
        </div>
      )}

      {section.type === 'footer' && (
        <div className="space-y-4">
          <Textarea label="Texte du footer" value={content.text || ''} onChange={(v) => handleChange('text', v)} />
          <div>
            <label className="block text-sm font-medium mb-2">Liens</label>
            {(content.links || []).map((link, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded mb-2 flex gap-2 items-center">
                <div className="flex-1">
                  <Input label="Label" value={link.label || ''} onChange={(v) => handleNestedChange('links', i, 'label', v)} />
                </div>
                <div className="flex-1">
                  <Input label="URL" value={link.url || ''} onChange={(v) => handleNestedChange('links', i, 'url', v)} />
                </div>
                <button onClick={() => removeItem('links', i)} className="text-red-500 self-center mt-6">✕</button>
              </div>
            ))}
            <button onClick={() => addItem('links', { label: '', url: '' })} className="text-blue-500 text-sm">+ Ajouter un lien</button>
          </div>
        </div>
      )}

      <div className="flex space-x-2 mt-6">
        <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-200 rounded">Annuler</button>
        <button onClick={handleSave} className="flex-1 px-4 py-2 bg-yellow-400 rounded">Enregistrer</button>
      </div>
    </div>
  );
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