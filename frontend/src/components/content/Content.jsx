import React from 'react';

const Content = ({ content = {} }) => {
  const {
    title = '',
    introduction = '',
    sections = [],
    ctaText = '',
    ctaLink = '#contact'
  } = content;

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl lg:text-4xl font-bold text-dark text-center mb-8">{title}</h2>}
        
        {introduction && (
          <div 
            className="content-intro text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mb-12"
            dangerouslySetInnerHTML={{ __html: introduction }}
          />
        )}

        {sections.map((section, index) => (
          <div key={index} className="content-block max-w-4xl mx-auto mb-12">
            {section.title && <h3 className="text-2xl font-bold text-dark mb-4">{section.title}</h3>}
            <div className="content-text text-gray-700 leading-relaxed space-y-4">
              {section.content && (
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              )}
            </div>
          </div>
        ))}

        {ctaText && (
          <div className="content-cta text-center mt-12">
            <a href={ctaLink} className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all">
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Content;