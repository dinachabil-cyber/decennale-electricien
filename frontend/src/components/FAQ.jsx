import React, { useState } from 'react';

const FAQ = ({ content = {} }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!content || typeof content !== 'object') {
    return null;
  }

  const { title = 'Questions fréquentes', items = [] } = content;
  
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-dark mb-4">{title}</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>
          )}
          
          <div className="space-y-4">
            {items.map((item, index) => {
              if (!item || typeof item !== 'object') {
                return null;
              }
              return (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <button 
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => toggle(index)}
                  >
                    <span className="font-semibold text-dark">{item.question || 'Question'}</span>
                    <i className={`fas fa-chevron-down text-yellow-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}></i>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{item.answer || ''}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;