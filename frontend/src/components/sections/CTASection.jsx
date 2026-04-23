import React from 'react';

export default function CTASection({ content }) {
  if (!content) return null;

  const backgroundClass = content.backgroundColor === 'yellow' ? 'bg-yellow-400' : 'bg-gray-900';
  const textClass = content.backgroundColor === 'yellow' ? 'text-dark' : 'text-white';

  return (
    <section className={`py-12 md:py-20 ${backgroundClass}`}>
      <div className="container mx-auto px-4 sm:px-6 text-center">
        {content.title && (
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textClass}`}>
            {content.title}
          </h2>
        )}

        {content.subtitle && (
          <p className={`text-lg mb-8 ${content.backgroundColor === 'yellow' ? 'text-gray-700' : 'text-gray-300'} max-w-2xl mx-auto`}>
            {content.subtitle}
          </p>
        )}

        {content.buttonText && content.buttonLink && (
          <a
            href={content.buttonLink}
            className={`inline-block font-bold py-4 px-8 rounded-xl transition-colors duration-200 ${
              content.backgroundColor === 'yellow'
                ? 'bg-dark hover:bg-gray-800 text-yellow-400'
                : 'bg-yellow-400 hover:bg-yellow-500 text-dark'
            }`}
          >
            {content.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}