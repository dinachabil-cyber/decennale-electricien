import React, { useState } from 'react';

export default function FormSectionEditor({ content, onSave, onCancel }) {
   const [formData, setFormData] = useState({
     title: content?.title || '',
     description: content?.description || '',
     submitText: content?.submitText || 'Envoyer',
     email: content?.email || '',
     fields: content?.fields || [{ name: '', label: '', type: 'text', required: false, visible: true }],
   });

   const handleSubmit = (e) => {
     e.preventDefault();
     onSave(formData);
   };

   const updateField = (index, field) => {
     setFormData(prev => ({
       ...prev,
       fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
     }));
   };

   return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          placeholder="Titre du formulaire"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          rows={3}
          placeholder="Description du formulaire"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
          <input
            type="text"
            value={formData.submitText}
            onChange={(e) => setFormData({ ...formData, submitText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Envoyer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email de destination</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="contact@exemple.com"
          />
        </div>
      </div>

       <div>
         <div className="flex justify-between items-center mb-3">
           <label className="block text-sm font-medium text-gray-700">Champs du formulaire</label>
         </div>

         <div className="space-y-3">
           {formData.fields.map((field, index) => (
             <div key={index} className="flex gap-3 items-end p-4 border border-gray-200 rounded-lg">
               <div className="flex-1">
                 <label className="block text-xs font-medium text-gray-600 mb-1">Nom du champ</label>
                 <input
                   type="text"
                   value={field.name}
                   onChange={(e) => updateField(index, { name: e.target.value })}
                   className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                   placeholder="name"
                 />
               </div>
               <div className="flex-1">
                 <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                 <input
                   type="text"
                   value={field.label}
                   onChange={(e) => updateField(index, { label: e.target.value })}
                   className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                   placeholder="Votre nom"
                 />
               </div>
               <div className="flex-1">
                 <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                 <select
                   value={field.type}
                   onChange={(e) => updateField(index, { type: e.target.value })}
                   className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                 >
                   <option value="text">Texte</option>
                   <option value="email">Email</option>
                   <option value="tel">Téléphone</option>
                   <option value="textarea">Zone de texte</option>
                 </select>
               </div>
               <div className="flex items-center gap-2">
                 <label className="flex items-center gap-1 text-xs">
                   <input
                     type="checkbox"
                     checked={field.required}
                     onChange={(e) => updateField(index, { required: e.target.checked })}
                     className="w-3 h-3"
                   />
                   Req.
                 </label>
               </div>
             </div>
           ))}
         </div>
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