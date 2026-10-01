# Frontend surface inventory

| Feature | Route | Legacy Source | Backend Dependency | State | User Action | V2 Strategy | Confidence |
|---|---|---|---|---|---|---|---|
| Home/hero | `/` | `html/index.php` | `get_banner`; `tbl_shop_banner` and image files | desktop/mobile banner IDs differ | slider, external social links | TS layout; banner read adapter | MEDIUM—live rows/files absent |
| Global header/nav/footer | every branded page | `_head.php` → `head.php`; `_tail.php` → `tail.php` | `$member`, GnuBoard URLs | auth and `mb_level > 7` correction link; responsive menu | navigate/login/logout/menu | TS layout + session adapter | HIGH |
| Brand intro | `/ceo_message.php` | `ceo_message.php` | banners 7/8 | device | navigate | TS page + banner adapter | MEDIUM |
| Teachers | `/teacher.php` | `teacher.php` | `tbl_lec_item_teacher`, `tbl_shop_category` | ordered, category-derived cards | scroll reveal | TS page + teacher adapter | HIGH |
| Correction introduction | `/correction.php` | `correction.php` | banners 11–14 | device | navigate | TS page + banner adapter | MEDIUM |
| Course/product catalogue | `/shop/list.php?ca_id=` | `shop/list.php`, `skin/shop/basic/list*.skin.php` | shop item/category tables and `shop.lib.php` | `it_use`, category, sort/page | list/filter/sort/pagination | adapter; preserve PHP eligibility | HIGH |
| Product detail/cart/wishlist | `/shop/item.php?it_id=` | `shop/item.php`, item skins | item/options/stock/reviews/Q&A/coupons | price/stock/sold-out/member | add cart, options, wish | bridge writes to PHP | HIGH |
| Checkout/order | `/shop/orderform.php`, order inquiry | shop order files and PG includes | order/cart/coupon/default/provider config | auth, amount, payment method | pay/cancel/address | legacy boundary | HIGH |
| Public boards/notices/briefing | `/bbs/board.php?bo_table=` | `bbs/board.php`, list/view/write skins | board/write/file tables | board permission/secret/page/search | read/write/comment/download | adapter for read; PHP writes initially | HIGH |
| FAQ/search/content/Q&A | `/bbs/faq.php`, `/bbs/search.php`, `/bbs/content.php`, `/bbs/qalist.php` | bbs endpoints/skins | config/FAQ/content/Q&A tables | query, permissions | search/form submit | adapter/read + legacy writes | HIGH |
| Member | `/bbs/login.php`, register/profile/password reset | bbs + member skin | member/session/social/cert/mail config | anonymous/member/blocked/certified | auth/register/update | PHP ownership | HIGH |
| My learning/LMS | `/lecture/mypage.php`, `/lecture/module/?it_id=` | lecture files, `lms.lib.php` | orders, lessons, progress | login/enrolment/date/status | player, correction route | legacy boundary/adapter | HIGH |
| Mobile | `/mobile/*`, mobile shop/lecture and CSS | mobile files plus `G5_IS_MOBILE` | UA detection/session | device branch | same actions | responsive V2; validate device parity | HIGH |
| SEO/sitemap | `/sitemap.php`, all heads | `head.sub.php`, sitemap | title/boards | route/board content | crawler access | V2 metadata/sitemap adapter | HIGH |
