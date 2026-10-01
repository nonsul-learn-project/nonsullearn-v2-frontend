# Nonsullearn V2 Working Principles

- V2 is the Experience Layer: it owns new frontend experience, marketing UI, SEO, and future client-side integrations.
- Treat Legacy PHP as the Backend Boundary. `src/legacy` holds TypeScript contracts and adapters for that boundary, not copied PHP source.
- Do not infer and reimplement existing business logic.
- Do not migrate PHP, payment, authentication, or LMS flows without an explicit approved scope.
- Write new frontend, marketing, and analytics code in TypeScript.
- UNKNOWN stays UNKNOWN: record uncertainty and ask for source-of-truth details instead of guessing.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
