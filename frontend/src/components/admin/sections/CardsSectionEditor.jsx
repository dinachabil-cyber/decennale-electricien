import React, { useState } from 'react';

export default function CardsSectionEditor({ content, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    subtitle: content?.subtitle || '',
    cards: content?.cards || [
      { 
        title: '', 
        subtitle: '', 
        bulletPoints: [''],
        buttonText: '',
        buttonLink: '',
        icon: '' 
      }
    ]
  });

  const handleCardChange = (index, field, value) => {
    const newCards = [...formData.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData({ ...formData, cards: newCards });
  };

  const handleBulletPointChange = (cardIndex, pointIndex, value) => {
    const newCards = [...formData.cards];
    const newPoints = [...(newCards[cardIndex].bulletPoints || [])];
    newPoints[pointIndex] = value;
    newCards[cardIndex] = { ...newCards[cardIndex], bulletPoints: newPoints };
    setFormData({ ...formData, cards: newCards });
  };

  const addBulletPoint = (cardIndex) => {
    const newCards = [...formData.cards];
    newCards[cardIndex] = {
      ...newCards[cardIndex],
      bulletPoints: [...(newCards[cardIndex].bulletPoints || []), '']
    };
    setFormData({ ...formData, cards: newCards });
  };

  const removeBulletPoint = (cardIndex, pointIndex) => {
    const newCards = [...formData.cards];
    const newPoints = newCards[cardIndex].bulletPoints.filter((_, i) => i !== pointIndex);
    newCards[cardIndex] = { ...newCards[cardIndex], bulletPoints: newPoints };
    setFormData({ ...formData, cards: newCards });
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { 
        title: '', 
        subtitle: '', 
        bulletPoints: [''],
        buttonText: '',
        buttonLink: '',
        icon: '' 
      }]
    });
  };

  const removeCard = (index) => {
    if (formData.cards.length > 1) {
      setFormData({
        ...formData,
        cards: formData.cards.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Titre de la section"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Sous-titre optionnel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cartes</label>
        {formData.cards.map((card, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg mb-3 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Carte {index + 1}</span>
              {formData.cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Supprimer
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Titre</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                  placeholder="Titre de la carte"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Icône</label>
                <input
                  type="text"
                  value={card.icon}
                  onChange={(e) => handleCardChange(index, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                  placeholder="star, bolt, shield..."
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">Sous-titre</label>
              <input
                type="text"
                value={card.subtitle || ''}
                onChange={(e) => handleCardChange(index, 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                placeholder="Sous-titre optionnel"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-2">Points de liste</label>
              {(card.bulletPoints || ['']).map((point, pointIndex) => (
                <div key={pointIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleBulletPointChange(index, pointIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                    placeholder={`Point ${pointIndex + 1}`}
                  />
                  {(card.bulletPoints || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBulletPoint(index, pointIndex)}
                      className="text-red-500 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBulletPoint(index)}
                className="text-blue-500 text-sm"
              >
                + Ajouter un point
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Texte bouton</label>
                <input
                  type="text"
                  value={card.buttonText || ''}
                  onChange={(e) => handleCardChange(index, 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                  placeholder="Obtenir mon devis"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Lien bouton</label>
                <input
                  type="text"
                  value={card.buttonLink || ''}
                  onChange={(e) => handleCardChange(index, 'buttonLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                  placeholder="#contactForm"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCard}
          className="text-blue-500 text-sm hover:text-blue-700 font-medium"
        >
          + Ajouter une carte
        </button>
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
