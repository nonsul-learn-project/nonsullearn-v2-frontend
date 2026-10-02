# Runbook — Vercel 설정 (Gate 4 전)

Gate 4 전에는 환경변수를 Vercel에 등록할 필요가 없다. local, Preview, Production 모두
동일한 mock 기본값으로 빌드·동작하며, `VERCEL_ENV` 값도 동작을 바꾸지 않는다.

## 기본 동작

- viewer와 course source: `mock`
- Legacy handoff base: `https://nonsul-learn.com`
- Legacy asset host: `nonsul-learn.com`
- 모든 robots: `noindex` / `Disallow: /`
- proxy: 요청을 그대로 통과

`.env.example`의 모든 항목은 optional이다. Bridge를 수동으로 확인해야 하는 경우에만
`NEXT_PUBLIC_VIEWER_SOURCE=http`, `COURSE_SOURCE=http`, `LEGACY_BRIDGE_BASE`를 설정한다.
mock source는 Bridge base와 proxy secret을 읽지 않는다.

`NEXT_PUBLIC_SITE_URL`은 선택 사항이다. absolute metadata URL이 필요하면 Vercel이 자동
주입하는 `VERCEL_URL`을 사용하며, 이것도 없으면 `metadataBase`를 만들지 않는다.

## Gate 4 재도입

Gate 4 routing 검증을 시작할 때는 ADR 0006의 목록을 모두 복구하고 테스트한다. 이 문서에
환경별 Vercel 등록 절차와 proxy secret 생성·교체 절차도 그 시점에 다시 추가한다.

## 이 단계에서 하지 않는 것

- Vercel 환경변수 변경
- Apache vhost, DNS, origin 도메인 설정 변경
- Production routing 또는 smoke test 실행
