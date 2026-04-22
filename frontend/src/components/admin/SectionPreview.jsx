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

      case 'cards':
        const cards = content?.cards || [];
        return (
          <div>
            <p className="text-sm text-gray-600">{cards.length} carte(s)</p>
            {cards.slice(0, 2).map((card, i) => (
              <p key={i} className="text-xs text-gray-500 mt-1 truncate">• {card.title}</p>
            ))}
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