import React from 'react';

const CTA = ({ content = {} }) => {
  const {
    title = 'Contactez-nous',
    subtitle = 'Une question? N\'hésitez pas à nous contacter.',
    buttonText = 'Contactez-nous',
    buttonLink = '#contact',
    backgroundColor = 'yellow'
  } = content || {};

  const bgClass = backgroundColor === 'yellow' 
    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    : 'bg-dark text-yellow-400';

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="reveal max-w-4xl mx-auto">
          {title && (
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-dark/80 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {buttonText && (
            <a 
              href={buttonLink} 
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-10 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105 gradient-shine"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTA;