import React from 'react';

function Contact({ content = {} }) {
  const { title = 'Contactez-nous', subtitle = '', email = '', phone = '', address = '', showMap = true } = content;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {email && (
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-envelope text-dark text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
              <a href={`mailto:${email}`} className="text-gray-600 hover:text-yellow-600">
                {email}
              </a>
            </div>
          )}

          {phone && (
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-phone text-dark text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Téléphone</h3>
              <a href={`tel:${phone}`} className="text-gray-600 hover:text-yellow-600">
                {phone}
              </a>
            </div>
          )}

          {address && (
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-map-marker-alt text-dark text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Adresse</h3>
              <p className="text-gray-600">{address}</p>
            </div>
          )}
        </div>

        {showMap && (
          <div className="mt-12 rounded-lg overflow-hidden h-64 bg-gray-100">
            <iframe
              title="Contact Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615674389!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee60ef7d3b!2sParis%2C%20France!5e0!3m2!1sfr!2sfr!4v1234567890`}
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </section>
  );
}

export default Contact;