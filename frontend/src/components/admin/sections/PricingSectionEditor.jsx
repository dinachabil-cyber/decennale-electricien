import React, { useState } from 'react';

export default function PricingSectionEditor({ content, onSave, onCancel }) {
  const [plans, setPlans] = useState(
    content?.plans || [{ name: '', price: '', features: [], featured: false }]
  );

  const addPlan = () => {
    setPlans([...plans, { name: '', price: '', features: [], featured: false }]);
  };

  const removePlan = (index) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const updatePlan = (index, field, value) => {
    const updated = [...plans];
    updated[index][field] = value;
    setPlans(updated);
  };

  const addFeature = (planIndex) => {
    const updated = [...plans];
    updated[planIndex].features = [...updated[planIndex].features, ''];
    setPlans(updated);
  };

  const removeFeature = (planIndex, featureIndex) => {
    const updated = [...plans];
    updated[planIndex].features = updated[planIndex].features.filter((_, i) => i !== featureIndex);
    setPlans(updated);
  };

  const updateFeature = (planIndex, featureIndex, value) => {
    const updated = [...plans];
    updated[planIndex].features[featureIndex] = value;
    setPlans(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ plans });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">Plans tarifaires</h4>
        <button
          type="button"
          onClick={addPlan}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Ajouter un plan
        </button>
      </div>

      {plans.map((plan, planIndex) => (
        <div key={planIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Plan {planIndex + 1}</span>
              {plan.featured && (
                <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">Mis en avant</span>
              )}
            </div>
            {plans.length > 1 && (
              <button
                type="button"
                onClick={() => removePlan(planIndex)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nom du plan</label>
              <input
                type="text"
                value={plan.name}
                onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Basique"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Prix</label>
              <input
                type="text"
                value={plan.price}
                onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="49€/mois"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={plan.featured}
                  onChange={(e) => updatePlan(planIndex, 'featured', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                />
                <span className="text-sm text-gray-700">Mis en avant</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-gray-500">Fonctionnalités</label>
              <button
                type="button"
                onClick={() => addFeature(planIndex)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(planIndex, featureIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Fonctionnalité..."
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(planIndex, featureIndex)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {plan.features.length === 0 && (
                <p className="text-xs text-gray-400">Aucune fonctionnalité ajoutée</p>
              )}
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