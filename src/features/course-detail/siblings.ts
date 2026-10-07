import type { Course } from '@/legacy';

/**
 * Legacy `shop/item.php:139-163` 의 이전/다음 강좌 계산을 그대로 옮긴다.
 *
 * ```sql
 * -- 이전 상품보기
 * select it_id from item where it_id > '$it_id'
 *   and SUBSTRING(ca_id,1,4) = '<현재 ca_id 앞 4자>' and it_use = '1'
 *   order by it_id asc limit 1
 * -- 다음 상품보기
 * select it_id from item where it_id < '$it_id'
 *   and SUBSTRING(ca_id,1,4) = '<현재 ca_id 앞 4자>' and it_use = '1'
 *   order by it_id desc limit 1
 * ```
 *
 * 레이블이 거꾸로인 게 Legacy 의 의도다 — "이전 강의"는 `it_id` 가 **큰** 쪽이다
 * (`it_id` 가 등록 시각이라 최신이 큰 값이다).
 *
 * `it_use = '1'`(+ `ca_use`)은 `courses.php` 가 이미 걸러 주므로 목록에 들어온 것만 본다.
 * `it_id` 는 `^[A-Za-z0-9_-]{1,20}$` 문자열이고, MySQL varchar 비교와 같은 결과를 내려면
 * 사전식으로 비교해야 한다 (운영 id 는 전부 같은 길이의 숫자라 수치 비교와 결과가 같다).
 *
 * Bridge 가 형제 강좌를 주지 않아 목록에서 계산한다.
 * // TBD(legacy): Bridge 에 siblings 를 추가하면 이 파일을 지운다.
 */

/** Legacy `SUBSTRING(ca_id, 1, 4)` — 분류 2단계까지 묶는다. */
function categoryGroup(categoryId: string): string {
  return categoryId.slice(0, 4);
}

export interface CourseSiblings {
  /** `it_id` 가 현재보다 큰 것 중 가장 작은 것. Legacy 레이블은 "이전 강의". */
  previous: string | null;
  /** `it_id` 가 현재보다 작은 것 중 가장 큰 것. Legacy 레이블은 "다음 강의". */
  next: string | null;
}

export function findCourseSiblings(
  courses: Course[],
  courseId: string,
  categoryId: string,
): CourseSiblings {
  const group = categoryGroup(categoryId);
  const peers = courses.filter((course) => categoryGroup(course.categoryId) === group);

  let previous: string | null = null;
  let next: string | null = null;

  for (const course of peers) {
    if (course.id > courseId) {
      // order by it_id asc limit 1 → 더 큰 것들 중 최솟값
      if (previous === null || course.id < previous) previous = course.id;
    } else if (course.id < courseId) {
      // order by it_id desc limit 1 → 더 작은 것들 중 최댓값
      if (next === null || course.id > next) next = course.id;
    }
  }

  return { previous, next };
}
