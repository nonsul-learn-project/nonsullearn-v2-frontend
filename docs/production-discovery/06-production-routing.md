# Production routing

## Historical read-only evidence

`03-upload-storage-inventory.md` records Apache `sites.conf` entries for `nonsul-learn.com` and `www.nonsul-learn.com`, with `DocumentRoot /home/nonsul-learn.com/html2` for HTTP and HTTPS virtual hosts. It is sufficient evidence for the established canonical root, but it is not a fresh 2026-10-01 host read.

Tracked `html2/.htaccess` has `RewriteEngine On`, no active canonical HTTPS/host rewrite, no active pretty-route rewrite, and `ErrorDocument 404 /index.php`. PHP files and static paths are consequently served by the normal Apache/PHP mapping unless unseen vhost rules alter them.

## Coexistence design

After a read-only, current vhost verification, route `/` and approved V2 public paths to Next.js through Apache reverse proxy. Explicitly preserve `/bbs/`, `/shop/`, `/lecture/`, `/mobile/`, `/uAdmin/`, `/data/`, `/src/`, `/js/`, `/css/`, `/img/`, and PHP callback paths for Legacy. Do not retain the current 404-to-home fallback for V2 routes; return Next.js 404s and preserve Legacy responses for Legacy namespaces. Keep same scheme/host so browser PHP session cookies accompany adapter requests.

## Status

DocumentRoot history is **RESOLVED**. Current VirtualHost directives, TLS termination, host aliases, proxy module availability, and any vhost-level rewrites are **BLOCKING** because the current Production inspection could not authenticate after host-key verification succeeded. No Apache configuration was changed, reloaded, or restarted.
