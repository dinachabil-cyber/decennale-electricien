import React from 'react';

export default function CardsSection({ content }) {
  if (!content) return null;

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-dark mb-4">
            {content.title}
          </h2>
        )}

        {content.subtitle && (
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            {content.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.cards?.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-400 rounded-xl md:rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center">
                <i className={`fas fa-${card.icon || 'star'} text-xl md:text-2xl text-dark`}></i>
              </div>

              {card.title && (
                <h3 className="text-lg md:text-xl font-bold text-dark text-center mb-3 md:mb-4">
                  {card.title}
                </h3>
              )}

              {card.subtitle && (
                <p className="text-gray-600 text-center mb-4 md:mb-6">
                  {card.subtitle}
                </p>
              )}

              {card.bulletPoints && card.bulletPoints.length > 0 && (
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  {card.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <i className="fas fa-check text-yellow-500 mt-0.5 flex-shrink-0"></i>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {card.buttonText && card.buttonLink && (
                <div className="text-center">
                  <a
                    href={card.buttonLink}
                    className="inline-block bg-yellow-400 hover:bg-yellow-500 text-dark font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-sm"
                  >
                    {card.buttonText}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}