import React from 'react';

function Testimonials({ content }) {
  const {
    title = 'Témoignages',
    items = []
  } = content || {};

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gradient mb-12 text-center">{title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
              <div className="text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="fas fa-star"></span>
                ))}
              </div>
              <p className="text-gray-600 mb-4">{item.text}</p>
              <p className="font-bold text-dark">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;