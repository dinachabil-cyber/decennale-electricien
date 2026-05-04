# Assurance Décennale Électricien - CMS & Lead Generation Platform

A full-stack web application built with Symfony 8 (PHP) backend and React 19 frontend. This is a headless CMS with a multi-step quote form for electrician's decennial insurance.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Architecture](#frontend-architecture)
7. [Section Types](#section-types)
8. [Form System](#form-system)
9. [Authentication & Security](#authentication--security)
10. [Admin Interface](#admin-interface)
11. [Development Setup](#development-setup)
12. [Step-by-Step Creation Process](#step-by-step-creation-process)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## Project Overview

This application is a marketing website + lead generation system for "Assurance Décennale Électricien" (Electrician's Decennial Insurance). It features:

- **Dynamic Page Builder**: Admin can create pages composed of multiple reusable sections
- **Multi-Step Lead Form**: A wizard-style quote request form with 10 fields
- **Admin Dashboard**: Manage pages, sections, and view leads
- **Headless CMS**: Symfony backend provides REST API consumed by React frontend
- **JWT Authentication**: Secure admin access with token-based auth

---

## Tech Stack

### Backend
- **PHP 8.4**
- **Symfony 8.0**: Framework with controllers, dependency injection, routing
- **Doctrine ORM**: Object-relational mapper for database operations
- **Doctrine Migrations**: Database schema versioning
- **MySQL/MariaDB 10.11**: Database
- **JWT (custom)**: JSON Web Token authentication (TokenService)

### Frontend
- **React 19.2.5**: UI library with functional components and hooks
- **React Router DOM 7.14.1**: Client-side routing
- **Tailwind CSS 3.4.19**: Utility-first CSS framework
- **Axios / Fetch**: API communication

### Infrastructure
- **DDEV**: Local development environment (Docker-based)
- **Composer**: PHP dependency manager
- **npm / Yarn**: Node package manager

---

## Architecture

The application follows a **headless CMS architecture**:

```
┌─────────────────────────────────────────────┐
│           React Frontend (Client)           │
│  Pages: Home, Dynamic, Admin, Login        │
│  Components: Sections, Forms, Admin UI     │
└───────────────┬─────────────────────────────┘
                │ HTTP/JSON REST API
                ↓
┌─────────────────────────────────────────────┐
│        Symfony Backend (API)                 │
│  Controllers: Page, Section, Lead, Auth    │
│  Services: TokenService, FormConfig         │
│  Entities: Page, Section, Lead, Admin      │
└───────────────┬─────────────────────────────┘
                │ Doctrine ORM
                ↓
┌─────────────────────────────────────────────┐
│              MySQL Database                  │
│  Tables: page, section, lead, admin        │
└─────────────────────────────────────────────┘
```

**Key Concepts:**

1. **Page** entity has many **Section** entities (OneToMany relationship)
2. **Section** content is stored as JSON (`content` column) to support flexible schemas
3. Pages are accessed by **slug** (URL-friendly identifier)
4. **Sections** are ordered by `position` integer
5. Each section has a **type** (hero, content, faq, cards, cta, form, steps, footer)
6. **Lead** records store form submissions
7. **Admin** users manage the CMS

### Data Flow

**Frontend Rendering Flow:**
1. User visits `/:slug` URL
2. React Router renders `DynamicPage` component
3. `DynamicPage` calls `pagesApi.getBySlug(slug)` → `GET /api/pages/slug/:slug`
4. Backend returns page data with sections
5. Frontend renders each section via `SectionRenderer` which maps types to components

**Admin Flow:**
1. Admin logs in at `/login` → POST `/api/auth/login`
2. JWT token stored in `localStorage`
3. Token sent in `Authorization: Bearer <token>` header
4. `AuthMiddleware` validates token on protected routes
5. Admin CRUD operations on pages/sections

**Form Submission Flow:**
1. User fills multi-step form in Hero section
2. Validation performed client-side (formSchema)
3. Form data POSTed to `/api/leads`
4. `LeadController` validates, creates Lead entity
5. Lead saved to database

---

## Database Schema

### 1. `page` table
```sql
CREATE TABLE page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_published TINYINT(1) DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

**Relationships:** One Page → Many Sections (cascade delete)

### 2. `section` table
```sql
CREATE TABLE section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    content JSON, -- Flexible content per section type
    position INT DEFAULT 0,
    is_enabled TINYINT(1) DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (page_id) REFERENCES page(id) ON DELETE CASCADE
);
```

**Section Types:** hero, content, faq, cards, cta, form, steps, footer

### 3. `lead` table
```sql
CREATE TABLE lead (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NULL,
    prenom VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    raison_sociale VARCHAR(255) NULL,
    demaree_activite VARCHAR(50) NULL,
    activite_assuree VARCHAR(255) NULL,
    assurance_resilie VARCHAR(255) NULL,
    motif_resiliation VARCHAR(255) NULL,
    code_postal VARCHAR(255) NULL,
    tele VARCHAR(50) NULL,
    created_at DATETIME NOT NULL
);
```

**Note:** Field names are in French to match business requirements.

### 4. `admin` table
```sql
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at DATETIME NOT NULL
);
```

---

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login admin user.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### GET `/api/auth/verify`
Verify JWT token (protected).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "role": "admin"
}
```

#### POST `/api/auth/logout`
Logout (client-side token removal).

---

### Pages

#### GET `/api/pages`
List all pages (admin only).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Accueil",
    "slug": "home",
    "isPublished": true,
    "createdAt": "2025-04-29T10:00:00+00:00",
    "updatedAt": "2025-04-29T11:30:00+00:00"
  }
]
```

#### POST `/api/pages`
Create new page (admin only).

**Request:**
```json
{
  "title": "My Page",
  "slug": "my-page"
}
```

**Response:** 201 Created with page object.

#### GET `/api/pages/{id}`
Get page by ID with sections (admin only).

#### GET `/api/pages/slug`
Get homepage (slug = `/`).

#### GET `/api/pages/slug/{slug}`
Get page by slug (public - only published pages). Add `?preview=true` for draft preview (admin only).

**Response:**
```json
{
  "id": 1,
  "title": "Accueil",
  "slug": "/",
  "isPublished": true,
  "sections": [
    {
      "id": 1,
      "type": "hero",
      "content": {
        "title": "Welcome",
        "subtitle": "Subtitle here"
      },
      "position": 0,
      "isEnabled": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### PUT `/api/pages/{id}`
Update page (admin only).

**Request:**
```json
{
  "title": "New Title",
  "slug": "new-slug"
}
```

#### PATCH `/api/pages/{id}/publish`
Toggle published status.

**Response:**
```json
{
  "id": 1,
  "isPublished": true
}
```

#### DELETE `/api/pages/{id}`
Delete page (cascades to sections).

---

### Sections

#### POST `/api/pages/{pageId}/sections`
Add section to page (admin only).

**Request:**
```json
{
  "type": "hero",
  "content": {
    "title": "Hero Title",
    "subtitle": "Hero Subtitle"
  },
  "position": 0
}
```

**Valid Types:** `hero`, `content`, `faq`, `cards`, `cta`, `form`, `steps`, `footer`

#### PUT `/api/sections/{id}`
Update section (admin only).

#### DELETE `/api/sections/{id}`
Delete section.

#### PATCH `/api/sections/{id}/toggle`
Toggle enabled/disabled status.

#### POST `/api/pages/{pageId}/reorder-sections`
Reorder sections by sending array of section IDs in new order.

**Request:**
```json
{
  "sections": [3, 1, 2]
}
```

---

### Leads

#### POST `/api/leads`
Create new lead submission (public).

**Request:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@example.com",
  "tele": "0612345678",
  "raisonSociale": "Auto-entrepreneur",
  "demarrageActivite": "oui",
  "activiteAssuree": "no",
  "assuranceResilie": "yes",
  "motifResiliation": "autre",
  "codePostal": "75001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead créé avec succès",
  "data": {
    "id": 1,
    "createdAt": "2025-04-29 14:32:00"
  }
}
```

#### GET `/api/leads`
List all leads (admin only).

#### GET `/api/leads/config`
Get form field configuration (which fields are visible, order, validation rules).

**Response:**
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
      "inputType": "text",
      "order": 1
    },
    ...
  ]
}
```

#### POST `/api/leads/config`
Update form field configuration (admin only).

#### POST `/api/leads/config/reset`
Reset to default configuration (admin only).

---

### Admin Stats

#### GET `/api/admin/stats`
Get dashboard statistics (admin only).

**Response:**
```json
{
  "totalLeads": 150,
  "newLeadsThisMonth": 12,
  "totalPages": 5,
  "leadsByStatus": {}
}
```

---

## Frontend Architecture

### Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── cms.js                    # API client (pagesApi, sectionsApi, authApi, leadsApi)
│   ├── components/
│   │   ├── admin/
│   │   │   ├── SectionRenderer.jsx   # Admin section editor
│   │   │   └── sections/             # Section editors (HeroEditor, ContentEditor, etc.)
│   │   ├── forms/                    # Form components (FieldRenderer, StepRenderer, etc.)
│   │   ├── sections/                 # Frontend section components
│   │   │   ├── SectionRenderer.jsx   # Maps section type to component
│   │   │   ├── Hero.jsx
│   │   │   ├── Content.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Cards.jsx
│   │   │   ├── CTASection.jsx
│   │   │   ├── StepsSection.jsx
│   │   │   ├── FormSection.jsx
│   │   │   └── FooterSection.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── CookieBanner.jsx
│   ├── config/
│   │   ├── formSchema.js             # Form field definitions
│   │   └── formConfig.js             # Form validation logic
│   ├── pages/
│   │   ├── Home.jsx                  # Home page wrapper
│   │   ├── DynamicPage.jsx           # Generic page renderer by slug
│   │   ├── Response.jsx              # Lead form submission response
│   │   ├── AdminPage.jsx             # Admin dashboard layout
│   │   └── Login.jsx                 # Admin login
│   ├── sections/
│   │   └── registry.js               # Section type registry (icons, defaults)
│   ├── App.js                        # Router setup
│   ├── index.js                      # Entry point
│   └── index.css                     # Global styles + Tailwind imports
├── public/
│   └── manifest.json
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

### Routing

**Frontend Routes (React Router):**

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `DynamicPage` | Home page (slug=/) |
| `/:slug` | `DynamicPage` | Any page by slug |
| `/login` | `Login` | Admin login |
| `/admin` | `AdminPage` | Admin dashboard (protected) |

**Backend API Routes (Symfony Attributes):**

All API routes are under `/api/...` and defined in controller classes using `#[Route()]` attributes.

---

## Section Types

The CMS supports 8 section types defined in `frontend/src/sections/registry.js`:

### 1. Hero (`hero`)
Homepage hero section with title, subtitle, CTA button, background image, and optional embedded lead form.

**Content structure:**
```json
{
  "title": "Hero Title",
  "subtitle": "Hero Subtitle",
  "ctaText": "Get Quote",
  "ctaLink": "/contact",
  "backgroundImage": "/path/to/image.jpg",
  "showForm": true,
  "formConfig": { ... } // Dynamic form steps configuration
}
```

**Frontend Component:** `Hero.jsx`

---

### 2. Content (`content`)
Text content section with intro and multiple text subsections.

**Content structure:**
```json
{
  "title": "Section Title",
  "introduction": "Intro paragraph...",
  "sections": [
    { "title": "Subsection", "content": "Text content..." }
  ],
  "ctaText": "Button text",
  "ctaLink": "/contact"
}
```

**Frontend Component:** `Content.jsx`

---

### 3. FAQ (`faq`)
Frequently asked questions accordion.

**Content structure:**
```json
{
  "items": [
    { "question": "Question?", "answer": "Answer..." }
  ]
}
```

**Frontend Component:** `FAQ.jsx`

---

### 4. Cards (`cards`)
Grid of feature cards with icons, titles, bullet points, and CTA.

**Content structure:**
```json
{
  "title": "Our Services",
  "subtitle": "Subtitle",
  "cards": [
    {
      "title": "Card Title",
      "subtitle": "Card Subtitle",
      "bulletPoints": ["Feature 1", "Feature 2"],
      "buttonText": "Learn More",
      "buttonLink": "#",
      "icon": "star"
    }
  ]
}
```

**Frontend Component:** `Cards.jsx`

---

### 5. CTA (`cta`)
Call-to-action banner.

**Content structure:**
```json
{
  "title": "Ready to start?",
  "subtitle": "Contact us today",
  "buttonText": "Get Started",
  "buttonLink": "/contact",
  "backgroundColor": "yellow"
}
```

**Frontend Component:** `CTA.jsx`

---

### 6. Form (`form`)
Generic contact/quote form (standalone section, different from hero-embedded form).

**Content structure:**
```json
{
  "title": "Contact Us",
  "description": "Fill out this form",
  "submitText": "Send",
  "email": "contact@example.com",
  "fields": [
    { "name": "name", "label": "Name", "type": "text", "required": true },
    { "name": "email", "label": "Email", "type": "email", "required": true },
    { "name": "message", "label": "Message", "type": "textarea", "required": true }
  ]
}
```

**Frontend Component:** `FormSection.jsx`

---

### 7. Steps (`steps`)
Process steps section (numbered steps).

**Content structure:**
```json
{
  "title": "How It Works",
  "steps": [
    { "number": "01", "title": "Step 1", "description": "Description..." }
  ]
}
```

**Frontend Component:** `StepsSection.jsx` (HowItWorks.jsx)

---

### 8. Footer (`footer`)
Site footer with text and links.

**Content structure:**
```json
{
  "text": "Copyright text...",
  "links": [
    { "label": "Legal", "url": "/legal" }
  ]
}
```

**Frontend Component:** `FooterSection.jsx`

---

## Form System

### Overview

The lead form is a **multi-step wizard** with 10 fields, stored in the `lead` table. The form supports dynamic configuration through the admin panel.

### Form Fields

All 11 fields (including a hidden system field):

| Key | Label | Type | Required | Input Type |
|-----|-------|------|----------|------------|
| `nom` | Nom | input | No | text |
| `prenom` | Prénom | input | Yes | text |
| `raisonSociale` | Raison Sociale | input | No | text |
| `demarrageActivite` | Démarrée activité ? | select | No | select (oui/non) |
| `tele` | Téléphone | input | Yes | tel (with consent) |
| `email` | Email | input | Yes | email (with consent) |
| `activiteAssuree` | Êtes-vous actuellement assuré ? | select | No | select (yes/no) |
| `assuranceResilie` | Avez-vous déjà résilié une assurance ? | select | No | select (yes/no) |
| `motifResiliation` | Motif de résiliation | select | No | select (sinistre, non_paiement, etc.) |
| `codePostal` | Code postal | input | No | text |
| `createdAt` | Date de création | datetime | No | (hidden system field) |

### Form Storage & Configuration

**FormConfig Service** (`BACKEND/src/Service/FormConfig.php`):
- Stores field configurations in Symfony cache (FilesystemAdapter)
- Default configuration defined in `DEFAULT_CONFIG` constant
- Admin can modify visibility, order, labels, required status via admin UI
- Configurable via API: `GET/POST /api/leads/config`

**Frontend Configuration** (`frontend/src/config/formSchema.js`):
- Single source of truth for form schema
- Includes validation rules, field metadata, option lists
- Used by Hero component to render dynamic steps

### Form Rendering Components

```
FormRenderer.jsx         - Main form renderer for FormSection
├── FieldRenderer.jsx   - Renders individual fields
├── StepRenderer.jsx    - Renders all fields in a step (for multi-step)
└── step components:
    ├── FormInput.jsx       - Text/number inputs
    ├── SelectCard.jsx       - Radio card selection
    ├── ConsentCheckbox.jsx  - Consent checkboxes
    └── FormTextarea.jsx     - Textarea fields
```

**Admin Form Editors:**
- `HeroSectionEditor.jsx` - Form config editor for Hero section
- `FormSectionEditor.jsx` - Generic form section editor
- `FormBuilderEditor.jsx` - Field configuration UI

### Submission Flow

1. **Client-side validation**: Each field validated on blur/next-step
2. **Data mapping**: `prepareSubmitData()` converts formData → Lead entity fields
3. **API POST**: `POST /api/leads` with JSON body
4. **Server-side validation** in `LeadController::createLead()`:
   - Checks required fields
   - Validates email format
   - Validates phone pattern
   - Ensures at least one contact field is provided
5. **Entity creation**: New Lead persisted to database
6. **Response**: Success 201 or error 400 with field errors

### Multi-Step Wizard (Hero Form)

The embedded hero form uses a wizard interface:
- Step indicators shown at top
- One field (or field group) per step
- "Next" button disabled until current step valid
- "Back" button to previous steps
- Final step shows "Submit" button

Controlled by `Hero.jsx` which uses:
- `currentStep` state
- `canProceedToStep()` validation function
- Dynamic `formConfig.steps` array from section content

---

## Authentication & Security

### JWT Token Service

**TokenService** (`BACKEND/src/Service/TokenService.php`):
- Custom JWT implementation (HS256)
- Payload: `{ sub: adminId, email: email, iat: issuedAt, exp: expiresAt }`
- Default expiry: 7 days
- Secret key from environment variable `JWT_SECRET`

**Token Structure:**
```
header.payload.signature
- Header: base64({"alg":"HS256","typ":"JWT"})
- Payload: base64({...})
- Signature: HMAC-SHA256(header.payload, secretKey)
```

### Authentication Flow

1. **Login**: POST `/api/auth/login` with credentials
2. **Verification**: Successful auth returns JWT token
3. **Storage**: Token saved in React `localStorage` as `admin_token`
4. **API Requests**: Token sent in `Authorization: Bearer <token>` header
5. **Verification**: Every protected route checks token via `AuthMiddleware` or `requireAdmin()`

### Protected Routes

**Backend** - Controllers extending `AdminController` call `$this->requireAdmin()` which:
- Extracts token from Authorization header
- Validates signature + expiry via `TokenService`
- Returns Admin entity or JsonResponse error

**Frontend** - `ProtectedAdminRoute` component calls `authApi.verify()` before rendering admin routes.

### CORS Configuration

`BACKEND/config/packages/nelmio_cors.yaml`:
- Allows origins: `localhost:3000`, `localhost`, `.ddev.site` domains
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Headers: `Content-Type`, `Authorization`

---

## Admin Interface

### Admin Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `AdminPage` | Dashboard with stats |
| `/admin/pages` | `PageList` | Manage pages (CRUD) |
| `/admin/pages/:id/sections` | `SectionManager` | Manage page sections |
| `/admin/leads` | `LeadList` | View submissions |
| `/admin/settings` | `FormFieldManager` | Configure form fields |
| `/admin/media` | `MediaManager` | Upload media |

### Page Management

**PageList.jsx**:
- List all pages with title, slug, published status
- Create new page (title + slug)
- Edit page (title, slug)
- Delete page (with confirmation)
- Toggle publish/unpublish
- Navigate to section manager

**SectionManager.jsx**:
- List all sections for a page
- Add new section modal (select type)
- Edit section in modal (opens appropriate editor)
- Reorder sections (up/down buttons)
- Toggle enable/disable
- Preview section in overlay
- Delete section
- "Preview page" button opens frontend URL

### Section Editors

Each section type has a dedicated editor component:

| Component | Section Type | Editable Fields |
|-----------|--------------|-----------------|
| `HeroSectionEditor` | hero | title, subtitle, cta, showForm, backgroundImage, formConfig |
| `ContentSectionEditor` | content | title, intro, sections[].title, sections[].content, cta |
| `FAQSectionEditor` | faq | items[].question, items[].answer |
| `CardsSectionEditor` | cards | title, subtitle, cards[] |
| `CTASectionEditor` | cta | title, subtitle, buttonText, buttonLink, backgroundColor |
| `FormSectionEditor` | form | title, description, submitText, email, fields[] |
| `StepsSectionEditor` | steps | title, steps[] |
| `FooterSectionEditor` | footer | text, links[] |

**AdminSectionRenderer** (`frontend/src/components/admin/SectionRenderer.jsx`):
- Chooses which editor component to render based on section.type
- Provides `onSave` callback to persist changes

### Lead Management

**LeadList.jsx** (future) - Would display leads table with:
- Contact info
- Form data fields
- Submission date
- Export functionality

### Form Field Configuration

`FormFieldManager.jsx` (future/implied):
- Drag-and-drop field ordering
- Toggle field visibility
- Edit labels, placeholders, validation
- Reset to defaults

---

## Development Setup

### Prerequisites

- PHP 8.4+
- Composer
- Node.js 18+
- DDEV (Docker) - optional but recommended

### Backend Setup

1. Navigate to backend:
   ```bash
   cd BACKEND
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Configure environment:
   ```bash
   cp .env .env.local
   ```
   Edit `.env.local`:
   ```env
   DATABASE_URL="mysql://db:db@db:3306/db?serverVersion=10.11.2-MariaDB&charset=utf8mb4"
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

4. Start DDEV (Docker) or configure local MySQL:
   ```bash
   ddev start
   ddev composer install
   ```

5. Run migrations:
   ```bash
   ddev symfony console doctrine:migrations:migrate
   ```

6. Load fixtures (optional sample data):
   ```bash
   ddev symfony console doctrine:fixtures:load
   ```

7. Create admin user:
   ```bash
   php BACKEND/load_admin.php
   ```
   Or manually:
   ```bash
   ddev symfony console app:create-admin admin@example.com password
   ```

8. Start backend:
   ```bash
   ddev symfony server:start
   ```
   Backend runs at: `http://ecennale-electricien-backend.ddev.site`

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   Create `.env.local`:
   ```env
   REACT_APP_API_URL=http://ecennale-electricien-backend.ddev.site/api
   REACT_APP_FRONTEND_URL=http://localhost:3000
   ```

4. Start development server:
   ```bash
   npm start
   ```
   Frontend runs at: `http://localhost:3000`

5. Build for production:
   ```bash
   npm run build
   ```

### Database Access

- **DDEV PHPMyAdmin**: `ddev phpmyadmin`
  URL: `http://ecennale-electricien-backend.ddev.site/phpmyadmin`
- **Direct MySQL**:
  ```bash
  ddev mysql
  ```

---

## Step-by-Step Creation Process

### Phase 1: Backend Foundation

1. **Symfony Project Setup**
   ```bash
   composer create-project symfony/skeleton BACKEND
   ```
   - Installed Symfony 8.0 skeleton
   - Configured Flex recipes

2. **Bundle Installation**
   ```bash
   composer require doctrine/doctrine-bundle
   composer require doctrine/doctrine-migrations-bundle
   composer require symfony/security-bundle
   composer require nelmio/cors-bundle
   ```
   - Doctrine ORM for database abstraction
   - Migrations for schema versioning
   - Security for potential future auth (initially planned, but custom JWT used)
   - CORS for frontend-backend communication

3. **Entity Creation**
   - `Page.php` - with OneToMany sections, lifecycle callbacks
   - `Section.php` - with ManyToOne Page, JSON content
   - `Lead.php` - with all insurance form fields
   - `Admin.php` - admin users

4. **Repository Classes**
   - `PageRepository.php`
   - `SectionRepository.php`
   - `LeadRepository.php`
   - `AdminRepository.php`

5. **Controller Development**
   - `PageController` - handles page CRUD, section additions
   - `SectionController` - manages sections standalone
   - `LeadController` - form submissions + config
   - `AuthController` - JWT login/logout/verify
   - `AdminController` - abstract base with `requireAdmin()` helper
   - `MediaController` - file uploads (if implemented)

6. **Services**
   - `TokenService` - custom JWT generation/validation
   - `FormConfig` - cached form field configuration

7. **Middleware**
   - `AuthMiddleware` - token extraction and admin lookup

8. **Database Migrations**
   - Initial migrations: create tables
   - Add `is_published` to pages
   - Add `is_enabled` to sections
   - Modify column types

9. **Fixtures** (optional)
   - `AppFixtures` - loads sample pages/sections
   - `PageFixtures` - default pages (homepage)
   - `AdminFixtures` - default admin user

---

### Phase 2: Frontend Foundation

1. **React App Creation**
   ```bash
   npx create-react-app frontend --template cra-template-pwa
   ```
   - Chose Vite or CRA (file shows react-scripts)
   - Installed dependencies: React Router, Tailwind CSS

2. **Dependency Installation**
   ```bash
   npm install react-router-dom tailwindcss
   npm install -D autoprefixer postcss
   ```

3. **Tailwind Setup**
   - `tailwind.config.js` - content paths, theme customization
   - `postcss.config.js` - PostCSS with Tailwind plugin
   - `index.css` - `@tailwind base; @tailwind components; @tailwind utilities;`

4. **Project Structure**
   Organized components by feature:
   - `/components` - reusable UI pieces
   - `/pages` - page-level components
   - `/api` - API client
   - `/config` - form schema, constants
   - `/sections` - section components + registry

---

### Phase 3: API Client Integration

**frontend/src/api/cms.js**:
- `API_URL` from environment
- `request()` - wrapper around fetch with error handling
- Auth token management (`getToken()`, `authHeader()`)
- Namespaced API objects: `pagesApi`, `sectionsApi`, `authApi`

All components import these APIs; no fetch calls scattered.

---

### Phase 4: Page Rendering System

**DynamicPage.jsx**:
- Reads URL slug from React Router `useParams()`
- Fetches page via `pagesApi.getBySlug(slug)`
- Handles loading, error, not-found states
- Filters sections by `isEnabled`
- Sorts by `position`
- Renders each via `SectionRenderer`

**SectionRenderer.jsx** (frontend):
- Lazy-loads section components with `React.lazy()`
- `COMPONENTS` map: `hero` → `Hero`, `content` → `Content`, etc.
- Passes `content` and `sectionId` as props
- Handles disabled sections (returns null)

---

### Phase 5: Section Development

Each section built as standalone React component:

1. **Hero.jsx** (most complex)
   - Multi-step form integration
   - Preview mode support
   - Dynamic formConfig from content
   - Form submission via `submitQuote` service

2. **Content, FAQ, Cards, CTA, Steps, Footer**
   - Receive `content` prop with section data
   - Render appropriate HTML structure with Tailwind

3. **FormSection.jsx**
   - Renders static form (config in `content.fields`)
   - Basic validation
   - Simulated submission (not active in production)

---

### Phase 6: Multi-Step Form System

**Key Files:**
- `frontend/src/config/formSchema.js` - master schema with all 10 fields
- `frontend/src/components/forms/` - form component library
- `Hero.jsx` - orchestrates multi-step wizard

**Form Wizard Features:**
- Progress indicator (StepIndicator)
- One field per step (for hero form)
- Validation before proceeding
- Back/Next/Submit buttons
- Success message after submission

**Admin Form Configuration:**
- `HeroSectionEditor.jsx` includes `FormBuilderEditor.jsx`
- Admin can reorder, add/remove fields, change labels
- Changes stored in section's `content.formConfig` JSON
- `FormConfig` service persists to cache on backend

---

### Phase 7: Admin Interface

**AdminPage.jsx**:
- Requires auth (`ProtectedAdminRoute`)
- Sidebar navigation
- Stats dashboard (leads, pages)
- Lists pages, sections, leads

**PageList.jsx**:
- Table/card responsive layout
- Create/Edit/Delete/Publish/Unpublish
- Modals for create/edit

**SectionManager.jsx**:
- List of sections with preview snippets
- Reorder with up/down or drag (buttons)
- Edit in type-specific modal
- Live preview button

**Section Editors**:
Each editor customizes content for that section type:
- Shared UI components from `admin/sections/`
- Two-column layout: preview left, editor right

---

### Phase 8: Lead Management

**Backend:**
- `LeadController::createLead()` - validates & saves
- Dynamic field mapping via `mapDataToLead()`
- `FormConfig` service provides allowed fields + validation
- All data stored in `lead` table

**Frontend:**
- Hero form submits to `/api/leads`
- FormSection simulates submission (demo only)
- Admin would have lead list view (not fully implemented)

---

### Phase 9: Authentication Implementation

**JWT Flow:**

1. **Token Generation** (`AuthController::login`):
   ```
   $payload = ['sub' => $adminId, 'email' => $email, 'iat' => time(), 'exp' => time() + 604800];
   $token = base64url(header) + '.' + base64url(payload) + '.' + HMACSHA256(header.payload, JWT_SECRET)
   ```

2. **Token Storage**: React `localStorage.setItem('admin_token', token)`

3. **Verification** (`AuthMiddleware::requireAuth`):
   - Extract Bearer token from `Authorization` header
   - Validate signature via `TokenService::validateToken()`
   - Check expiry
   - Fetch Admin from database by `sub` (ID)
   - Return Admin object or 401 error

4. **Logout**: Token removed from localStorage; no server invalidation (stateless JWT)

**Password Hashing:**
- `password_hash($password, PASSWORD_BCRYPT)` on create
- `password_verify($input, $hash)` on login

---

### Phase 10: Styling & UX

**Tailwind CSS**:
- Utility classes everywhere (no custom CSS files)
- Responsive design: `md:`, `lg:` prefixes
- Color scheme: yellow primary (`bg-yellow-400`), dark text, light backgrounds

**Fonts & Icons**:
- Google Fonts in `index.html` (likely Inter or Poppins)
- Font Awesome icons (`fas fa-...`) for UI elements

**Responsive Layouts**:
- Mobile-first approach
- Collapsible tables → card views on small screens
- Hamburger menu (if implemented)

---

### Phase 11: DevOps & Deployment Prep

**DDEV Configuration**:
- `BACKEND/.ddev/config.yaml` - Docker environment
- Auto-generated URLs: `*.ddev.site`
- PHP version 8.4
- MySQL 10.11
- XHProf for profiling

**Production Considerations**:
- `.env` contains dev values; `.env.prod` needed
- `APP_ENV=prod`, `APP_DEBUG=0`
- `JWT_SECRET` must be strong random string
- Database production URL
- HTTPS enforced in prod via web server config

---

## Step-by-Step Creation Process (Chronological)

Based on git history (implied from migrations):

| Date | Milestone |
|------|-----------|
| 2025-04-22 | Initial database: `admin`, `page`, `section`, `lead` tables |
| 2026-04-14 | Early migrations (possibly early development) |
| 2026-04-17 | Migration added `is_published` to pages, `is_enabled` to sections |

This file shows you how to reconstruct the platform from scratch. Follow each phase in order. Each phase builds on the previous one.

---

## Troubleshooting

### Common Issues

**1. JWT token invalid**
- Ensure `JWT_SECRET` set in `.env.local`
- Clear browser localStorage and re-login

**2. CORS errors**
- Check `nelmio_cors.yaml` includes your frontend origin
- Frontend `REACT_APP_API_URL` correct

**3. 404 on page slug**
- Page must have `isPublished = true` for public access
- Check that slug exists in database

**4. Form not submitting**
- Open browser console; check for validation errors
- Verify required fields filled
- Check network tab for API errors

**5. Sections not appearing**
- Ensure section `isEnabled = true`
- Check `position` ordering (0, 1, 2...)
- Verify section `type` exists in `registry.js`

**6. Admin can't edit**
- Token may be expired (7 days default)
- Log out and log back in

**7. Migrations fail**
- Database not accessible; verify DATABASE_URL
- Run `ddev start` first
- Check migrations are in sync: `ddev symfony console doctrine:migrations:status`

---

## Additional Notes

### Environment Variables

**Backend** (`.env.local`):
```env
APP_ENV=dev
APP_SECRET=change-this-random-string
DATABASE_URL=mysql://user:pass@host:3306/dbname?serverVersion=10.11.2-MariaDB&charset=utf8mb4
JWT_SECRET=super-secret-jwt-key-at-least-32-chars
```

**Frontend** (`.env.local`):
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### File Structure Notes

- `DATA/pages_data.json` - Static seed data for homepage
- `update_hero_form.php`, `FixHeroFormsCommand.php` - scripts to fix legacy hero content
- `bin/check-pages.php` - CLI script to validate page data
- Command classes (`LoadPagesCommand`, `ResetPagesCommand`) - CLI tools

### Security Considerations

- JWT without blacklist (cannot revoke single token without cache check)
- Form submissions not rate-limited
- Admin password hashing uses bcrypt
- SQL injection prevented by prepared statements (Doctrine)
- XSS mitigated by React's JSX auto-escaping (but content stored as raw JSON; need sanitization if admin inputs HTML)
- CSRF not implemented on API (add if needed)

---

## License

This project was built as a custom solution. Intellectual property belongs to the client.

---

**Last Updated:** 2026-04-30  
**Project Version:** 1.0 (in development)
