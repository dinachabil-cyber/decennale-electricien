# Form Configuration System Documentation

## Overview

This document explains how the controlled form configuration system works, from the backend to the frontend, including the Hero section and admin controls.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Symfony)                       │
├─────────────────────────────────────────────────────────────┤
│  FormConfig.php                                           │
│  - DEFAULT_CONFIG (11 predefined fields)                │
│  - ALLOWED_UPDATE_KEYS = [visible, required, order,       │
│                         label, placeholder]            │
│  - Cached in filesystem                               │
│                                                          │
│  LeadController.php                                    │
│  - GET /api/leads/config → returns all fields           │
│  - POST /api/leads/config → updates allowed props       │
└─────────────────────────────────────────────────────┘
                            ↓
                            API
                            ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
├─────────────────────────────────────────────────────────────┤
│  leadsApi.js (API client)                             │
│  - getConfig(), updateConfig(), resetConfig()          │
│                                                          │
│  Hero.jsx (Form rendering)                           │
│  - Fetches config from section content                 │
│  - Filters visible fields                           │
│  - Renders multi-step form                          │
│                                                          │
│  HeroSectionEditor.jsx (Admin)                        │
│  - Edit label, placeholder, visible, required          │
│  - NO add/remove fields                          │
└─────────────────────────────────────────────────────┘
```

---

## 1. Backend - FormConfig.php

### Default Fields (11 predefined)

The form has exactly 11 fields that cannot be added or removed:

```php
private const DEFAULT_CONFIG = [
    ['key' => 'nom',           'label' => 'Nom',           'type' => 'input'],
    ['key' => 'prenom',        'label' => 'Prénom',        'type' => 'input'],
    ['key' => 'raisonSociale', 'label' => 'Raison Sociale','type' => 'input'],
    ['key' => 'demarrageActivite','label' => 'Démarrée activité ?','type' => 'select'],
    ['key' => 'tele',          'label' => 'Téléphone',    'type' => 'input'],
    ['key' => 'email',         'label' => 'Email',        'type' => 'input'],
    ['key' => 'activiteAssuree','label' => 'Êtes-vous actuellement assurée ?','type' => 'select'],
    ['key' => 'assuranceResilie','label' => 'Avez-vous déjà résilié ?','type' => 'select'],
    ['key' => 'motifResiliation','label' => 'Motif de résiliation','type' => 'select'],
    ['key' => 'codePostal',    'label' => 'Code postal',   'type' => 'input'],
    ['key' => 'createdAt',     'label' => 'Date de création','type' => 'datetime'],
];
```

### What Admin Can Modify

```php
private const ALLOWED_UPDATE_KEYS = [
    'visible',      // Show/hide field in form
    'required',    // Make field mandatory
    'order',       // Change display order
    'label',       // Edit question text
    'placeholder', // Edit placeholder text
];
```

### What is Locked (Cannot Modify)

- `type` - Always 'input', 'select', or 'datetime'
- `options` - Select dropdown options (for select fields)
- `inputType` - 'text', 'email', 'tel', etc.
- `key` - Field identifier (never changes)

---

## 2. API Endpoints

### GET /api/leads/config

Returns all form fields from cache:

```json
{
  "success": true,
  "fields": [
    {
      "key": "nom",
      "label": "Nom",
      "type": "input",
      "required": false,
      "visible": true,
      "placeholder": "Votre nom",
      "inputType": "text",
      "order": 1
    },
    ...
  ]
}
```

### POST /api/leads/config

Update field configurations:

```json
// Request
{
  "fields": [
    { "key": "nom", "visible": false },
    { "key": "email", "label": "Votre email pro", "placeholder": "email@entreprise.com" }
  ]
}

// Response
{
  "success": true,
  "message": "Configuration updated successfully",
  "fields": [ ... updated fields ... ]
}
```

---

## 3. Frontend - Hero Section

### How Hero Uses Form Config

The Hero section stores form configuration in its content:

```javascript
// Section content structure
{
  "title": "Devis Assurance Décennale",
  "subtitle": "Obtenez votre tarif en 2 minutes",
  "showForm": true,
  "formConfig": {
    "steps": [
      {
        "key": "nom",
        "label": "Nom",           // Editable by admin
        "type": "input",
        "required": true,
        "visible": true,          // Toggle by admin
        "placeholder": "Votre nom" // Editable by admin
      },
      ...
    ],
    "options": {
      "LEGAL_STATUSES": [...],
      "REVENUE_OPTIONS": [...]
    }
  }
}
```

### Form Rendering Flow

```
1. Hero.jsx loads section content (which includes formConfig)
2. Extracts steps from formConfig.steps
3. Filters to visible only: steps.filter(s => s.visible)
4. Renders multi-step form with StepRenderer
5. Each step rendered by FieldRenderer based on type
```

---

## 4. Admin - HeroSectionEditor

### Configuration Tab Interface

When admin clicks "Configuration Formulaire" tab:

```
┌─────────────────────────────────────────────────────┐
│  Configuration du formulaire                    [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Étape 1  nom                          [👁]         │
│  ┌─────────────────────────────┬────────────────┐    │
│  │ Question                 │ Placeholder    │    │
│  │ Nom                     │ Votre nom      │    │
│  └──────────────────���──────────┴────────────────┘    │
│  ☐ Obligatoire    ✓ Visible                        │
│                                                     │
│  Étape 2  prenom                       [👁]         │
│  ...                                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Controls Available

| Control | Action |
|---------|--------|
| 👁 (eye) button | Toggle visibility ON/OFF |
| Question input | Edit label (saved to form) |
| Placeholder input | Edit placeholder (saved to form) |
| ☐ Obligatoire | Toggle required checkbox |
| Up/Down arrows | Change order |

### What Admin CAN Do

- ✅ Toggle field visibility (visible: true/false)
- ✅ Edit label text
- ✅ Edit placeholder text  
- ✅ Toggle required (checkbox)
- ✅ Reorder fields

### What Admin CANNOT Do

- ❌ Add new fields
- ❌ Delete existing fields
- ❌ Change field type (input/select)
- ❌ Change select options
- ❌ Change input type (text/email/tel)

---

## 5. Form Field Rendering

### StepRenderer Flow

```javascript
// 1. Get steps from formConfig
const steps = hero.formConfig.steps;

// 2. Filter visible only
const visibleSteps = steps.filter(s => s.visible);

// 3. Render each step
visibleSteps.map(step => (
  <StepContainer key={step.key} isActive={currentStep === index}>
    <FieldRenderer
      field={step}
      value={formData[step.key]}
      onChange={(val) => updateField(step.key, val)}
    />
  </StepContainer>
))
```

### FieldRenderer Types

```javascript
const FIELD_RENDERERS = {
  input: FormInput,      // Text, email, tel inputs
  select: SelectCard,  // Dropdown selections
  textarea: FormTextarea, // Multi-line text
  consent: ConsentCheckbox // GDPR consent
};
```

---

## 6. Data Flow Example

### Admin Changes Field Visibility

```
1. Admin opens Hero Section Editor
2. Goes to "Configuration Formulaire" tab
3. Clicks eye icon on "nom" field
   → local state: { key: "nom", visible: false }
4. Clicks "Enregistrer"
5. onSave(heroContent) called
6. Section saved with formConfig.steps updated
7. Frontend reloads, filters visible fields
8. "nom" field no longer appears in form
```

### Lead Submission

```
1. User fills form (only visible fields shown)
2. submitQuote(formData) called
3. POST to /api/leads
4. LeadController validates using FormConfig
5. Lead entity created with data
6. Returns success/error response
```

---

## 7. File Structure

```
BACKEND/
├── src/
│   ├── Service/
│   │   └── FormConfig.php          # Field config management
│   └── Controller/
│       └── LeadController.php      # API endpoints

frontend/
├── src/
│   ├── api/
│   │   └── leadsApi.js           # API client functions
│   ├── components/
│   │   ├── Hero.jsx             # Form rendering
│   │   └── forms/
│   │       ├── FormRenderer.jsx # Field rendering
│   │       ├── FieldRenderer.jsx  # Generic field
│   │       └── StepRenderer.jsx    # Step rendering
│   ├── admin/
│   │   └── pages/
│   │       └── FormFieldManager.jsx # Global field manager
│   │   └── sections/
│   │       └── HeroSectionEditor.jsx # Hero config editor
│   └── config/
│       ├── formConfig.js          # Default steps fallback
│       └── formSchema.js         # Schema definitions
```

---

## 8. Quick Reference

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads/config` | GET | Get all fields |
| `/api/leads/config` | POST | Update fields |
| `/api/leads/config/reset` | POST | Reset to defaults |
| `/api/leads` | POST | Submit lead |

### Frontend Functions

| Function | Location | Purpose |
|----------|---------|---------|
| `getConfig()` | leadsApi.js | Fetch config from API |
| `updateConfig()` | leadsApi.js | Save config to API |
| `getFormSteps()` | formConfig.js | Get default steps |
| `getVisibleFields()` | formConfig.js | Filter visible |

### Key Properties

| Property | Can Edit? | Description |
|----------|----------|------------|
| `visible` | ✅ YES | Show/hide field |
| `required` | ✅ YES | Make mandatory |
| `order` | ✅ YES | Display order |
| `label` | ✅ YES | Question text |
| `placeholder` | ✅ YES | Input hint |
| `type` | ❌ NO | Field type |
| `options` | ❌ NO | Select options |
| `key` | ❌ NO | Field ID |

---

## 9. Troubleshooting

### Field not showing in form
→ Check if `visible: true` in formConfig.steps

### Required validation not working
→ Check field has `required: true`

### Changes not saving
→ Make sure to click "Enregistrer" in editor

### API errors
→ Check backend Symfony cache: `php bin/console cache:clear`

---

*Last updated: 2024*
