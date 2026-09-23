# AKSSADA Platform — Technical Architecture

**Prepared for:** Julius, Final-year BTech Computer Engineering,
S.P.I.T. Mumbai **Purpose:** Portfolio-grade, ₹0/month-deployable web
platform for AKSSADA (All Karnataka Siddi Social & Aspirational
Diversification Association)

------------------------------------------------------------------------

## 0. What I verified from akssada.org

The current site is a WordPress/Elementor site. I fetched the homepage,
the "Support and Get Involved" page, and checked the nav structure.
Everything below marked **\[Verified\]** came directly from the live
site. Everything else is marked **\[Assumption\]** or **\[Architectural
recommendation\]** — I have not invented any organizational facts,
numbers, or claims.

**\[Verified\] Organization identity**

- Full name: All Karnataka Siddi Social & Aspirational Diversification
  Association (AKSSADA)
- Registered as a Section 8 non-profit
- Mission: uplifting the Siddi community (an Afro-descendant tribal
  group in India) and other forest-dwelling communities in Karnataka
- Address: House No 82, Block No 20, Bhajantri Galli, Fish Market Road,
  opposite Milagres English Medium School, Haliyal Taluk, Karwar
  District, Karnataka — 581329
- Emails: <akssada@akssada.org>, <akssada1@gmail.com>
- Social: Instagram (@akssada_siddi), Facebook, LinkedIn, WhatsApp
  business link

**\[Verified\] Current site structure (nav)** Home · About Us ·
Blogs/Stories · Gallery · Support and Get Involved · Contact Us · Donate

**\[Verified\] Focus areas (from homepage)**

1.  Sustainable Livelihoods — beekeeping, medicinal plant nurseries,
    eco-tourism, animal husbandry
2.  Education & Skills — literacy programs, vocational training, digital
    literacy
3.  Cultural Heritage — Dhamal dance, Kawandi quilts, music
4.  Environmental Protection — reforestation, forest-fire prevention,
    waste management, eco-farming
5.  Youth Leadership — sports, leadership programs, national/state event
    participation

**\[Verified\] Stated 3-year goals** (from the site — do not treat as
current impact numbers, they are forward-looking targets)

- Support at least 10 villages with livelihood training
- Set up 3 pilot beekeeping projects for women's groups
- Distribute 10,000 medicinal plant saplings
- Organize sports and cultural events for youth participation

**\[Verified\] "Ways to help" categories:** Donate, Volunteer, Partner
(NGOs / corporates for CSR / educational institutions), Sponsor a
specific project

**\[Verified\]** No live payment gateway details are exposed publicly —
donation page exists but I have not extracted bank/UPI details, and per
your instructions I will not invent any.

**\[Assumption\]** No existing structured "Events" concept, no numeric
"Impact" dashboard, and no admin CMS beyond WordPress exist today —
these are new capabilities this project will introduce.

------------------------------------------------------------------------

## 1. System Architecture

**\[Architectural recommendation\]**

``` mermaid
flowchart LR
    subgraph Client["Browser (Public Visitor / Admin)"]
        A[Next.js Frontend]
    end

    subgraph Backend["Spring Boot Modular Monolith"]
        B1[Public REST API]
        B2[Admin REST API]
        B3[Auth Module - JWT]
        B4[Validation and Service Layer]
    end

    subgraph Data["Data Layer"]
        C[(PostgreSQL - Supabase/Neon Free Tier)]
        D[(Cloudinary / Supabase Storage - Images)]
    end

    subgraph External["External Services"]
        E1[Resend/SMTP - Email Notifications]
        E2[reCAPTCHA v3 - Spam Protection]
        E3[Future: Razorpay/Payment Gateway]
    end

    A -->|HTTPS/JSON| B1
    A -->|HTTPS/JSON + JWT| B2
    B2 --> B3
    B1 --> B4
    B2 --> B4
    B4 --> C
    B4 --> D
    B4 --> E1
    A --> E2
    B4 -.future.-> E3

    style E3 stroke-dasharray: 5 5
```

**Flow summary:** Frontend (Next.js, statically generated where
possible) → Backend REST API (Spring Boot) → PostgreSQL for structured
data → Object storage for images → external services for email delivery
and spam protection, with a clearly isolated seam for a future payment
provider.

------------------------------------------------------------------------

## 2. Technology Stack

**\[Architectural recommendation\]** — chosen against your existing
skills (Java, Spring Boot, JS/HTML/CSS, Python/Flask, MySQL/PostgreSQL,
Git, Figma) and the ₹0 constraint.

| Layer              | Choice                                                           | Why                                                                                                                                                                                                                               |
|--------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Frontend           | **Next.js (React) + TypeScript + Tailwind CSS**                  | Best free-hosting story (Vercel free tier), excellent SEO via SSG/ISR for an NGO site that's mostly content, huge portfolio value, and you already know JS/HTML/CSS so the ramp is small.                                         |
| Backend            | **Spring Boot (Java) REST API**                                  | Directly uses your strongest, most "hireable" skill. A layered Spring Boot API (Controller → Service → Repository → DTO) is exactly what recruiters want to see from a CE portfolio project, more so than another Flask CRUD app. |
| Database           | **PostgreSQL** (via Supabase or Neon free tier)                  | Free managed Postgres with generous limits, proper relational modeling for initiatives/stories/events, and you already know PostgreSQL.                                                                                           |
| Image/File storage | **Cloudinary free tier** (or Supabase Storage)                   | Free image storage + on-the-fly resizing/optimization, avoids storing binaries in your DB or app server disk (important since most hosts have ephemeral filesystems).                                                             |
| Backend hosting    | **Render free tier** (Web Service)                               | Deploys a Spring Boot JAR directly from GitHub for free; sleeps on idle but that's acceptable for an MVP NGO site with low/moderate traffic.                                                                                      |
| Frontend hosting   | **Vercel free tier**                                             | Native Next.js support, free SSL, global CDN, generous free bandwidth.                                                                                                                                                            |
| Email              | **Resend free tier** (or SMTP via Gmail for MVP)                 | For contact-form/volunteer/partnership notification emails to org staff and auto-acknowledgement to the sender.                                                                                                                   |
| Spam protection    | **Google reCAPTCHA v3** (free)                                   | Protects public forms without adding user friction.                                                                                                                                                                               |
| CI/CD              | **GitHub Actions** (free for public/private repos within limits) | Auto-deploy on push; also strong portfolio signal.                                                                                                                                                                                |

**Alternatives considered, briefly (not chosen):**

- **Full MERN (Express instead of Spring Boot):** faster to prototype,
  but wastes your strongest skill (Java/Spring) and is a much more
  common/less differentiated portfolio stack for a CE student who
  already knows Spring.
- **Django/Flask backend:** viable given your Python skill, but Spring
  Boot demonstrates more "enterprise-relevant" architecture (DI, layered
  design, JPA) that maps better to backend/SDE interviews.
- **WordPress-as-a-service (keep current stack) + headless CMS (e.g.,
  Strapi/Sanity):** fastest to ship and genuinely reasonable for an NGO,
  but has near-zero portfolio/engineering value for you — you'd be
  gluing together products rather than building one. Rejected given your
  explicit goal is to demonstrate engineering ability.
- **Firebase (Firestore) instead of Postgres+Spring:** faster MVP, free
  tier, but a NoSQL document store is a worse fit for relational data
  (stories ↔ initiatives ↔ categories) and again undersells backend
  engineering skill.

------------------------------------------------------------------------

## 3. Frontend Architecture

**\[Architectural recommendation\]**

**Routes (Next.js App Router):**

    /                      → Home
    /about                 → About (mission, Siddi community background, org info)
    /initiatives           → Initiatives list (data-driven, filterable by focus area)
    /initiatives/[slug]    → Initiative detail
    /impact                → Impact metrics (aggregated numbers from DB)
    /stories               → Stories/updates list (paginated)
    /stories/[slug]        → Story detail
    /events                → Events list (upcoming/past)
    /events/[slug]         → Event detail
    /volunteer             → Volunteer info + application form
    /partner               → Partnership info + inquiry form
    /support               → Donate/Support (verified info only + future payment CTA)
    /contact               → Contact form + org details/map

    /admin/login
    /admin                 → Dashboard (submission counts, quick links)
    /admin/initiatives     → CRUD
    /admin/stories         → CRUD
    /admin/events          → CRUD
    /admin/impact-metrics  → CRUD
    /admin/submissions     → View volunteer/partner/contact submissions
    /admin/media           → Upload/manage images

**Major reusable components:** `PageHero`, `SectionHeading`,
`InitiativeCard`, `StoryCard`, `EventCard`, `ImpactStatCard`, `Form`
primitives (`TextField`, `TextArea`, `Select`, `SubmitButton` with
loading/error state), `AdminTable` (generic paginated table w/
edit/delete), `AdminForm` wrapper, `Navbar`, `Footer`, `ImageUploader`.

**API communication:** A single typed API client (`lib/api.ts`) wrapping
`fetch`, using generated TypeScript types matching backend DTOs (kept in
sync manually for MVP; OpenAPI-generated later). Server Components fetch
public content at build/request time (SSG/ISR); admin pages are Client
Components using the client with the JWT attached.

**Form handling:** `react-hook-form` + `zod` for schema validation
matching backend validation rules (client-side UX validation is a mirror
of server-side authority, never a replacement).

**Responsive strategy:** Tailwind's mobile-first breakpoints;
content-heavy NGO layout (image-driven cards, generous whitespace)
rather than dense dashboards; test at 360px/768px/1280px.

**SEO approach:** Next.js metadata API for per-page
`<title>`/`<meta description>`, Open Graph tags per story/initiative,
`sitemap.xml` and `robots.txt` auto-generated, semantic HTML,
`next/image` for optimized images, static generation (SSG/ISR) for all
public pages so content is crawlable without JS execution.

------------------------------------------------------------------------

## 4. Backend Architecture

**\[Architectural recommendation\]**

**Package structure (modular monolith, package-by-feature):**

    com.akssada.platform
     ├── config/           (SecurityConfig, CorsConfig, WebConfig, OpenApiConfig)
     ├── common/           (ApiResponse<T>, exceptions, GlobalExceptionHandler)
     ├── auth/             (AdminUser entity, AuthController, AuthService, JWT util)
     ├── initiative/       (Initiative entity, controller, service, repository, DTOs)
     ├── story/            (Story, StoryCategory, controller/service/repo/DTOs)
     ├── event/
     ├── impact/           (ImpactMetric)
     ├── volunteer/        (VolunteerApplication)
     ├── partnership/      (PartnershipInquiry)
     ├── contact/          (ContactSubmission)
     ├── media/            (MediaAsset, upload handling → Cloudinary)
     └── PlatformApplication.java

Each feature package follows:
`Controller → Service (interface + impl) → Repository (Spring Data JPA) → Entity`,
with `DTOs` (request/response) kept separate from entities so the
persistence model never leaks into the API contract.

**Validation:** Bean Validation (`@NotBlank`, `@Email`, `@Size`, custom
validators for slugs) on request DTOs, enforced at the controller
boundary via `@Valid`.

**Error handling:** A `@ControllerAdvice` `GlobalExceptionHandler`
mapping `MethodArgumentNotValidException`, `EntityNotFoundException`,
`AccessDeniedException`, and a fallback `Exception` → a consistent
`ApiError { timestamp, status, error, message, path }` JSON shape.

**Authentication/authorization:**

- Public endpoints: no auth.
- Admin endpoints: JWT-based auth (Spring Security). Admin logs in with
  email+password → receives short-lived access token (+ refresh token
  for MVP-lite, or just a longer-lived single token if you want to keep
  MVP scope tight).
- Single role (`ADMIN`) is enough for MVP; design the `AdminUser` entity
  with a `role` column so multiple roles (e.g., `EDITOR`) can be added
  later without a schema change.

------------------------------------------------------------------------

## 5. Database Schema

**\[Architectural recommendation\]** — PostgreSQL, minimum-necessary
schema.

``` mermaid
erDiagram
    ADMIN_USER {
        uuid id PK
        string email UK
        string password_hash
        string role
        timestamp created_at
    }
    INITIATIVE {
        uuid id PK
        string title
        string slug UK
        string focus_area
        text summary
        text content
        string cover_image_url
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }
    STORY {
        uuid id PK
        string title
        string slug UK
        text content
        string cover_image_url
        string author_name
        string category
        uuid initiative_id FK
        boolean is_published
        timestamp published_at
        timestamp created_at
    }
    EVENT {
        uuid id PK
        string title
        string slug UK
        text description
        string location
        timestamp start_at
        timestamp end_at
        string cover_image_url
        boolean is_published
    }
    IMPACT_METRIC {
        uuid id PK
        string label
        string value
        string unit
        int display_order
        timestamp updated_at
    }
    VOLUNTEER_APPLICATION {
        uuid id PK
        string full_name
        string email
        string phone
        string skills
        text message
        string status
        timestamp submitted_at
    }
    PARTNERSHIP_INQUIRY {
        uuid id PK
        string organization_name
        string contact_name
        string email
        string phone
        string partnership_type
        text message
        string status
        timestamp submitted_at
    }
    CONTACT_SUBMISSION {
        uuid id PK
        string name
        string email
        string subject
        text message
        string status
        timestamp submitted_at
    }
    MEDIA_ASSET {
        uuid id PK
        string url
        string alt_text
        string uploaded_for_type
        uuid uploaded_for_id
        timestamp uploaded_at
    }

    INITIATIVE ||--o{ STORY : "relates to (nullable)"
```

**Notes on scope-cutting (removed on purpose):**

- No separate `users`/donor accounts table for MVP — donation is
  informational, not transactional yet, so there's nothing to
  authenticate donors against.
- No `comments` table — stories/updates are one-way content, not a
  social feed.
- No many-to-many `story_tags` join table for MVP; a single `category`
  string column is enough. Upgrade to a proper `Tag`/`StoryTag` join
  table in Phase 2 if filtering needs grow.
- `MEDIA_ASSET` uses a generic `(uploaded_for_type, uploaded_for_id)`
  pair instead of separate FK columns per entity, so one table serves
  all image needs without a join table explosion — acceptable
  denormalization for MVP; document it as a known trade-off.

**Important indexes:**

- Unique indexes on all `slug` columns (used for public URL lookups) and
  `email` on `ADMIN_USER`.
- Index on `STORY.is_published, published_at DESC` (the list-page query
  pattern).
- Index on `EVENT.start_at` (upcoming/past filtering).
- Index on `VOLUNTEER_APPLICATION.status`, `PARTNERSHIP_INQUIRY.status`,
  `CONTACT_SUBMISSION.status` (admin inbox filtering by new/reviewed).
- Foreign key index on `STORY.initiative_id`.

------------------------------------------------------------------------

## 6. API Design

**\[Architectural recommendation\]** — REST, JSON, versioned under
`/api/v1`.

**Public:**

    GET  /api/v1/initiatives                → list published initiatives (filter: ?focusArea=)
    GET  /api/v1/initiatives/{slug}         → single initiative
    GET  /api/v1/stories?page=&size=        → paginated published stories
    GET  /api/v1/stories/{slug}             → single story
    GET  /api/v1/events?status=upcoming     → events list
    GET  /api/v1/events/{slug}              → single event
    GET  /api/v1/impact-metrics             → all metrics for Impact page
    POST /api/v1/volunteer-applications     → submit volunteer form
    POST /api/v1/partnership-inquiries      → submit partnership form
    POST /api/v1/contact-submissions        → submit contact form

**Admin (JWT-protected, prefix `/api/v1/admin`):**

    POST   /api/v1/admin/auth/login
    GET    /api/v1/admin/initiatives            (incl. unpublished)
    POST   /api/v1/admin/initiatives
    PUT    /api/v1/admin/initiatives/{id}
    DELETE /api/v1/admin/initiatives/{id}
            (same CRUD pattern for stories, events, impact-metrics)
    GET    /api/v1/admin/volunteer-applications
    PATCH  /api/v1/admin/volunteer-applications/{id}/status
    GET    /api/v1/admin/partnership-inquiries
    PATCH  /api/v1/admin/partnership-inquiries/{id}/status
    GET    /api/v1/admin/contact-submissions
    PATCH  /api/v1/admin/contact-submissions/{id}/status
    POST   /api/v1/admin/media                  (multipart upload → returns URL)

That's the full endpoint surface needed — no separate endpoints per
filter combination; query params handle filtering/pagination.

------------------------------------------------------------------------

## 7. Security

**\[Architectural recommendation\]**

- **Authentication:** JWT (HS256 for MVP, short expiry, e.g., 2 hours)
  issued on admin login.
- **Password hashing:** BCrypt via Spring Security's `PasswordEncoder` —
  never store plaintext, never roll your own hashing.
- **Authorization:** `@PreAuthorize`/security filter chain restricting
  all `/api/v1/admin/**` routes to authenticated requests with valid
  JWT; public routes explicitly permitted.
- **Input validation:** Bean Validation on every request DTO (already
  covered in §4); reject unknown/malformed JSON via strict
  deserialization.
- **SQL injection:** Non-issue by construction — Spring Data
  JPA/Hibernate uses parameterized queries; never build raw concatenated
  SQL.
- **XSS:** Sanitize/escape any rich text (story `content`) on render
  (React escapes by default; if you allow HTML in story content,
  sanitize server-side with a library like OWASP Java HTML Sanitizer
  before storage).
- **CSRF:** Not applicable in the classic sense since the API is
  stateless JWT-bearer (no cookies for admin auth) — CSRF protection
  matters mainly for cookie-based sessions. If you instead choose to
  store the JWT in an HttpOnly cookie, enable Spring Security's CSRF
  protection for state-changing requests.
- **CORS:** Explicit allow-list of the Vercel frontend origin(s) only;
  no wildcard `*` in production.
- **Rate limiting:** A simple in-memory or Bucket4j-based rate limit on
  public POST endpoints (contact/volunteer/partnership forms) to prevent
  abuse — e.g., N requests per IP per minute. Free-tier-friendly since
  it needs no external service.
- **File upload validation:** Restrict to image MIME types, enforce max
  file size (e.g., 5MB), validate actual file content (not just
  extension) before forwarding to Cloudinary, generate randomized
  storage filenames.
- **Secrets/environment variables:** DB URL, JWT secret, Cloudinary
  keys, email API key all via environment variables (Render/Vercel
  secret managers) — never committed to the repo; `.env.example`
  committed instead of `.env`.
- **Spam protection:** reCAPTCHA v3 token generated client-side,
  verified server-side on every public form submission before it's
  persisted.

------------------------------------------------------------------------

## 8. Deployment

**\[Architectural recommendation\]**

| Component     | Service                                                                                                                         | Cost              | Key free-tier limitation                                                                                          |
|---------------|---------------------------------------------------------------------------------------------------------------------------------|-------------------|-------------------------------------------------------------------------------------------------------------------|
| Frontend      | Vercel (Hobby)                                                                                                                  | Free              | Fair-use bandwidth/build-minute limits; fine for an NGO site's expected traffic                                   |
| Backend       | Render (Free Web Service)                                                                                                       | Free              | Spins down after ~15 min idle → cold start delay (~30-50s) on first request after inactivity                      |
| Database      | Supabase or Neon (Free Postgres)                                                                                                | Free              | Storage cap (~500MB–1GB) and possible pausing after inactivity on some providers — acceptable for MVP data volume |
| Image storage | Cloudinary Free                                                                                                                 | Free              | ~25 credits/month (storage+bandwidth combined) — sufficient for a content site of this size early on              |
| Email         | Resend Free / Gmail SMTP                                                                                                        | Free              | Resend free tier caps monthly emails (a few hundred–low thousands); more than enough for form notifications       |
| Domain        | Existing `akssada.org` (if DNS access available) or a free subdomain (`vercel.app`/`onrender.com`) for the portfolio deployment | Free (if reusing) | Custom domain SSL is free via Vercel/Render either way                                                            |
| CI/CD         | GitHub Actions                                                                                                                  | Free              | Free minutes are generous for a project this size                                                                 |

**What may eventually cost money:** removing Render's cold-start (a paid
"always-on" instance), scaling Postgres storage/connections beyond free
tier, a paid transactional email volume, and — when the org is ready —
payment gateway transaction fees (Razorpay/Instamojo etc., which are not
free but are pay-per-transaction, not monthly).

------------------------------------------------------------------------

## 9. Sitemap / UX

**\[Architectural recommendation\]** — page hierarchy and visual
direction.

**Public hierarchy:**

    Home
    ├── About
    ├── Initiatives (list) → Initiative detail
    ├── Impact
    ├── Stories (list) → Story detail
    ├── Events (list) → Event detail
    ├── Volunteer
    ├── Partner With Us
    ├── Support / Donate
    └── Contact

**Admin hierarchy:**

    Login
    └── Dashboard
        ├── Initiatives (list/create/edit/delete)
        ├── Stories (list/create/edit/delete)
        ├── Events (list/create/edit/delete)
        ├── Impact Metrics (list/edit)
        ├── Media Library
        └── Submissions (Volunteer / Partnership / Contact — tabbed inbox view)

**Visual direction:** Warm, earthy palette reflecting forest/community
themes (greens, warm browns/ochres, one accent color) rather than
corporate blue; large, real photography (the org already has strong
photo material) as the dominant visual element on
Home/Initiatives/Stories; generous whitespace and readable serif or
humanist sans for headings to feel warm rather than clinical; simple,
accessible components (WCAG AA contrast, visible focus states, alt text
on every image) — not flashy motion/parallax, since trust and clarity
matter more than spectacle for a donation-adjacent NGO site.

------------------------------------------------------------------------

## 10. MVP Boundary

**\[Architectural recommendation\]**

**Phase 1 — 1–2 day MVP**

- Public pages: Home, About, Initiatives (list + detail, DB-driven),
  Stories (list + detail, DB-driven), Support/Donate (static, verified
  info only), Contact (working form → DB + email notification)
- Backend: Spring Boot API for Initiatives, Stories, Contact submissions
  only (Events, Impact metrics, Volunteer/Partnership forms deferred if
  time is tight — but if time allows, include Volunteer + Partnership
  forms since they're the same pattern as Contact and high value)
- Single hardcoded/seeded admin user (no admin UI yet — content managed
  by direct DB inserts or a minimal seed script)
- Deployed live on Vercel + Render + Supabase/Neon, with a working
  custom or subdomain URL

**Phase 2 — Production improvements**

- Full Admin CMS UI (login + CRUD for all entities)
- Events + Impact Metrics modules
- Volunteer & Partnership forms (if not done in Phase 1) with admin
  inbox/status tracking
- reCAPTCHA + rate limiting on all public forms
- Image upload pipeline via Cloudinary from the admin UI
- Proper email notifications (Resend) for all form types
- SEO polish: sitemap.xml, structured data (Organization/NGO schema), OG
  images per story

**Phase 3 — Future/advanced features**

- Real payment gateway integration (Razorpay/Instamojo) for online
  donations, once AKSSADA provides verified payment details
- Multi-role admin (Editor vs Admin)
- Multi-language support (Kannada) for wider community reach
- Newsletter automation (the site already has a subscribe box — could
  integrate with an ESP)
- Analytics dashboard for impact reporting
- Full-text search across stories/initiatives

------------------------------------------------------------------------

## 11. Repository Structure

**\[Architectural recommendation\]**

    akssada-platform/
    ├── frontend/
    │   ├── app/
    │   │   ├── (public)/            # public route group
    │   │   ├── admin/               # admin route group
    │   │   └── layout.tsx
    │   ├── components/
    │   ├── lib/                     # api.ts, auth.ts, types.ts
    │   ├── public/
    │   ├── next.config.js
    │   └── package.json
    ├── backend/
    │   ├── src/main/java/com/akssada/platform/
    │   │   ├── config/
    │   │   ├── common/
    │   │   ├── auth/
    │   │   ├── initiative/
    │   │   ├── story/
    │   │   ├── event/
    │   │   ├── impact/
    │   │   ├── volunteer/
    │   │   ├── partnership/
    │   │   ├── contact/
    │   │   ├── media/
    │   │   └── PlatformApplication.java
    │   ├── src/main/resources/application.yml
    │   ├── src/test/java/...
    │   └── pom.xml
    ├── docs/
    │   └── architecture.md          # this document
    ├── .github/workflows/           # CI/CD pipelines
    └── README.md

Two deployable units (`frontend/`, `backend/`) in one repo (monorepo) is
simplest for a solo portfolio project and keeps CI/CD config in one
place.

------------------------------------------------------------------------

## 12. Development Order

**\[Architectural recommendation\]** — sequenced to get something *live*
as fast as possible, then layer features on top.

1.  Set up repo structure, Spring Boot project skeleton, and Next.js
    project skeleton; push to GitHub.
2.  Provision Postgres (Supabase/Neon) and Cloudinary accounts; store
    credentials as env vars locally.
3.  Build `Initiative` entity → repository → service → controller
    (public GET only) end-to-end; seed 2–3 real initiatives from the
    verified focus areas.
4.  Build the Next.js Initiatives list + detail pages consuming that API
    — **this gets you your first real full-stack vertical slice working
    locally.**
5.  Repeat the same vertical-slice pattern for `Story`.
6.  Build `ContactSubmission` (POST-only) end-to-end, including basic
    email notification — this proves the write-path and external-service
    integration.
7.  Deploy backend to Render and frontend to Vercel; wire up production
    environment variables; confirm the deployed site works end-to-end.
8.  Build Home, About, Support/Donate as mostly-static pages using
    verified copy.
9.  Add Volunteer and Partnership forms (same pattern as Contact).
10. Add admin authentication (JWT) and a minimal admin CRUD UI for
    Initiatives/Stories.
11. Add Events and Impact Metrics modules (public + admin).
12. Add reCAPTCHA, rate limiting, and file upload validation hardening.
13. Polish SEO metadata, accessibility pass, responsive QA, and write
    the README documenting architecture and setup.

Steps 1–7 alone constitute a legitimate, demoable MVP.

------------------------------------------------------------------------

## 13. Portfolio Value

**\[Architectural recommendation\]** — what to actually highlight, and
only for what you build.

- **Layered Spring Boot API with clean separation of concerns**
  (Controller/Service/Repository/DTO, global exception handling) —
  directly demonstrates backend engineering discipline, not just "made a
  CRUD app."
- **Relational schema design with real constraints** (unique slugs, FKs,
  status-based indexes) — shows you can model a real domain, not just
  dump JSON into a document store.
- **JWT-based auth implemented from scratch with Spring Security** — a
  genuinely common interview topic; having actually built it (not just
  used a library's defaults blindly) is worth explaining in interviews.
- **Full deployment pipeline on free infrastructure** (GitHub Actions →
  Render/Vercel, environment-based config, managed Postgres) — shows you
  understand real deployment concerns, not just `localhost`.
- **Public API + admin API on the same backend with proper authorization
  boundaries** — demonstrates you can design multi-tenant-style access
  control even at small scale.
- **A real-world constraint-driven project** (non-invented data, actual
  NGO, real stakeholders) — far more compelling in interviews than
  another generic to-do app or e-commerce clone.

Do not claim things you haven't built (e.g., don't say "payment
integration" until Phase 3 is actually implemented, don't say
"multi-language" until it exists).

------------------------------------------------------------------------

## Decisions I Need to Approve

1.  **Backend language/framework:** Confirm Spring Boot (Java) over
    Flask (Python) — I recommended Spring Boot to leverage your
    strongest skill and for stronger portfolio signal, but Flask would
    ship slightly faster if speed-to-MVP matters more to you.
2.  **Hosting combo:** Confirm Vercel (frontend) + Render (backend) +
    Supabase/Neon (Postgres) as the free-tier trio — alternative combos
    exist (e.g., Railway, Fly.io) with different free-tier trade-offs.
3.  **Phase 1 scope:** Confirm that Volunteer/Partnership forms can be
    deferred to Phase 2 if the 1–2 day window is tight, keeping Phase 1
    to Initiatives + Stories + Contact only.
4.  **Domain:** Confirm whether you'll deploy under a free subdomain
    (`*.vercel.app`) for the portfolio version, or whether you have/can
    get DNS access to point (a subdomain of) `akssada.org` at this
    deployment.
5.  **Content source for MVP seed data:** Confirm you'll manually
    transcribe the verified initiatives/copy from the current site into
    seed data (since there's no admin UI yet in Phase 1) rather than
    scraping automatically.
