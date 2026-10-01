# V2 ownership map

| Ownership | Features |
|---|---|
| A — TypeScript | shared layout/navigation, responsive UI, carousels/interactions, brand static pages, visual system, SEO tags/sitemap rendering, analytics integration after confirmation |
| B — Legacy PHP | auth/session source, registration/certification, product price/discount/stock/coupon validation, cart/order/PG/callbacks, board and upload writes, LMS entitlement/progress/correction, permissions |
| C — Bridge required | session identity; banners; teacher/catalogue/detail read models; public board/search/FAQ reads; cart/order entry state; LMS/my-page read models and progress event forwarding |
