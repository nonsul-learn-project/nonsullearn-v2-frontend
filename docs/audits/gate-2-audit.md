# Gate 2 감사 보고서

감사일: 2026-10-02 (Asia/Seoul)  
범위: 읽기/명령 실행 및 지정 변이 실험만 수행. 운영 도메인·`capture-legacy-baseline`은 실행하지 않음.

## 요약

**최종 판정: FAIL.** Blocker 4건, Major 14건, Minor 7건이다. 가장 직접적인 Gate 2 PASS 차단 사유는 (1) 3 viewport/세 영역의 Legacy baseline 및 실제 visual 비교가 없고 `pnpm test:visual`이 종료 1인 점, (2) Legacy DOM/classes와 V2가 일치하지 않는 점, (3) footer 법정표시 테스트가 요구된 정확 비교가 아닌 점, (4) Gate 2 실행 지시서 파일 자체가 없는 점이다.

판정 표기: PASS / PARTIAL / FAIL / UNVERIFIABLE. `—`는 수정 제안이 없는 PASS다.

## 사전 측정 출력

```text
$ git log --oneline -15
a1f47d3 chore(env): single environment until gate 4, remove guards and localhost defaults
4dac978 docs(design): document extracted legacy tokens
93938b7 docs(gates): gate 2 evidence record
8b7a17e test(visual): legacy baseline capture script and shell parity tests
dd8c3e3 feat(shell): header, desktop/mobile nav, auth area, footer with legacy markup
a9435fc feat(design): sync gate-1 docs, legacy bootstrap/main.css/font, extracted tokens
... (9 commits)

$ git status --short
(empty before audit write)

$ pnpm install --frozen-lockfile
Lockfile is up to date ... Done in 420ms

$ pnpm check; echo "EXIT=$?"
268 passed; next build succeeded; EXIT=0
(ESLint warnings: layout custom font, three `<img>` uses)

$ pnpm test:visual; echo "EXIT=$?"
Error: No tests found
EXIT=1

$ pnpm vitest run --reporter=dot 2>&1 | tail -5
Test Files 16 passed (16)
Tests 268 passed (268)

$ test -d ../nonsul-learn-html1/html2 && git -C ../nonsul-learn-html1 rev-parse HEAD
d83d730627ca267ec30f74dca71401481e948e7f
```

## 항목별 결과

| # | 항목 | 판정 | 심각도 | 증거 | 수정 제안 |
|---|---|---|---|---|---|
| 1.1 | Phase 1~4 지시서 커밋 | FAIL | Blocker | 지정 기준 `docs/prompts/gate-2-design-parity.md`가 없음 (`sed: No such file`); 따라서 Phase/정확한 메시지 대조 불가 | 지시서를 복구하고 Phase 1~4 커밋 메시지를 대조 가능하게 기록 |
| 1.2 | Gate 2 증거 실재 | PARTIAL | Major | `docs/gates/gate-2.md:6-14`는 해시/경로를 적었지만 `pnpm check` 수가 299가 아니라 268, visual은 실패 | 실제 명령 출력·검증일·baseline 상태로 증거 갱신 |
| 1.3 | Gate 1 문서 동기화 5항목 | PARTIAL | Major | AGENTS `§4, §6.2`는 barrel/proxy 반영; CI `.github/workflows/ci.yml:51` prettier 있음. 그러나 HARNESS `§4` member 행은 displayName 요구를 계속 포함하고, ADR 0003:15-18, 46-53도 명시적 불일치 | 사람 승인으로 HARNESS member 행과 ADR 결정을 동기화 |
| 1.4 | EXECUTION-PLAN Gate 2 행 | PASS | — | `docs/harness/EXECUTION-PLAN.md:137-145` Gate 2-A=PARTIAL, baseline pending | — |
| 2.1 | Bootstrap 5.3.2 CSS import | PASS | — | `package.json:26` 정확히 `5.3.2`; `src/app/layout.tsx:7` CSS import | — |
| 2.2 | Bootstrap JS/Popper 부재 | PASS | — | `rg -nE 'bootstrap...|@popperjs' src/ package.json` 무결과; `.next/static` bootstrap.bundle 무결과 | — |
| 2.3 | Bootstrap → main.css 순서 | PASS | — | `src/app/layout.tsx:7-9` | — |
| 2.4 | main.css SHA/Legacy 일치 | PASS | — | 두 파일 `shasum -a 256` 모두 `e0dce7...367f1a`; verifier `scripts/verify-legacy-css.mjs:4-12` | — |
| 2.5 | check 연결/변이 | PASS | — | `package.json:23`; 임시 복사본 1글자 변이 결과 `TEMP COPY FAIL ... got 3a2b...`; repo source 불변 | — |
| 2.6 | CSS url 자산/빌드 경고 | PASS | — | `main.css:66,70,74` 3개 URL, `src/design-system/src/nonsul-learn/img/` 3파일; 빌드 CSS URL 경고 없음 | — |
| 2.7 | Legacy와 같은 font link/preconnect | PARTIAL | Minor | Legacy `head.sub.php:83` font href는 같고 V2 `layout.tsx:34-39`은 preconnect도 추가. Legacy에는 preconnect 없음; strict “같은 link/preconnect” 충족 증거 없음 | parity 기준을 명확히 하고 필요 시 Legacy와 동일하게 |
| 2.8 | 모든 token 출처/10 sample | PASS | — | `tokens.css:3-22` 20개 모두 `main.css:<line>`; 샘플 navy(2), white(78), radius-md(201), space-2(158), shadow-md(173), light(39), breakpoint-lg(275) 원본 대조 | — |
| 2.9 | tokens 문서 개수/이름 | FAIL | Major | CSS 20개 변수 vs `docs/design/tokens.md:5-12`은 9 요약 행이며 변수명도 불일치 | 20개 이름/값/출처로 문서를 기계적으로 일치시킬 것 |
| 3.1 | shell/primitives 위치 | PASS | — | `src/features/site-shell/{SiteHeader,DesktopNav,MobileNav,SiteFooter}.tsx`, `primitives/index.tsx:2-29` 6종 | — |
| 3.2 | Server/Client 경계 | PARTIAL | Major | shell client는 DesktopNav/MobileNav뿐이나 `src/features/header/AuthArea.tsx:1`도 필요. 반면 `src/legacy/adapters/viewer/ViewerProvider.tsx:1`, `src/app/error.tsx:1`도 존재; 요구한 범위/섬 목록을 문서화하지 않음 | 경계 inventory와 필요한 섬의 근거 추가 |
| 3.3 | client → legacy/server 금지 | PASS | — | `rg` client 파일에서 `@/legacy/server` 무결과; ADR 0004:35-47 | — |
| 3.4 | DOM/class legacy 대조 | FAIL | Blocker | Legacy `head.php:24-25` toggler는 `<i class="fa-solid fa-bars fa-lg text-dark">`; V2 `MobileNav.tsx:36-45`는 `<span class="navbar-toggler-icon">`. Legacy `head.php:140,144` lacks V2 `aria-*`; V2 adds backdrop `MobileNav.tsx:105-107`. Footer Legacy `tail.php:69-71` SNS 블록은 V2 `SiteFooter.tsx:46-62`에 없음. 대조표/렌더 증거도 없음 | 블록별 DOM/class table 및 legacy-equivalent markup 테스트 작성 |
| 3.5 | Bootstrap state/ARIA 위치 | PARTIAL | Major | Desktop `DesktopNav.tsx:25,29,37` show/aria-expanded; Mobile `MobileNav.tsx:72-84` collapsed/show/aria. 그러나 legacy는 `data-bs-target`, `data-bs-parent` (`head.php:140,144`)이고 V2는 absent; test는 aria만 | Bootstrap 위치·속성 parity를 render/E2E로 검증 |
| 3.6 | PHP 4분기 capability 대응 | FAIL | Major | Legacy branches: authenticated `head.php:96`, admin:97, correction level:85/211; V2 correction is AuthArea `:109-110`, 즉 DesktopNav/MobileNav MY submenu에 삽입되지 않고 auth 영역에 삽입. 표 없음 | correction/admin/auth anonymous를 legacy 위치별로 매핑 |
| 3.7 | displayName 미사용 | PASS | — | production `src/features`/contracts uses comment only; invalid fixture is intentional (`viewer.invalid.has-displayName.json`) | — |
| 3.8 | shell/header hardcoded copy/URL 없음 | FAIL | Major | component literal copy: `MobileNav.tsx:39,62,67`; `SiteFooter.tsx:24-29,54,67`; href `/` `MobileNav.tsx:56`, `SiteHeader.tsx:11`. `site.ts` 외 위치 | 모든 copy/route를 `src/content/site.ts` 또는 allowed route helper로 이동 |
| 3.9 | legacy link 생성 단일화 | PARTIAL | Major | `site.ts:80-83` external links literal은 legitimate content, but `/` href literals above and footer logo `/src/...` mean stated “legacyRoutes or site.ts only” 미충족 | home/asset route ownership을 content/helper로 단일화 |
| 3.10 | placeholder shell | PASS | — | `src/app/page.tsx:8-13` SiteShell + placeholder | — |
| 3.11 | /_v2/shell/noindex/scenarios | FAIL | Major | route exists `src/app/%5Fv2/shell/page.tsx:4-13`, noindex. 하지만 query를 읽지 않아 `?viewer=anonymous|member|admin`이 scenario를 전환하지 않음 | searchParams를 zod parse하여 ViewerProvider scenario에 전달, 3 E2E 추가 |
| 3.12 | shell image asset rules | FAIL | Major | `SiteHeader.tsx:12`, `MobileNav.tsx:57` use `/src/nonsul-learn/...`; `SiteFooter.tsx:12` same; `public/` empty and `legacyAssetUrl()` unused. `img` also violates AGENTS next/image rule | permitted public copy 또는 legacyAssetUrl/next/image로 교체 |
| 4.1 | footer fixture 11값 exact legacy | FAIL | Major | fixture `footer-legal.json:3-14` has 10, not required 11; legacy legal/copyright are at `tail.php:45-63,90`; no per-item source/value proof | enumerate required 11 values and source line per item |
| 4.2 | exact equality assertion | PARTIAL | Major | `site-shell.test.tsx:17` uses `toContain`, prohibited by audit criterion | exact array/text-node `toEqual` assertions |
| 4.3 | footer mutation | PASS | — | `site.ts` 사업자번호 6→7 temporary mutation made test fail at `site-shell.test.tsx:17`; immediately restored; final source diff empty | — |
| 4.4 | header links full inventory | FAIL | Major | fixture has 15 labels (`header-links.json:3-19`); legacy desktop+mobile includes 15 public labels plus conditionally correction (`head.php:85-90,211-216`). Fixture does not represent links/URLs or conditional item | extract desktop/mobile URL+label inventories including correction scenario |
| 4.5 | nav interaction test breadth | FAIL | Major | tests only dropdown Escape (`:23-31`) and Mobile open/accordion/Escape (`:32-48`); no close click, outside click, keyboard navigation, focus trap, scroll-lock assertions | add one test per required behavior |
| 4.6 | AuthArea Gate1 retained + class | PARTIAL | Minor | Gate1 tests retained (`git log` includes `8ff2c82`); class assertions absent in `AuthArea.test.tsx:42-233` | assert desktop/mobile legacy classes/structure |
| 4.7 | test count ≥ Gate1 310 | FAIL | Major | user baseline=310; current full Vitest=268. Gate1 evidence also lists L1 225 + L2 33 (`git show 326e53d:docs/gates/gate-1.md:21-22`) | reconcile/delete audit and restore coverage before promotion |
| 5.1 | capture script requirements | PARTIAL | Major | URL required `capture...:6-7`; 3 viewport `:8-12`; one load/viewport `:20`; animation/fonts `:21-30`; meta `:49-52`. It does not explicitly establish anonymous viewer/session | add anonymous assertion/cookie handling and test script behavior |
| 5.2 | capture/compare set equality | FAIL | Blocker | capture emits header/footer 375/768/1440 + mobile 375/768 (8); `tests/visual/shell.spec.ts:4-13` compares header-375 only | define shared matrix and verify all 8 pairs |
| 5.3 | absent baseline skip | PARTIAL | Major | test has skip `shell.spec.ts:6-9`, but command ends `Error: No tests found`, exit 1, so required non-failing behavior absent | correct Playwright testDir/project so skipped test is discovered and command exits 0 |
| 5.4 | 0.02 separated/TBD comment | PARTIAL | Minor | `shell.spec.ts:12` inline `0.02`; no named constant/TBD comment (HARNESS wording only) | export named `MAX_DIFF_PIXEL_RATIO` with TBD comment |
| 5.5 | e2e/visual project separation | PARTIAL | Major | config `:44-46` separates patterns, but visual test lives outside `testDir: './tests/e2e'`, yielding no tests | configure visual testDir/project correctly and show both command lists |
| 5.6 | CI prettier/visual advisory/artifact/comment | PARTIAL | Minor | prettier `ci.yml:51`, continue-on-error `:85-103`, artifact exists. “Gate 6에서 필수” is only job name, not requested comment | add explicit policy comment and artifact evidence path |
| 5.7 | shell parity template/PENDING | PARTIAL | Minor | `docs/parity/shell.md:1-9` PENDING but not HARNESS §7 P1-P16 table template | use prescribed L5 template |
| 6.1 | ADR number collision | PASS | — | `docs/decisions/0002...0006` unique; 0006 single environment | — |
| 6.2 | ADR0005 superseded/guards absent | PARTIAL | Major | ADR `0005:3` superseded; runtime source has no guard, but stale references remain in `playwright.config.ts:27`, `.github/workflows/ci.yml:31`, docs gate1 prompts | remove obsolete config vars/docs or classify clearly historical |
| 6.3 | prompt Gate1 structure vs single env | FAIL | Major | required `docs/prompts/gate-2-design-parity.md` absent; cannot inspect asserted table | restore/relocate canonical prompt and reconcile 0006 |
| 6.4 | each GATES PASS sentence mapped | FAIL | Blocker | no PASS-condition-to-results mapping existed; Gate condition requires 3 viewport tolerance while 5.2/5.3 fail | add traceability table after actual visual evidence |
| 6.5 | out-of-scope work absent | PASS | — | `src/content/` only README/site; no home section components, Tailwind dependency, or Bootstrap JS found (`package.json`, `src/`) | — |
| 6.6 | intended difference logged | FAIL | Major | known differences (3.4: icon/backdrop/SNS/ARIA) not recorded in parity file, which only has pending rows (`docs/parity/shell.md:3-9`) | record each intentional change, or restore parity |
| 7 | clean-env build/artifact scan | PARTIAL | Major | prescribed build exits 0; no CSS/image warnings. `grep -rl localhost .next/static .next/server` returns multiple chunks, so localhost is shipped. bootstrap.bundle/popper scan empty | determine source and remove localhost from production artifact or document why safe |

## Gate PASS CONDITION traceability

| GATES Gate 2 PASS CONDITION | Mapped audit results | Outcome |
|---|---|---|
| Header, Footer, MobileNav match Legacy within tolerance at 3 viewports | 3.4 FAIL, 5.2 FAIL, 5.3 PARTIAL, 5.5 PARTIAL | **Unmet** |
| home sections can be assembled on same foundation | 2.1-2.6 PASS, but 2.9 FAIL, 3.4/3.8/3.12 FAIL | **Unmet** |

## 빈 곳 목록

- Primitives are only thin Bootstrap wrappers (`primitives/index.tsx:2-29`); no documented responsive spacing, image, grid, or carousel/accordion composition contract for Gate 5 sections.
- `siteContent` is a single unvalidated `as const` object (`src/content/site.ts:6-88`); it does not show a scalable typed home-content structure promised by `component-map.md:30`.
- Visual parity has no shared capture matrix, no screenshot naming contract, and no baseline provenance beyond a timestamp/hash.
- The UI route query contract advertised for viewer scenarios is not implemented by the shell preview.

## 수정 지시서 초안

1. **Blocker — make visual parity executable.** Update `playwright.config.ts`, `tests/visual/shell.spec.ts`, and (if needed) `scripts/capture-legacy-baseline.mjs`. Completion: `pnpm test:visual` discovers/skips cleanly without baseline, then compares all header/footer/mobile-nav matrix pairs at 375/768/1440 (mobile where applicable) with a named 0.02 TBD constant; commit baseline and meta after human capture.
2. **Blocker — restore structural parity evidence.** Update `src/features/site-shell/{SiteHeader,DesktopNav,MobileNav,SiteFooter}.tsx` and tests. Completion: block-by-block legacy/V2 DOM-class table; no unexplained icon/SNS/backdrop/attribute/conditional-link differences; behavior tests cover all listed interactions.
3. **Blocker — restore canonical Gate 2 instructions and traceability.** Restore `docs/prompts/gate-2-design-parity.md`; update `docs/gates/gate-2.md`. Completion: every Phase/commit is verifiable and every GATES PASS sentence maps to concrete current evidence.
4. **Blocker — make footer test exact.** Update `tests/fixtures/footer-legal.json`, `tests/component/site-shell.test.tsx`, and `src/content/site.ts`. Completion: all required legal values have one source line each and tests use `toEqual`/`toBe`, not containment.
5. **Major — complete content/asset/query ownership.** Update `src/content/site.ts`, `SiteHeader.tsx`, `MobileNav.tsx`, `SiteFooter.tsx`, `src/app/%5Fv2/shell/page.tsx`. Completion: no component copy/home URL literals, allowed image strategy only, and three viewer query scenarios actually render.
6. **Major — document token and environment consistency.** Update `docs/design/tokens.md`, `docs/harness/HARNESS.md`, CI/playwright env config, and stale prompts. Completion: token names/counts match CSS; member condition reflects approved ADR; obsolete guard refs removed or explicitly historical; clean build no unintended localhost.
7. **Major — restore test coverage.** Update relevant tests only after behavior is implemented. Completion: full Vitest count is at least the declared Gate1 baseline (310) or an approved ADR documents each removed test.
8. **Minor — normalize parity documentation.** Update `docs/parity/shell.md` to HARNESS P1-P16 template and record all intended accessibility differences.

## 사람이 확인할 것

- Human must capture/approve Legacy baseline screenshots; this audit did not request the operating domain.
- Decide whether preconnect is a permitted non-visual improvement or must exactly mirror Legacy markup.
- Approve HARNESS L2 member-row change required by ADR 0003, rather than treating it as an agent-only harness relaxation.
- Resolve the stated “11” footer values versus the current Legacy legal/copyright payload, which contains 10 fixture values.

## 변이 실험 복구 확인

```text
CSS temporary-copy mutation: EXIT=1
TEMP COPY FAIL: Legacy main.css SHA256 mismatch ... got 3a2b22a4...

Footer temporary mutation: FOOTER_MUTATION_EXIT=1
tests/component/site-shell.test.tsx ... expected ... to contain '사업자번호 : 511-95-06456'

After restoring src/content/site.ts:
$ git status --short
(empty; before this audit report was created)
$ git diff -- src/content/site.ts
(empty)
```
