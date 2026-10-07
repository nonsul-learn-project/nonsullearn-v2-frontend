import { assertHostedBridgeConfigured, serverEnv } from '@/env.server';

import type { CategoryListResponse } from '../../contracts/category-list';

import { getCategoryListHttp } from './http';

/**
 * 분류 목록 조회. `adapters/public-pages` 와 같은 방식이다 — 서버 전용이고
 * Preview/Production 은 http adapter 만 쓴다.
 *
 * 로컬·CI 에는 Bridge 가 없으므로 fixture 를 돌려준다.
 */
const shouldUseMock = () => {
  assertHostedBridgeConfigured();
  return (
    serverEnv.VERCEL_ENV === 'development' &&
    (serverEnv.COURSE_SOURCE === 'mock' || serverEnv.LEGACY_BRIDGE_BASE === undefined)
  );
};

/** 없는 분류는 `null`. 403·503·네트워크·Contract 오류는 `BridgeError` 를 던진다. */
export async function getCategoryList(
  id: string,
  page = 1,
): Promise<CategoryListResponse | null> {
  if (shouldUseMock()) {
    const { categoryListResponseSchema } = await import('../../contracts/category-list');
    const fixture = await import('../../../../contracts/bridge/fixtures/category-list.basic.json');
    const parsed = categoryListResponseSchema.parse(fixture.default);
    return { ...parsed, category: { ...parsed.category, id } };
  }
  return getCategoryListHttp(id, page);
}
