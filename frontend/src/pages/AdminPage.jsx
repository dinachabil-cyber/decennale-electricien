import React, { useState } from 'react';
import { settingsApi, mediaApi } from '../api/cms';
import AdminLayout from '../admin/layout/AdminLayout';
import PageList from '../admin/pages/PageList';
import SectionManager from '../admin/sections/SectionManager';

export default function AdminPage() {
  const [tab, setTab] = useState('pages');
  const [selectedPage, setSelectedPage] = useState(null);

  const tabs = [
    { id: 'pages', label: 'Pages' },
    { id: 'settings', label: 'Paramètres' },
    { id: 'media', label: 'Médias' },
  ];

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab} tabs={tabs}>
      {tab === 'pages' && !selectedPage && (
        <PageList
          onSelectPage={(page) => { setSelectedPage(page); setTab('sections'); }}
        />
      )}

      {tab === 'sections' && selectedPage && (
        <SectionManager
          page={selectedPage}
          onBack={() => { setSelectedPage(null); setTab('pages'); }}
        />
      )}

      {tab === 'settings' && <Settings />}

      {tab === 'media' && <Media />}
    </AdminLayout>
  );
}

function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    settingsApi.get().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(settings);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h2>
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <Input label="Titre du Site" value={settings.siteTitle || ''} onChange={(v) => setSettings({ ...settings, siteTitle: v })} />
        <Input label="Sous-titre" value={settings.siteSubtitle || ''} onChange={(v) => setSettings({ ...settings, siteSubtitle: v })} />
        <Input label="Téléphone" value={settings.phone || ''} onChange={(v) => setSettings({ ...settings, phone: v })} />
        <Input label="Email" value={settings.email || ''} onChange={(v) => setSettings({ ...settings, email: v })} />
        <Input label="Adresse" value={settings.address || ''} onChange={(v) => setSettings({ ...settings, address: v })} />
        <Input label="Texte Footer" value={settings.footerText || ''} onChange={(v) => setSettings({ ...settings, footerText: v })} />
        <button type="submit" disabled={saving} className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 disabled:opacity-50">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}

function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    mediaApi.getAll().then(setMedia).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await mediaApi.upload(file);
      const data = await mediaApi.getAll();
      setMedia(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Supprimer?')) return;
    try {
      await mediaApi.delete(filename);
      setMedia(media.filter(m => m.filename !== filename));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Médiathèque</h2>
      <label className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 cursor-pointer mb-6 inline-block">
        + Uploader
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>
      <div className="grid grid-cols-4 gap-4">
        {media.map(item => (
          <div key={item.filename} className="bg-white rounded shadow p-2">
            <img src={item.url} alt={item.filename} className="w-full h-32 object-cover rounded" />
            <p className="text-xs text-gray-500 mt-2 truncate">{item.filename}</p>
            <button onClick={() => handleDelete(item.filename)} className="mt-2 w-full px-2 py-1 bg-red-500 text-white text-xs rounded">
              Supprimer
            </button>
          </div>
        ))}
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