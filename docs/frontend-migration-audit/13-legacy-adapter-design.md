# Legacy adapter design

The adapter is an anti-corruption layer, not a rewrite. It must have no direct MariaDB write route and translate PHP errors/redirects to typed responses while retaining legacy redirect URLs for ownership-B flows.

| Gateway | Input/output | Auth/cache | Legacy source / risk |
|---|---|---|---|
| `LegacySessionGateway.getViewer()` | none → anonymous/member level/name | cookie; no shared cache | `common.php`; high cookie-domain risk |
| `LegacyMarketingGateway.getBanners(slot, device)` | slot/device → image/link/alt/target | public; short cache only after update policy | `get_banner`; live data missing |
| `LegacyTeacherGateway.listTeachers()` | none → ordered teacher/category cards | public; cacheable | `teacher.php`; content field shape verify |
| `LegacyCatalogueGateway.list/get()` | category/query/page/item ID → display model | public read, member-aware details | shop files/lib; price must be server-authoritative |
| `LegacyContentGateway` | board/search/post/FAQ inputs → paginated read model | permission-aware; avoid caching private | bbs source; board config varies |
| `LegacyLearningGateway` | viewer/item → enrolments/module state; progress event | auth; no cache for status | LMS source; writes stay PHP |

Gateway calls must return `{ok:false, code, legacyRedirect?}` for login/forbidden/not-found/validation/server failure. Validate actual serialized PHP responses during implementation; none are presently API contracts.
