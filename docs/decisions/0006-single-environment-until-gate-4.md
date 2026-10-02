# ADR 0006 — Gate 4 전 단일 환경 운영

상태: ACCEPTED (supersedes ADR 0005)  
작성일: 2026-10-02

## Context

Gate 4 전에는 운영 트래픽과 Vercel routing이 없다. 이 단계에서 local, Preview, Production의
서로 다른 환경 계약은 mock UI의 build·검증만 복잡하게 하고, 실제 배포 안전을 제공하지 않는다.

## Decision

환경과 무관하게 env 없이 같은 기본값으로 빌드한다. viewer/course source는 `mock`, Legacy
base는 `https://nonsul-learn.com`, asset host는 `nonsul-learn.com`이다. `NEXT_PUBLIC_SITE_URL`,
Bridge base, proxy secret은 optional이다. `NEXT_PUBLIC_SITE_URL`이 없으면 Vercel 시스템 변수
`VERCEL_URL`을 metadataBase에만 사용하고, 그것도 없으면 absolute metadata URL을 생략한다.

## Removed before Gate 4

- `VERCEL_ENV` 기반의 분기와 production 금지 조합 검사
- `V2_RELEASE_GUARD`, `V2_ENFORCE_PROXY`
- proxy secret 검사 및 origin redirect
- 환경별 robots와 production sitemap
- localhost 기본값

## Gate 4 reintroduction checklist

- release guard와 production source/Bridge/secret 검증
- Apache proxy secret 검사와 origin redirect
- 환경별 robots 정책 및 production sitemap/canonical 기준
- 환경별 Vercel env 등록·secret 생성/교체 runbook
- 위 항목의 unit/build 검증 및 Gate 4 routing smoke 증거

## Consequences

Gate 4 전 모든 배포는 noindex이며 proxy로 보호되지 않는다. 그러므로 이 결정은 routing 또는
외부 트래픽이 없는 기간에만 유효하다. Gate 4 PASS 전에 재도입 목록 전체와 테스트를 복구한다.
