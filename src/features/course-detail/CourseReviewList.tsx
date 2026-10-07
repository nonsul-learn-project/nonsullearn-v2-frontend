'use client';

import Image from 'next/image';
import { useState } from 'react';

import { legacyAssetUrl, legacyRoutes, type CourseReviewsState } from '@/legacy';
import { formatLegacyListDate } from '@/lib/format';

import {
  accordionBodyStyle,
  cardStyle,
  emptyStyle,
  listHeaderStyle,
  listHeadingStyle,
  replyBlockStyle,
  toggleButtonStyle,
  writeButtonStyle,
} from './legacy-inline-styles';

/**
 * Legacy `skin/shop/basic/itemuse.skin.php` 를 그대로 옮긴 것.
 *
 * Legacy 와 다른 점 두 가지는 둘 다 **소유권 경계** 때문이다 (AGENTS.md §3):
 *
 *   1. 수정/삭제 버튼이 없다. `$is_admin || $row['mb_id'] == $member['mb_id']` 로 갈리는
 *      회원 전용 쓰기 기능이고, V2 는 쓰기를 구현하지 않는다. Bridge 도 `mb_id` 를 주지 않는다.
 *   2. 페이지 번호(`itemuse_page()`)가 없다. 대신 "더 보기"가 Legacy `itemuse.php` 로 보낸다.
 *      Legacy 는 jQuery `$("#itemuse").load(...)` 로 부분 교체하는데, 그건 PHP 조각 HTML 을
 *      그대로 끼워 넣는 방식이라 V2 에서 재현할 수 없다.
 *
 * AGENTS.md §6.4 4가지 상태를 모두 처리한다: loading / 정상 / 빈 값 / unavailable.
 */

export interface CourseReviewListProps {
  courseId: string;
  state: CourseReviewsState;
}

export function CourseReviewList({ courseId, state }: CourseReviewListProps) {
  /** 열린 카드의 index. Legacy 는 하나만 열어 두고 나머지를 `slideUp()` 한다. */
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="sit_use_list" style={{ marginTop: '20px' }}>
      <div style={listHeaderStyle}>
        <h3 style={listHeadingStyle}>수강생 강의후기</h3>
        <div id="sit_use_wbtn">
          {/* Legacy 는 `window.open(..., 810x680)` 으로 띄운다. 로그인 판단은 Legacy 가 한다. */}
          <a
            href={legacyRoutes.courseReviewForm(courseId)}
            className="btn02 itemuse_form"
            target="_blank"
            rel="noreferrer"
            style={writeButtonStyle}
          >
            강의후기 쓰기<span className="sound_only"> 새 창</span>
          </a>
        </div>
      </div>

      {state.status === 'loading' && (
        // 서버 렌더에서는 이 상태로 오지 않는다. 클라이언트 재조회를 붙일 때를 위한 분기다.
        <p className="sit_empty" style={emptyStyle}>
          강의후기를 불러오는 중입니다.
        </p>
      )}

      {state.status === 'unavailable' && (
        <p className="sit_empty" style={emptyStyle}>
          강의후기를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {state.status === 'ready' && state.items.length === 0 && (
        // Legacy `itemuse.skin.php:100`
        <p className="sit_empty" style={emptyStyle}>
          등록된 강의후기가 없습니다.
        </p>
      )}

      {state.status === 'ready' && state.items.length > 0 && (
        <ol id="sit_use_ol">
          {state.items.map((review, index) => {
            const isOpen = open === index;
            return (
              <li key={review.id} className="sit_use_li" style={cardStyle}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '15px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '6px',
                      }}
                    >
                      <Image
                        src={legacyAssetUrl(`/shop/img/s_star${review.score}.png`)}
                        alt={`별${review.score}개`}
                        width={85}
                        height={17}
                        unoptimized
                      />
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>|</span>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {review.authorName}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>&bull;</span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        <i className="fa fa-clock-o" aria-hidden="true" />{' '}
                        {formatLegacyListDate(review.createdAt)}
                      </span>
                    </div>
                    <div
                      className="sit_use_tit"
                      style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}
                    >
                      {review.subject}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="sit_use_li_title"
                    style={toggleButtonStyle}
                    aria-expanded={isOpen}
                    aria-controls={`sit_use_con_${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    내용보기 <i className="fa fa-caret-down" aria-hidden="true" />
                  </button>
                </div>

                <div
                  id={`sit_use_con_${index}`}
                  className={isOpen ? 'sit_use_con is_open' : 'sit_use_con'}
                  style={accordionBodyStyle}
                >
                  <div
                    className="sit_use_p"
                    style={{ lineHeight: 1.6, color: '#334155' }}
                    dangerouslySetInnerHTML={{ __html: review.contentHtml }}
                  />

                  {review.reply !== null && (
                    <div className="sit_use_reply" style={replyBlockStyle}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            background: '#2a5298',
                            color: '#fff',
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          답변
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                          {review.reply.subject}
                        </strong>
                        <span
                          style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 'auto' }}
                        >
                          {review.reply.authorName}
                        </span>
                      </div>
                      <div
                        className="use_reply_p"
                        style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}
                        dangerouslySetInnerHTML={{ __html: review.reply.contentHtml }}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/*
       * Legacy 는 여기에 `itemuse_page()` 페이지 번호를 그린다. V2 는 1페이지만 서버 렌더하고
       * 나머지는 Legacy 목록으로 넘긴다.
       */}
      {state.status === 'ready' && state.hasMore && (
        <div className="sit_use_more" style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href={legacyRoutes.courseReviews(courseId)} className="btn02" style={writeButtonStyle}>
            강의후기 더 보기 ({state.total}건)
          </a>
        </div>
      )}
    </section>
  );
}
