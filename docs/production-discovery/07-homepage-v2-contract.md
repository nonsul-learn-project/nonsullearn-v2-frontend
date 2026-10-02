# Homepage V2 contract

## Minimal dependency result

For the current tracked canonical `html2/index.php`, Homepage requires **SessionAdapter only** for global header/mobile navigation state. It does **not** require BannerAdapter: the canonical page has no runtime banner call. The hero/content itself is source-owned UI and one public legacy teacher asset path.

```ts
export interface HomepageViewer {
  authenticated: boolean;
  member?: { id: string; name: string; level: number };
}

export interface SessionAdapter {
  getViewer(): Promise<HomepageViewer>;
}
```

| Adapter | Responsibility | Source of truth / PHP source | Auth | Output/error/cache | Risk |
|---|---|---|---|---|---|
| `SessionAdapter` | Resolve only navigation-visible identity state | PHP session + member; `common.php`, `head.php` | existing browser cookie | anonymous viewer on no session; typed unavailable/invalid-session error; no shared cache | live cookie topology and handler/save configuration unverified |
| `BannerAdapter` | Not part of Homepage | N/A | N/A | N/A | do not implement for Homepage |

The adapter response must not include member contact data, session IDs, passwords, hashes, or authorization beyond the navigation-visible level. PHP remains identity/session authority.

## Data flow and errors

`Browser cookie → Next.js server route → PHP session-view endpoint → common.php member resolution → sanitized viewer → Next.js header`.

On unavailable PHP, render the homepage public content with a conservative anonymous navigation state and log server-side; never mint a session or infer a member. If PHP says anonymous, show Login. If authenticated, show Logout; level above 7 preserves correction navigation.

## Parity checklist

- Anonymous and authenticated headers; level 1 versus level above 7 navigation.
- Login links to `/bbs/login.php`; logout links to `/bbs/logout.php` until those flows are separately migrated.
- Desktop and mobile header/menu route destinations match legacy.
- Current three-slide Bootstrap carousel keeps automatic cycling, controls/indicators, touch behavior and internal legacy routes.
- Direct legacy public teacher asset resolves; failure has an accessible image fallback. Production asset presence remains a gate item pending authenticated read-only verification.
- Legacy external links, query strings, status/404 behavior and HTTPS host are preserved.
- The current source has no homepage active/inactive banner or banner ordering behavior. Do not add it without confirmed Production evidence.
