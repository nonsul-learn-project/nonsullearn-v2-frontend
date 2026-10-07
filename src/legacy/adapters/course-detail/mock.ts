import basicFixture from '../../../../contracts/bridge/fixtures/course-full.basic.json';
import noOptionsFixture from '../../../../contracts/bridge/fixtures/course-full.no-options.json';
import priceOnInquiryFixture from '../../../../contracts/bridge/fixtures/course-full.price-on-inquiry.json';
import soldOutFixture from '../../../../contracts/bridge/fixtures/course-full.sold-out.json';
import { BridgeError } from '../../client/bridge-error';
import { courseFullResponseSchema, type CourseFull } from '../../contracts/course-full';

import { COURSE_DETAIL_BRIDGE_PATH } from './http';

/**
 * mock 강좌 상세. **데이터를 여기 쓰지 않는다.** `contracts/bridge/fixtures/` 를 읽어
 * zod 로 parse 해서 돌려준다 (contracts/bridge/README.md "단일 원본 규칙" 3).
 *
 * 반환 모양은 http adapter 와 **같다**: 없는 강좌는 `null`, 실패는 `BridgeError` throw.
 *
 * ## 왜 `?course=` 쿼리가 아니라 id 로 고르는가
 *
 * 강좌 목록 mock(`adapters/course/mock.ts`)은 `?course=` 시나리오를 쓴다 (AGENTS.md §5).
 * 상세 페이지는 **그럴 수 없다** — 페이지가 `searchParams` 를 읽는 순간 Next 가 그 라우트를
 * 요청마다 SSR 로 돌리고, AGENTS.md §6.3 이 금지한 `force-dynamic` 과 같아진다
 * (빌드 출력에서 `ƒ` 로 확인). 강좌 상세는 ISR 이어야 한다.
 *
 * 그래서 시나리오를 **id 로 주소화**한다. http adapter 도 id 로 조회하므로 모양이 더 가깝다.
 * 로컬에서 보려면 `/courses/1003` 처럼 들어가면 된다.
 */

/** id → fixture. 각 id 는 해당 fixture 의 `item.id` 와 같다. */
const SCENARIOS = {
  /** 선택옵션 3개(품절 1개 포함), 후기 3건. */
  '1001': basicFixture,
  /** 선택옵션 없음 — 스킨이 옵션 줄을 미리 넣는 분기. */
  '1002': noOptionsFixture,
  /** 품절 — `#sit_ov_soldout`, 주문 버튼 없음. */
  '1003': soldOutFixture,
  /** 전화문의 — 판매가격 행이 "전화문의", 주문 버튼 없음. */
  '1004': priceOnInquiryFixture,
} as const;

/** Bridge 장애를 눈으로 보기 위한 예약 id. 503 을 던진다. */
export const COURSE_DETAIL_MOCK_ERROR_ID = '9999';

export const COURSE_DETAIL_MOCK_IDS = Object.keys(SCENARIOS);

/** fixture 를 한 번만 parse 한다. Contract 를 벗어난 fixture 는 여기서 바로 터진다. */
function load(fixture: unknown): CourseFull {
  const parsed = courseFullResponseSchema.parse(fixture);
  return {
    item: parsed.item,
    options: parsed.options,
    reviewSummary: parsed.reviewSummary,
    form: parsed.form,
  };
}

const loaded = new Map<string, CourseFull>(
  Object.entries(SCENARIOS).map(([id, fixture]) => [id, load(fixture)]),
);

/** 등록되지 않은 id 는 `null` 이다 (Bridge 는 404 로 답한다). */
export function getCourseDetailMock(id: string): CourseFull | null {
  if (id === COURSE_DETAIL_MOCK_ERROR_ID) {
    throw new BridgeError(
      'http',
      COURSE_DETAIL_BRIDGE_PATH,
      `mock 장애 시나리오 (id=${COURSE_DETAIL_MOCK_ERROR_ID})`,
      { status: 503 },
    );
  }
  return loaded.get(id) ?? null;
}
