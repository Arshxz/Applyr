# External Integrations

**Analysis Date:** 2026-01-12

## APIs & External Services

**Job Automation (Planned):**
- n8n - Workflow automation for job applications
  - Status: Not yet implemented (TODO in `app/api/applications/route.ts` line 55)
  - Purpose: Handle automated application submissions

- Playwright - Browser automation for job scraping
  - Status: Planned per README, not in current dependencies
  - Purpose: Scrape job listings from career sites

## Data Storage

**Databases:**
- Neon PostgreSQL - Primary data store
  - Connection: `DATABASE_URL` env var
  - Client: Prisma ORM 5.19.1 (`lib/prisma.ts`)
  - Schema: `prisma/schema.prisma`
  - Models: User, Profile, Job, Application, Bot

**Caching:**
- Upstash Redis - Job listing cache
  - Connection: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  - Client: @upstash/redis (`lib/redis.ts`)
  - Usage: 60-second TTL cache for `/api/jobs` endpoint
  - Optional in development, required in production

## Authentication & Identity

**Auth Provider:**
- Auth0 - OAuth2/OIDC authentication
  - SDK: @auth0/nextjs-auth0 3.8.0
  - Integration: `app/api/auth/[...auth0]/route.ts`, `lib/auth.ts`
  - Token storage: Session cookies managed by Auth0 SDK
  - Provider wraps app in `app/layout.tsx` via `UserProvider`

**OAuth Integrations:**
- Google OAuth - Social sign-in (configured in Auth0)
- Apple OAuth - Social sign-in (configured in Auth0)
- Email/Password - Direct authentication

**Configuration:**
- `AUTH0_SECRET` - Session encryption
- `AUTH0_BASE_URL` - App base URL
- `AUTH0_ISSUER_BASE_URL` - Auth0 tenant domain
- `AUTH0_CLIENT_ID` - Application client ID
- `AUTH0_CLIENT_SECRET` - Application client secret

## Monitoring & Observability

**Error Tracking:**
- Not configured

**Analytics:**
- Not configured

**Logs:**
- Console logging only (stdout/stderr)
- Vercel logs in production

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js hosting
  - Deployment: Automatic on git push
  - Environment vars: Configured in Vercel dashboard

**CI Pipeline:**
- Not configured (no GitHub Actions workflows)

## Environment Configuration

**Development:**
- Required: `DATABASE_URL`, `AUTH0_*` credentials
- Optional: `UPSTASH_REDIS_*` (caching disabled without)
- Secrets: `.env.local` (gitignored)

**Production:**
- All credentials required including Redis
- Secrets: Vercel environment variables

## Webhooks & Callbacks

**Incoming:**
- Auth0 callback: `/api/auth/callback`
  - Handles OAuth redirect after authentication

**Outgoing:**
- None currently
- Planned: n8n webhook triggers for application automation

---

*Integration audit: 2026-01-12*
*Update when adding/removing external services*
