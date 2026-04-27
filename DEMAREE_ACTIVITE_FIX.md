# ✅ Fix Complete: Démarrée Activité Field

## Changes Applied

### 1. Database Migration ✅
**File:** `Version20260427200000.php`
- Renamed column `start_activity` → `demaree_activite`
- Changed type from `DATETIME` → `VARCHAR(50)`
- Migration executed successfully

### 2. Lead Entity ✅
**File:** `src/Entity/Lead.php`
```php
#[ORM\Column(length: 50, nullable: true)]
private ?string $demaree_activite = null;

public function getDemareeActivite(): ?string
public function setDemareeActivite(?string $demaree_activite): static
```
- Removed `start_activity` property and methods
- Added `demaree_activite` property with getter/setter

### 3. FormConfig Service ✅
**File:** `src/Service/FormConfig.php`
```php
[
    'key' => 'demaree_activite',
    'label' => 'Démarrée activité ?',
    'type' => 'select',
    'required' => false,
    'visible' => true,
    'options' => [
        ['value' => 'oui', 'label' => 'Oui'],
        ['value' => 'non', 'label' => 'Non'],
    ],
    'placeholder' => 'Sélectionnez une option',
    'order' => 7,
]
```
- Changed from date input to yes/no select
- Added French labels

### 4. Form Schema ✅
**File:** `frontend/src/config/formSchema.js`
```javascript
{
    key: 'demaree_activite',
    label: 'Démarrée activité ?',
    type: 'select',
    required: false,
    visible: true,
    options: 'YES_NO_OPTIONS',
    placeholder: 'Sélectionnez une option',
    icon: 'fa-calendar',
    order: 7,
    validation: { required: false }
}
```
- Added `YES_NO_OPTIONS` to global options
- Type: `select` (not `input`)

### 5. LeadController ✅
**File:** `src/Controller/LeadController.php`
- Updated `listLeads()` to use `getDemareeActivite()` instead of `getStartActivity()`
- Updated `mapDataToLead()` to map `demaree_activite` field
- Removed date handling for this field (now a simple string)

### 6. Homepage Hero Section ✅
**File:** `src/Command/SetHomepageHeroFormConfigCommand.php`
```php
[
    'key' => 'demaree_activite',
    'label' => 'Démarrée activité ?',
    'type' => 'select',
    'required' => false,
    'visible' => true,
    'options' => 'YES_NO_OPTIONS',
    'placeholder' => 'Sélectionnez une option',
    'icon' => 'fa-calendar',
    'validation' => ['required' => false]
]
```
- Added to homepage hero (ID 75) formConfig
- Position: 7th field (after email, before insured_currently)

### 7. FormRenderer ✅
**File:** `src/components/forms/FormRenderer.jsx`
- Already supports `type: 'select'`
- No changes needed - existing code handles it

---

## Database Schema - Final State

| Column | Type | Description |
|--------|------|-------------|
| demaree_activite | VARCHAR(50) | Démarrée activité ? (oui/non) |

**Replaced:** `start_activity DATETIME` → `demaree_activite VARCHAR(50)`

---

## Form Fields on Homepage

**Position 7 of 7 fields:**

1. Entreprise (text input)
2. Statut Juridique (select)
3. Chiffre d'affaires (select)
4. Téléphone (tel input + consent)
5. Email (email input + consent)
6. **Démarrée activité ? (select - oui/non)** ✨
7. Motif de résiliation (select)

---

## Verification

### Database
```sql
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'lead' AND COLUMN_NAME = 'demaree_activite';
```
✅ Returns: `demaree_activite`

```sql
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'lead' AND COLUMN_NAME = 'start_activity';
```
✅ Returns: (empty - column removed)

### Homepage Hero Content
```json
{
  "key": "demaree_activite",
  "label": "Démarrée activité ?",
  "type": "select",
  "options": "YES_NO_OPTIONS",
  "validation": {"required": false}
}
```
✅ Present in hero section (ID 75)

### Options Available
- `oui` - Oui
- `non` - Non

---

## API Endpoints

### POST /api/leads
Accepts `demaree_activite` field:
```json
{
  "demaree_activite": "oui"
}
```

### GET /api/leads
Returns `demaree_activite` field:
```json
{
  "demaree_activite": "oui"
}
```

---

## Summary

✅ Column renamed in database  
✅ Entity updated  
✅ FormConfig updated  
✅ FormSchema updated  
✅ Controller updated  
✅ Homepage hero updated  
✅ Migration executed  

**Status: ✅ COMPLETE**

The form now has a "Démarrée activité ?" select field with "Oui/Non" options instead of a date picker!
