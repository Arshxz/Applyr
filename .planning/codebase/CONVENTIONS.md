# Coding Conventions

**Analysis Date:** 2026-01-12

## Naming Patterns

**Files:**
- PascalCase for components: `Header.tsx`, `JobsList.tsx`
- kebab-case for utilities: `auth.ts`, `prisma.ts`, `redis.ts`
- Next.js conventions: `page.tsx`, `route.ts`, `layout.tsx`

**Functions:**
- camelCase for all functions: `getAuthUser`, `fetchJobs`, `handleApply`
- Event handlers prefixed with `handle`: `handleApply`, `handleSubmit`
- Async functions use descriptive verb-noun: `fetchProfile`, `createApplication`

**Variables:**
- camelCase for variables: `cacheKey`, `session`, `jobs`
- UPPER_SNAKE_CASE for constants: `CACHE_TTL = 60`
- React state: `const [jobs, setJobs] = useState()`

**Types:**
- PascalCase for interfaces: `Job`, `Profile`, `JobsResponse`
- PascalCase for type aliases: `UserProp`, `ApplicationStatus`
- No `I` prefix for interfaces

**Database:**
- snake_case for table names: `users`, `profiles`, `jobs`, `applications`
- snake_case for columns: `auth0_id`, `user_id`, `created_at`, `last_seen`
- Prisma maps: `@@map("table_name")`

## Code Style

**Formatting:**
- 2-space indentation
- Double quotes for strings
- Semicolons required
- ~100 character line width

**Linting:**
- ESLint with `next/core-web-vitals`
- Config: `.eslintrc.json`
- Run: `npm run lint`

**No Prettier configured** - relies on ESLint rules

## Import Organization

**Order:**
1. External packages (`next/...`, `@auth0/...`, `react`)
2. Internal modules (`@/lib/...`, `@/components/...`)
3. Relative imports (`./utils`)
4. Type imports (`import type { ... }`)

**Path Aliases:**
- `@/*` maps to project root (`tsconfig.json`)
- Example: `import { prisma } from "@/lib/prisma"`

## Error Handling

**Patterns:**
- Try/catch at API route level
- Console.error for logging
- Generic error responses: `{ error: "message" }`

**API Route Pattern:**
```typescript
try {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... business logic
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
```

## Logging

**Framework:**
- Console.log/error (no structured logging)

**Patterns:**
- `console.error("Error fetching X:", error)` for errors
- No debug logging in production code

## Comments

**When to Comment:**
- Section markers: `// Try cache first`, `// Fetch from database`
- TODOs for incomplete features: `// TODO: Trigger n8n workflow`
- Prisma schema field explanations

**JSDoc:**
- Not used (TypeScript types serve as documentation)

**TODO Format:**
- `// TODO: description`

## Function Design

**Size:**
- Keep functions focused
- Large components like `ProfilePage` (763 lines) need refactoring

**Parameters:**
- Destructure objects: `function Component({ user }: UserProp)`
- Max ~3 parameters before using options object

**Return Values:**
- Explicit return for API routes
- Early returns for guard clauses

## Module Design

**Exports:**
- Named exports for utilities: `export function getAuthUser()`
- Default exports for components: `export default function Header()`
- Default exports for pages: `export default async function Page()`

**Singletons:**
- Prisma client singleton pattern in `lib/prisma.ts`
- Redis client conditional export in `lib/redis.ts`

## React Patterns

**Server vs Client:**
- Server Components: Dashboard pages with data fetching
- Client Components: `"use client"` directive for hooks/interactivity
- Example: `components/JobsList.tsx` is client, `app/dashboard/page.tsx` is server

**State Management:**
- Local state with useState for forms
- No global state library (Context or Redux)

---

*Convention analysis: 2026-01-12*
*Update when patterns change*
