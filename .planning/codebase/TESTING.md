# Testing Patterns

**Analysis Date:** 2026-01-12

## Test Framework

**Current Status: No Tests Configured**

No test framework is installed or configured:
- No Jest, Vitest, or other test runner
- No @testing-library packages
- No test files found (`*.test.ts`, `*.spec.ts`)
- No `__tests__/` directories

## Run Commands

```bash
npm run lint                 # ESLint check (only automated check available)
npm run build                # Type checking via TypeScript compilation
```

No test script in `package.json`.

## Test File Organization

**Location:**
- Not applicable (no tests exist)

**Recommended Pattern (if added):**
- Co-located: `lib/auth.test.ts` alongside `lib/auth.ts`
- Or separate: `__tests__/lib/auth.test.ts`

## Implicit Quality Checks

**TypeScript:**
- Strict mode enabled (`tsconfig.json`)
- Type errors caught at build time
- Path aliases configured

**ESLint:**
- `next/core-web-vitals` rules
- Run via `npm run lint`

**Next.js Build:**
- Validates pages compile
- Checks for invalid imports
- Run via `npm run build`

## Areas Needing Tests

**High Priority:**
- `lib/auth.ts` - Auth helper functions (unit tests)
- `app/api/jobs/route.ts` - Job listing with caching (integration)
- `app/api/applications/route.ts` - Application submission (integration)
- `app/api/profile/route.ts` - Profile CRUD with file handling (integration)

**Medium Priority:**
- `components/JobsList.tsx` - Pagination and apply flow (component)
- `components/Header.tsx` - Navigation and auth state (component)

**Low Priority:**
- `lib/prisma.ts` - Singleton pattern (simple, low risk)
- `lib/redis.ts` - Conditional initialization (simple)

## Recommended Test Setup

**If Adding Tests:**

1. Install Vitest (fast, ESM-native):
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

2. Add to `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage"
}
```

3. Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

## Mocking Considerations

**External Dependencies to Mock:**
- `@auth0/nextjs-auth0` - `getSession()` returns
- `@prisma/client` - Database queries
- `@upstash/redis` - Cache operations
- `next/navigation` - `redirect()` calls

**Environment:**
- Mock `process.env` for credentials
- Mock Redis as optional (null in tests)

## Coverage

**Current:** 0% (no tests)

**Target:** Not defined

**Recommended Focus:**
- API route handlers (most critical)
- Auth helper functions
- File upload/download handling

---

*Testing analysis: 2026-01-12*
*Update when test patterns change*
