# PHP dependency map

`html/common.php` initializes configuration, database connection, session and `$member`; then loads `lib/common.lib.php`, `lib/lms.lib.php`, and GnuBoard settings. `html/config.php` supplies path constants. `head.php` injects shared navigation and checks `$member['mb_level'] > 7` for correction submission visibility.

| Surface | PHP/data path | Observable rule |
|---|---|---|
| Banner | `lib/lms.lib.php:get_banner` → banner skin/table | IDs 1/3/5/9/15 desktop; 2/4/6/10/16 mobile home; 7/8 intro; 11–14 correction |
| Teachers | `teacher.php` → `tbl_lec_item_teacher`, `tbl_shop_category` | `ir_order ASC`; category fetched per teacher |
| Catalogue | `shop/list.php` + `lib/shop.lib.php` + list skins | only items satisfying legacy `it_use` and list conditions render |
| Price/stock | `lib/shop.lib.php:display_price`, `is_soldout`, item/cart/order endpoints | server remains authority for actual payable amount/stock |
| Boards | `bbs/board.php` → board/list/view/write skins | `bo_*` permission, secret, points and configured skin determine output |
| LMS | `lms.lib.php:get_lecture_*`; `lecture/mypage.php` | completed order and date determine access; progress derived from content logs |
| Auth | `bbs/login_check.php`, `logout.php`, `common.php` | member/session/auto-login/certification/intercept/leave rules |

Do not duplicate price, entitlement, authorization, coupon, checkout, or LMS writes in V2.
