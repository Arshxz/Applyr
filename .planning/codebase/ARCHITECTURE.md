# Architecture

**Analysis Date:** 2026-01-12

## Pattern Overview

**Overall:** Next.js Full-Stack Monolith with Layered Pattern

**Key Characteristics:**
- Single Next.js application serving frontend and API
- App Router with Server and Client components
- Prisma ORM for type-safe database access
- Auth0 for authentication with session management

## Layers

**Presentation Layer:**
- Purpose: User interface and interactions
- Contains: React components (Server and Client)
- Location: `app/**/*.tsx`, `components/*.tsx`
- Depends on: API routes for data
- Used by: End users via browser

**API Layer:**
- Purpose: HTTP endpoints for data operations
- Contains: Route handlers with auth checks
- Location: `app/api/**/route.ts`
- Depends on: Utility layer, Prisma
- Used by: Presentation layer via fetch

**Utility Layer:**
- Purpose: Shared helpers and client singletons
- Contains: Auth helpers, Prisma client, Redis client
- Location: `lib/*.ts`
- Depends on: External SDKs (Auth0, Prisma, Redis)
- Used by: API routes, Server components

**Data Layer:**
- Purpose: Database schema and access
- Contains: Prisma schema, generated client
- Location: `prisma/schema.prisma`
- Depends on: PostgreSQL (Neon)
- Used by: Utility layer

## Data Flow

**Job Browsing Flow:**

1. User visits `/dashboard/jobs`
2. `JobsList` client component mounts
3. Fetches `GET /api/jobs?page=1&limit=20`
4. API checks Redis cache for `jobs:{page}:{limit}`
5. Cache miss: queries `prisma.job.findMany()`
6. Results cached in Redis (60s TTL)
7. JSON response rendered in component

**Application Submission Flow:**

1. User clicks "Apply Now" on job card
2. `handleApply()` calls `POST /api/applications`
3. API validates session via `getSession()`
4. Looks up user by `auth0_id`
5. Verifies job exists
6. Creates Application record (status: QUEUED)
7. Returns created application with job data
8. TODO: Trigger n8n automation workflow

**State Management:**
- Server state: Prisma queries in Server Components
- Client state: React useState/useCallback in Client Components
- Session state: Auth0 cookies via `getSession()`
- Cache state: Redis for job listings

## Key Abstractions

**Prisma Models:**
- Purpose: Type-safe database entities
- Examples: User, Profile, Job, Application, Bot (`prisma/schema.prisma`)
- Pattern: ORM with relations and enums

**Auth Helpers:**
- Purpose: Reusable authentication checks
- Examples: `getAuthUser()`, `requireAuth()` (`lib/auth.ts`)
- Pattern: Wrapper functions around Auth0 SDK

**API Route Pattern:**
- Purpose: RESTful endpoints with consistent structure
- Pattern: Auth check → User lookup → Business logic → Response
- All routes export `dynamic = "force-dynamic"` for session access

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Auth0 UserProvider, metadata, global styles

**Landing Page:**
- Location: `app/page.tsx`
- Triggers: Unauthenticated visit to `/`
- Responsibilities: Marketing content, login CTA

**Dashboard:**
- Location: `app/dashboard/page.tsx`
- Triggers: Authenticated visit to `/dashboard`
- Responsibilities: User greeting, navigation to features

**Auth Callback:**
- Location: `app/api/auth/[...auth0]/route.ts`
- Triggers: Auth0 OAuth redirect
- Responsibilities: Session creation, login/logout handling

## Error Handling

**Strategy:** Try/catch at route level, generic error responses

**Patterns:**
- API routes wrap logic in try/catch
- Errors logged to console
- Generic 500 response returned to client
- No custom error types or error boundary

## Cross-Cutting Concerns

**Logging:**
- Console.log/error for debugging
- No structured logging framework

**Validation:**
- Minimal input validation
- No schema validation library (e.g., Zod)

**Authentication:**
- Auth0 middleware via `getSession()`
- Session check at start of each protected route

---

*Architecture analysis: 2026-01-12*
*Update when major patterns change*
