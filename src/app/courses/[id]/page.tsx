import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { clientEnv } from '@/env.client';
import { enforceProxy } from '@/env.server';
import { CourseDetail } from '@/features/course-detail/CourseDetail';
import { findCourseSiblings } from '@/features/course-detail/siblings';
import { SiteShell } from '@/features/site-shell/SiteShell';
import { courseIdSchema, legacyRoutes, requiresLegacyCertification } from '@/legacy';
import {
  getCourseDetail,
  getCourseQuestionsState,
  getCourseReviewsState,
  getCourses,
} from '@/legacy/server';

// 이 라우트에서만 쓰는 Legacy 스킨 CSS (= skin/shop/basic/style_2.css 미러).
import '@/features/course-detail/legacy-course-detail.css';

/**
 * `/courses/[id]` — Legacy `shop/item.php?it_id=<id>` 와 같은 화면.
 *
 * ## ISR
 *
 * `searchParams` 를 **읽지 않는다.** 읽으면 Next 가 이 라우트를 요청마다 SSR 로 돌리고
 * (빌드 출력에서 `ƒ`), 그건 AGENTS.md §6.3 이 `/api/v2-health` 외에 금지한 동작이다.
 * 그래서 mock 시나리오도 쿼리가 아니라 **id 로 주소화**한다
 * (`src/legacy/adapters/course-detail/mock.ts`).
 *
 * 캐시 주기는 두 곳에 있다:
 *   - 세그먼트 `revalidate` — Next 가 **정적으로 분석**해야 해서 리터럴이어야 한다.
 *   - fetch 단위 `next: { revalidate }` — `bridgeServerFetch` 가 env 값으로 건다.
 * `COURSE_REVALIDATE_SECONDS` 를 바꾸면 아래 리터럴도 같이 바꿔야 한다.
 *
 * viewer(로그인 상태)를 서버에서 조회하지 않는다. 이 HTML 은 모든 방문자가 공유한다.
 */

/**
 * `COURSE_REVALIDATE_SECONDS` 의 기본값과 같아야 한다 (`src/env.server.ts`).
 * env 를 그대로 쓸 수 없는 이유는 위 주석 참고.
 */
export const revalidate = 300;

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

/**
 * **빈 배열을 돌려주지만 함수 자체는 있어야 한다.**
 *
 * 함수가 없으면 Next 가 `[id]` 를 full route cache 에 등록하지 않고
 * (`prerender-manifest.json` 의 `dynamicRoutes` 가 빈다) 응답에 `Cache-Control: no-store` 를
 * 붙여 요청마다 다시 렌더한다. 그래서 ISR 을 켜는 스위치로 남겨 둔다.
 *
 * 빈 배열인 이유: 빌드 때 Bridge 를 부르지 않기 위해서다. 카탈로그 39개를 모두 prerender 하면
 * 빌드가 Bridge 왕복 40번에 묶이고, Vercel 빌드 환경에서 `LEGACY_BRIDGE_TIMEOUT_MS`(기본 3s)를
 * 넘기는 순간 `AbortError`(DOMException)로 **배포 전체가 실패**했다
 * ("Export encountered an error on /courses/[id]/page").
 * Bridge 가 느린 것과 배포가 막히는 것은 분리해야 한다.
 *
 * 모든 강좌는 `dynamicParams` 기본값(true)대로 첫 요청에 렌더되고 `revalidate` 주기로
 * 캐시된다. 첫 요청만 느리고 그 뒤는 같다.
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [];
}

/**
 * Bridge 가 받지 않는 id 로 요청하면 400 이 온다. 라우트에서 먼저 Contract 로 좁혀서
 * Bridge 를 때리지 않고 404 를 낸다 (`courseIdSchema` = `^[A-Za-z0-9_-]{1,20}$`).
 */
async function resolveId(params: CoursePageProps['params']): Promise<string> {
  const parsed = courseIdSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  return parsed.data;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const id = await resolveId(params);
  const course = await getCourseDetail(id);
  if (course === null) return { title: '강좌를 찾을 수 없습니다' };

  const { item } = course;
  // Legacy `$g5['title'] = $it['it_name'].' &gt; '.$it['ca_name']` 와 같은 조합.
  const title = `${item.name} > ${item.category.name}`;
  const description = item.basic === '' ? item.name : item.basic;
  const canonical = new URL(
    `/courses/${item.id}`,
    clientEnv.NEXT_PUBLIC_SITE_URL ?? clientEnv.NEXT_PUBLIC_LEGACY_BASE_URL,
  ).toString();

  return {
    title,
    description,
    alternates: { canonical },
    // Gate 6 컷오버 전에는 layout 의 noindex 를 상속한다 (`src/app/page.tsx` 와 같은 기준).
    robots: enforceProxy ? { index: true, follow: true } : undefined,
    openGraph: { type: 'website', title, description, url: canonical },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const id = await resolveId(params);

  /**
   * 강좌 본문은 `getCourseDetail` 을 쓴다 — 실패를 throw 해서 ISR 이 마지막 성공본을
   * 계속 내보내게 한다 (ADR 0007). `unavailable` 을 돌려주면 Bridge 가 잠깐 흔들릴 때마다
   * 캐시된 좋은 HTML 이 빈 화면으로 덮인다.
   */
  const course = await getCourseDetail(id);
  if (course === null) notFound();

  /**
   * Legacy `shop_member_cert_check()` 가 막는 강좌는 Legacy 로 넘긴다.
   *
   * 본인인증/성인인증 통과 여부는 PHP 세션에만 있고, V2 서버는 그걸 보면 안 된다
   * (AGENTS.md §6.3 — 서버 HTML 에 로그인 상태가 섞이면 ISR/CDN 캐시가 오염된다).
   * 그래서 판단 자체를 Legacy 에 위임한다. Legacy 는 비인증 사용자에게 alert 후 `/shop/` 으로
   * 보내고, 인증된 사용자에게는 정상 화면을 준다.
   */
  if (requiresLegacyCertification(course.item.category)) {
    redirect(legacyRoutes.courseDetail(course.item.id));
  }

  /**
   * 후기·문의 1페이지와 형제 강좌. 전부 실패해도 강좌 화면은 떠야 하므로 후기/문의는
   * `*State` 표면(실패 → `unavailable`)을 쓰고, 목록 실패는 형제 링크만 포기한다.
   */
  const [reviews, questions, courses] = await Promise.all([
    getCourseReviewsState(id),
    getCourseQuestionsState(id),
    getCourses().catch(() => []),
  ]);

  return (
    <SiteShell>
      <CourseDetail
        course={course}
        siblings={findCourseSiblings(courses, course.item.id, course.item.category.id)}
        reviews={reviews}
        questions={questions}
      />
    </SiteShell>
  );
}
