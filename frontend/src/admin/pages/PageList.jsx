import React, { useState } from 'react';
import { pagesApi } from '../../api/cms';

export default function PageList({ onSelectPage, onRefresh }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });

  const loadPages = async () => {
    try {
      setLoading(true);
      const data = await pagesApi.getAll();
      console.log('Pages API response:', data);
      // Ensure we always set an array
      const pagesArray = Array.isArray(data) ? data : [];
      setPages(pagesArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadPages(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await pagesApi.create(newPage);
      setShowModal(false);
      setNewPage({ title: '', slug: '' });
      loadPages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette page?')) return;
    try {
      await pagesApi.delete(id);
      loadPages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await pagesApi.togglePublish(id);
      loadPages();
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
          <button onClick={() => setError(null)} className="ml-4 text-red-800">✕</button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pages</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500">
          + Nouvelle Page
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{page.title}</td>
                <td className="px-6 py-4 text-gray-500">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {page.isPublished ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTogglePublish(page.id)}
                      className={`px-3 py-1 text-sm rounded ${page.isPublished ? 'bg-gray-200' : 'bg-green-500 text-white'}`}
                    >
                      {page.isPublished ? 'Dépublier' : 'Publier'}
                    </button>
                    <button
                      onClick={() => onSelectPage(page)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                    >
                      Sections
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Nouvelle Page</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">/page/{newPage.slug}</p>
              </div>
              <div className="flex space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-400 rounded">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}