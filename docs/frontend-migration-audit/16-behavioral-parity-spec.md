# Behavioral parity specification

| Legacy state | Required V2 behavior |
|---|---|
| anonymous | login visible; restricted mypage/module sends legacy login return URL |
| authenticated / level > 7 | logout visible; correction submission navigation visible |
| desktop/mobile | home banner slot sets differ; navigation behaves as desktop/mobile equivalent |
| active/inactive product, stock/coupon/price | PHP-derived availability/price displayed; checkout uses PHP result |
| empty catalogue/order/enrolment/search | legacy-equivalent empty state, no fabricated content |
| invalid/missing query or forbidden board/post | preserve status/message/legacy redirect semantics |
| home | five-second autoplay hero, controls/pagination and external social links |
| enrolled/expired/incomplete LMS | access and progress follow completed status/end date/log rules |
| public/secret board content | permission and secret visibility remain PHP-authoritative |

Test each state at desktop and mobile breakpoints with fixture data only after approved read-only capture.
