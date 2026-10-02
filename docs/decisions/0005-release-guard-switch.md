# ADR 0005 — Production release guard switch

상태: Superseded by 0006
작성일: 2026-10-02

## Context

Vercel의 `main` 배포는 `VERCEL_ENV=production`으로 빌드된다. Gate 1~3에서는 아직 Bridge,
origin route, proxy secret, Production 환경변수를 등록하지 않으므로 기존 production guard가
mock placeholder build까지 막았다. Production branch build 실패는 Preview와 독립적인 초기
foundation 검증을 막는다.

## Decision

`V2_RELEASE_GUARD` server env를 도입한다. 기본값은 `off`다.

- `off`: mock source와 미등록 Bridge/proxy 값을 허용하며, production build에
  `[env] release guard OFF — Gate 4 전까지만 허용` 경고를 남긴다.
- `on`: production에서 viewer/course source를 http로 강제하고 `V2_PROXY_SECRET` 32자 이상을
  요구한다. 기존 production guard와 같은 release safety를 복원한다.
- `COURSE_SOURCE=http`이면 guard와 무관하게 `LEGACY_BRIDGE_BASE`가 필요하다. http source는
  proxy secret 16자 이상이 필요하다.

## Consequences

기본 `off`는 Production branch가 mock UI를 빌드·배포할 수 있다는 위험을 가진다. 따라서 이는
Gate 4 전까지만 허용하며 Apache가 V2 route를 proxy하지 않는 동안에만 사용한다. Gate 4의
route/kill-switch 검증 전에 Production env를 등록하고 `V2_RELEASE_GUARD=on`으로 전환한다.
전환 시 mock source 또는 32자 미만 secret 조합이 실제 Vercel build에서 실패하는 것을 Gate
증거에 기록해야 한다.
