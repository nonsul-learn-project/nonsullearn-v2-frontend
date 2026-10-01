# SEO, metadata, and analytics

`head.sub.php` emits dynamic title from `$g5_head_title`, fixed Korean description/keywords, viewport, Naver and Google verification meta tags, favicons and mobile icons under `seo/img`. `/sitemap.php` emits home and public posts for `briefing`/`notice` (up to 1500 each), excluding secret posts. No canonical, robots.txt, Open Graph/Twitter metadata, structured data, or analytics tag was found in the audited public sources. Their production/vhost presence is **UNKNOWN**.

V2 owns metadata layout and sitemap serialization but must preserve legacy title/description verification values only after read-only confirmation that they remain active.
