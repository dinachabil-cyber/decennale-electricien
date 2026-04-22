import React from 'react';

function Cards({ content = {} }) {
  const { title = '', subtitle = '', cards = [] } = content;

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="fade-in">
            {title && (
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gradient mb-6">{title}</h2>
                {subtitle && (
                  <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
                )}
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full mt-6"></div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover"
                >
                  <div className="flex items-start space-x-6">
                    {card.icon && (
                      <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg flex-shrink-0">
                        <i className={`fas fa-${card.icon} text-white text-2xl`}></i>
                      </div>
                    )}
                    <div className="flex-1">
                      {card.title && (
                        <h3 className="text-2xl font-bold text-gradient mb-4">{card.title}</h3>
                      )}

                      {card.bulletPoints && card.bulletPoints.length > 0 && (
                        <ul className="space-y-4">
                          {card.bulletPoints.map((point, i) => (
                            <li key={i} className="flex items-start space-x-4">
                              <div className="p-1 bg-yellow-400 rounded-full mt-1 flex-shrink-0">
                                <i className="fas fa-check text-success text-sm"></i>
                              </div>
                              <span className="text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {card.description && !card.bulletPoints && (
                        <p className="text-gray-600 leading-relaxed">{card.description}</p>
                      )}

                      {card.buttonText && card.buttonLink && (
                        <a
                          href={card.buttonLink}
                          className="inline-block bg-yellow-400 text-dark font-bold py-4 px-10 rounded-2xl hover:bg-primary transition-all transform hover:scale-105 shadow-2xl mt-6"
                        >
                          <i className="fas fa-arrow-up mr-2"></i>
                          {card.buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cards;
