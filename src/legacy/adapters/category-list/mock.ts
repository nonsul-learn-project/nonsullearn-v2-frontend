import basicFixture from '../../../../contracts/bridge/fixtures/course-full.basic.json';
import noOptionsFixture from '../../../../contracts/bridge/fixtures/course-full.no-options.json';
import mathFixture from '../../../../contracts/bridge/fixtures/course-full.mock-math.json';
import shortAnswerFixture from '../../../../contracts/bridge/fixtures/course-full.mock-short-answer.json';
import { courseFullResponseSchema } from '../../contracts/course-full';
import type { CategoryListItem, CategoryListResponse } from '../../contracts/category-list';

const full = [basicFixture, noOptionsFixture, mathFixture, shortAnswerFixture].map((fixture) => courseFullResponseSchema.parse(fixture));
const itemsByCategory: Record<string, CategoryListItem[]> = {};

for (const entry of full) {
  const item: CategoryListItem = {
    id: entry.item.id, name: entry.item.name, basicHtml: entry.item.basic, image: entry.item.images[0] ?? null,
    price: entry.item.price, listPrice: entry.item.listPrice, priceOnInquiry: entry.item.priceOnInquiry,
    soldOut: entry.item.soldOut, averageScore: entry.reviewSummary.averageScore, star: entry.reviewSummary.averageScore === null ? 0 : Math.round(entry.reviewSummary.averageScore),
    badges: { hit: false, recommend: false, new: false, popular: false, discount: false, coupon: false },
  };
  const key = entry.item.category.id.slice(0, 4);
  (itemsByCategory[key] ??= []).push(item);
}

const names: Record<string, string> = { '1010': '인문논술', '3020': '수리논술', '4010': '약술형논술' };
const PAGE_SIZE = 1;

/** Development-only catalog: only IDs with a matching course-full fixture are linked. */
export function getCategoryListMock(id: string, page = 1): CategoryListResponse {
  const items = itemsByCategory[id] ?? [];
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  return {
    v: 1,
    category: { id, name: names[id] ?? '개발용 미지원 분류', headHtml: '', tailHtml: '', skin: 'list.10.skin.php', customHeadInclude: false, customTailInclude: false },
    pagination: { page, perPage: PAGE_SIZE, totalCount: items.length, totalPages, pagesShown: 10 },
    items: page >= 1 && page <= Math.max(totalPages, 1) ? items.slice(start, start + PAGE_SIZE) : [],
  };
}
