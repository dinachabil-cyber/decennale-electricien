import React, { useState, useEffect, useMemo } from 'react';
import { submitQuote } from '../services/api';
import {
  getFormSteps,
  initializeFormData,
  canProceedToStep,
  prepareSubmitData
} from '../config/formConfig';
import { FORM_SCHEMA } from '../config/formSchema';
import { StepRenderer, StepIndicator, StepContainer } from './forms';

// Extract and normalize hero content from potentially corrupted formats
function getHeroContent(content) {
  if (!content) return {};

  // If content is a full section object (corrupted from old save bug), extract its inner content
  if (content && typeof content === 'object' && 'id' in content && 'type' in content && 'content' in content) {
    content = content.content;
  }

  // Map legacy field names to new ones
  const normalized = { ...content };
  if (normalized.formTitle && !normalized.title) {
    normalized.title = normalized.formTitle;
  }
  if (normalized.buttonText && !normalized.ctaText) {
    normalized.ctaText = normalized.buttonText;
  }
  if (normalized.image && !normalized.backgroundImage) {
    normalized.backgroundImage = normalized.image;
  }

  // Ensure formConfig exists
  if (!normalized.formConfig) {
    normalized.formConfig = {
      steps: getFormSteps(),
      options: {
        LEGAL_STATUSES: FORM_SCHEMA.options.LEGAL_STATUSES,
        REVENUE_OPTIONS: FORM_SCHEMA.options.REVENUE_OPTIONS
      }
    };
  }

  return normalized;
}

// Fallback to static config if no dynamic config available
const DEFAULT_FORM_CONFIG = {
  steps: getFormSteps(),
  options: {
    LEGAL_STATUSES: FORM_SCHEMA.options.LEGAL_STATUSES,
    REVENUE_OPTIONS: FORM_SCHEMA.options.REVENUE_OPTIONS
  }
};

function Hero({ onSuccess, content: rawContent }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dynamicConfig, setDynamicConfig] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Normalize hero content (handle legacy formats and corruption)
  const hero = useMemo(() => getHeroContent(rawContent), [rawContent]);

  // Load dynamic configuration from content or use defaults
  useEffect(() => {
    const formConfig = hero?.formConfig;

    if (formConfig && formConfig.steps) {
      setDynamicConfig(formConfig);
      // Initialize form data from dynamic config
      const initialData = {};
      formConfig.steps.forEach(step => {
        initialData[step.key] = '';
        // Handle consent fields
        if (step.consentRequired) {
          initialData[`agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`] = false;
        }
      });
      setFormData(initialData);
    } else {
      // Use static config as fallback
      setDynamicConfig(DEFAULT_FORM_CONFIG);
      setFormData(initializeFormData());
    }
  }, [hero]);

  const steps = hero?.formConfig?.steps || dynamicConfig?.steps || [];
  const options = hero?.formConfig?.options || dynamicConfig?.options || DEFAULT_FORM_CONFIG.options;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    return canProceedToStep(currentStep, formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canProceed()) return;

    setLoading(true);
    setError(null);

    try {
      // For dynamic forms, send all form data
      // For static forms, use the prepared data mapping
      const submitData = dynamicConfig !== DEFAULT_FORM_CONFIG
        ? formData // Send all dynamic form data
        : prepareSubmitData(formData); // Use static mapping

      await submitQuote(submitData);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 scanlines-bg opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="w-full lg:flex-1 order-1 lg:order-2">
              <div className="bg-surface rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <i className="fas fa-check text-white text-2xl md:text-3xl"></i>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3 md:mb-4">Merci !</h2>
                <p className="text-gray-600 text-base md:text-lg px-2">
                  Votre demande a été envoyée. Un expert vous contactera rapidement.
                </p>
              </div>
            </div>
            <div className="w-full lg:flex-1 order-2 lg:order-1">
              <div className="w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/5] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
                <img src="/images/img.png" alt="Assurance Décennale Électricien" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render form if disabled
  if (hero.showForm === false) {
    return (
      <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 scanlines-bg opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6">
            {hero.title || 'Bienvenue'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {hero.subtitle}
          </p>
          {hero.ctaText && hero.ctaLink && (
            <a
              href={hero.ctaLink}
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-dark font-bold py-4 px-8 rounded-xl transition-colors duration-200"
            >
              {hero.ctaText}
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-light via-surfaceHover to-light hero-pattern relative overflow-hidden">
      <div className="absolute inset-0 scanlines-bg opacity-30"></div>
      <div className="absolute top-10 left-10 floating-animation">
        <i className="fas fa-shield-alt text-yellow-500 text-6xl opacity-30"></i>
      </div>
      <div className="absolute bottom-10 right-10 floating-animation" style={{ animationDelay: '-2s' }}>
        <i className="fas fa-bolt text-yellow-500 text-8xl opacity-25"></i>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="w-full lg:flex-1 order-1 lg:order-2">
            <div className="bg-surface rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
              <div className="text-center mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-400 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <i className="fas fa-calculator text-xl md:text-2xl text-dark"></i>
                </div>
                 <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gradient mb-3 md:mb-4 px-2">
                   {hero?.title || hero?.formTitle || 'Complétez ce formulaire pour obtenir un tarif'}
                 </h2>
                <div className="w-16 md:w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <StepIndicator steps={steps} currentStep={currentStep} />

                <div className="relative min-h-[200px]">
                  {steps.map((step, index) => (
                    <StepContainer key={step.key} isActive={currentStep === index}>
                      <StepRenderer
                        step={{
                          ...step,
                          options: step.options ? options[step.options] : undefined
                        }}
                        formData={formData}
                        onFieldChange={updateField}
                        onConsentChange={(field, value) => updateField(field, value)}
                      />
                    </StepContainer>
                  ))}
                </div>

                <div className="mt-6">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full mb-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Retour
                    </button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Suivant
                      <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !canProceed()}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? 'Traitement...' : 'Obtenir mon devis'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="w-full lg:flex-1 order-2 lg:order-1">
            <div className="w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/5] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
              <img src="/images/img.png" alt="Assurance Décennale Électricien" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;