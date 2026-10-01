# Route and entrypoint map

Common path: URL → entry PHP → `common.php` → `config.php` + ignored `data/dbconfig.php` → GnuBoard session/config/member → `_head.php`/`head.php` and `_tail.php`/`tail.php` → skin/library/assets.

| URL family | Entry and major includes | Template/asset boundary | Backend boundary |
|---|---|---|---|
| `/`, `/ceo_message.php`, `/teacher.php`, `/correction.php` | corresponding root file; `_head.php`, `_tail.php` | branded `src/nonsul-learn`, inline JS/CSS | banner/teacher/category queries |
| `/shop/*` | `shop/_common.php`, entry, `shop/_head.php`; skins | `skin/shop/basic/*` | shop tables, cart/order/PG endpoints |
| `/bbs/*` | `bbs/_common.php`, entry, `_head.php`/`_tail.php`; board/member/FAQ/search skins | `skin/{board,member,faq,search,qa}` | board/member/config tables |
| `/lecture/*` | `lecture/_common.php`, branded head/tail | `lecture/module/{pc,mobile}` and video JS | enrolment/lesson/progress tables |
| `/mobile/*` | mobile entry/head/tail | mobile skins/CSS | same PHP source of truth |
| `/sitemap.php` | root `_common.php` | XML | board/write tables |

Static URL rewrite rules and actual vhost routing are **UNKNOWN**: no tracked Apache/Nginx configuration was found. `html` vs `html2` runtime selection is **UNKNOWN**.
