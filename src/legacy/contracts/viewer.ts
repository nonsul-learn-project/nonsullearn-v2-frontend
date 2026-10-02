import { z } from 'zod';

/**
 * Viewer Contract v1 — 로그인 상태와 권한만.
 *
 * **단일 원본은 `contracts/bridge/viewer.v1.schema.json` 이다.** 이 파일은 그 스키마의 zod 사본이며,
 * `tests/contract/bridge-fixtures.test.ts` 가 두 검증기의 판정이 fixture 전체에서 일치하는지 본다.
 * Gate 3 에서 대조한 결과 이 schema 는 Contract 와 이미 같았다 (바꾼 것 없음).
 *
 * 근거: `docs/discovery/viewer-contract-v1.md` (상태 DONE), `docs/discovery/decisions-needed.md` #10.
 *
 * `displayName`은 **일부러 없다.** Legacy Header가 이름을 쓰지 않으므로 넣을 이유가 없고,
 * 넣으면 불필요한 개인정보가 캐시 불가 응답에 실려 나간다 (ADR 0003).
 *
 * canonical 필드와 Legacy 원본의 대응:
 *   authenticated            ← `$member['mb_id']` 값이 있으면 true
 *   capabilities.correction  ← `$member['mb_level'] > 7`
 *   capabilities.admin       ← `$is_admin` truthy
 *
 * 금지 필드: `mb_id`, 이메일, 연락처, 이름, 포인트, session ID.
 * `.strict()`가 그것들을 포함한 모든 미지의 필드를 거부한다.
 */

export const VIEWER_CONTRACT_VERSION = 1;

const capabilitiesSchema = z
  .object({
    /** 첨삭 제출 현황을 볼 수 있는가 (Legacy `mb_level > 7`). */
    correction: z.boolean(),
    admin: z.boolean(),
  })
  .strict();

export const viewerResponseSchema = z.discriminatedUnion('authenticated', [
  z
    .object({
      v: z.literal(VIEWER_CONTRACT_VERSION),
      authenticated: z.literal(false),
    })
    .strict(),
  z
    .object({
      v: z.literal(VIEWER_CONTRACT_VERSION),
      authenticated: z.literal(true),
      capabilities: capabilitiesSchema,
    })
    .strict(),
]);

export type ViewerResponse = z.infer<typeof viewerResponseSchema>;
export type ViewerCapabilities = z.infer<typeof capabilitiesSchema>;

/**
 * UI가 쓰는 viewer 상태. AGENTS.md §6.4의 4가지 상태를 타입으로 강제한다.
 *
 * `unavailable`은 예외가 아니라 상태다. Bridge가 죽어도 사이트는 비로그인처럼 보여야 한다.
 * AGENTS.md §6.4: 권한 판단은 `can.*`만 쓴다. UI에서 level 숫자를 비교하지 않는다.
 */
export type ViewerState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'member'; can: { correction: boolean; admin: boolean } }
  | { status: 'unavailable' };

/** 검증된 Bridge 응답을 UI 상태로 옮긴다. */
export function toViewerState(response: ViewerResponse): ViewerState {
  if (!response.authenticated) return { status: 'anonymous' };
  return {
    status: 'member',
    can: {
      correction: response.capabilities.correction,
      admin: response.capabilities.admin,
    },
  };
}
