# ✅ Clean Database Schema - Final State

## Database: `lead` table

### 13 Columns (1 ID + 12 data fields)

| # | Column Name | Type | Nullable | Description |
|---|-------------|------|----------|-------------|
| 1 | `id` | INT | NO | Primary key, auto-increment |
| 2 | `firstname` | VARCHAR(255) | YES | First name |
| 3 | `email` | VARCHAR(255) | YES | Email address |
| 4 | `phone` | VARCHAR(50) | YES | Phone number |
| 5 | `company` | VARCHAR(255) | YES | Company name |
| 6 | `status` | VARCHAR(50) | YES | Legal status (SARL, SAS, etc.) |
| 7 | `turnover` | VARCHAR(50) | YES | Annual revenue range |
| 8 | `start_activity` | DATETIME | YES | Business start date |
| 9 | `insured_currently` | VARCHAR(50) | YES | Currently insured? (yes/no) |
| 10 | `previous_resiliation` | VARCHAR(50) | YES | Previous insurance cancellation? |
| 11 | `resiliation_reason` | TEXT | YES | Reason for cancellation |
| 12 | `postcode` | VARCHAR(20) | YES | Postal code |
| 13 | `created_at` | DATETIME | YES | Record creation timestamp |

### ❌ Columns REMOVED (no longer exist):
- `nom` (legacy - replaced by `firstname`)
- `tele` (legacy - replaced by `phone`)
- `entreprise` (legacy - replaced by `company`)
- `statut` (legacy - replaced by `status`)
- `chiffre_affaires` (legacy - replaced by `turnover`)
- `resiliation_motif` (renamed to `resiliation_reason`)
- `custom_fields` (no longer needed)

### ✅ No duplicates
### ✅ No custom_fields
### ✅ Clean English/French mixed naming (consistent)

---

## Form Configuration (formSchema.js)

### 12 Form Fields (11 visible + 1 hidden system field)

| Key | Label | Type | Required | Visible |
|-----|-------|------|----------|---------|
| `firstname` | Prénom | text | ✅ true | ✅ true |
| `company` | Entreprise | text | ❌ false | ✅ true |
| `status` | Statut Juridique | select | ✅ true | ✅ true |
| `turnover` | Chiffre d'affaires | select | ✅ true | ✅ true |
| `phone` | Téléphone | tel | ✅ true | ✅ true |
| `email` | Email | email | ✅ true | ✅ true |
| `start_activity` | Date de début d'activité | date | ❌ false | ✅ true |
| `insured_currently` | Êtes-vous assuré? | select | ❌ false | ✅ true |
| `previous_resiliation` | Déjà résilié? | select | ❌ false | ✅ true |
| `resiliation_reason` | Motif de résiliation | textarea | ❌ false | ✅ true |
| `postcode` | Code postal | text | ❌ false | ✅ true |
| `created_at` | Date de création | datetime | ❌ false | ❌ false |

---

## Entity Mapping (Lead.php)

```php
class Lead
{
    private ?int $id = null;
    private ?string $firstname = null;
    private ?string $email = null;
    private ?string $phone = null;
    private ?string $company = null;
    private ?string $status = null;
    private ?string $turnover = null;
    private ?\DateTime $start_activity = null;
    private ?string $insured_currently = null;
    private ?string $previous_resiliation = null;
    private ?string $resiliation_reason = null;
    private ?string $postcode = null;
    private ?\DateTime $created_at = null;

    // Getters & Setters for each property...
}
```

---

## API Payload Format

### Submission Data:
```json
{
  "firstname": "John",
  "company": "My Company",
  "status": "sarl",
  "turnover": "30-60k",
  "phone": "0600000000",
  "email": "john@example.com",
  "start_activity": "2024-01-01",
  "insured_currently": "yes",
  "previous_resiliation": "no",
  "resiliation_reason": "N/A",
  "postcode": "75001"
}
```

### Response Data:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstname": "John",
    "email": "john@example.com",
    "phone": "0600000000",
    "company": "My Company",
    "status": "sarl",
    "turnover": "30-60k",
    "start_activity": "2024-01-00",
    "insured_currently": "yes",
    "previous_resiliation": "no",
    "resiliation_reason": "N/A",
    "postcode": "75001",
    "created_at": "2026-04-24 16:30:00"
  }
}
```

---

## Golden Rules Applied

✅ **1 column = 1 field** - No composite fields
✅ **Form keys = DB columns** - Exact name matching
✅ **Admin controls only visibility + labels** - Not data structure
✅ **No custom_fields** - All fields explicit
✅ **No duplicates** - Only one naming convention
✅ **No HTML in database** - Clean data only

---

## Migration History

1. **Version20260414130000** - Create lead table (initial columns)
2. **Version20260414150000** - Add additional columns
3. **Version20260423113000** - Add custom_fields (later removed)
4. **Version20260424160000** - Add missing columns, remove custom_fields
5. **Version20260424170000** - Add status, turnover
6. **Version20260424180000** - Rename resiliation_motif → resiliation_reason
7. **Version20260424190000** - Remove legacy duplicate columns

**Current count:** 13 columns ✅

---

## Verification Commands

```bash
# Check column count
ddev exec php bin/console dbal:run-sql \
  "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'lead';"

# List all columns
ddev exec php bin/console dbal:run-sql \
  "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'lead' ORDER BY ORDINAL_POSITION;"

# Verify no custom_fields
ddev exec php bin/console dbal:run-sql \
  "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'lead' AND COLUMN_NAME = 'custom_fields';"
```

Expected output: `0` for custom_fields check ✅

---

## Status: ✅ CLEAN & PRODUCTION READY

- 13 columns, no duplicates
- No custom_fields
- No legacy columns
- Clean naming throughout
- Full admin control
- Dynamic form system working
- All migrations executed
