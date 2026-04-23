# Dynamic Website Builder Architecture

This document outlines the new configuration-driven architecture for the React-based dynamic website builder.

## Overview

The system now uses a clean, scalable, and configuration-driven approach for:
- Multi-step forms (Hero section)
- Dynamic content sections (CMS-like)
- Validation and rendering logic

## Architecture Components

### 1. Form Configuration System (`config/formConfig.js`)

**Purpose**: Centralizes all form field definitions, validation rules, and behavior.

**Key Features**:
- `FORM_CONFIG.STEPS`: Array of step configurations
- `initializeFormData()`: Creates form state from config
- `canProceedToStep()`: Generic validation logic
- `prepareSubmitData()`: Maps form data to API format

**Step Configuration Structure**:
```javascript
{
  key: 'fieldName',           // Used in formData
  title: 'Step Title',        // Progress indicator
  label: 'Question Text',     // Display question
  type: 'input|select',       // Field type
  required: true|false,       // Validation
  placeholder: 'Placeholder', // Input placeholder
  icon: 'fa-icon',           // FontAwesome icon
  autoFocus: true|false,     // Auto-focus on step
  inputType: 'text|email|tel', // HTML input type
  options: 'OPTIONS_KEY',    // Reference to options array
  consentRequired: true|false, // Requires consent checkbox
  consentText: 'Consent text',  // Consent checkbox text
  validation: {               // Validation rules
    required: true,
    minLength: 1,
    pattern: /regex/
  }
}
```

### 2. Section Configuration System (`config/sectionConfig.js`)

**Purpose**: Unifies section types, editors, and renderers.

**Key Features**:
- `SECTION_CONFIG`: Complete section definitions
- `loadSectionEditor()`: Dynamic editor loading
- `loadSectionRenderer()`: Dynamic renderer loading
- `validateSection()`: Content validation
- `getDefaultContent()`: Default content generation

**Section Configuration Structure**:
```javascript
{
  hero: {
    label: 'Hero',
    icon: '🟣',
    description: 'Section description',
    category: 'content',
    editor: 'hero',           // Editor component key
    renderer: 'hero',         // Renderer component key
    defaultContent: { ... },  // Default content
    validation: { ... }       // Validation rules
  }
}
```

### 3. Form Rendering System (`components/forms/`)

**Components**:
- `FormRenderer.jsx`: Generic field renderer
- `FormInput.jsx`: Input field component
- `SelectCard.jsx`: Selection component
- `StepIndicator.jsx`: Progress indicator
- `StepContainer.jsx`: Step wrapper
- `ConsentCheckbox.jsx`: Consent checkbox

**Key Features**:
- Registry-based field rendering
- Dynamic field type support
- Extensible for new field types

### 4. Section Rendering System (`components/sections/`)

**Components**:
- `HeroSection.jsx`: Hero with form
- `ContentSection.jsx`: Content blocks
- `CardsSection.jsx`: Feature cards
- `CTASection.jsx`: Call-to-action
- `FormSection.jsx`: Custom forms

**Features**:
- Lazy-loaded components
- Consistent styling
- Responsive design

## Usage Examples

### Adding a New Form Field

1. **Add to FORM_CONFIG.STEPS**:
```javascript
{
  key: 'newField',
  title: 'New Field',
  label: 'What is your new field?',
  type: 'input',
  required: true,
  placeholder: 'Enter value',
  icon: 'fa-star',
  validation: { required: true }
}
```

2. **Update API submission** in `prepareSubmitData()`:
```javascript
return {
  // ... existing fields
  newField: formData.newField
};
```

### Adding a New Section Type

1. **Add to SECTION_CONFIG**:
```javascript
newSection: {
  label: 'New Section',
  icon: '🎯',
  description: 'New section description',
  category: 'content',
  editor: 'newSection',
  renderer: 'newSection',
  defaultContent: { title: '', content: '' },
  validation: { title: { required: true } }
}
```

2. **Create editor component** (`admin/sections/NewSectionEditor.jsx`)

3. **Create renderer component** (`sections/NewSection.jsx`)

4. **Update import maps** in `sectionConfig.js`

### Custom Field Types

1. **Create field component**:
```javascript
function CustomField({ value, onChange, field }) {
  return (
    <div>
      {/* Custom rendering */}
    </div>
  );
}
```

2. **Add to FIELD_RENDERERS** in `FormRenderer.jsx`:
```javascript
const FIELD_RENDERERS = {
  // ... existing
  custom: CustomField,
};
```

## Benefits

### Maintainability
- **Single source of truth**: All configuration in one place
- **DRY principle**: No repeated logic
- **Easy updates**: Change config, not code

### Scalability
- **Dynamic loading**: Components loaded on demand
- **Registry pattern**: Easy to add new types
- **Validation system**: Centralized validation logic

### Developer Experience
- **Type safety**: Clear interfaces
- **IntelliSense**: Full IDE support
- **Error handling**: Comprehensive validation

### Performance
- **Lazy loading**: Components loaded as needed
- **Code splitting**: Smaller initial bundles
- **Efficient rendering**: Optimized re-renders

## Migration Guide

### From Old System
1. **Forms**: Replace hardcoded steps with FORM_CONFIG
2. **Sections**: Replace switch statements with dynamic loading
3. **Validation**: Use centralized validation functions

### Best Practices
- Always use configuration over hardcoded values
- Validate all content before saving
- Keep component interfaces consistent
- Use lazy loading for better performance

## Future Enhancements

- Schema validation with JSON Schema
- Drag-and-drop section reordering
- Form field dependencies
- Advanced validation rules
- A/B testing support
- Multi-language support