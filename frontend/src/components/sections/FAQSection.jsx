import React from 'react';

export default function FAQSection({ content }) {
  if (!content) return null;

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {content.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-center text-dark mb-6">
              {content.title}
            </h2>
          )}

          {content.subtitle && (
            <p className="text-lg text-gray-600 text-center mb-12">
              {content.subtitle}
            </p>
          )}

          <div className="space-y-6">
            {content.items?.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-dark mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}