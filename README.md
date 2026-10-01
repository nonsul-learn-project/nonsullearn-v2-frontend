# Nonsullearn V2 Frontend

Nonsullearn V2 is a Next.js experience layer. It owns future frontend experience, marketing pages, UI/UX, SEO, and client-side integrations. The existing PHP application remains the backend boundary for authentication, orders, payments, LMS, grading, administration, and established business logic.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Project layout

```text
src/app/           Next.js routes and route-level UI
src/components/    Shared presentational components
src/design-system/ Future foundational UI primitives and tokens
src/features/      Feature-owned frontend modules
src/legacy/        PHP backend contracts and adapters only; never copied PHP
src/lib/           Framework-agnostic shared utilities
docs/architecture/ Architecture decisions and boundaries
docs/exec-plans/   Implementation plans
```

No PHP API adapter, database connection, authentication, order/payment flow, LMS, analytics, or production migration is implemented in Gate 1.
