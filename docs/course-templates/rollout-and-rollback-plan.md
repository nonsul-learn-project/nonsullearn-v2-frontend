# Gate 2 — Rollout & Rollback Plan

작성일: 2026-10-15

## 1. 두 단계 스위치

템플릿 적용은 **AND 조건 2개**로 통제한다. 둘 중 하나만 꺼도 현재 화면으로 돌아간다.

```
새 템플릿을 쓴다  =  COURSE_TEMPLATES === 'on'                  ← 전역 kill switch (env)
                 AND resolveCourseTemplate(ca_id) !== 'legacy'   ← 유형 매핑
                 AND getCourseTemplateContent(it_id) !== null     ← 강좌별 opt-in (콘텐츠 파일)
```

| 레벨 | 수단 | 적용 범위 | 반영 시점 |
|---|---|---|---|
| L1 전역 | `COURSE_TEMPLATES` env | 전체 강좌 | Vercel env 변경 + 재배포 |
| L2 유형 | `resolveCourseTemplate`의 `BY_PREFIX` | 유형 단위 | 코드 배포 |
| L3 강좌 | 콘텐츠 파일 존재 여부 | 강좌 1개 | 코드 배포 |

**가장 중요한 점: 기존 `CourseDetail.tsx`를 수정하지 않으므로 롤백에 "되돌리기"가 필요 없다.**
스위치를 끄면 지금 운영되는 그 코드가 그대로 실행된다.

## 2. 신규 env — `COURSE_TEMPLATES`

```ts
// src/env.server.ts  serverEnvSchema 에 추가
/**
 * 강좌 상세 3종 템플릿 kill switch. 'off' 면 모든 강좌가 기존 Legacy 스킨 화면이다.
 * 강좌별 활성화는 콘텐츠 파일 존재 여부로 하고, 이 스위치는 전역 차단만 한다.
 */
COURSE_TEMPLATES: z.enum(['on', 'off']).default('off'),
```

```ts
export const courseTemplatesEnabled: boolean = serverEnv.COURSE_TEMPLATES === 'on';
```

| 요구 | 처리 |
|---|---|
| 서버 env인가 | **예.** `NEXT_PUBLIC_`이 아니다. 클라이언트가 알 필요가 없다 |
| 기본값 | **`'off'`** — 등록하지 않은 환경(로컬·CI·기존 Preview)은 현재 화면 그대로 |
| ISR 영향 | 없음. 렌더 시 서버에서 읽는 상수 |
| `.env.example` | 추가 필요 |
| `docs/harness/HARNESS.md` 환경별 값 표 | 갱신 필요 (AGENTS.md §10 Task DoD) |
| `tests/contract/env.test.ts` | 케이스 추가 |

## 3. 템플릿 Gate 3~7 실행 순서

| 단계 | 내용 | 스위치 | 검증 |
|---|---|---|---|
| **3-0** | `useCourseOrder()` 추출 **단독 커밋** | — | `pnpm check` + 기존 테스트 무수정 통과 + 렌더 HTML diff 0 |
| **3-1** | 공용 CSS·토큰·`shared/` 15개 | — | L2 단위 테스트 |
| **3-2** | 유형별 01·02-A·04 (3 × 3) + 템플릿 루트 3개 | — | — |
| **3-3** | Router + Resolver + 콘텐츠 provider + fixture 2개 | `off` | L1: Resolver 분기 4종, `buildTemplateProps` |
| **3-4** | 로컬에서 세 템플릿 확인 (mock id + 신규 fixture) | 로컬만 `on` | L3 e2e: 320/390/768/1024/1440px |
| **4** | 대표 강좌 3종 콘텐츠 파일 작성 + 실데이터 확인 | Preview `on` | 필수 정보 누락 0 |
| **5** | 기능 회귀 검증 | Preview `on` | §5 체크리스트 |
| **6** | Preview 스테이징 + 롤백 리허설 | Preview `on` | §4 |
| **7** | 대표 3 → 10 → 전체 (콘텐츠 파일 추가로 확대) | Production `on` | 강좌별 검수 |

**3-0을 반드시 단독 커밋으로 분리한다.** 주문 로직 추출과 템플릿 추가가 한 커밋에 섞이면
결제 회귀가 생겼을 때 원인을 가를 수 없다 (`component-reuse-plan.md` §2).

## 4. 롤백 절차

| 상황 | 절차 | 소요 |
|---|---|---|
| 특정 강좌 1개만 문제 | 해당 콘텐츠 파일 삭제 또는 `legacyContent: 'visible'`로 복구 → 배포 | 배포 1회 |
| 한 유형 전체 문제 | `BY_PREFIX`에서 해당 접두사 제거 → 배포 | 배포 1회 |
| 전체 문제 (디자인·레이아웃) | Vercel `COURSE_TEMPLATES=off` → 재배포 | env 변경 + 재배포 |
| **주문·결제 이상** | ① `COURSE_TEMPLATES=off` ② Vercel 이전 deployment promote | 즉시 |
| V2 자체 장애 | 운영 kill switch `/etc/nonsulrun/v2.off` → V2 경로 전부 Legacy | 사람 (서버) |

하네스 `GATES.md:314`의 롤백 우선순위를 따른다:
**kill switch → Vercel 이전 deployment promote → vhost backup → Bridge tar backup.**
**DB/데이터 변경을 롤백 수단으로 쓰지 않는다.**

### 캐시 주의

`revalidate = 300`이므로 스위치를 꺼도 **최대 5분간 기존 ISR 캐시가 남는다.**
즉시 반영이 필요하면 재배포(새 빌드 = 새 캐시)한다.
결제 이상 같은 긴급 상황에서는 **Vercel 이전 deployment promote가 가장 빠르다.**

### 롤백 리허설 (템플릿 Gate 6 필수)

1. Preview에서 `COURSE_TEMPLATES=on` → 대표 강좌 3종이 새 템플릿으로 보임을 확인
2. `off`로 바꾸고 재배포 → 같은 URL이 기존 화면으로 돌아옴을 확인
3. 콘텐츠 파일 1개만 지우고 배포 → 그 강좌만 기존 화면, 나머지 2개는 새 템플릿
4. 세 경우 모두 주문 폼 전송 필드가 동일함을 확인 (DevTools Network, **실제 결제는 하지 않는다**)

## 5. 템플릿 Gate 5 기능 회귀 체크리스트

요청서 §9 검증 대상에 대응한다. **기존 화면과 1:1 비교**한다.

| 대상 | 확인 |
|---|---|
| 강좌 URL | `/courses/[id]` 동일. 잘못된 id → 404. 인증 분류 → Legacy redirect |
| 로그인 상태 | 상세페이지 서버 HTML에 로그인 흔적 없음. 헤더만 클라이언트 조회 |
| 장바구니 | **버튼이 없어야 한다** (기존과 동일) |
| 바로구매 | `sw_direct=1`. 전송 필드 스냅샷이 legacy 템플릿과 **완전 일치** |
| 가격·할인 | 금액 값 동일. 취소선은 `listPrice > price`일 때만 (G-05 의도된 차이) |
| 강사 정보 | 데이터 없으면 영역 숨김. **생성 금지** |
| 교재·배송 | 선택옵션(`교재비`)으로만 존재. 카드에 하드코딩 금지 |
| 첨삭 안내 | 데이터 없으면 숨김 |
| 후기·문의·공지 | 목록·쓰기·더보기 링크 동일. `#sit_use`/`#sit_qa` 해시 딥링크 작동 |
| 환불 안내 | copy.md §8 공통 5항목 + `policyUrl` 링크 작동 |
| SEO | `<title>` 동일, canonical 동일, OG 동일, `<h1>`은 D2 결정대로 |
| PC·모바일 | 320/375/390/768/1024/1440px 가로 스크롤 0. 모바일 고정 바가 약관 링크를 가리지 않음 |
| 접근성 | 키보드만으로 CTA·탭·FAQ·커리큘럼 펼치기·합격증 정지 조작. 터치 44px. 대비 AA |
| 빌드·타입·테스트 | `pnpm check` 통과 |
| ISR | 빌드 출력에서 `/courses/[id]`가 ISR (`ƒ`가 아님) |
| Bridge 장애 | mock id `9999`로 확인 — 마지막 성공본 유지 |
| 4가지 상태 | 후기·문의의 loading/정상/빈값/unavailable |

## 6. 템플릿 Gate 7 점진 확대

| 단계 | 대상 | 완료 조건 |
|---|---|---|
| 1 | 인문·수리·약술 대표 각 1개 (3개) | §5 전 항목 통과 |
| 2 | 대표 강좌 검수·수정 | 운영 담당 확인 |
| 3 | 10개로 확대 | 각 강좌 필수 정보 누락 0 |
| 4 | 전체 대상 강좌 | 유형별 일괄 |
| 5 | 신규 강좌 템플릿 자동 선택 | **Resolver가 이미 `ca_id`로 자동 판정한다.** 남는 작업은 콘텐츠 파일 작성 가이드 |
| 6 | 운영 문서·QA 결과 갱신 | `docs/parity/course-detail.md` 신규, `docs/gates/` 기록 |

5단계 메모: 유형 선택은 `ca_id`로 자동이므로 추가 개발이 없다.
단 D1에서 **A안(콘텐츠 파일)을 유지하는 한 신규 강좌마다 코드 배포가 필요하다.**
전체 강좌(39개+) 적용 시점에 B안(Bridge 확장) 이관을 재검토한다 — 그때가 ADR을 쓸 시점이다.

## 7. 운영 영향 없음 보장

| 보장 | 근거 |
|---|---|
| 운영 데이터 변경 0 | 이 레포는 DB에 접속하지 않는다 (AGENTS.md §2 원칙 1). 읽기만 |
| 결제 영향 0 | 폼 전송 필드를 바꾸지 않는다. `cartupdate.php` 이후는 전부 Legacy |
| 가격 변경 0 | `item.price`/`listPrice`를 그대로 표시. 취소선 **표시 조건**만 변경 |
| Apache/PHP 설정 변경 0 | 이 작업에 서버 설정 변경이 없다 |
| Legacy URL 구조 변경 0 | `legacyRoutes` 그대로 |
| 테스트 중 실결제 0 | DevTools Network로 전송값만 확인. submit까지 가지 않는다 |
