# Migration sequence

1. Read-only Production inventory: deployed root, runtime config shape, banner/content/media, routes/vhost, session/cookies, active providers/tracking.
2. Freeze and sanitize route/state fixtures; choose canonical URLs and proxy topology.
3. Build shared V2 shell and session/banner adapters; visually compare homepage.
4. Migrate static brand pages and teacher page with adapter reads.
5. Add catalogue/detail and public board/search read adapters.
6. Maintain PHP-owned writes/payment/auth/LMS; add bridge observability and staged traffic.
7. Migrate an ownership-B domain only under a separate gated program.
