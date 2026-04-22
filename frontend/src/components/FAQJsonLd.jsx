import React from 'react';
import faqSchema from '../data/faq-schema.jsonld';

export default function FAQJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}