import React from 'react';
import { getSectionConfig, getSectionLabel } from './registry';

const FieldPreview = ({ type, value }) => {
  if (value === undefined || value === null || value === '') {
    return <span className="text-gray-400">Non défini</span>;
  }

  switch (type) {
    case 'text':
    case 'textarea':
      return <span className="text-gray-700 truncate max-w-xs">{value}</span>;
    case 'array':
      if (Array.isArray(value)) {
        return <span className="text-gray-600">{value.length} élément(s)</span>;
      }
      return <span className="text-gray-400">Tableau invalide</span>;
    case 'object':
      if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value).filter(k => value[k]);
        return <span className="text-gray-600">{keys.length} champ(s)</span>;
      }
      return <span className="text-gray-400">Objet invalide</span>;
    default:
      return <span className="text-gray-700">{String(value)}</span>;
  }
};

export const SectionPreview = React.memo(function SectionPreview({ section, onClick, isSelected }) {
  const { type, content, isEnabled = true } = section;
  const config = getSectionConfig(type);
  
  if (!config) {
    return (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">Type inconnu: {type}</p>
      </div>
    );
  }

  const renderPreview = () => {
    const previewFields = getPreviewFields(type, content);
    
    return (
      <div className="space-y-2">
        {previewFields.map((field, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-xs text-gray-400 w-20 flex-shrink-0">{field.label}:</span>
            <FieldPreview type={field.type} value={field.value} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`mt-3 p-3 rounded-lg transition-all ${
        isSelected 
          ? 'bg-yellow-50 border-2 border-yellow-400' 
          : 'bg-gray-50 border border-transparent hover:border-gray-200'
      } ${!isEnabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase">
          {config.icon} {getSectionLabel(type)}
        </span>
        {!isEnabled && (
          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
            Désactivé
          </span>
        )}
      </div>
      {renderPreview()}
    </div>
  );
});

function getPreviewFields(type, content) {
  const fields = {
    hero: [
      { label: 'Titre', type: 'text', value: content?.title },
      { label: 'Sous-titre', type: 'text', value: content?.subtitle },
      { label: 'CTA', type: 'text', value: content?.ctaText }
    ],
    content: [
      { label: 'Titre', type: 'text', value: content?.title },
      { label: 'Sous-sections', type: 'array', value: content?.sections }
    ],
    features: [
      { label: 'Features', type: 'array', value: content?.features }
    ],
    pricing: [
      { label: 'Plans', type: 'array', value: content?.plans }
    ],
    faq: [
      { label: 'Questions', type: 'array', value: content?.items }
    ],
    contact: [
      { label: 'Email', type: 'text', value: content?.email },
      { label: 'Téléphone', type: 'text', value: content?.phone },
      { label: 'Adresse', type: 'text', value: content?.address }
    ],
    cta: [
      { label: 'Titre', type: 'text', value: content?.title },
      { label: 'Bouton', type: 'text', value: content?.buttonText }
    ],
    testimonials: [
      { label: 'Témoignages', type: 'array', value: content?.testimonials }
    ],
    gallery: [
      { label: 'Images', type: 'array', value: content?.images }
    ]
  };
  
  return (fields[type] || []).filter(f => f.value !== undefined && f.value !== null && f.value !== '');
}

export default SectionPreview;