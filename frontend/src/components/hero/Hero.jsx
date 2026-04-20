import React, { useState, useEffect } from 'react';
import { submitQuote } from '../../services/api';

const LEGAL_STATUSES = [
  { value: 'auto-entrepreneur', label: 'Auto-entrepreneur', icon: 'fa-user' },
  { value: 'ei', label: 'Entreprise Individuelle', icon: 'fa-building' },
  { value: 'eurl', label: 'EURL', icon: 'fa-building' },
  { value: 'sarl', label: 'SARL', icon: 'fa-users' },
  { value: 'sas', label: 'SAS', icon: 'fa-users' },
];

const REVENUE_OPTIONS = [
  { value: '0-30k', label: "Moins de 30,000€" },
  { value: '30-60k', label: "30,000€ - 60,000€" },
  { value: '60-100k', label: "60,000€ - 100,000€" },
  { value: '100k+', label: "Plus de 100,000€" },
];

const STEPS = [
  { key: 'identity', title: 'Identité' },
  { key: 'legal', title: 'Statut' },
  { key: 'revenue', title: 'Chiffre d\'affaires' },
  { key: 'contact', title: 'Contact' },
];

function MultiStepInput({ value, onChange, placeholder, icon, required, type = 'text', autoFocus }) {
  return (
    <div className="flex w-full min-w-0">
      <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
        <i className={`fas ${icon} text-yellow-500`}></i>
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-200"
      />
    </div>
  );
}

function SelectableCard({ options, value, onChange, autoAdvance }) {
  const [timer, setTimer] = useState(null);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    if (autoAdvance) {
      setTimer(setTimeout(() => {
        window.dispatchEvent(new CustomEvent('multiStepNext'));
      }, 400));
    }
  };

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSelect(option.value)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-3 ${
            value === option.value
              ? 'border-yellow-500 bg-yellow-50 shadow-md'
              : 'border-gray-200 bg-light hover:border-yellow-300 hover:shadow-sm'
          }`}
        >
          {option.icon && (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              value === option.value ? 'bg-yellow-500 text-dark' : 'bg-gray-100 text-gray-500'
            }`}>
              <i className={`fas ${option.icon}`}></i>
            </div>
          )}
          <span className={`font-medium ${value === option.value ? 'text-dark' : 'text-gray-700'}`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className={`text-xs font-medium ${
              index <= currentStep ? 'text-yellow-600' : 'text-gray-400'
            }`}
          >
            {step.title}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

function StepContainer({ children, stepKey, isActive }) {
  return (
    <div
      className={`transition-all duration-300 ${
        isActive
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 absolute -translate-x-4 pointer-events-none'
      }`}
      style={{ display: isActive ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
}

function Summary({ data, onEdit }) {
  const statusLabel = LEGAL_STATUSES.find(s => s.value === data.statut)?.label || data.statut;
  const revenueLabel = REVENUE_OPTIONS.find(r => r.value === data.chiffreAffaires)?.label || data.chiffreAffaires;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-dark text-center mb-4">Récapitulatif</h3>
      
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-gray-500 text-sm">Nom</span>
          <span className="font-medium text-dark">{data.nom}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-gray-500 text-sm">Statut</span>
          <span className="font-medium text-dark">{statusLabel}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-gray-500 text-sm">Chiffre d'affaires</span>
          <span className="font-medium text-dark">{revenueLabel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Email</span>
          <span className="font-medium text-dark">{data.email}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onEdit()}
        className="w-full text-yellow-600 hover:text-yellow-700 text-sm font-medium underline"
      >
        Modifier
      </button>
    </div>
  );
}

function Hero({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    statut: '',
    chiffreAffaires: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const handleNext = () => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    };
    window.addEventListener('multiStepNext', handleNext);
    return () => window.removeEventListener('multiStepNext', handleNext);
  }, [currentStep]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.nom.trim().length > 0;
      case 1:
        return formData.statut.length > 0;
      case 2:
        return formData.chiffreAffaires.length > 0;
      case 3:
        return formData.email.length > 0 && agreed;
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canProceed()) return;
    
    setLoading(true);
    setError(null);

    try {
      await submitQuote({
        nom: formData.nom,
        email: formData.email,
        statut: formData.statut,
        chiffreAffaires: formData.chiffreAffaires,
        entreprise: formData.nom,
        tele: '',
        agreed: agreed
      });
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
                  Complétez ce formulaire pour obtenir un tarif
                </h2>
                <div className="w-16 md:w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                <StepIndicator steps={STEPS} currentStep={currentStep} />

                <div className="relative min-h-[200px]">
                  <StepContainer stepKey="identity" isActive={currentStep === 0}>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-dark mb-4">Quel est votre nom ?</h3>
                      <MultiStepInput
                        value={formData.nom}
                        onChange={(val) => updateField('nom', val)}
                        placeholder="Votre Nom complet *"
                        icon="fa-user"
                        required
                        autoFocus
                      />
                    </div>
                  </StepContainer>

                  <StepContainer stepKey="legal" isActive={currentStep === 1}>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-dark mb-4">Quel est votre statut juridique ?</h3>
                      <SelectableCard
                        options={LEGAL_STATUSES}
                        value={formData.statut}
                        onChange={(val) => updateField('statut', val)}
                        autoAdvance
                      />
                    </div>
                  </StepContainer>

                  <StepContainer stepKey="revenue" isActive={currentStep === 2}>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-dark mb-4">Quel est votre chiffre d'affaires ?</h3>
                      <SelectableCard
                        options={REVENUE_OPTIONS}
                        value={formData.chiffreAffaires}
                        onChange={(val) => updateField('chiffreAffaires', val)}
                        autoAdvance
                      />
                    </div>
                  </StepContainer>

                  <StepContainer stepKey="contact" isActive={currentStep === 3}>
                    <div className="space-y-4">
                      <Summary data={formData} onEdit={() => goToStep(0)} />
                      
                      <div className="mt-6">
                        <MultiStepInput
                          value={formData.email}
                          onChange={(val) => updateField('email', val)}
                          placeholder="Votre Email *"
                          icon="fa-envelope"
                          required
                          type="email"
                          autoFocus
                        />
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <input 
                          type="checkbox" 
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-1 w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400" 
                        />
                        <span className="text-xs md:text-sm text-gray-600">
                          En cliquant sur "Obtenir mon devis", vous acceptez d'être contacté.
                        </span>
                      </div>
                    </div>
                  </StepContainer>
                </div>

                <div className="flex gap-3 mt-6">
                  {currentStep > 0 && currentStep < 3 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Retour
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Suivant
                      <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !canProceed()}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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