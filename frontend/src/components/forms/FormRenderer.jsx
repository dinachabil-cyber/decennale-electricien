import React from 'react';
import { FormInput, SelectCard, ConsentCheckbox, FormTextarea } from './';

// Registry of field renderers
const FIELD_RENDERERS = {
  input: FormInput,
  select: SelectCard,
  consent: ConsentCheckbox,
  textarea: FormTextarea,
};

/**
 * Generic FieldRenderer - renders any field type dynamically
 * Uses field config from API, no hardcoded logic
 */
export function FieldRenderer({ field, value, onChange, formData, onConsentChange }) {
  if (!field) return null;

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

  // Render based on field type
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
        />
      );

    case 'select':
      return (
        <Renderer
          key={field.key}
          {...commonProps}
          options={field.options || []}
        />
      );

    case 'textarea':
      return (
        <Renderer
          key={field.key}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          required={field.required}
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

/**
 * StepRenderer - renders a single step with its field
 */
export function StepRenderer({ step, formData, onFieldChange, onConsentChange }) {
  if (!step) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-dark mb-4">{step.label}</h3>

      <FieldRenderer
        field={step}
        value={formData[step.key]}
        onChange={(val) => onFieldChange(step.key, val)}
        formData={formData}
        onConsentChange={onConsentChange}
      />

      {/* Handle consent fields */}
      {step.consentRequired && (
        <div className="mt-4">
          <FieldRenderer
            field={{
              type: 'consent',
              key: `agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`,
              label: step.consentText || `J'accepte d'être contacté pour ${step.key}`,
            }}
            value={formData[`agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`]}
            onChange={(val) => onFieldChange(`agreed${step.key.charAt(0).toUpperCase() + step.key.slice(1)}`, val)}
            onConsentChange={onConsentChange}
            formData={formData}
          />
        </div>
      )}
    </div>
  );
}

export default FieldRenderer;
