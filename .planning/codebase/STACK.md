# Technology Stack

**Analysis Date:** 2026-01-12

## Languages

**Primary:**
- TypeScript 5.5.4 - All application code (`package.json`)

**Secondary:**
- JavaScript - Build scripts, config files (`next.config.js`, `postcss.config.js`)
- CSS/PostCSS - Styling via Tailwind CSS (`app/globals.css`)

## Runtime

**Environment:**
- Node.js 18+ (per README)
- Browser runtime for client components

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.25 - Full-stack React framework with App Router (`package.json`)
- React 18.3.1 - UI library (`package.json`)

**Testing:**
- Not configured (no test framework installed)

**Build/Dev:**
- TypeScript 5.5.4 - Type checking and compilation (`package.json`)
- Tailwind CSS 3.4.7 - Utility-first CSS (`tailwind.config.ts`)
- PostCSS 8.4.40 - CSS transformation (`postcss.config.js`)
- Autoprefixer 10.4.19 - CSS vendor prefixes (`package.json`)
- ESLint 8.57.0 - Code linting with eslint-config-next (`package.json`)

## Key Dependencies

**Critical:**
- @auth0/nextjs-auth0 3.8.0 - Authentication (`lib/auth.ts`, `app/layout.tsx`)
- @prisma/client 5.19.1 - Database ORM (`lib/prisma.ts`)
- @upstash/redis 1.34.3 - Caching layer (`lib/redis.ts`)

**Infrastructure:**
- Prisma 5.19.1 - Database toolkit and migrations (`prisma/schema.prisma`)

## Configuration

**Environment:**
- `.env.local` for local development secrets
- `.env.example` for template
- Required vars: `AUTH0_*`, `DATABASE_URL`, `UPSTASH_REDIS_*`

**Build:**
- `tsconfig.json` - TypeScript with strict mode, path alias `@/*`
- `next.config.js` - React strict mode enabled
- `tailwind.config.ts` - Custom color variables

## Platform Requirements

**Development:**
- macOS/Linux/Windows with Node.js 18+
- No Docker required for local development

**Production:**
- Vercel - Hosting and deployment
- Neon - PostgreSQL database
- Upstash - Redis caching (optional in dev)

---

*Stack analysis: 2026-01-12*
*Update after major dependency changes*
