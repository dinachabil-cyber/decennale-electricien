import React, { useState } from 'react';

function Gallery({ content }) {
  const {
    title = 'Galerie',
    images = []
  } = content || {};

  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gradient mb-12 text-center">{title}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightbox(img)}
            >
              <img src={img.url || img} alt={img.alt || `Gallery ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-images text-4xl mb-4"></i>
            <p>Aucune image dans la galerie.</p>
          </div>
        )}

        {lightbox && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox.url || lightbox} alt="" className="max-w-full max-h-full" />
            <button className="absolute top-4 right-4 text-white text-2xl">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;