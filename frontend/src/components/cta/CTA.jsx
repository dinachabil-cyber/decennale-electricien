import React from 'react';

function CTA({ content }) {
  const {
    title = 'Contactez-nous',
    description = 'Une question? N\'hésitez pas à nous contacter.',
    buttonText = 'Contactez-nous'
  } = content || {};

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-dark mb-4">{title}</h2>
        <p className="text-xl text-dark/80 mb-8 max-w-2xl mx-auto">{description}</p>
        <a href="#contact" className="inline-block bg-dark text-yellow-400 font-bold py-4 px-10 rounded-2xl hover:bg-primary transition-all transform hover:scale-105 shadow-2xl">
          {buttonText}
        </a>
      </div>
    </section>
  );
}

export default CTA;