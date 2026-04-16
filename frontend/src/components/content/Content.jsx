import React from 'react';

const Content = ({ content = {} }) => {
  const {
    title = '',
    introduction = '',
    sections = [],
    ctaText = '',
    ctaLink = '#contact'
  } = content;

  return (
    <section className="content-section">
      <div className="container">
        {title && <h2>{title}</h2>}
        {introduction && <p className="content-intro">{introduction}</p>}
        {sections.map((section, index) => (
          <div key={index} className="content-block">
            <h3>{section.title}</h3>
            <div className="content-text">
              {section.content?.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
        {ctaText && (
          <div className="content-cta">
            <a href={ctaLink} className="cta-button">{ctaText}</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Content;