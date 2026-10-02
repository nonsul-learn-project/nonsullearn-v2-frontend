import { describe, expect, it } from 'vitest';

import { legacyRoutes, safeReturnTo } from '@/legacy/handoff/routes';

/**
 * L1 — Handoff (HARNESS.md §3 "legacyRoutes: 인코딩, returnTo 외부 URL 차단").
 * 근거: docs/discovery/legacy-url-map.md
 *
 * 단일 환경 기본값은 Legacy main domain의 absolute URL이다.
 */

const legacyBase = 'https://nonsul-learn.com';

describe('Legacy URL 지도 (docs/discovery/legacy-url-map.md)', () => {
  it.each([
    ['logout', legacyRoutes.logout(), `${legacyBase}/bbs/logout.php`],
    ['register', legacyRoutes.register(), `${legacyBase}/bbs/register.php`],
    ['memberEdit', legacyRoutes.memberEdit(), `${legacyBase}/bbs/member_confirm.php?url=register_form.php`],
    ['myLecture', legacyRoutes.myLecture(), `${legacyBase}/lecture/mypage.php`],
    ['correctionStatus', legacyRoutes.correctionStatus(), `${legacyBase}/bbs/board.php?bo_table=correcting`],
    ['notice', legacyRoutes.notice(), `${legacyBase}/bbs/board.php?bo_table=notice`],
    ['briefing', legacyRoutes.briefing(), `${legacyBase}/bbs/board.php?bo_table=briefing`],
    ['aboutCeo', legacyRoutes.aboutCeo(), `${legacyBase}/ceo_message`],
    ['aboutTeacher', legacyRoutes.aboutTeacher(), `${legacyBase}/teacher`],
    ['aboutCorrection', legacyRoutes.aboutCorrection(), `${legacyBase}/correction.php`],
    ['admin', legacyRoutes.admin(), `${legacyBase}/uAdmin`],
  ])('%s', (_name, actual, expected) => {
    expect(actual).toBe(expected);
  });

  it('courseList 는 ca_id 를 붙인다', () => {
    expect(legacyRoutes.courseList('1010')).toBe(`${legacyBase}/shop/list.php?ca_id=1010`);
  });

  it('courseDetail 은 it_id 를 붙인다', () => {
    expect(legacyRoutes.courseDetail('1001')).toBe(`${legacyBase}/shop/item.php?it_id=1001`);
  });
});

describe('쿼리 인코딩', () => {
  it('returnTo 를 encodeURIComponent 로 인코딩한다', () => {
    expect(legacyRoutes.login('/courses/1?a=b&c=d')).toBe(
      `${legacyBase}/bbs/login.php?url=%2Fcourses%2F1%3Fa%3Db%26c%3Dd`,
    );
  });

  it('한글 경로를 인코딩한다', () => {
    const url = legacyRoutes.login('/강좌');
    expect(url).toBe(`${legacyBase}/bbs/login.php?url=%2F%EA%B0%95%EC%A2%8C`);
    expect(url).not.toContain('강좌');
  });

  it('ca_id 와 it_id 의 특수문자를 인코딩한다', () => {
    expect(legacyRoutes.courseList('10 10&x=1')).toBe(`${legacyBase}/shop/list.php?ca_id=10%2010%26x%3D1`);
    expect(legacyRoutes.courseDetail('a/b')).toBe(`${legacyBase}/shop/item.php?it_id=a%2Fb`);
  });
});

describe('returnTo 외부 URL 차단 (open redirect 방지)', () => {
  it.each([
    'https://evil.test/steal',
    'http://evil.test',
    '//evil.test',
    '/\\evil.test',
    'javascript:alert(1)',
    'data:text/html,<script>1</script>',
    'evil.test',
    '',
  ])('%s 는 / 로 떨어진다', (returnTo) => {
    expect(safeReturnTo(returnTo)).toBe('/');
  });

  it.each([null, undefined])('%s 는 / 로 떨어진다', (returnTo) => {
    expect(safeReturnTo(returnTo)).toBe('/');
  });

  it.each(['/', '/courses/1', '/_v2/check', '/courses/1?x=y#z'])(
    '%s 는 그대로 통과한다',
    (returnTo) => {
      expect(safeReturnTo(returnTo)).toBe(returnTo);
    },
  );

  it('login 링크가 외부 호스트로 나가지 않는다', () => {
    for (const hostile of ['https://evil.test', '//evil.test', '/\\evil.test']) {
      expect(legacyRoutes.login(hostile)).toBe(`${legacyBase}/bbs/login.php?url=%2F`);
    }
  });
});

describe('공개 표면', () => {
  it('Legacy 결제/주문 경로를 만들 수 있는 함수가 없다 (AGENTS.md §9)', () => {
    const names = Object.keys(legacyRoutes);
    for (const forbidden of ['checkout', 'cart', 'order', 'pay', 'payment', 'orderform']) {
      expect(names).not.toContain(forbidden);
    }
  });
});
