# Codebase Concerns

**Analysis Date:** 2026-01-12

## Tech Debt

**Type safety bypassed with `any`:**
- Issue: Multiple `any` types defeat TypeScript's benefits
- Files:
  - `app/api/profile/route.ts` lines 37, 86, 130 (`const profileResponse: any`, `const profileData: any`)
  - `app/dashboard/profile/page.tsx` line 283 (`const payload: any`)
  - `app/api/profile/resume/route.ts` line 40 (`const view = data as any`)
- Impact: Runtime errors possible, reduced IDE support
- Fix approach: Define proper interfaces for profile data structures

**Duplicated user lookup pattern:**
- Issue: Same user find-or-create logic repeated across files
- Files:
  - `app/dashboard/page.tsx` lines 14-26
  - `app/dashboard/applications/page.tsx` lines 14-26
  - `app/api/profile/route.ts` lines 14-16
  - `app/api/applications/route.ts` lines 14-21
- Impact: Inconsistent behavior if logic changes, harder maintenance
- Fix approach: Extract to `lib/user.ts` as `getOrCreateUser(session)` helper

**Oversized component:**
- Issue: Profile page is 763 lines mixing forms, state, modals, and API calls
- File: `app/dashboard/profile/page.tsx`
- Impact: Hard to test, maintain, and understand
- Fix approach: Extract ExperienceModal, EducationModal, SkillsSection into separate components

## Known Bugs

**None identified during static analysis**

## Security Considerations

**Input validation gaps:**
- Risk: Malformed input could cause unexpected behavior
- Files:
  - `app/api/jobs/route.ts` lines 19-20: No validation of `page`/`limit` query params
  - `app/api/applications/route.ts` lines 23-24: Only checks `job_id` presence
  - `app/api/profile/route.ts`: No schema validation of request body
- Current mitigation: Prisma provides some type coercion
- Recommendations: Add Zod schemas for request validation

**File upload validation:**
- Risk: Only client-side file type/size validation, server accepts any buffer
- File: `app/dashboard/profile/page.tsx` lines 115-124 (client), `app/api/profile/route.ts` (server)
- Current mitigation: Client checks file type and 5MB limit
- Recommendations: Add server-side validation of MIME type and size

## Performance Bottlenecks

**No significant issues detected**

Current caching strategy is appropriate:
- Redis caching on job listings with 60s TTL (`app/api/jobs/route.ts`)
- Optional Redis gracefully degrades in development

## Fragile Areas

**Resume binary handling:**
- File: `app/api/profile/resume/route.ts` lines 30-48
- Why fragile: Complex type checking for Buffer/ArrayBuffer/base64 conversion
- Common failures: Type mismatches between Prisma Bytes and JavaScript types
- Safe modification: Test thoroughly with different upload scenarios
- Test coverage: None

## Scaling Limits

**Vercel/Neon Free Tier:**
- Current capacity: Development/small scale usage
- Limit: Vercel function timeouts, Neon connection limits
- Symptoms at limit: 504 errors, connection pool exhaustion
- Scaling path: Upgrade to paid tiers

## Dependencies at Risk

**None critical**

All major dependencies are actively maintained:
- Next.js 14.x (stable)
- Auth0 SDK 3.x (stable)
- Prisma 5.x (stable)

## Missing Critical Features

**n8n workflow integration:**
- Problem: Core automation feature not implemented
- File: `app/api/applications/route.ts` line 55 (`// TODO: Trigger n8n workflow here`)
- Current workaround: Applications created but not processed
- Blocks: Automated job application submission
- Implementation complexity: Medium (webhook integration + n8n workflow design)

## Test Coverage Gaps

**API Routes (Critical):**
- What's not tested: All API endpoints
- Files: `app/api/jobs/route.ts`, `app/api/applications/route.ts`, `app/api/profile/route.ts`
- Risk: Breaking changes undetected
- Priority: High
- Difficulty: Need to mock Auth0, Prisma, Redis

**Auth Helpers:**
- What's not tested: `getAuthUser()`, `requireAuth()`
- File: `lib/auth.ts`
- Risk: Auth bypass if logic changes
- Priority: High
- Difficulty: Low (small, focused functions)

**Components:**
- What's not tested: JobsList pagination, Header navigation
- Files: `components/JobsList.tsx`, `components/Header.tsx`
- Risk: UI regressions
- Priority: Medium
- Difficulty: Need React testing setup

---

*Concerns audit: 2026-01-12*
*Update as issues are fixed or new ones discovered*
