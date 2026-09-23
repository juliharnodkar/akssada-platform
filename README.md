# AKSSADA Platform
Portfolio-grade web platform for AKSSADA (All Karnataka Siddi Social & Aspirational Diversification Association).

- **Frontend:** Next.js + TypeScript + Tailwind CSS (`frontend/`)
- **Backend:** Spring Boot + Java REST API (`backend/`)
- **Database:** PostgreSQL, versioned via Flyway migrations

See `docs/technical-architecture.md` for the approved system architecture and
`docs/implementation-blueprint.md` for the phase-by-phase implementation plan.

## Status

**Phases 1-5 complete:** Database schema, APIs, frontend integration, forms, authentication, and production readiness are complete.

## Local development

```bash
# Frontend
cd frontend
cp .env.example .env.local  # adjust if needed
npm install
npm run dev                 # http://localhost:3000

# Backend (requires local PostgreSQL)
cd backend
./mvnw spring-boot:run      # http://localhost:8080
```

## Deployment Guide

### Database (e.g. Supabase, Neon)
1. Create a PostgreSQL database.
2. The backend will automatically apply Flyway migrations on startup.
3. Obtain connection credentials to set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

### Backend (e.g. Render, Railway)
1. Deploy using the provided `backend/Dockerfile`.
2. Required Environment Variables:
   - `SPRING_DATASOURCE_URL` (e.g., `jdbc:postgresql://<host>:5432/<db>`)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `CORS_ALLOWED_ORIGINS` (e.g., `https://akssada.vercel.app`)
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` (used on first boot to create the default admin)
3. Ensure port `8080` is exposed or configure via `PORT`.

### Frontend (e.g. Vercel)
1. Set the Build Command to `npm run build` and Output Directory to `.next`.
2. Required Environment Variables:
   - `NEXT_PUBLIC_API_URL` (e.g., `https://akssada-backend.onrender.com`)
3. Deploy the `frontend/` directory.
