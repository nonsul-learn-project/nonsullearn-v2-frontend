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

  /** 현장강의설명회. */
  briefing: (): string => legacyUrl('/bbs/board.php', { bo_table: 'briefing' }),

  /** 강좌 목록. `caId`는 강사별 분류 번호 (예: 인문논술 김윤환 1010). */
  courseList: (caId: string): string => legacyUrl('/shop/list.php', { ca_id: caId }),

  /** 강좌 상세. */
  courseDetail: (itId: string): string => legacyUrl('/shop/item.php', { it_id: itId }),

  aboutCeo: (): string => legacyUrl('/ceo_message'),
  aboutTeacher: (): string => legacyUrl('/teacher'),
  aboutCorrection: (): string => legacyUrl('/correction.php'),

  /** 관리자. `capabilities.admin`이 true일 때만 노출한다. */
  admin: (): string => legacyUrl('/uAdmin'),
} as const;

export type LegacyRoutes = typeof legacyRoutes;
