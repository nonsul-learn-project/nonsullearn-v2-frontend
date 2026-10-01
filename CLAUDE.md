# CLAUDE.md

@AGENTS.md

이 파일은 Claude Code 전용 보충 규칙이다. 프로젝트 규칙의 본문은 위에서 import한 `AGENTS.md`이며, 충돌 시 `AGENTS.md`가 우선한다.

---

## 작업 시작 전

- 요청이 어느 Gate에 속하는지 `docs/GATES.md`에서 확인하고, 그 Gate의 DoD를 기준으로 작업한다.
- 다음에 해당하면 **코드를 쓰기 전에 계획을 먼저 제시**하고 확인을 받는다.
  - `src/legacy/contracts/` 변경 (Contract 추가/수정)
  - `middleware.ts`, `env.*.ts`, `next.config.*` 변경
  - 의존성 추가
  - 하네스(`tests/`, `scripts/smoke-prod.sh`) 기준 변경
- 단순 UI, 문구, 스타일 작업은 바로 진행한다.

## 작업 중

- 새 Legacy 데이터는 `AGENTS.md` §7.1 순서를 그대로 따른다. **테스트를 먼저 쓰고 실패를 확인한 뒤** Adapter를 구현한다.
- Legacy PHP의 실제 동작을 추측해서 Contract를 만들지 않는다. 확인되지 않은 필드는 `// TBD(legacy):` 주석과 함께 optional로 두고 사용자에게 확인을 요청한다.
- Legacy 코드를 참고해야 하면 사용자에게 `nonsul-learn-html1` 레포의 해당 파일을 요청한다. 운영 서버를 직접 조회하는 명령을 실행하지 않는다.
- 파일이 많은 탐색(전체 grep 등)은 이 레포 안에서만 한다.

## 실행해도 되는 것 / 안 되는 것

| 실행 가능 | 실행 금지 (명령 제안만) |
|---|---|
| `pnpm` 스크립트 전부 (`smoke:prod` 제외) | `ssh`, `scp`, `rsync` 운영 서버 대상 |
| 로컬 `git` (commit, branch) | `git push` to `main`, force push |
| Playwright (로컬 dev 서버 대상) | `pnpm smoke:prod`, 운영 도메인 대상 반복 요청 |
| 의존성 설치 (계획 승인 후) | Vercel CLI로 production 배포/env 변경 |

## 작업 종료 전 (필수)

1. `pnpm check` 실행, 전부 통과 확인. 실패하면 고친 뒤 다시 실행한다. 통과하지 못하면 "완료"라고 보고하지 않는다.
2. `AGENTS.md` §10 Task DoD 체크리스트를 스스로 점검한다.
3. 보고에 포함할 것:
   - 변경 요약 (파일 단위 아님, 기능 단위)
   - 실행한 검증과 결과
   - 사람이 해야 할 후속 작업 (Bridge PHP 수정, Vercel env 등록, 운영 스모크 등)
   - 관련 Gate와 해당 DoD 항목 진척

## 자주 하는 실수 (하지 말 것)

- Server Component에서 viewer를 조회해서 로그인 상태를 서버 HTML에 넣는 것 → 캐시 오염
- `fetch('/v2-api/...')`를 컴포넌트에 직접 쓰는 것 → Adapter 경유
- 테스트가 실패할 때 fixture를 고쳐서 통과시키는 것 → Contract가 바뀐 건지 먼저 확인하고 보고
- `href="/bbs/login.php"` 하드코딩 → `legacyRoutes.login(pathname)`
- 에러 시 `throw`로 페이지 전체를 실패시키는 것 → `unavailable` 상태