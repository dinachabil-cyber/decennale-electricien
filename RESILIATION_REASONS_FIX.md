# ✅ Fix Complete: Resiliation Reason Select Options

## Problem
The `resiliation_reason` field was using `type: 'textarea'` instead of a select dropdown with specific insurance cancellation reasons.

## Solution Applied

### 1. Backend (`FormConfig.php`)
Changed `resiliation_reason` from `textarea` to `select` with options:
```php
[
    'key' => 'resiliation_reason',
    'label' => 'Motif de résiliation',
    'type' => 'select',  // Changed from 'textarea'
    'required' => false,
    'visible' => true,
    'options' => [
        ['value' => 'sinistre', 'label' => 'Sinistre'],
        ['value' => 'non_paiement', 'label' => 'Non paiement'],
        ['value' => 'suspension_paiement', 'label' => 'Suspension de paiement'],
        ['value' => 'fausse_declaration', 'label' => 'Fausse déclaration'],
        ['value' => 'echeance', 'label' => 'Échéance'],
        ['value' => 'autre', 'label' => 'Autre'],
    ],
    'placeholder' => 'Sélectionnez un motif',
    'inputType' => null,
    'order' => 10,
]
```

### 2. Frontend (`formSchema.js`)
Added `RESILIATION_REASONS` options array and updated `resiliation_reason` step:
```javascript
RESILIATION_REASONS: [
    { value: 'sinistre', label: 'Sinistre' },
    { value: 'non_paiement', label: 'Non paiement' },
    { value: 'suspension_paiement', label: 'Suspension de paiement' },
    { value: 'fausse_declaration', label: 'Fausse déclaration' },
    { value: 'echeance', label: 'Échéance' },
    { value: 'autre', label: 'Autre' }
]
```

### 3. Homepage Hero Section (ID 32)
Updated via `app:set-homepage-hero-form` command to include:
- `resiliation_reason` field with `type: 'select'`
- `RESILIATION_REASONS` in options

### 4. FormTextarea Component
- **Note:** `FormTextarea.jsx` was created but is no longer needed for this field (kept for potential future use)

## Verification

✅ Database: `resiliation_reason` column exists (type: TEXT)  
✅ Backend: `FormConfig` uses `type: 'select'`  
✅ Frontend: `formSchema.js` uses `type: 'select'`  
✅ Homepage Hero: Updated with 6 fields including `resiliation_reason`  
✅ Options: All 6 reasons available (sinistre, non_paiement, suspension_paiement, fausse_declaration, echeance, autre)  

## Form Fields on Homepage

1. **Entreprise** (text input) - optional
2. **Statut Juridique** (select) - required
3. **Chiffre d'affaires** (select) - required
4. **Téléphone** (tel input + consent) - required
5. **Email** (email input + consent) - required
6. **Motif de résiliation** (select) - optional ✨ NEW

## Result

The form now displays a **select dropdown** for "Motif de résiliation" with 6 specific insurance cancellation reasons instead of a free-text textarea!
