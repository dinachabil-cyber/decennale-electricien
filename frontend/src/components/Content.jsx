import React, { memo } from 'react';
import DOMPurify from 'dompurify';

const cardStyles = [
  {
    icon: 'fa-euro-sign',
    bgGradient: 'from-yellow-400 to-yellow-400/80',
    borderColor: 'border-yellow-200'
  },
  {
    icon: 'fa-shield-alt',
    bgGradient: 'from-blue-500 to-blue-500/80',
    borderColor: 'border-blue-200'
  },
  {
    icon: 'fa-user-clock',
    bgGradient: 'from-green-500 to-green-500/80',
    borderColor: 'border-green-200'
  },
  {
    icon: 'fa-question-circle',
    bgGradient: 'from-purple-500 to-purple-500/80',
    borderColor: 'border-purple-200'
  }
];

const Content = ({ content = {} }) => {
  const {
    title = '',
    introduction = '',
    sections = [],
    ctaText = '',
    ctaLink = '#contact'
  } = content;

  // Return null if no content to render
  if (!sections?.length && !title && !introduction) return null;

  return (
    <section className="py-20 bg-surface relative overflow-hidden">
      <div
        className="bg-orb w-64 h-64 bg-yellow-200 top-10 right-10"
        style={{ animationDelay: '0s' }}
      ></div>

      <div
        className="bg-orb w-48 h-48 bg-blue-200 bottom-10 left-10"
        style={{ animationDelay: '-7s' }}
      ></div>

      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-dark text-center mb-8 reveal">
            {title}
          </h2>
        )}

        {introduction && (
          <div
            className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mb-16 reveal"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introduction) }}
          />
        )}

        {sections.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-8">
            {sections.map((section, index) => {
              const style = cardStyles[index % cardStyles.length];

              return (
                <div
                  key={section.id || index}
                  className={`bg-white rounded-3xl p-6 sm:p-8 shadow-lg border ${style.borderColor} hover:shadow-xl transition-all duration-300 reveal hover-lift`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 sm:gap-6 mb-4">
                    <div
                      className={`w-14 h-14 min-w-[56px] flex items-center justify-center bg-gradient-to-br ${style.bgGradient} rounded-2xl shadow-lg flex-shrink-0 icon-bounce`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <i className={`fas ${style.icon} text-white text-xl`}></i>
                    </div>

                    {section.title && (
                      <h3 className="text-xl sm:text-2xl font-bold text-dark leading-tight">
                        {section.title}
                      </h3>
                    )}
                  </div>

                  {section.content && (
                    <div
                      className="text-gray-700 leading-relaxed space-y-4 break-words"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {ctaText && (
          <div className="text-center mt-16 reveal">
            <a
              href={ctaLink}
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-8 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105 gradient-shine"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

Content.displayName = 'Content';

export default memo(Content);