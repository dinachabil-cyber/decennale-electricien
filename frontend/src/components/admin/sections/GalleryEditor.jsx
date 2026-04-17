import React, { useState } from 'react';

export default function GalleryEditor({ content, onSave, onCancel }) {
  const [images, setImages] = useState(
    content?.images || [{ url: '', alt: '', caption: '' }]
  );

  const addImage = () => {
    setImages([...images, { url: '', alt: '', caption: '' }]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    const updated = [...images];
    updated[index][field] = value;
    setImages(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ images });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">Images</h4>
        <button
          type="button"
          onClick={addImage}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Ajouter une image
        </button>
      </div>

      {images.map((image, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-gray-600">Image {index + 1}</span>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">URL de l'image</label>
              <input
                type="text"
                value={image.url}
                onChange={(e) => updateImage(index, 'url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="/images/photo.jpg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Texte alternatif</label>
              <input
                type="text"
                value={image.alt}
                onChange={(e) => updateImage(index, 'alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Description de l'image"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Légende</label>
              <input
                type="text"
                value={image.caption}
                onChange={(e) => updateImage(index, 'caption', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Légende optionnelle"
              />
            </div>
          </div>
        </div>
      ))}

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