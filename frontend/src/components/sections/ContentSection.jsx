import React from 'react';

export default function ContentSection({ content }) {
  if (!content) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-dark mb-6">
            {content.title}
          </h2>
        )}

        {content.introduction && (
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            {content.introduction}
          </p>
        )}

        <div className="grid gap-8 md:gap-12">
          {content.sections?.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {section.title && (
                <h3 className="text-xl md:text-2xl font-bold text-dark mb-4">
                  {section.title}
                </h3>
              )}
              {section.content && (
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {(content.ctaText && content.ctaLink) && (
          <div className="text-center mt-12">
            <a
              href={content.ctaLink}
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-dark font-bold py-4 px-8 rounded-xl transition-colors duration-200"
            >
              {content.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}