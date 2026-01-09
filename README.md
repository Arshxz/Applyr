# Applyr - Universal Job Application Platform

> One profile. Apply everywhere. Your bot does the work.

## 🧩 Core Concept

Applyr is a universal job application layer that sits on top of the internet. Your users never leave Applyr, and your bot does all the dirty work of scraping jobs, collecting application questions, and submitting applications.

## 🏗️ Architecture

```
Internet Career Sites
        ↓
   Applyr Bot
        ↓
  Applyr Job Database
        ↓
 Users browse + apply
        ↓
 Applyr Automation (n8n / Playwright)
        ↓
Company Career Portals
```

## 🧱 Tech Stack

| **Layer**  | **Tech**                     |
| ---------- | ---------------------------- |
| Frontend   | Next.js (App Router)         |
| Auth       | Auth0 (Google, Apple, Email) |
| ORM        | Prisma                       |
| Database   | Neon Postgres                |
| Caching    | Upstash Redis                |
| Bot        | Playwright                   |
| Automation | n8n                          |
| Hosting    | Vercel                       |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Auth0 account
- Neon Postgres database
- Upstash Redis instance

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   The `.env.local` file has been created with placeholder values. Update it with your actual credentials:

   - **Auth0 credentials** (required):
     - Go to [Auth0 Dashboard](https://manage.auth0.com/)
     - Create a new Application (Regular Web Application)
     - Configure allowed callback URLs: `http://localhost:3000/api/auth/callback`
     - Configure allowed logout URLs: `http://localhost:3000`
     - Enable Google and Apple social connections
     - Copy `Domain`, `Client ID`, and `Client Secret` to `.env.local`
   
   - **Neon Postgres** (required):
     - Create a database at [Neon Console](https://console.neon.tech/)
     - Copy the connection string to `DATABASE_URL` in `.env.local`
   
   - **Upstash Redis** (optional for development):
     - Create a Redis instance at [Upstash Console](https://console.upstash.com/)
     - Copy the REST URL and token to `.env.local`
     - Note: The app works without Redis, but caching will be disabled

3. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Auth0 routes
│   │   ├── jobs/         # Jobs API
│   │   └── applications/  # Applications API
│   ├── dashboard/        # Dashboard pages
│   └── page.tsx          # Landing page
├── components/            # React components
├── lib/                  # Utilities
│   ├── prisma.ts        # Prisma client
│   ├── redis.ts         # Redis client
│   └── auth.ts          # Auth helpers
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## 🗄️ Data Model

- **User**: Authentication and user info
- **Profile**: User's resume and preferences
- **Job**: Scraped job listings
- **Application**: User applications to jobs
- **Bot**: Bot status and metrics

## 🔐 Auth0 Setup

1. Create an Auth0 account
2. Create a new application (Regular Web Application)
3. Configure allowed callback URLs: `http://localhost:3000/api/auth/callback`
4. Configure allowed logout URLs: `http://localhost:3000`
5. Enable Google and Apple social connections
6. Copy credentials to `.env`

## 🤖 Bot & Automation

The bot system (Playwright + n8n) will:

- Scrape job listings every 10 minutes
- Normalize and hash jobs
- Insert only new jobs into Postgres
- Handle application submissions automatically

## 📝 License

MIT
