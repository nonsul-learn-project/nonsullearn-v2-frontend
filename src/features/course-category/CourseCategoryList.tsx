import Image from 'next/image';

import { legacyAssetUrl, legacyRoutes, type CategoryListResponse } from '@/legacy';
import { formatPrice } from '@/lib/format';
import { sanitizeLegacyHtml } from '@/lib/sanitize-legacy-html';

/**
 * Legacy `shop/list.php` + `skin/shop/basic/list.10.skin.php` 를 그대로 옮긴 것.
 *
 * 출력 순서는 `list.php` 와 같다:
 *   `#sct_hhtml` → 히어로 → 검색바 → `ul.lists-row` → `nav.pg_wrap` → `#sct_thtml`
 *
 * 태그·class 는 스킨 파일 기준이다 (AGENTS.md §9 "Gate 6 이전 리디자인 금지").
 * 정렬 UI 와 하위 분류 탭은 Legacy 스킨에도 없어서 만들지 않는다.
 */

export interface CourseCategoryListProps {
  data: CategoryListResponse;
}

export function CourseCategoryList({ data }: CourseCategoryListProps) {
  const { category, pagination, items } = data;
  const headHtml = sanitizeLegacyHtml(category.headHtml);
  const tailHtml = sanitizeLegacyHtml(category.tailHtml);

  return (
    <>
      {/* list.php:70 — 값이 비어도 빈 div 가 나간다. */}
      <div id="sct_hhtml" dangerouslySetInnerHTML={{ __html: headHtml }} />

      {/* 히어로 — list.10.skin.php:15-30 */}
      <div className="position-relative overflow-hidden text-center text-white py-5 mb-5 shop_hero_section">
        <div className="hero_overlay" />
        <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 opacity-25 pointer-events-none" />

        <div className="container position-relative z-1 py-4" data-aos="fade-up">
          <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill fs-7 text-uppercase mb-3 shadow-sm">
            {category.name}
          </span>
          <h1 className="display-5 fw-extrabold mt-2 mb-3 text-white">합격을 만드는 모든 콘텐츠</h1>
          <p
            className="fs-6 text-light opacity-75 max-w-2xl mx-auto mb-0"
            style={{ wordBreak: 'keep-all' }}
          >
            수험생의 현재 위치를 정확히 진단하고 최적의 합격 로드맵을 제시합니다.
          </p>
        </div>
      </div>

      {/* 검색바 — list.10.skin.php:33-47. Legacy search.php 로 GET 한다. */}
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <form
              name="nisearch"
              method="get"
              action={legacyRoutes.courseSearch()}
              className="d-flex gap-2 p-2 bg-light rounded-pill shadow-sm border"
            >
              <input type="hidden" name="ca_id" value={category.id} />
              <input
                type="text"
                name="q"
                defaultValue=""
                placeholder="원하시는 강의나 교재를 검색해보세요."
                required
                className="form-control border-0 bg-transparent px-3 shadow-none"
                aria-label="강의 검색"
              />
              <button
                type="submit"
                className="btn btn-dark px-4 rounded-pill fw-bold text-nowrap"
              >
                <i className="fa fa-search me-1" aria-hidden="true" /> 검색
              </button>
            </form>
          </div>
        </div>
        <div style={{ height: '20px' }} />
      </div>

      {/* 상품 목록 — list.10.skin.php:57-130 */}
      {items.length === 0 ? (
        <p className="sct_noitem">등록된 강의가 없습니다.</p>
      ) : (
        <ul className="lists-row">
          {items.map((item) => {
            const href = legacyRoutes.courseDetail(item.id);
            return (
              <li className="sct_li" data-it_id={item.id} key={item.id}>
                <div className="sct_img">
                  <a href={href}>
                    {item.image === null ? null : (
                      <Image
                        src={legacyAssetUrl(item.image)}
                        alt={item.name}
                        width={500}
                        height={500}
                        unoptimized
                      />
                    )}
                  </a>

                  {item.soldOut && (
                    <span className="shop_icon_soldout">
                      <span className="soldout_txt">SOLD OUT</span>
                    </span>
                  )}
                </div>

                <div className="sct_ct_wrap">
                  {/* Legacy `if ($this->view_star && $star_score)` — 0 이면 그리지 않는다. */}
                  {item.star !== null && item.star > 0 && (
                    <div className="sct_star">
                      <span className="sound_only">고객평점</span>
                      <Image
                        src={legacyAssetUrl(`/shop/img/s_star${item.star}.png`)}
                        alt={`별점 ${item.star}점`}
                        className="sit_star"
                        width={90}
                        height={18}
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="sct_txt">
                    <a href={href}>{item.name}</a>
                  </div>

                  {item.basicHtml !== '' && (
                    <div
                      className="sct_basic"
                      dangerouslySetInnerHTML={{ __html: sanitizeLegacyHtml(item.basicHtml) }}
                    />
                  )}

                  <div className="sct_bottom">
                    <div className="sct_cost">
                      {/* Legacy `display_price(get_price($row), $row['it_tel_inq'])` */}
                      {item.priceOnInquiry
                        ? '전화문의'
                        : item.price === null
                          ? ''
                          : formatPrice(item.price)}
                      {/* `if ($row['it_cust_price'])` — 값이 없으면 span 자체가 없다. */}
                      {item.listPrice !== null && item.listPrice > 0 && (
                        <span className="sct_dict">{formatPrice(item.listPrice)}</span>
                      )}
                    </div>

                    <div className="sct_op_btn">
                      <div className="sit_icon_li">
                        {/* Legacy item_icon() — shop.lib.php:1466 */}
                        <span className="sit_icon">
                          {item.badges.hit && <span className="shop_icon shop_icon_1">히트</span>}
                          {item.badges.recommend && (
                            <span className="shop_icon shop_icon_2">추천</span>
                          )}
                          {item.badges.new && <span className="shop_icon shop_icon_3">최신</span>}
                          {item.badges.popular && (
                            <span className="shop_icon shop_icon_4">인기</span>
                          )}
                          {item.badges.discount && (
                            <span className="shop_icon shop_icon_5">할인</span>
                          )}
                          {item.badges.coupon && (
                            <span className="shop_icon shop_icon_coupon">쿠폰</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <CategoryPaging categoryId={category.id} pagination={pagination} />

      {/* list.php:122 */}
      <div id="sct_thtml" dangerouslySetInnerHTML={{ __html: tailHtml }} />
    </>
  );
}

/**
 * Legacy `get_paging_nn()` (`common.lib.php:65-113`) 을 그대로 옮긴 것.
 *
 * V2 는 항상 1페이지만 렌더하므로 번호는 **Legacy 주소**로 보낸다.
 * `nav.pg_wrap` 은 번호가 하나도 없으면 아예 나오지 않는다 (`if ($str)`).
 */
function CategoryPaging({
  categoryId,
  pagination,
}: {
  categoryId: string;
  pagination: CategoryListPaginationProp;
}) {
  const { page, totalPages, pagesShown } = pagination;
  const startPage = Math.floor((page - 1) / pagesShown) * pagesShown + 1;
  const endPage = Math.min(startPage + pagesShown - 1, totalPages);

  const href = (n: number) => legacyRoutes.courseListPage(categoryId, n);

  const numbers: number[] = [];
  if (totalPages > 1) {
    for (let k = startPage; k <= endPage; k += 1) numbers.push(k);
  }

  const hasFirst = page > 1;
  const hasPrevGroup = startPage > 1;
  const hasNextGroup = totalPages > endPage;
  const hasLast = page < totalPages;

  if (!hasFirst && !hasPrevGroup && numbers.length === 0 && !hasNextGroup && !hasLast) {
    return null;
  }

  return (
    <nav className="pg_wrap">
      {hasFirst && (
        <a href={href(1)} className="pg_page pg_start" title="처음 페이지">
          <i className="fa fa-angle-double-left" aria-hidden="true" />
          <span className="sound_only">처음</span>
        </a>
      )}
      {hasPrevGroup && (
        <a href={href(startPage - 1)} className="pg_page pg_prev" title="이전 페이지">
          <i className="fa fa-angle-left" aria-hidden="true" />
          <span className="sound_only">이전</span>
        </a>
      )}
      {numbers.map((n) =>
        n === page ? (
          <strong className="pg_current" key={n}>
            {n}
            <span className="sound_only">열린 페이지</span>
          </strong>
        ) : (
          <a href={href(n)} className="pg_page" key={n}>
            {n}
          </a>
        ),
      )}
      {hasNextGroup && (
        <a href={href(endPage + 1)} className="pg_page pg_next" title="다음 페이지">
          <i className="fa fa-angle-right" aria-hidden="true" />
          <span className="sound_only">다음</span>
        </a>
      )}
      {hasLast && (
        <a href={href(totalPages)} className="pg_page pg_end" title="맨끝 페이지">
          <i className="fa fa-angle-double-right" aria-hidden="true" />
          <span className="sound_only">맨끝</span>
        </a>
      )}
    </nav>
  );
}

type CategoryListPaginationProp = CategoryListResponse['pagination'];
