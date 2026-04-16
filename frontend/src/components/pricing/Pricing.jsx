import React from 'react';

const Pricing = ({ content = {} }) => {
  const { title = 'Nos Tarifs', plans = [] } = content;

  return (
    <section className="pricing-section">
      <div className="container">
        <h2>{title}</h2>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && <span className="pricing-badge">Populaire</span>}
              <h3>{plan.name}</h3>
              <div className="pricing-price">
                <span className="price">{plan.price}</span>
                <span className="period">/an</span>
              </div>
              <ul className="pricing-features">
                {plan.features?.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className="pricing-cta">{plan.cta || 'Souscrire'}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;