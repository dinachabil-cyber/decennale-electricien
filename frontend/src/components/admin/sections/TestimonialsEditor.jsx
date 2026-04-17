import React, { useState } from 'react';

export default function TestimonialsEditor({ content, onSave, onCancel }) {
  const [testimonials, setTestimonials] = useState(
    content?.testimonials || [{ name: '', role: '', quote: '', avatar: '' }]
  );

  const addTestimonial = () => {
    setTestimonials([...testimonials, { name: '', role: '', quote: '', avatar: '' }]);
  };

  const removeTestimonial = (index) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const updateTestimonial = (index, field, value) => {
    const updated = [...testimonials];
    updated[index][field] = value;
    setTestimonials(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ testimonials });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">Témoignages</h4>
        <button
          type="button"
          onClick={addTestimonial}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Ajouter un témoignage
        </button>
      </div>

      {testimonials.map((testimonial, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-gray-600">Témoignage {index + 1}</span>
            {testimonials.length > 1 && (
              <button
                type="button"
                onClick={() => removeTestimonial(index)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nom</label>
              <input
                type="text"
                value={testimonial.name}
                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fonction</label>
              <input
                type="text"
                value={testimonial.role}
                onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Client"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Avatar (URL)</label>
              <input
                type="text"
                value={testimonial.avatar}
                onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="/images/avatar.jpg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Citation</label>
              <textarea
                value={testimonial.quote}
                onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Excellent service..."
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