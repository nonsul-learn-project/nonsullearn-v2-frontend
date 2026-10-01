# Forms, actions, AJAX, and redirects

| UI | Endpoint/action | Authority |
|---|---|---|
| Login | `/bbs/login_check.php` | PHP auth/session |
| Register/profile/reset | `/bbs/register_form_update.php`, password endpoints | PHP member/auth/mail/cert |
| Board/posts/comments | `write_update.php`, `write_comment_update.php`, token/filter AJAX | PHP permissions/files/content |
| Cart/wish/order | `cartupdate.php`, `wishupdate.php`, `orderformupdate.php`, `ajax.order*` | PHP cart/order/price/PG |
| Product Q&A/review | item QA/use update endpoints | PHP validation/ownership |
| LMS progress | `/lecture/module/ajax.progress.php` | PHP writes log and derived progress |
| Correction decrement | `/lecture/update_correct_count.php` (currently client call is commented) | PHP LMS authority |

Existing forms include CSRF/token behavior in GnuBoard. V2 must call a reviewed adapter that forwards required cookie/token context. Do not expose direct database writes from Next.js.
