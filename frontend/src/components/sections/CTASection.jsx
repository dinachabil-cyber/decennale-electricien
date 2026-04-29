import React from 'react';

export default function CTASection({ content }) {
  if (!content) return null;

  const backgroundClass = content.backgroundColor === 'yellow' ? 'bg-yellow-400' : 'bg-dark';
  const textClass = content.backgroundColor === 'yellow' ? 'text-dark' : 'text-yellow-400';
  const subtitleClass = content.backgroundColor === 'yellow' ? 'text-dark/80' : 'text-yellow-400/80';

  return (
    <section className={`py-20 ${backgroundClass}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto reveal">
          {content.title && (
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${textClass}`}>
              {content.title}
            </h2>
          )}

          {content.subtitle && (
            <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${subtitleClass}`}>
              {content.subtitle}
            </p>
          )}

          {content.buttonText && content.buttonLink && (
            <a
              href={content.buttonLink}
              className={`inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-10 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105 gradient-shine ${
                content.backgroundColor === 'yellow' ? '' : 'border-2 border-yellow-400'
              }`}
            >
              {content.buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
