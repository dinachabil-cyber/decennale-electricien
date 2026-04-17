import React from 'react';
import { getSectionLabel } from './sections/sectionTypes';

export default function SectionPreview({ section }) {
  const renderPreview = () => {
    const { type, content } = section;
    
    switch (type) {
      case 'hero':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-800">{content?.title || 'Sans titre'}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{content?.subtitle || 'Aucun sous-titre'}</p>
            {content?.ctaText && (
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                Bouton: {content.ctaText}
              </span>
            )}
          </div>
        );
      
      case 'content':
        const subsections = content?.subsections || [];
        return (
          <div>
            <p className="text-sm text-gray-600">{subsections.length} sous-section(s)</p>
            {subsections.slice(0, 2).map((sub, i) => (
              <p key={i} className="text-xs text-gray-500 mt-1">• {sub.title || 'Sans titre'}</p>
            ))}
          </div>
        );
      
      case 'features':
        const features = content?.features || [];
        return (
          <div>
            <p className="text-sm text-gray-600">{features.length} fonctionnalité(s)</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {features.slice(0, 3).map((f, i) => (
                <span key={i} className="text-lg" title={f.title}>{f.icon}</span>
              ))}
            </div>
          </div>
        );
      
      case 'pricing':
        const plans = content?.plans || [];
        return (
          <div>
            <p className="text-sm text-gray-600">{plans.length} plan(s)</p>
            {plans.map((plan, i) => (
              <span key={i} className={`inline-block px-2 py-0.5 text-xs rounded mr-1 mb-1 ${plan.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                {plan.name} - {plan.price}
              </span>
            ))}
          </div>
        );
      
      case 'faq':
        const items = content?.items || [];
        return (
          <div>
            <p className="text-sm text-gray-600">{items.length} question(s)</p>
            {items.slice(0, 2).map((item, i) => (
              <p key={i} className="text-xs text-gray-500 mt-1 truncate">• {item.question}</p>
            ))}
          </div>
        );
      
      case 'contact':
        return (
          <div className="space-y-1">
            {content?.email && <p className="text-xs text-gray-500">✉ {content.email}</p>}
            {content?.phone && <p className="text-xs text-gray-500">📞 {content.phone}</p>}
            {content?.address && <p className="text-xs text-gray-500">📍 {content.address}</p>}
          </div>
        );
      
      case 'cta':
        return (
          <div className="space-y-1">
            <p className="font-medium text-gray-800">{content?.title || 'Sans titre'}</p>
            {content?.buttonText && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {content.buttonText}
              </span>
            )}
          </div>
        );
      
      case 'testimonials':
        const testimonials = content?.testimonials || [];
        return (
          <div>
            <p className="text-sm text-gray-600">{testimonials.length} témoignage(x)</p>
          </div>
        );
      
      case 'gallery':
        const images = content?.images || [];
        return (
          <div>
            <p className="text-sm text-gray-600">{images.length} image(s)</p>
          </div>
        );
      
      default:
        return <p className="text-sm text-gray-500">Type: {type}</p>;
    }
  };

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase">{getSectionLabel(section.type)}</span>
      </div>
      {renderPreview()}
    </div>
  );
}