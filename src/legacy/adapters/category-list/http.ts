import 'server-only';

import { bridgeServerFetch } from '../../client/bridge-server';
import { isBridgeError } from '../../client/bridge-error';
import {
  categoryListResponseSchema,
  type CategoryListResponse,
} from '../../contracts/category-list';

const REVALIDATE = 300;

/** 없는 분류만 404 다. 403(restricted)·503·네트워크·Contract 오류는 전부 throw 한다. */
const missing = (error: unknown) =>
  isBridgeError(error) && error.kind === 'http' && error.status === 404;

/** 없는 분류는 `null`. 그 밖의 실패는 `BridgeError` 를 던진다. */
export async function getCategoryListHttp(
  id: string,
  page = 1,
): Promise<CategoryListResponse | null> {
  const query = new URLSearchParams({ id, page: String(page) });
  try {
    return await bridgeServerFetch({
      path: `/category-list.php?${query.toString()}`,
      schema: categoryListResponseSchema,
      revalidate: REVALIDATE,
    });
  } catch (error) {
    if (missing(error)) return null;
    throw error;
  }
}
