import React from 'react';

const HowItWorks = ({ content = {} }) => {
  const { title = 'Comment ça marche ?', steps = [] } = content;

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {title && (
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-dark mb-4">{title}</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-dark">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;