import React from 'react';
import { FormInput, SelectCard, ConsentCheckbox } from './';

// Registry of field renderers
const FIELD_RENDERERS = {
  input: FormInput,
  select: SelectCard,
  consent: ConsentCheckbox,
};

// Generic field renderer that delegates to specific components
export function FieldRenderer({ field, value, onChange, formData, onConsentChange }) {
  const Renderer = FIELD_RENDERERS[field.type];

  if (!Renderer) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Type de champ non supporté: {field.type}
      </div>
    );
  }

  const commonProps = {
    value,
    onChange,
  };

  // Type-specific props
  switch (field.type) {
    case 'input':
      return (
        <Renderer
          key={field.key}
          {...commonProps}
          placeholder={field.placeholder}
          icon={field.icon}
          required={field.required}
          type={field.inputType || 'text'}
          autoFocus={field.autoFocus}
        />
      );

    case 'select':
      const options = field.options || [];
      return (
        <Renderer
          key={field.key}
          {...commonProps}
          options={options}
        />
      );

    case 'consent':
      return (
        <ConsentCheckbox
          field={field}
          checked={value}
          onChange={onConsentChange}
        />
      );

    default:
      return null;
  }
}

// Step renderer that renders all fields for a step
export function StepRenderer({ step, formData, onFieldChange, onConsentChange }) {
  if (!step) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-dark mb-4">{step.label}</h3>

      {step.type === 'input' && (
        <FieldRenderer
          field={step}
          value={formData[step.key]}
          onChange={(val) => onFieldChange(step.key, val)}
          formData={formData}
        />
      )}

      {step.type === 'select' && (
        <FieldRenderer
          field={step}
          value={formData[step.key]}
          onChange={(val) => onFieldChange(step.key, val)}
          formData={formData}
        />
      )}

      {/* Handle special cases like phone/email with consent */}
      {(step.consentRequired) && (
        <div className="mt-4">
          <FieldRenderer
            field={{
              ...step,
              type: 'consent',
              consentText: step.consentText,
              key: `agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`
            }}
            value={formData[`agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`]}
            onChange={onFieldChange}
            onConsentChange={onConsentChange}
            formData={formData}
          />
        </div>
      )}
    </div>
  );
}

export default FieldRenderer;