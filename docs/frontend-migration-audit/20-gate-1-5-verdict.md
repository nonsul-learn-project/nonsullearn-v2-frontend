# Gate 1.5 verdict

**Q1. Can Git alone reproduce the frontend exactly?** No. It can reconstruct source-driven layout and flows, but not live runtime-driven content/state exactly.

**Q2. What is missing?** DB bootstrap/data/settings, uploads/banner files, session state, provider configuration/secrets, server routing and selected deployment root.

**Q3. What must Production confirm?** The eight missing and five unknown items in `10-missing-and-unknown.md`, read-only.

**Q4. What can be TypeScript?** Layout, responsive UI, interactions, static branding, SEO rendering, and UI presentation listed in ownership A.

**Q5. What stays PHP source of truth?** Auth, order/payment/PG, price/stock/coupons, LMS/correction, board writes/uploads and permissions.

**Q6. What bridges are needed?** Session, marketing banners, teachers/catalogue, content/board reads, cart/order entry and learning gateways in `13-legacy-adapter-design.md`.

**Q7. May homepage migration start now?** **CONDITIONAL YES** for shell/component work against local assets. Exact production implementation/release waits for deployed-root and live-banner/media confirmation.

**Q8. May full public migration start now?** **No.** Discovery/adapter scaffolding may start; implementation commitment waits for runtime configuration/content/route/session/provider confirmation.

**Gate result: CONDITIONAL PASS.**
