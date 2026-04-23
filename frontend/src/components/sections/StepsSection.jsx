import React from 'react';

export default function StepsSection({ content }) {
  if (!content) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {content.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-center text-dark mb-6">
              {content.title}
            </h2>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.steps?.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-dark">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}