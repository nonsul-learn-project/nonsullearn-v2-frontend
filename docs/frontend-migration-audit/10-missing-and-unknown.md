# Missing and unknown

Count: **8 MISSING**, **5 UNKNOWN**.

| Status | Item | Impact / blocker | Required read-only Production confirmation |
|---|---|---|---|
| MISSING | `html{,2}/data/dbconfig.php` | all data-driven pages; full migration blocker | config structure/active root, redact values |
| MISSING | DB data/dump | banners, products, teachers, boards, prices, permissions | schema plus representative rows/counts and settings |
| MISSING | `data/file/` uploads | exact banners, board attachments, content images | inventory/path mapping of referenced assets |
| MISSING | runtime `$config`/`$default` | URLs, shop/payment/feature flags | active fields and non-secret values/shape |
| MISSING | sessions/cookies | cannot replay auth state | cookie names/domain/SameSite/TTL observed safely |
| MISSING | provider secrets/certificates | checkout/social/cert callbacks | enabled provider list and callback URLs only |
| MISSING | Production web-server config | canonical/rewrite/robots/domain behavior | vhost/rewrite/robots read-only inspection |
| MISSING | Production runtime media host/S3 config | image/video exact URLs | active storage topology |
| UNKNOWN | Production root `html` vs `html2` | source selection | deployed release checksum/path |
| UNKNOWN | active payment/social/identity providers | entry/callback scope | configuration activation fields |
| UNKNOWN | live banner slots/content | home exact parity | banner table rows and referenced paths |
| UNKNOWN | analytics outside tracked source | tracking parity | tag-manager/vhost/CDN inspection |
| UNKNOWN | scheduled job dependencies | downstream LMS/order behavior | cron/process inventory |
