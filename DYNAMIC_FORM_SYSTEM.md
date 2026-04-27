# Dynamic Form System Architecture

## Overview

This document describes the clean, scalable architecture for the lead form system. The system provides a CMS-like experience where form fields can be configured dynamically without modifying the database schema.

## Key Principles

1. **Static Database Schema**: The `lead` table structure is fixed and never changes
2. **Code-Based Configuration**: All form flexibility comes from configuration, not database changes
3. **No Custom Fields Column**: Each field maps directly to a database column
4. **Admin Control**: Admin can toggle visibility, edit labels, and set required fields
5. **Type Safety**: Full-stack type safety with PHP entities and TypeScript/JavaScript configs

## Architecture Components

### 1. Backend (Symfony)

#### 1.1 Lead Entity (`src/Entity/Lead.php`)

The Lead entity contains all database columns:

```php
- id (int, primary key)
- nom (string, nullable)
- firstname (string, nullable)
- company (string, nullable)
- start_activity (datetime, nullable)
- insured_currently (string, nullable)
- previous_resiliation (string, nullable)
- resiliation_motif (text, nullable)
- postcode (string, nullable)
- email (string, nullable)
- phone (string, nullable)
- tele (string, nullable) - legacy field
- entreprise (string, nullable) - legacy field
- statut (string, nullable) - legacy field
- chiffreAffaires (string, nullable) - legacy field
- created_at (datetime)
```

**Key Points:**
- No `custom_fields` column
- All fields are nullable for flexibility
- Legacy fields kept for backward compatibility

#### 1.2 FormField Service (`src/Service/FormField.php`)

Represents a single form field configuration:

```php
class FormField
{
    - key: string          // Database column name
    - label: string        // Display label
    - type: string         // text, email, tel, select, textarea, date, datetime
    - required: bool       // Is field required?
    - visible: bool        // Should field be shown?
    - options: ?array      // For select fields
    - placeholder: ?string // Input placeholder
    - inputType: ?string   // HTML input type
    - order: ?int          // Display order
}
```

#### 1.3 FormConfig Service (`src/Service/FormConfig.php`)

Manages all form field configurations:

**Features:**
- Cached configuration for performance
- Default configuration matching database structure
- Dynamic field updates
- Field reordering
- Validation per field type
- Mass assignment protection

**Key Methods:**
```php
- getFields(): array                    // Get all fields
- getVisibleFields(): array             // Get only visible fields
- getField(string $key): ?array         // Get specific field
- updateField(string $key, array $updates): bool
- updateFields(array $updates): bool    // Update multiple fields
- reorderFields(array $order): bool     // Reorder fields
- resetToDefault(): bool                // Reset to defaults
- getAllowedKeys(): array               // For mass assignment protection
- validateFieldValue(string $key, $value): array
```

**Default Configuration:**
Defined in `FormConfig::DEFAULT_CONFIG` with all 11 database columns.

#### 1.4 LeadController (`src/Controller/LeadController.php`)

Handles form submissions dynamically:

**Endpoints:**
- `POST /api/leads` - Create lead
- `GET /api/leads` - List leads
- `GET /api/leads/config` - Get form configuration
- `POST /api/leads/config` - Update form configuration
- `POST /api/leads/config/reset` - Reset to defaults

**Dynamic Mapping:**
```php
private function mapDataToLead(Lead $lead, array $data): void
{
    // Maps form data to entity setters dynamically
    // Handles date/datetime conversion
    // Only processes allowed keys
}
```

**Validation:**
- Field-level validation based on configuration
- Type-specific validation (email, phone, date)
- Required field checking
- Returns detailed error messages

#### 1.5 Migration (`migrations/Version20260424160000.php`)

Updates lead table structure:
- Adds: firstname, company, start_activity, insured_currently, 
        previous_resiliation, resiliation_motif, postcode, phone
- Removes: custom_fields (no longer needed)

### 2. Frontend (React)

#### 2.1 Form Schema (`src/config/formSchema.js`)

Single source of truth for form configuration:

```javascript
export const FORM_SCHEMA = {
  options: {
    LEGAL_STATUSES: [...],
    REVENUE_OPTIONS: [...],
    INSURED_OPTIONS: [...],
    RESILIATION_OPTIONS: [...]
  },
  steps: [
    {
      key: 'nom',              // Database column
      label: 'Nom',            // Display label
      type: 'text',            // Field type
      required: false,         // Required?
      visible: true,           // Visible?
      placeholder: '...',      // Placeholder
      icon: 'fa-user',         // Icon
      order: 1,                // Display order
      validation: {...}        // Validation rules
    },
    // ... more fields
  ]
}
```

**Key Features:**
- All 11 database columns defined
- Legacy fields marked `visible: false`
- Type-specific validation
- Consent field support
- Order property for sorting

**Helper Functions:**
```javascript
- getFormSteps()              // Get visible steps
- getAllFormSteps()           // Get all steps
- getFieldOptions(key)        // Get options for select
- initializeFormData()        // Create empty form data
- validateField(index, value) // Validate field
- canProceedToStep(index)     // Check step validity
- prepareSubmitData(data)     // Map to API format
- getVisibleFields()          // Sorted visible fields
```

#### 2.2 Admin UI (`src/admin/pages/FormFieldManager.jsx`)

Full-featured admin interface for managing form fields:

**Features:**
- Toggle field visibility
- Edit field labels and placeholders
- Set/unset required fields
- Reorder fields with up/down buttons
- Edit select field options (JSON)
- Change field types
- Save/reset configurations
- Real-time stats

**UI Components:**
- Field list with drag indicators
- Inline editors for all properties
- Type selector dropdown
- Options editor for select fields
- Action buttons (Save, Reset, Refresh)
- Status indicators

#### 2.3 Hero Component (`src/components/Hero.jsx`)

Multi-step form component:

**Features:**
- Dynamic step rendering from configuration
- Progress indicator
- Field validation
- Consent checkboxes
- Success/error states
- Back/next navigation

**Data Flow:**
```
Form Schema → StepRenderer → FieldRenderer → Specific Component
     ↓
  Validation
     ↓
  Submit → API → Controller → Entity → Database
```

#### 2.4 Form Components (`src/components/forms/`)

**FieldRenderer.jsx:**
- Registry-based rendering
- Supports: input, select, consent
- Type-specific props
- Extensible for new types

**StepRenderer.jsx:**
- Renders all fields for a step
- Handles consent fields
- Manages field state

**StepIndicator.jsx:**
- Visual progress indicator
- Shows current step

**StepContainer.jsx:**
- Animated step transitions
- Active/inactive states

## Data Flow

### Form Submission:
```
1. User fills form (Frontend)
   ↓
2. Field validation (Frontend)
   ↓
3. Submit to /api/leads (POST)
   ↓
4. LeadController::createLead()
   ↓
5. Validate against FormConfig
   ↓
6. Map data to Lead entity
   ↓
7. Persist to database
   ↓
8. Return success/error
```

### Configuration Update:
```
1. Admin changes config (Admin UI)
   ↓
2. POST /api/leads/config
   ↓
3. LeadController::updateConfig()
   ↓
4. FormConfig::updateFields()
   ↓
5. Update cache
   ↓
6. Return updated config
```

### Form Rendering:
```
1. Load form (Frontend)
   ↓
2. GET /api/leads/config (optional)
   ↓
3. Use FORM_SCHEMA as default
   ↓
4. Filter visible fields
   ↓
5. Sort by order
   ↓
6. Render steps
```

## Adding New Fields

### Backend:
1. Add column to Lead entity
2. Add getter/setter methods
3. Add field to FormConfig::DEFAULT_CONFIG
4. Create migration
5. Run migration

### Frontend:
1. Add field to FORM_SCHEMA.steps
2. Set appropriate type and validation
3. Set order property
4. (Optional) Add to options if select field

### Example:
```php
// Lead.php
#[ORM\Column(length: 255, nullable: true)]
private ?string $new_field = null;

public function getNewField(): ?string { return $this->new_field; }
public function setNewField(?string $value): self { $this->new_field = $value; return $this; }
```

```php
// FormConfig.php
[
    'key' => 'new_field',
    'label' => 'New Field',
    'type' => 'text',
    'required' => false,
    'visible' => true,
    'order' => 10,
]
```

```javascript
// formSchema.js
{
    key: 'new_field',
    label: 'New Field',
    type: 'text',
    required: false,
    visible: true,
    order: 10,
    validation: { required: false }
}
```

## Benefits

### Maintainability:
- Single source of truth (formSchema.js / FormConfig.php)
- No repeated logic
- Easy updates (change config, not code)
- Clear separation of concerns

### Scalability:
- Dynamic field loading
- Registry pattern for field types
- Centralized validation
- Easy to add new field types

### Developer Experience:
- Type-safe (PHP + TypeScript)
- Full IDE support
- Clear interfaces
- Comprehensive validation

### Performance:
- Cached configuration
- Lazy-loaded components
- Code splitting
- Optimized re-renders

### Flexibility:
- Admin-controlled visibility
- Dynamic labels
- Configurable validation
- No database migrations needed for UI changes

## Security Considerations

1. **Mass Assignment Protection:**
   - Only allowed keys are processed
   - FormConfig::getAllowedKeys()

2. **Input Validation:**
   - Type-specific validation
   - Pattern matching
   - Required field checking

3. **CSRF Protection:**
   - Token validation (if implemented)

4. **Data Sanitization:**
   - Doctrine ORM handles SQL injection
   - Type conversion for dates

5. **Access Control:**
   - Admin endpoints should be protected
   - Role-based access (if implemented)

## Testing

### Backend Tests:
```bash
cd BACKEND
php bin/phpunit
```

### Frontend Tests:
```bash
cd frontend
npm test
```

### Manual Testing:
1. Submit form with valid data
2. Submit form with invalid data
3. Toggle field visibility in admin
4. Reorder fields
5. Reset to defaults
6. Test all field types

## Troubleshooting

### Form not rendering:
- Check FORM_SCHEMA.steps is populated
- Verify visible: true for fields
- Check console for errors

### Validation errors:
- Check validation rules in schema
- Verify field types match
- Check pattern regex

### Database errors:
- Run migrations: `php bin/console doctrine:migrations:migrate`
- Check column names match entity
- Verify nullable fields

### Cache issues:
- Clear cache: `php bin/console cache:clear`
- Reset FormConfig cache

## Future Enhancements

1. **Field Dependencies:** Show/hide based on other field values
2. **Conditional Validation:** Validation based on other fields
3. **Field Groups:** Group related fields
4. **Multi-language:** Support for multiple languages
5. **Version History:** Track configuration changes
6. **Export/Import:** Share configurations
7. **Field Templates:** Predefined field configurations
8. **Analytics:** Track field usage and completion rates

## Migration Guide

### From Old System:
1. Run migration to update database
2. Update Lead entity
3. Deploy FormConfig service
4. Update frontend formSchema.js
5. Test all form submissions
6. Remove custom_fields usage

### Rollback:
1. Restore custom_fields column if needed
2. Revert Lead entity changes
3. Restore old controller logic
4. Keep new system for new features

## Conclusion

This architecture provides a robust, scalable foundation for dynamic forms while maintaining a stable database schema. The separation of configuration from code enables rapid iteration and admin control without developer intervention.
