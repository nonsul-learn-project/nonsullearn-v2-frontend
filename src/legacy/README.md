# legacy — Legacy Integration Boundary

이 레포에서 Legacy PHP와 닿는 **유일한** 지점이다. AGENTS.md §2/§7 전체가 이 폴더에 적용된다.

```text
contracts/          zod schema + 타입. Bridge 응답의 약속
contracts/fixtures/ Contract 예시 JSON. mock adapter / L1 / L4 가 같은 파일을 쓴다 (HARNESS.md §2)
client/             bridge-fetch.ts (브라우저), bridge-server.ts (서버)
adapters/           <contract>/{http,mock,index}.ts — Contract를 채우는 구현
handoff/routes.ts   Legacy URL 단일 출처
index.ts            ★ 유일한 공개 API. 여기 export된 것만 밖에서 쓸 수 있다
```

밖에서는 `@/legacy`만 import한다. 내부 경로 직접 import는 ESLint가 막는다.
Legacy 명명(`mb_*`, `it_*`, `g5_*`)과 Legacy URL 문자열은 이 폴더 밖으로 나가지 않는다.
