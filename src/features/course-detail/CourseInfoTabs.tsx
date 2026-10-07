'use client';

import { useState, useSyncExternalStore } from 'react';

import {
  COURSE_INFORMATION_TITLES,
  legacyRoutes,
  type CourseInformation,
  type CourseQuestionsState,
  type CourseReviewsState,
} from '@/legacy';

import { CourseQuestionList } from './CourseQuestionList';
import { CourseReviewList } from './CourseReviewList';
import { sectionTitleStyle } from './legacy-inline-styles';

/**
 * Legacy `skin/shop/basic/item.info.skin.php` 를 그대로 옮긴 것.
 *
 * 탭 4개: 강의 정보 / 강의후기 / 강의문의 / 공지사항(Legacy 게시판으로 이동).
 * Legacy 는 jQuery 로 `$(".tab_con > li").hide()` 후 `:first` 만 보여주고, 버튼 클릭 시
 * `rel` 선택자를 `show()` 한다. 여기서는 같은 동작을 React state 로 한다.
 *
 * `#sit_inf` 가 기본 탭이고 버튼에 `class="selected"` 가 붙는다.
 */

/** Legacy 탭 id. `tab_con > li` 의 id 와 버튼의 `rel` 이 짝이다. */
const TABS = [
  { id: 'sit_inf', label: '강의 정보' },
  { id: 'sit_use', label: '강의후기' },
  { id: 'sit_qa', label: '강의문의' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export interface CourseInfoTabsProps {
  courseId: string;
  information: CourseInformation;
  /** `sanitizeLegacyHtml()` 을 이미 통과한 `it_explan`. 서버에서 정제해 내려온다. */
  descriptionHtml: string;
  reviews: CourseReviewsState;
  questions: CourseQuestionsState;
}

export function CourseInfoTabs({
  courseId,
  information,
  descriptionHtml,
  reviews,
  questions,
}: CourseInfoTabsProps) {
  /**
   * Legacy `item.info.skin.php:226-229`:
   *
   * ```js
   * if (window.location.href.split("#").length > 1) {
   *   let id = window.location.href.split("#")[1];
   *   $("#btn_" + id).trigger("click");
   * }
   * ```
   *
   * `/courses/<id>#sit_use` 로 들어오면 후기 탭이 열린다. 해시는 서버로 전송되지 않으므로
   * 서버 HTML 은 항상 첫 탭이고, hydration 후에 해시가 반영된다.
   *
   * 해시는 React 밖의 상태라서 `useSyncExternalStore` 로 구독한다. effect 에서 setState 하면
   * cascading render 가 되고 lint(`react-hooks/set-state-in-effect`)가 막는다.
   */
  const hash = useSyncExternalStore(subscribeToHash, readHash, readServerHash);
  /** 사용자가 탭을 누르면 해시보다 그쪽이 우선이다 (Legacy 도 클릭이 나중에 일어난다). */
  const [clicked, setClicked] = useState<TabId | null>(null);
  const hashTab = TABS.find((tab) => tab.id === hash)?.id;
  const active: TabId = clicked ?? hashTab ?? 'sit_inf';
  const setActive = setClicked;

  /** Legacy 가 `it_info_value` 를 unserialize 해서 저장 순서대로 그린 표. 값이 비어도 행은 그린다. */
  const informationRows = COURSE_INFORMATION_TITLES.filter(
    ([key]) => information[key] !== undefined,
  );

  return (
    <section id="sit_info" className="shop_list_container">
      <div id="sit_tab">
        {/* 탭 네비게이션 버튼 메뉴 */}
        <ul className="tab_tit">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                id={`btn_${tab.id}`}
                rel={`#${tab.id}`}
                className={active === tab.id ? 'selected' : undefined}
                onClick={() => setActive(tab.id)}
                aria-expanded={active === tab.id}
              >
                {tab.label}
              </button>
            </li>
          ))}
          <li>
            {/* Legacy 는 `onclick="location.href='.../board.php?bo_table=notice'"` 로 이동한다. */}
            <button
              type="button"
              id="btn_sit_dex"
              onClick={() => {
                window.location.href = legacyRoutes.notice();
              }}
            >
              공지사항
            </button>
          </li>
        </ul>

        <ul className="tab_con">
          {/* 상품 정보 시작 */}
          <li id="sit_inf" style={{ display: active === 'sit_inf' ? 'block' : 'none' }}>
            <h2 className="contents_tit sound_only">
              <span>강의 정보</span>
            </h2>

            {informationRows.length > 0 && (
              <>
                <h3 style={sectionTitleStyle}>강의 정보 고시</h3>
                <table id="sit_inf_open" className="sit_ov_tbl" style={{ marginBottom: '30px' }}>
                  <tbody>
                    {informationRows.map(([key, title]) => (
                      <tr key={key}>
                        <th scope="row">{title}</th>
                        <td>{information[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {descriptionHtml !== '' && (
              <>
                <h3 style={sectionTitleStyle}>상세 강의 소개</h3>
                {/*
                 * Legacy `conv_content($it['it_explan'], 1)` 자리다. HTML 사용 상품이라
                 * Legacy 도 그대로 출력한다. V2 는 서버에서 `sanitizeLegacyHtml()` 을 거친 값만 받는다.
                 */}
                <div
                  id="sit_inf_explan"
                  style={{ lineHeight: 1.6, color: '#334155' }}
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </>
            )}
          </li>
          {/* 상품 정보 끝 */}

          {/* 강의후기 시작 */}
          <li id="sit_use" style={{ display: active === 'sit_use' ? 'block' : 'none' }}>
            <h2 className="sound_only">강의후기</h2>
            <div id="itemuse">
              <CourseReviewList courseId={courseId} state={reviews} />
            </div>
          </li>
          {/* 강의후기 끝 */}

          {/* 강의문의 시작 */}
          <li id="sit_qa" style={{ display: active === 'sit_qa' ? 'block' : 'none' }}>
            <h2 className="sound_only">강의문의</h2>
            <div id="itemqa">
              <CourseQuestionList courseId={courseId} state={questions} />
            </div>
          </li>
          {/* 강의문의 끝 */}
        </ul>
      </div>
    </section>
  );
}

/** `hashchange` 구독. `useSyncExternalStore` 가 쓰는 세 함수다. */
function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function readHash(): string {
  return window.location.hash.replace('#', '');
}

/** 서버 렌더에는 해시가 없다. 항상 첫 탭이 열린 HTML 이 나간다. */
function readServerHash(): string {
  return '';
}
