import { describe, expect, it } from 'vitest';

import {
  toViewerState,
  VIEWER_CONTRACT_VERSION,
  viewerResponseSchema,
} from '@/legacy/contracts/viewer';

/**
 * L1 — Viewer Contract v1 (HARNESS.md §3).
 * 근거: docs/discovery/viewer-contract-v1.md, docs/decisions/0003-viewer-no-display-name.md
 */

const member = {
  v: 1,
  authenticated: true,
  capabilities: { correction: false, admin: false },
} as const;

describe('버전', () => {
  it('v 는 z.literal(1) 이다', () => {
    expect(VIEWER_CONTRACT_VERSION).toBe(1);
    expect(viewerResponseSchema.safeParse({ v: 1, authenticated: false }).success).toBe(true);
    expect(viewerResponseSchema.safeParse({ v: 2, authenticated: false }).success).toBe(false);
    expect(viewerResponseSchema.safeParse({ authenticated: false }).success).toBe(false);
  });
});

describe('.strict() — 알 수 없는 필드를 거부한다', () => {
  it.each([
    'mb_id',
    'mb_email',
    'mb_hp',
    'mb_password',
    'mb_level',
    'mb_name',
    'mb_point',
    'is_admin',
    'displayName',
    'sessionId',
    'PHPSESSID',
  ])('금지 필드 %s 가 있으면 parse 실패한다', (field) => {
    expect(viewerResponseSchema.safeParse({ ...member, [field]: 'x' }).success).toBe(false);
  });

  it('capabilities 안에 알 수 없는 필드가 있으면 실패한다', () => {
    expect(
      viewerResponseSchema.safeParse({
        ...member,
        capabilities: { correction: false, admin: false, mb_level: 8 },
      }).success,
    ).toBe(false);
  });

  it('비로그인 응답에 capabilities 를 붙이면 실패한다', () => {
    expect(
      viewerResponseSchema.safeParse({
        v: 1,
        authenticated: false,
        capabilities: { correction: false, admin: false },
      }).success,
    ).toBe(false);
  });
});

describe('개인 식별 정보 필드가 schema 에 없다 (AGENTS.md §7.2)', () => {
  it('로그인 응답의 키는 v, authenticated, capabilities 뿐이다', () => {
    const parsed = viewerResponseSchema.parse(member);
    expect(Object.keys(parsed).sort()).toEqual(['authenticated', 'capabilities', 'v']);
  });

  it('capabilities 의 키는 correction, admin 뿐이다', () => {
    const parsed = viewerResponseSchema.parse(member);
    expect(parsed.authenticated).toBe(true);
    if (!parsed.authenticated) throw new Error('unreachable');
    expect(Object.keys(parsed.capabilities).sort()).toEqual(['admin', 'correction']);
  });
});

describe('필수 필드', () => {
  it('로그인 응답에 capabilities 가 없으면 실패한다', () => {
    expect(viewerResponseSchema.safeParse({ v: 1, authenticated: true }).success).toBe(false);
  });

  it('capabilities 값은 boolean 이어야 한다', () => {
    expect(
      viewerResponseSchema.safeParse({
        ...member,
        capabilities: { correction: 'yes', admin: false },
      }).success,
    ).toBe(false);
  });

  it('authenticated 는 boolean literal 로 분기한다', () => {
    expect(viewerResponseSchema.safeParse({ v: 1, authenticated: 'false' }).success).toBe(false);
  });
});

describe('toViewerState', () => {
  it('비로그인은 anonymous 다', () => {
    expect(toViewerState(viewerResponseSchema.parse({ v: 1, authenticated: false }))).toEqual({
      status: 'anonymous',
    });
  });

  it('일반 회원은 member 이고 권한이 모두 false 다', () => {
    expect(toViewerState(viewerResponseSchema.parse(member))).toEqual({
      status: 'member',
      can: { correction: false, admin: false },
    });
  });

  it('첨삭 권한을 can.correction 으로 옮긴다', () => {
    const state = toViewerState(
      viewerResponseSchema.parse({
        v: 1,
        authenticated: true,
        capabilities: { correction: true, admin: false },
      }),
    );
    expect(state).toEqual({ status: 'member', can: { correction: true, admin: false } });
  });

  it('관리자 권한을 can.admin 으로 옮긴다', () => {
    const state = toViewerState(
      viewerResponseSchema.parse({
        v: 1,
        authenticated: true,
        capabilities: { correction: true, admin: true },
      }),
    );
    expect(state).toEqual({ status: 'member', can: { correction: true, admin: true } });
  });
});
