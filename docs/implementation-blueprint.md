# AKSSADA Platform — Implementation Blueprint (MVP)

**Baseline:** *AKSSADA Platform — Technical Architecture* (approved).
**Constraint:** ship a working v1 in ~1–2 days. Do not overbuild. Admin/CMS stays minimal now, expands later.

> This document is a plan, not code. It exists so implementation can proceed one phase at a time in follow-up prompts, each phase small enough to verify before moving on.

---

## 1. Final MVP Scope

**Public (10 pages)**
Home · About · Initiatives · Initiative detail · Stories · Story detail · Support/Donate · Contact · Volunteer · Partner With Us

**Backend**
Initiative API · Story API · Contact submission · Volunteer submission · Partnership inquiry · PostgreSQL persistence · basic admin authentication foundation (login endpoint + JWT issuance only — no admin UI required to prove it works)

**Admin**
Just enough to prove the architecture: one protected endpoint (e.g. list contact submissions) behind JWT. No CRUD UI, no media manager, no dashboard yet.

**Explicitly cut from MVP** (present in the full architecture, deferred to Phase 2): Events, Impact Metrics, admin CRUD UI, media manager, refresh tokens, reCAPTCHA wiring (endpoint left with a seam for it), payment gateway.

---

## 2. Implementation Phases

Each phase is a vertical slice — after it completes, something real works end-to-end, not just a layer of the stack.

| Phase | Objective | What works after |
|---|---|---|
| **1** | Repo + project init (Next.js app, Spring Boot app, `docs/`, `.github/`) | Both apps boot locally; empty homepage renders; `/actuator/health` (or equivalent) returns 200 |
| **2** | Database + entities + first migration | `initiative`, `story`, `contact_submission`, `volunteer_application`, `partnership_inquiry`, `admin_user` tables exist in a real Postgres instance (local Docker or Supabase/Neon dev branch) |
| **3** | Initiative backend (entity → DTO → repo → service → controller) | `GET /api/v1/initiatives` and `GET /api/v1/initiatives/{slug}` return seeded data via Postman/curl |
| **4** | Initiative frontend | `/initiatives` and `/initiatives/[slug]` render real data from the API, with loading/empty/error states |
| **5** | Story backend + frontend | `/stories` and `/stories/[slug]` work end-to-end, same pattern as Initiative |
| **6** | Contact form (backend + frontend) | Submitting `/contact` persists a row and shows a success state |
| **7** | Volunteer + Partnership forms | Same pattern as Contact, reused form primitives |
| **8** | Remaining static public pages | Home, About, Support/Donate render with real AKSSADA content (no API calls needed beyond initiatives/stories previews on Home) |
| **9** | Admin auth foundation | `POST /api/v1/admin/auth/login` issues a JWT; one protected `GET` endpoint rejects unauthenticated requests and accepts a valid token |
| **10** | Deployment | Frontend live on Vercel, backend live on Render, DB live on Supabase/Neon, CORS correctly configured, all forms work in production |

Each phase's "Verification/test command" is defined in §14/§16 — every phase should end with something you can literally run and watch pass before starting the next.

---

## 3. Exact Repository Structure

```
akssada-platform/
├── frontend/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── initiatives/page.tsx
│   │   │   ├── initiatives/[slug]/page.tsx
│   │   │   ├── stories/page.tsx
│   │   │   ├── stories/[slug]/page.tsx
│   │   │   ├── support/page.tsx
│   │   │   ├── volunteer/page.tsx
│   │   │   ├── partner/page.tsx
│   │   │   └── contact/page.tsx
│   │   └── layout.tsx
│   ├── components/                      # PageHero, InitiativeCard, StoryCard, Form primitives, Navbar, Footer
│   ├── lib/
│   │   ├── api.ts                       # typed fetch wrapper
│   │   └── types.ts                     # DTO-matching TS types
│   ├── public/
│   ├── tailwind.config.ts
│   └── package.json
├── backend/
│   ├── src/main/java/com/akssada/platform/
│   │   ├── config/                      # SecurityConfig, CorsConfig
│   │   ├── common/                      # ApiResponse<T>, GlobalExceptionHandler
│   │   ├── auth/                        # AdminUser, AuthController, JWT util
│   │   ├── initiative/
│   │   ├── story/
│   │   ├── contact/
│   │   ├── volunteer/
│   │   ├── partnership/
│   │   └── PlatformApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/                # Flyway scripts, V1__..., V2__...
│   └── pom.xml
├── docs/
│   ├── technical-architecture.md        # the approved baseline doc
│   ├── implementation-blueprint.md      # this document
│   └── api-contracts.md
└── .github/
    └── workflows/
        ├── frontend-deploy.yml
        └── backend-deploy.yml
```

**Responsibilities:** `frontend/app/(public)` holds only public routes (a route group keeps admin routes separable later without restructuring). `lib/api.ts` is the single seam between frontend and backend — nothing else in the frontend calls `fetch` directly against the API. Each `backend` feature package is self-contained (entity, DTO, repo, service, controller) so a feature can be understood by opening one folder. `db/migration` is the single source of truth for schema — never hand-edit the DB.

---

## 4. Database Implementation Plan

### Tables (MVP only — Event/ImpactMetric/MediaAsset deferred)

**`admin_user`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| email | varchar(255) | unique, not null |
| password_hash | varchar(255) | not null |
| role | varchar(50) | not null, default `'ADMIN'` |
| created_at | timestamptz | default `now()` |

**`initiative`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| title | varchar(255) | not null |
| slug | varchar(255) | unique, not null, indexed |
| focus_area | varchar(100) | not null |
| summary | text | not null |
| content | text | not null |
| cover_image_url | text | nullable |
| is_published | boolean | default `false` |
| created_at / updated_at | timestamptz | default `now()` |

**`story`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| title | varchar(255) | not null |
| slug | varchar(255) | unique, not null, indexed |
| content | text | not null |
| cover_image_url | text | nullable |
| author_name | varchar(255) | nullable |
| category | varchar(100) | nullable |
| initiative_id | uuid | FK → initiative.id, nullable, indexed |
| is_published | boolean | default `false` |
| published_at | timestamptz | nullable |
| created_at | timestamptz | default `now()` |

**`contact_submission`**, **`volunteer_application`**, **`partnership_inquiry`** — as defined in the baseline architecture (§5 there), unchanged for MVP: each has its own status column (`varchar`, default `'NEW'`) and `submitted_at`.

### Indexes
Unique on all `slug` columns and `admin_user.email`; composite index on `story(is_published, published_at desc)`; index on `story.initiative_id`; index on each submission table's `status` column.

### Migration tool: **Flyway** — chosen over Liquibase (Flyway's plain-SQL migrations are more portfolio-legible than Liquibase's XML/YAML, and simpler than justifying against Hibernate `ddl-auto` which is explicitly wrong for anything beyond local prototyping).

**Migration sequence (no SQL yet, just the plan):**
1. `V1__create_admin_user.sql`
2. `V2__create_initiative.sql`
3. `V3__create_story.sql`
4. `V4__create_contact_submission.sql`
5. `V5__create_volunteer_application.sql`
6. `V6__create_partnership_inquiry.sql`
7. `V7__seed_admin_user.sql` (one admin account, password hash generated ahead of time, never committed in plaintext)

---

## 5. Backend Implementation Plan

Every feature below follows the same shape: **Entity → DTOs (request/response) → Repository (Spring Data JPA) → Service (interface + impl) → Controller**.

### Initiative
- **Entity:** matches §4 schema.
- **DTOs:** `InitiativeSummaryDto` (list view: title, slug, focusArea, summary, coverImageUrl), `InitiativeDetailDto` (adds content, timestamps).
- **Repository:** `findBySlugAndIsPublishedTrue`, `findAllByIsPublishedTrueOrderByCreatedAtDesc`, optional `focusArea` filter.
- **Service:** maps entity → DTO, throws `EntityNotFoundException` on missing/unpublished slug.
- **Controller:** `GET /api/v1/initiatives`, `GET /api/v1/initiatives/{slug}`.
- **Validation:** none needed (read-only in MVP; writes come via admin in Phase 2).
- **Error cases:** unknown slug → 404 via `GlobalExceptionHandler`.

### Story
Same structure as Initiative, plus optional `initiativeId` filter and pagination (`page`, `size` query params, Spring Data `Pageable`).

### Contact
- **Entity/DTO:** `ContactSubmissionRequestDto { name, email, subject, message }`.
- **Repository/Service:** simple `save`.
- **Controller:** `POST /api/v1/contact-submissions` → 201, no auth.
- **Validation:** `@NotBlank` name/subject/message, `@Email` email, `@Size(max=...)` per §11.
- **Error cases:** validation failure → 400 with field-level errors.

### Volunteer
Same structure as Contact; DTO adds `phone`, `location`, `skills`, `areasOfInterest`, `availability`.

### Partnership
Same structure as Contact; DTO adds `organizationName`, `partnershipType`.

### Authentication (minimum viable)
- Single `AdminUser` entity with `role` column (future-proofed for `EDITOR` etc., but only `ADMIN` used now).
- `POST /api/v1/admin/auth/login { email, password }` → validates via `BCryptPasswordEncoder`, issues **one** JWT access token (no refresh token — refresh-token rotation is real complexity with no MVP payoff since there's no admin UI session to protect yet).
- Token lifetime: a few hours is fine for MVP; nothing in the admin surface is sensitive enough yet to demand short-lived tokens with rotation.
- Spring Security filter chain: public endpoints permit-all; anything under `/api/v1/admin/**` requires a valid JWT via a custom `OncePerRequestFilter`.
- **Deferred to Phase 2:** refresh tokens, password reset flow, multiple roles actually being used, rate-limited login attempts.

---

## 6. API Contracts

**`GET /api/v1/initiatives`**
- Response `200`:
```json
{
  "data": [
    { "title": "Beekeeping for Women's Groups", "slug": "beekeeping-womens-groups",
      "focusArea": "SUSTAINABLE_LIVELIHOODS", "summary": "...", "coverImageUrl": "https://..." }
  ]
}
```

**`GET /api/v1/initiatives/{slug}`**
- `200`: full `InitiativeDetailDto`. `404`: `{ "timestamp": "...", "status": 404, "error": "Not Found", "message": "Initiative not found: {slug}", "path": "/api/v1/initiatives/{slug}" }`

**`GET /api/v1/stories?page=0&size=10`**
- `200`: `{ "data": [ StorySummaryDto... ], "page": 0, "size": 10, "totalElements": 42, "totalPages": 5 }`

**`POST /api/v1/contact-submissions`**
- Request: `{ "name": "string", "email": "string", "subject": "string", "message": "string" }`
- `201`: `{ "message": "Thank you — we'll be in touch." }`
- `400`: `{ "status": 400, "error": "Bad Request", "message": "Validation failed", "errors": { "email": "must be a valid email address" } }`
- Auth: none.

**`POST /api/v1/volunteer-applications`**, **`POST /api/v1/partnership-inquiries`** — same response shape as Contact, request body per §11.

**`POST /api/v1/admin/auth/login`**
- Request: `{ "email": "string", "password": "string" }`
- `200`: `{ "accessToken": "eyJ...", "expiresIn": 14400 }`
- `401`: `{ "status": 401, "error": "Unauthorized", "message": "Invalid credentials" }`
- Auth: none (this endpoint issues auth).

All admin endpoints beyond login require header `Authorization: Bearer <token>`; a missing/invalid token returns `401`.

---

## 7. Frontend Implementation Plan

| Route | Purpose | Data | API call | Key components |
|---|---|---|---|---|
| `/` | Orient visitor, funnel to Initiatives/Stories/Support | Latest 3 initiatives, latest 3 stories | `GET /initiatives` (limit), `GET /stories?size=3` | `PageHero`, `InitiativeCard`, `StoryCard` |
| `/about` | Mission, Siddi community context, org info | Static content | none | `PageHero`, `SectionHeading` |
| `/initiatives` | Browse all initiatives, optional focus-area filter | Published initiatives | `GET /initiatives` | `InitiativeCard` grid |
| `/initiatives/[slug]` | Full initiative detail | One initiative | `GET /initiatives/{slug}` | rich content block |
| `/stories` | Browse stories, paginated | Published stories | `GET /stories?page=` | `StoryCard` grid, pagination control |
| `/stories/[slug]` | Full story detail | One story | `GET /stories/{slug}` | rich content block |
| `/support` | Ways to give/donate (verified info only) | Static content | none | CTA cards |
| `/volunteer` | Info + application form | Static + form | `POST /volunteer-applications` | `Form`, `TextField`, `SubmitButton` |
| `/partner` | Info + inquiry form | Static + form | `POST /partnership-inquiries` | same form primitives |
| `/contact` | Contact form + org details | Static + form | `POST /contact-submissions` | same form primitives |

Every data-driven route defines: **loading** (skeleton/spinner), **empty** (e.g. "No stories yet — check back soon"), **error** (retry affordance, no raw stack traces). **SEO:** per-page `<title>`/meta description via the Next.js metadata API; Open Graph tags on Initiative/Story detail pages; `next/image` for all imagery.

---

## 8. Design System

- **Palette:** warm, earthy base (terracotta/ochre accent) on a neutral off-white background — avoid corporate blue/navy NGO-template defaults. One accent color used sparingly for CTAs, not decoratively.
- **Typography:** one humanist sans for body (system stack or a single Google Font, e.g. `Inter` or `Work Sans`), one slightly warmer serif or rounded-sans for headings if desired — never more than two font families.
- **Spacing:** 4px base scale (4/8/12/16/24/32/48/64), generous section padding (photography-led NGO sites read as templated when cramped).
- **Radius:** consistent small-to-medium radius (e.g. 8px cards, 6px buttons/inputs) — soft, not sharp corporate edges, not overly rounded/playful.
- **Shadows:** subtle single soft shadow on cards only; none on buttons/nav.
- **Buttons:** solid accent primary, outline secondary, one size scale.
- **Cards:** `InitiativeCard`/`StoryCard` share one visual pattern (image top, eyebrow label, title, one-line summary).
- **Forms:** consistent label-above-input pattern, inline validation messages, clear success/error states.
- **Navigation:** simple horizontal nav, sticky, condenses to a drawer under 768px.
- **Responsive breakpoints:** Tailwind defaults (`sm 640 / md 768 / lg 1024 / xl 1280`) — test at 360/768/1280 per §3 of the architecture doc.

---

## 9. Homepage Structure

| # | Section | Purpose | Content | Data source | CTA |
|---|---|---|---|---|---|
| 1 | Hero | Immediate orientation | Org name, one-line mission, hero photo | Static | "See our Initiatives" |
| 2 | Focus areas | Show breadth of work | The 5 verified focus areas | Static | link into `/initiatives?focusArea=` |
| 3 | Featured initiatives | Concrete proof of work | 3 latest published initiatives | `GET /initiatives` | "View all initiatives" |
| 4 | Latest stories | Show the work is active/current | 3 latest published stories | `GET /stories?size=3` | "Read all stories" |
| 5 | Ways to help | Convert visitor to action | Donate / Volunteer / Partner cards | Static | links to `/support`, `/volunteer`, `/partner` |
| 6 | Contact/footer strip | Reachability, trust | Address, emails, social links | Static | link to `/contact` |

No impact-metric numbers on the homepage for MVP — the architecture doc's own instruction (§9) stands: don't invent statistics; build the component later when real numbers are verified, and leave the section out entirely until then rather than showing placeholders.

---

## 10. Content Model — Static vs Dynamic

**Static (frontend):** navigation labels, organization identity/address/contact emails (verified, changes rarely), mission/vision copy, focus-area descriptions, footer/social links, Support/Donate page copy (until a real payment flow exists — see architecture doc, no bank/UPI details are invented).

**Dynamic (PostgreSQL):** Initiatives, Stories, and all three form submission types (contact, volunteer, partnership) — this is content that changes independent of a deploy, or that the org needs to review/action (submissions).

**Why:** a database only earns its place where content changes without a code deploy, or where a human needs to query/filter/audit records over time (submissions). Org address and mission statement change on a timescale of years, not worth a CMS round-trip for MVP.

---

## 11. Forms

### Contact
| Field | Required | Rule |
|---|---|---|
| Name | yes | max 255 chars |
| Email | yes | valid email format, max 255 |
| Subject | yes | max 255 |
| Message | yes | max 5,000 chars |

### Volunteer
| Field | Required | Rule |
|---|---|---|
| Name | yes | max 255 |
| Email | yes | valid email, max 255 |
| Phone | yes | max 20, digits/`+`/`-`/space only |
| Location | yes | max 255 |
| Skills | no | max 500 |
| Areas of interest | no | max 500 |
| Availability | no | max 255 |
| Message | no | max 5,000 |

### Partner
| Field | Required | Rule |
|---|---|---|
| Organization | yes | max 255 |
| Contact name | yes | max 255 |
| Email | yes | valid email, max 255 |
| Phone | no | max 20 |
| Partnership type | yes | enum: NGO / Corporate CSR / Educational Institution / Other |
| Message | yes | max 5,000 |

**All forms:** spam-protection integration point is the form submit handler on the frontend (reCAPTCHA v3 token attached to the request body; backend verifies token server-side before persisting — wire the seam now, verification logic can be a Phase 2 addition if the 1–2 day window is tight). **Success:** `201` + on-screen confirmation, no redirect (keeps context). **Error:** field-level messages from the `400` response mapped back onto the relevant input.

---

## 12. Image Strategy

- **Where images live:** Cloudinary (free tier) — never the app server's disk (Render's filesystem is ephemeral) and never binary blobs in Postgres.
- **How admins upload (MVP):** no upload UI yet — images for seed Initiatives/Stories are uploaded manually to Cloudinary and the resulting URL is pasted into seed data. An `ImageUploader` component and admin upload endpoint are Phase 2.
- **URL storage:** `cover_image_url` as a plain `text` column — Cloudinary URL, optionally with a transformation string baked in (e.g. `w_800,q_auto,f_auto`).
- **Optimization:** Cloudinary's `f_auto,q_auto` handles format/quality automatically; `next/image` handles responsive `srcset` on the frontend.
- **Alt text:** stored alongside the image reference wherever it's used (a plain column on Initiative/Story for now — no separate media table needed until real upload/reuse exists).
- **File size/MIME limits (once upload exists):** max 5MB, `image/jpeg`, `image/png`, `image/webp` only, enforced both client-side (before upload) and server-side.

---

## 13. Security Implementation Checklist

**MVP-critical:**
- [ ] Password hashing via `BCryptPasswordEncoder` for `admin_user.password_hash`
- [ ] JWT signed with a strong secret from environment variables, never committed
- [ ] CORS restricted to the deployed frontend origin only (no wildcard in production)
- [ ] Bean Validation on every request DTO (`@Valid` at controller boundary)
- [ ] Parameterized queries via Spring Data JPA (no string-concatenated SQL — this is the default, just don't break it)
- [ ] Consistent error response shape that never leaks stack traces to the client
- [ ] `/api/v1/admin/**` rejects any request without a valid JWT
- [ ] Secrets (DB URL, JWT secret, Cloudinary keys) only in environment variables on Render/Vercel, never in the repo

**Phase 2:**
- [ ] reCAPTCHA v3 server-side verification wired in
- [ ] Rate limiting on public POST endpoints (submission spam)
- [ ] File upload MIME/size validation (once uploads exist)
- [ ] Refresh-token rotation / shorter access-token lifetime
- [ ] XSS hardening review on any rendered rich-text content (Story/Initiative `content` fields) if a rich text editor is introduced

---

## 14. Testing Strategy

**Backend:**
- Controller tests (`@WebMvcTest`) for each public endpoint: happy path + one validation-failure case + one not-found case.
- Service tests for anything with real logic (slug lookup, DTO mapping) — skip trivial pass-through services.
- One repository/integration test (`@DataJpaTest`) confirming the unique-slug constraint actually works.
- Auth: one test confirming a protected endpoint returns 401 without a token and 200 with a valid one.

**Frontend:**
- `next build` / `tsc --noEmit` as the CI gate — a type-safe build passing is the primary signal for MVP.
- Form validation: a couple of component tests on the shared `Form` primitives (required field, invalid email) is enough; don't test every page's form separately.
- Responsive/manual QA at 360/768/1280 before each deploy — not automated for MVP.

No end-to-end test suite (Playwright/Cypress) for MVP — real payoff versus setup time is poor at this scope; add it if the project grows past Phase 2.

---

## 15. Deployment Plan

1. **GitHub** — push `frontend/` and `backend/` in one monorepo (simpler for a solo 1–2 day build than split repos).
2. **PostgreSQL** — create a Supabase or Neon free-tier instance; run Flyway migrations against it.
3. **Backend** — deploy to Render as a Web Service (Docker or native Java build), pointed at the managed Postgres via env vars.
4. **Frontend** — deploy to Vercel, connected to the same GitHub repo, `frontend/` as the project root.
5. **Environment variables** — set on both platforms (list below); never commit `.env` files.
6. **CORS** — backend `CorsConfig` allowlists the exact Vercel production URL (and `localhost:3000` for dev).
7. **Production API URL** — set as `NEXT_PUBLIC_API_BASE_URL` on Vercel, pointing at the Render backend URL.
8. **Domain/DNS** — deploy under free subdomains (`*.vercel.app` / `*.onrender.com`) for MVP unless DNS access to `akssada.org` is confirmed.
9. **Final verification** — walk every public route in production, submit each of the 3 forms and confirm rows land in the DB, confirm admin login issues a token.

**Environment variables required:**
| Var | Where | Purpose |
|---|---|---|
| `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` | Render | Postgres connection |
| `JWT_SECRET` | Render | token signing |
| `CLOUDINARY_URL` | Render | image storage (if backend touches it directly) |
| `ALLOWED_ORIGIN` | Render | CORS allowlist |
| `NEXT_PUBLIC_API_BASE_URL` | Vercel | frontend → backend base URL |

---

## 16. Local Development

```bash
# Frontend — create + install
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend && npm install

# Backend — create via https://start.spring.io (Web, JPA, PostgreSQL, Validation, Security, Flyway)
# or with the CLI equivalent, then:
cd backend && ./mvnw clean install      # macOS/Linux
cd backend && mvnw.cmd clean install    # Windows

# Local Postgres via Docker (optional, if not using a hosted dev branch directly)
docker run --name akssada-db -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=akssada -p 5432:5432 -d postgres:16

# Run frontend
cd frontend && npm run dev

# Run backend
cd backend && ./mvnw spring-boot:run      # macOS/Linux
cd backend && mvnw.cmd spring-boot:run    # Windows

# Tests
cd frontend && npm run build && npx tsc --noEmit
cd backend && ./mvnw test

# Production builds
cd frontend && npm run build
cd backend && ./mvnw clean package
```

---

## 17. Git Strategy

```
feat: initialize frontend (Next.js + TS + Tailwind)
feat: initialize backend (Spring Boot skeleton)
chore: add Flyway migrations for core schema
feat: add Initiative API (entity/DTO/repo/service/controller)
feat: add Initiative pages (list + detail)
feat: add Story API
feat: add Story pages (list + detail)
feat: add Contact form (backend + frontend)
feat: add Volunteer form
feat: add Partnership form
feat: add remaining static public pages (Home/About/Support)
feat: add admin authentication foundation (JWT login)
chore: configure CI/CD (GitHub Actions → Render/Vercel)
docs: add README with architecture and setup instructions
```

Each commit should correspond to a completed, verifiable phase from §2 — a commit history that reads as one deliberate slice at a time is itself part of the portfolio value.

---

## 18. Deployment-Ready Definition

- [ ] All 10 public routes render correctly in production
- [ ] Initiatives and Stories show real, seeded AKSSADA content (no lorem ipsum)
- [ ] All 3 forms submit successfully and persist to the production DB
- [ ] Responsive and legible at 360px, 768px, 1280px
- [ ] Basic accessibility pass: semantic headings, alt text on all images, visible focus states, form labels correctly associated
- [ ] Per-page SEO metadata present; `sitemap.xml`/`robots.txt` generated
- [ ] CORS locked to the real frontend origin; no secrets in the repo
- [ ] Admin login issues a JWT and one protected endpoint enforces it
- [ ] Flyway migrations are the sole source of schema truth, applied cleanly on a fresh DB
- [ ] Public API endpoints match §6 exactly
- [ ] Deployment pipeline (GitHub Actions → Render/Vercel) triggers on push to `main`
- [ ] `README.md` documents architecture, setup, and how to run/deploy

---

## 19. START HERE

1. Create the GitHub repository `akssada-platform` with `frontend/`, `backend/`, `docs/`, `.github/` folders as in §3, and commit this blueprint plus the baseline architecture doc into `docs/`.
2. Run `npx create-next-app@latest frontend --typescript --tailwind --app` and confirm `npm run dev` shows the default Next.js page at `localhost:3000`.
3. Go to `start.spring.io`, generate a Spring Boot project with dependencies: Web, Spring Data JPA, PostgreSQL Driver, Validation, Spring Security, Flyway — download it into `backend/` and confirm `./mvnw spring-boot:run` boots without errors.
4. Create a free Supabase or Neon PostgreSQL project and copy its connection string.
5. Add `backend/src/main/resources/application.yml` with the DB connection (using environment variable placeholders, not hardcoded credentials) and confirm the backend connects on startup.
6. Write and run `V1__create_admin_user.sql` through `V6__create_partnership_inquiry.sql` (per §4) via Flyway and confirm all 6 tables exist in the DB.
7. Manually transcribe the verified AKSSADA content (focus areas, mission, org details from the architecture doc's §0) into a short `docs/seed-content.md` file — this becomes your seed data source of truth before any API exists.
8. Build the `Initiative` feature end-to-end on the backend only (entity → DTO → repo → service → controller) and verify `GET /api/v1/initiatives` returns `[]` (empty but working) via curl or Postman.
9. Insert 2–3 real initiatives directly via SQL (from your seed-content doc) and re-verify the same endpoint now returns real data.
10. Build the `/initiatives` and `/initiatives/[slug]` frontend pages against that live endpoint, with loading/empty/error states — this is your first true vertical slice, and the pattern every remaining feature repeats.
