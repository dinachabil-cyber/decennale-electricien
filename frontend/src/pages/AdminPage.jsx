import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchAllPages, createPage, updatePage, deletePage, togglePagePublish,
  fetchMedia, uploadMedia, deleteMedia,
  fetchSettings, updateSettings,
  logout as apiLogout
} from '../api/cms';

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'features', label: 'Features' },
  { value: 'content', label: 'Content' },
  { value: 'faq', label: 'FAQ' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'cta', label: 'CTA' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'contact', label: 'Contact' },
  { value: 'gallery', label: 'Gallery' }
];

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });
  const [settings, setSettings] = useState({});
  const [media, setMedia] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSection, setNewSection] = useState({ type: 'hero', content: {} });
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    loadPages();
    loadSettings();
    loadMedia();
  }, []);

  const loadPages = async () => {
    try {
      const data = await fetchAllPages();
      setPages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadMedia = async () => {
    try {
      const data = await fetchMedia();
      setMedia(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    try {
      await createPage(newPage);
      setShowNewPageModal(false);
      setNewPage({ title: '', slug: '' });
      loadPages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePage = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page?')) {
      try {
        await deletePage(id);
        loadPages();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await togglePagePublish(id);
      loadPages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      setShowSettingsModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUploadMedia = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadMedia(file);
        loadMedia();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteMedia = async (filename) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image?')) {
      try {
        await deleteMedia(filename);
        loadMedia();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    apiLogout();
    navigate('/login');
  };

  const selectPage = async (page) => {
    setSelectedPage(page);
    try {
      const pageData = await fetchAllPages().then(() => {
        return fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${page.id}`).then(r => r.json());
      });
      setSections(pageData.sections || []);
      setActiveTab('sections');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${selectedPage.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection)
      });
      if (response.ok) {
        const pageData = await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${selectedPage.id}`).then(r => r.json());
        setSections(pageData.sections || []);
        setShowSectionModal(false);
        setNewSection({ type: 'hero', content: {} });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateSection = async (section, content) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const pageData = await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${selectedPage.id}`).then(r => r.json());
      setSections(pageData.sections || []);
      setEditingSection(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section?')) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/sections/${sectionId}`, {
          method: 'DELETE'
        });
        const pageData = await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${selectedPage.id}`).then(r => r.json());
        setSections(pageData.sections || []);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleToggleSection = async (sectionId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/sections/${sectionId}/toggle`, {
        method: 'PATCH'
      });
      const pageData = await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${selectedPage.id}`).then(r => r.json());
      setSections(pageData.sections || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReorderSections = async (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    const sectionIds = newSections.map(s => s.id);
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${selectedPage.id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: sectionIds })
      });
      const pageData = await fetch(`${process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api'}/pages/${selectedPage.id}`).then(r => r.json());
      setSections(pageData.sections || []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => { setActiveTab('pages'); setSelectedPage(null); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'pages' ? 'bg-yellow-400 text-dark' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Pages
                </button>
                {selectedPage && (
                  <button
                    onClick={() => setActiveTab('sections')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'sections' ? 'bg-yellow-400 text-dark' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Sections
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'settings' ? 'bg-yellow-400 text-dark' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Paramètres
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'media' ? 'bg-yellow-400 text-dark' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Médias
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'pages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestion des Pages</h2>
              <button
                onClick={() => setShowNewPageModal(true)}
                className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 font-medium"
              >
                + Nouvelle Page
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{page.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">/page/{page.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {page.isPublished ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleTogglePublish(page.id)}
                            className={`px-3 py-1 text-sm rounded ${page.isPublished ? 'bg-gray-200 text-gray-700' : 'bg-green-500 text-white'}`}
                          >
                            {page.isPublished ? 'Dépublier' : 'Publier'}
                          </button>
                          <button
                            onClick={() => selectPage(page)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Gérer Sections
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pages.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        Aucune page. Créez votre première page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sections' && selectedPage && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Sections: {selectedPage.title}</h2>
                <p className="text-gray-500">/page/{selectedPage.slug}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => { setActiveTab('pages'); setSelectedPage(null); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  ← Retour
                </button>
                <button
                  onClick={() => setShowSectionModal(true)}
                  className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 font-medium"
                >
                  + Ajouter Section
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id} className={`bg-white rounded-lg shadow p-4 ${!section.isEnabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">{index + 1}</span>
                      <span className="font-medium text-gray-800">{section.type}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${section.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {section.isEnabled ? 'Actif' : 'Désactivé'}
                      </span>
                    </div>
                     <div className="flex space-x-2">
                       <button
                         onClick={() => handleReorderSections(index, index - 1)}
                         disabled={index === 0}
                         className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                         title="Monter"
                       >
                         ▲
                       </button>
                       <button
                         onClick={() => handleReorderSections(index, index + 1)}
                         disabled={index === sections.length - 1}
                         className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                         title="Descendre"
                       >
                         ▼
                       </button>
                       <button
                         onClick={() => handleToggleSection(section.id)}
                         className="px-3 py-1 text-sm rounded"
                       >
                         {section.isEnabled ? 'Désactiver' : 'Activer'}
                       </button>
                       <button
                         onClick={() => setEditingSection(section)}
                         className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                       >
                         Modifier
                       </button>
                       <button
                         onClick={() => handleDeleteSection(section.id)}
                         className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                       >
                         Supprimer
                       </button>
                     </div>
                  </div>
                  <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(section.content, null, 2)}
                  </pre>
                </div>
              ))}
              {sections.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                  Aucune section. Ajoutez votre première section.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres Globaux</h2>
            <form onSubmit={handleSaveSettings} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du Site</label>
                <input
                  type="text"
                  value={settings.siteTitle || ''}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={settings.siteSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, siteSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte Footer</label>
                <input
                  type="text"
                  value={settings.footerText || ''}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 font-medium"
              >
                Enregistrer
              </button>
            </form>
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Médiathèque</h2>
            <div className="mb-6">
              <label className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 cursor-pointer font-medium">
                + Uploader une image
                <input type="file" accept="image/*" onChange={handleUploadMedia} className="hidden" />
              </label>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.filename} className="bg-white rounded-lg shadow p-2">
                  <img src={item.url} alt={item.filename} className="w-full h-32 object-cover rounded" />
                  <p className="text-xs text-gray-500 mt-2 truncate">{item.filename}</p>
                  <button
                    onClick={() => handleDeleteMedia(item.filename)}
                    className="mt-2 w-full px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              {media.length === 0 && (
                <p className="col-span-4 text-center text-gray-500 py-8">
                 Aucune image. Uploadez votre première image.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {showNewPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nouvelle Page</h3>
            <form onSubmit={handleCreatePage}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">/page/{newPage.slug || 'slug'}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nouvelle Section</h3>
            <form onSubmit={handleAddSection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de Section</label>
                <select
                  value={newSection.type}
                  onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {SECTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (JSON)</label>
                <textarea
                  value={JSON.stringify(newSection.content, null, 2)}
                  onChange={(e) => {
                    try {
                      setNewSection({ ...newSection, content: JSON.parse(e.target.value) });
                    } catch (err) {}
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-48 font-mono text-xs"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Modifier Section: {editingSection.type}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (JSON)</label>
              <textarea
                defaultValue={JSON.stringify(editingSection.content, null, 2)}
                onBlur={(e) => {
                  try {
                    const content = JSON.parse(e.target.value);
                    handleUpdateSection(editingSection, content);
                  } catch (err) {
                    alert('JSON invalide');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-96 font-mono text-xs"
              />
            </div>
            <button
              onClick={() => setEditingSection(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;