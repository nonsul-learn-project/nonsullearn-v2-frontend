# V2 architecture

`Browser → Next.js + TypeScript experience layer → typed Legacy Adapter/Contract → Legacy PHP core → existing MariaDB`.

Next.js owns SSR/metadata/layout/responsive presentation and calls a server-side adapter. The adapter authenticates to PHP using the browser's existing same-site session and returns normalized read models. PHP remains the sole writer/authority for authentication, member state, shop pricing/stock/coupon/order/payment, boards writes/files, LMS entitlement/progress/correction, and provider callbacks. Begin with reverse-proxy/same-origin routing; decide cookie domain only after Production inspection.
