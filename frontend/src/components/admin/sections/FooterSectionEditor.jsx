import React, { useState } from 'react';

export default function FooterSectionEditor({ content, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    text: content?.text || '',
    links: content?.links || [{ label: '', url: '' }],
    showSocialLinks: content?.showSocialLinks || false,
    socialLinks: content?.socialLinks || {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }]
    }));
  };

  const updateLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Texte du copyright</label>
        <input
          type="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="© 2024 Votre Entreprise"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Liens de navigation</label>
          <button
            type="button"
            onClick={addLink}
            className="px-3 py-1 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 text-sm font-medium"
          >
            + Ajouter un lien
          </button>
        </div>

        <div className="space-y-3">
          {formData.links.map((link, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 items-end p-4 border border-gray-200 rounded-lg">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Mentions légales"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                  placeholder="/legal"
                />
              </div>
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="px-2 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 w-full md:w-auto"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.showSocialLinks}
            onChange={(e) => setFormData({ ...formData, showSocialLinks: e.target.checked })}
            className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400"
          />
          <span className="text-sm font-medium text-gray-700">Afficher les liens sociaux</span>
        </label>

        {formData.showSocialLinks && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Facebook</label>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Twitter</label>
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn</label>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instagram</label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-500 font-medium"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}