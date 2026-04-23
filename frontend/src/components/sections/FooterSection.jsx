import React from 'react';

export default function FooterSection({ content }) {
  if (!content) return null;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-300">{content.text}</p>
          </div>

          <div className="flex flex-wrap gap-6">
            {content.links?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}