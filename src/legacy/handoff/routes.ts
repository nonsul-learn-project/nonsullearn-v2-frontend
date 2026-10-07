import { clientEnv } from '@/env.client';

/**
 * Legacy PHP로 가는 모든 링크의 단일 출처.
 *
 * 근거: `docs/discovery/legacy-url-map.md` (상태 DONE-BASELINE).
 * AGENTS.md §7.3: 문자열 URL 하드코딩 금지. 이 파일 밖에서 Legacy 경로를 쓰지 않는다.
 *
 * `NEXT_PUBLIC_LEGACY_BASE_URL`이 빈 문자열이면 결과도 상대경로가 된다.
 * 운영은 Apache 정문이 같은 도메인이므로 그게 정답이다.
 */

const base = clientEnv.NEXT_PUBLIC_LEGACY_BASE_URL;

function legacyUrl(path: string, query?: Record<string, string>): string {
  const search =
    query === undefined
      ? ''
      : `?${Object.entries(query)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&')}`;
  return `${base}${path}${search}`;
}

/**
 * 로그인 후 복귀 경로를 안전한 값으로 좁힌다.
 *
 * open redirect를 막는 것이 목적이다. `/`로 시작하는 **경로**만 허용하고,
 * `//evil.test`(protocol-relative URL)와 `/\evil.test`처럼 브라우저가 호스트로 해석하는
 * 모양도 거부한다. 거부하면 홈(`/`)으로 돌려보낸다.
 */
export function safeReturnTo(returnTo: string | null | undefined): string {
  if (typeof returnTo !== 'string' || returnTo.length === 0) return '/';
  if (!returnTo.startsWith('/')) return '/';
  // `//host` 와 `/\host` 는 경로가 아니라 다른 origin 으로 해석된다.
  if (returnTo.startsWith('//') || returnTo.startsWith('/\\')) return '/';
  return returnTo;
}

export const legacyRoutes = {
  /** 로그인. 현재 경로를 복귀 파라미터로 넘긴다 (AGENTS.md §7.3). */
  login: (returnTo?: string | null): string =>
    legacyUrl('/bbs/login.php', { url: safeReturnTo(returnTo) }),

  logout: (): string => legacyUrl('/bbs/logout.php'),

  register: (): string => legacyUrl('/bbs/register.php'),

  /** 정보수정. Legacy가 비밀번호 재확인을 먼저 요구한다. */
  memberEdit: (): string => legacyUrl('/bbs/member_confirm.php', { url: 'register_form.php' }),

  myLecture: (): string => legacyUrl('/lecture/mypage.php'),

  /** 첨삭제출현황. `capabilities.correction`이 true일 때만 노출한다. */
  correctionStatus: (): string => legacyUrl('/bbs/board.php', { bo_table: 'correcting' }),

  notice: (): string => legacyUrl('/bbs/board.php', { bo_table: 'notice' }),
  learningFaq: (): string => legacyUrl('/bbs/faq.php', { fm_id: '1' }),
  terms: (): string => legacyUrl('/bbs/content.php', { co_id: 'provision' }),
  privacy: (): string => legacyUrl('/bbs/content.php', { co_id: 'privacy' }),
  businessInfo: (): string => legacyUrl('/kyhinfo.php'),

  /** 현장강의설명회. */
  briefing: (): string => legacyUrl('/bbs/board.php', { bo_table: 'briefing' }),

  /** 강좌 목록. `caId`는 강사별 분류 번호 (예: 인문논술 김윤환 1010). */
  courseList: (caId: string): string => legacyUrl('/shop/list.php', { ca_id: caId }),

  /** 강좌 상세. */
  courseDetail: (itId: string): string => legacyUrl('/shop/item.php', { it_id: itId }),

  /**
   * 장바구니/바로구매 처리. `shop/item.php` 의 `<form action>` 과 같은 곳이다.
   *
   * **Bridge 가 이 경로를 `form.action` 으로 같이 준다.** 상세 페이지는 Bridge 값을 쓰고,
   * 이 함수는 Bridge 를 못 받았을 때의 기준값이자 Legacy URL 단일 출처 역할이다.
   */
  cartUpdate: (): string => legacyUrl('/shop/cartupdate.php'),

  /** 강의후기 목록. 상세 페이지의 "더 보기"가 여기로 보낸다. */
  courseReviews: (itId: string): string => legacyUrl('/shop/itemuse.php', { it_id: itId }),

  /** 강의문의 목록. */
  courseQuestions: (itId: string): string => legacyUrl('/shop/itemqa.php', { it_id: itId }),

  /** 강의후기 쓰기. Legacy 가 새 창(810x680)으로 띄우며 로그인 여부를 거기서 본다. */
  courseReviewForm: (itId: string): string =>
    legacyUrl('/shop/itemuseform.php', { it_id: itId }),

  /** 강의문의 쓰기. */
  courseQuestionForm: (itId: string): string =>
    legacyUrl('/shop/itemqaform.php', { it_id: itId }),

  /** 상품 원본 이미지 팝업. `no` 는 1부터 시작하는 이미지 순번이다. */
  courseLargeImage: (itId: string, no: number): string =>
    legacyUrl('/shop/largeimage.php', { it_id: itId, no: String(no) }),

  aboutCeo: (): string => legacyUrl('/ceo_message'),
  aboutTeacher: (): string => legacyUrl('/teacher'),
  aboutCorrection: (): string => legacyUrl('/correction.php'),

  /** 관리자. `capabilities.admin`이 true일 때만 노출한다. */
  admin: (): string => legacyUrl('/uAdmin'),
} as const;

export type LegacyRoutes = typeof legacyRoutes;
