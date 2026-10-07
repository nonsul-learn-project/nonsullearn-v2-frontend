import type { CourseFull, CourseQuestionsState, CourseReviewsState } from '@/legacy';
import { sanitizeLegacyHtml } from '@/lib/sanitize-legacy-html';

import { CourseInfoTabs } from './CourseInfoTabs';
import { CourseOrderForm } from './CourseOrderForm';

/**
 * Legacy `shop/item.php` 의 본문 조립 순서를 그대로 따른다 (`html2/shop/item.php:127-273`):
 *
 * ```php
 * echo run_replace('shop_it_head_html', '<div id="sit_hhtml">'.conv_content($it['it_head_html'], 1).'</div>', $it);
 * <div id="sit">
 *   include item.form.skin.php      // 히어로 + 구입폼
 *   include item.info.skin.php      // 탭
 * </div>
 * echo run_replace('shop_it_tail_html', conv_content($it['it_tail_html'], 1), $it);
 * ```
 *
 * `#sit_hhtml` 은 **값이 비어도 빈 div 가 나간다** (운영 응답에서 `<div id="sit_hhtml"></div>` 확인).
 * `it_tail_html` 은 wrapper 없이 그대로 나간다.
 *
 * 이 컴포넌트는 Server Component 다. Html 필드를 여기서 `sanitizeLegacyHtml()` 로 정제해
 * Client Component 로 넘긴다 — sanitize 는 `server-only` 모듈이다.
 */

export interface CourseDetailProps {
  course: CourseFull;
  siblings: { previous: string | null; next: string | null };
  reviews: CourseReviewsState;
  questions: CourseQuestionsState;
}

export function CourseDetail({ course, siblings, reviews, questions }: CourseDetailProps) {
  const { item } = course;

  const headHtml = sanitizeLegacyHtml(item.headHtml);
  const tailHtml = sanitizeLegacyHtml(item.tailHtml);
  const descriptionHtml = sanitizeLegacyHtml(item.descriptionHtml);

  const safeReviews = sanitizeReviews(reviews);
  const safeQuestions = sanitizeQuestions(questions);

  return (
    <>
      {/* 상품 상세보기 시작 */}
      <div id="sit_hhtml" dangerouslySetInnerHTML={{ __html: headHtml }} />

      <div id="sit">
        {/* 상단 히어로 배너 영역 — item.form.skin.php:8-16 */}
        <section className="shop_hero_section">
          <div className="hero_overlay" />
          <div className="hero_content">
            <span className="hero_sub_title">논술런</span>
            <h1 className="hero_title">{item.name}</h1>
            <p className="hero_desc">{item.basic}</p>
          </div>
        </section>

        <CourseOrderForm course={course} siblings={siblings} />

        <CourseInfoTabs
          courseId={item.id}
          information={item.information}
          descriptionHtml={descriptionHtml}
          reviews={safeReviews}
          questions={safeQuestions}
        />
      </div>

      {/* 하단 HTML — wrapper 없이 그대로 나간다. */}
      {tailHtml !== '' && <div dangerouslySetInnerHTML={{ __html: tailHtml }} />}
    </>
  );
}

/**
 * 후기 본문도 Bridge 가 주는 HTML 이다. 회원이 에디터로 쓴 값이므로 강좌 소개보다 더 정제가 필요하다.
 * `dangerouslySetInnerHTML` 로 들어가기 **전에** 서버에서 처리한다.
 */
function sanitizeReviews(state: CourseReviewsState): CourseReviewsState {
  if (state.status !== 'ready') return state;
  return {
    ...state,
    items: state.items.map((review) => ({
      ...review,
      contentHtml: sanitizeLegacyHtml(review.contentHtml),
      reply:
        review.reply === null
          ? null
          : { ...review.reply, contentHtml: sanitizeLegacyHtml(review.reply.contentHtml) },
    })),
  };
}

function sanitizeQuestions(state: CourseQuestionsState): CourseQuestionsState {
  if (state.status !== 'ready') return state;
  return {
    ...state,
    items: state.items.map((question) => ({
      ...question,
      questionHtml: sanitizeLegacyHtml(question.questionHtml),
      answerHtml: sanitizeLegacyHtml(question.answerHtml),
    })),
  };
}
