# Jazi: White-Label AI Voice Agent Platform

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4.svg)](https://tailwindcss.com/)

Jazi is a multi-tenant SaaS platform for building, deploying and managing AI voice agents. It includes a CRM, call management, approval workflows for human oversight, and white-label branding per tenant.

## Features

- **Voice agent builder**: create and configure AI voice agents through a guided wizard.
- **White-label branding**: per-tenant branding settings (stored in `tenant_branding`).
- **Multi-provider AI**: LLM inference through Groq, with voice providers such as ElevenLabs and Deepgram.
- **Call management**: inbound and outbound call handling, with Twilio telephony and LiveKit for real-time audio.
- **Built-in CRM**: leads, pipeline stages and tasks.
- **Human-in-the-loop approvals**: an approvals queue for reviewing agent actions.
- **Analytics dashboard**: call volume and performance charts (Recharts).
- **Multi-tenant data isolation**: Supabase Row-Level Security (RLS) on tenant-scoped tables.
- **Rate limiting**: Upstash Redis via `@upstash/ratelimit`.

## Tech Stack

- **Frontend**: Next.js (App Router), React 19, Tailwind CSS 4, shadcn/ui and Radix UI
- **Backend**: Next.js API routes, Supabase (PostgreSQL, Auth, RLS)
- **AI and voice**: Vercel AI SDK, Groq, ElevenLabs, Deepgram, LiveKit, Twilio
- **Caching and rate limiting**: Upstash Redis
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- pnpm (`npm install -g pnpm`)
- A Supabase project
- An Upstash Redis database
- API keys for the providers you plan to use (see `.env.example`)

### Local development

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/haseeb099/jazi.git
   cd jazi
   pnpm install
   ```

2. Create your environment file from the template and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   `.env.local` is git-ignored. Do not commit it.

3. Start the development server:

   ```bash
   pnpm dev
   ```

   The app runs at `http://localhost:3000`.

### Other commands

```bash
pnpm build        # production build
pnpm start        # run the production build
pnpm lint         # ESLint
pnpm type-check   # TypeScript check without emitting files
```

## Project Structure

```
jazi/
├── app/                  # Next.js App Router: pages, layouts and API routes
│   ├── (auth)/           # Login and signup
│   ├── (dashboard)/      # Protected pages: CRM, agents, calls, analytics, approvals
│   ├── api/              # Server API routes
│   ├── onboarding/       # Tenant onboarding flow
│   └── page.tsx          # Landing page
├── components/           # UI components, grouped by feature (agents, crm, calls, ...)
├── hooks/                # Shared React hooks (use-tenant, use-user)
├── lib/
│   ├── ai/               # AI provider integration
│   ├── supabase/         # Supabase clients (browser and server)
│   ├── rate-limit.ts     # Upstash rate limiting
│   └── utils.ts
├── types/
│   └── database.ts       # Database types
├── middleware.ts         # Auth and routing middleware
└── docs/                 # Architecture and deployment notes
```

## Database

The schema lives in Supabase (PostgreSQL). Tenant-scoped tables use Row-Level Security so each tenant can only read its own rows. The main tables include `tenants`, `tenant_branding`, `users`, `agents`, `leads`, `pipeline_stages`, `calls`, `tasks`, `approvals` and `audit_logs`. See `types/database.ts` for the generated types and `docs/ARCHITECTURE.md` for more detail.

## Deployment

The app is designed for Vercel:

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Deploy. Vercel builds on each push to `main`.

Before going live, check that RLS is enabled on every tenant-scoped table, that rate limits suit your expected traffic, and that the approval workflows and call recording work end to end.

## License

Licensed under the [Apache License 2.0](LICENSE).

© 2026 Muhammad Haseeb Rafique
