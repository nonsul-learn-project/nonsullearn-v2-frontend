# Bridge Contract v1

`/v2-api/*.php` (Thin PHP Bridge) 응답의 **단일 원본**이다.

V2(이 레포)와 Legacy(`nonsul-learn-html1` 레포의 `html2/v2-api/`)가 공유하는 약속이며,
둘 중 하나가 아니라 **이 디렉터리**가 기준이다. 코드와 이 스키마가 다르면 코드를 고친다.

## 파일

| 파일 | 대상 |
|---|---|
| `viewer.v1.schema.json` | `GET /v2-api/viewer.php` |
| `courses-list.v1.schema.json` | `GET /v2-api/courses.php` |
| `course-detail.v1.schema.json` | `GET /v2-api/courses.php?id=<it_id>` |
| `error.v1.schema.json` | 위 두 endpoint 의 4xx/5xx 본문 |
| `fixtures/*.json` | 예시 응답. 하네스와 mock adapter 가 **같은 파일**을 쓴다 |

## 단일 원본 규칙

1. **스키마가 먼저다.** 필드를 바꾸려면 여기를 먼저 고치고, 그 다음 zod(`src/legacy/contracts/`)와
   PHP 를 맞춘다. 반대 방향은 금지다.
2. **zod 와 JSON Schema 의 판정이 같아야 한다.** `tests/contract/bridge-fixtures.test.ts` 가
   모든 fixture 에 대해 두 검증기의 결과가 일치하는지 본다. 한쪽만 고치면 그 테스트가 깨진다.
3. **mock 은 fixture 를 읽는다.** mock adapter 는 데이터를 직접 쓰지 않고 `fixtures/` 에서 읽어
   zod 로 parse 한다. 그래서 mock 이 Contract 를 벗어날 수 없다.
4. **fixture 파일명 접두사 = 스키마 이름.** `courses-list.basic.json` → `courses-list.v1.schema.json`.
   검사기가 이름으로 스키마를 고르므로 접두사를 임의로 바꾸면 안 된다.
5. **`*.invalid.json` 은 거부되어야 하는 응답이다.** 통과하면 그게 실패다.
   Contract 가 막아야 하는 것(개인정보 유출, 절대 URL 이미지)을 음성 증거로 고정한다.
6. `course` 정의는 `courses-list` 와 `course-detail` 에 **중복**되어 있다. 검사기가 로컬 `$ref` 만
   지원해서 의도한 것이다. 한쪽을 고치면 반드시 다른 쪽도 같이 고친다 (테스트가 둘 다 본다).

## 버전 규칙

응답 envelope 은 항상 `{ "v": 1, ... }` 로 시작한다.

| 변경 | `v` | 배포 |
|---|---|---|
| 필드 **추가** | 유지 | 한쪽씩 배포해도 된다. 단, V2 zod 는 `.strict()` 라 **V2 를 먼저** 배포해야 한다 |
| 필드 **삭제**, 타입 변경, 의미 변경 | **증가** | V2 와 PHP 를 **동시에** 바꾼다. 과도기에는 양쪽 버전을 모두 받는 코드가 필요하다 |

`.strict()` / `additionalProperties: false` 때문에 **PHP 가 모르는 필드를 먼저 보내면 V2 가 그 응답을 전부 거부한다.**
필드 추가 순서를 지키는 이유가 이것이다.

## 금지

- 개인 식별 정보 (`mb_id`, 이름, 닉네임, 이메일, 연락처, `mb_level` 같은 raw 권한 숫자)
- 사람마다 다른 값 (회원별 가격, 수강 여부, 진도)
- Legacy 컬럼명 (`it_*`, `ca_*`, `g5_*`) — canonical 이름만 쓴다
- `image` 에 절대 URL — Legacy DB 기준 상대 경로(`/data/item/...`)만 담는다.
  호스트 결합은 V2 의 `legacyAssetUrl()` 이 한다

## 검사

```bash
pnpm contract:fixtures                     # 오프라인. 정상 7개 통과, 거부 3개 거부 확인
BASE=https://nonsul-learn.com pnpm bridge:check   # 운영 실응답 (사람이 실행)
SMOKE_PHPSESSID=<세션> BASE=... pnpm bridge:check  # 로그인 viewer 까지
```

`BASE` 는 사이트 루트(`https://nonsul-learn.com`)와 Bridge 경로
(`https://nonsul-learn.com/v2-api`) 를 모두 받는다. 검사기가 `/v2-api` 를 알아서 붙인다.
