'use client';

import { useState } from 'react';

import { legacyRoutes, type CourseQuestionsState } from '@/legacy';
import { formatLegacyListDate } from '@/lib/format';

import {
  accordionBodyStyle,
  answerBlockStyle,
  cardStyle,
  emptyStyle,
  listHeaderStyle,
  listHeadingStyle,
  qaBadgeStyle,
  qaToggleButtonStyle,
  writeButtonStyle,
} from './legacy-inline-styles';

/**
 * Legacy `skin/shop/basic/itemqa.skin.php` 를 그대로 옮긴 것.
 *
 * Legacy 와 다른 점:
 *
 *   1. **비밀글이 없다.** Bridge 가 `iq_secret = 0` 만 준다. Legacy 는 비밀글도 목록에 제목을
 *      보여주고(`fa-lock` 아이콘) 본문만 "비밀글로 보호된 문의입니다." 로 가린다.
 *      그래서 V2 목록이 Legacy 보다 짧고 `total` 도 작다. 이건 Bridge 소관이다
 *      (docs/decisions/bridge-course-community.md).
 *   2. 수정/삭제 버튼이 없다 (회원 전용 쓰기, AGENTS.md §3).
 *   3. 페이지 번호 대신 "더 보기"가 Legacy `itemqa.php` 로 보낸다.
 *
 * AGENTS.md §6.4 4가지 상태를 모두 처리한다.
 */

export interface CourseQuestionListProps {
  courseId: string;
  state: CourseQuestionsState;
}

export function CourseQuestionList({ courseId, state }: CourseQuestionListProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="sit_qa_list" style={{ marginTop: '20px' }}>
      <div style={listHeaderStyle}>
        <h3 style={listHeadingStyle}>수강생 강의문의</h3>
        <div id="sit_qa_wbtn">
          <a
            href={legacyRoutes.courseQuestionForm(courseId)}
            className="btn02 itemqa_form"
            target="_blank"
            rel="noreferrer"
            style={writeButtonStyle}
          >
            강의문의 쓰기<span className="sound_only">새 창</span>
          </a>
        </div>
      </div>

      {state.status === 'loading' && (
        <p className="sit_empty" style={emptyStyle}>
          강의문의를 불러오는 중입니다.
        </p>
      )}

      {state.status === 'unavailable' && (
        <p className="sit_empty" style={emptyStyle}>
          강의문의를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {state.status === 'ready' && state.items.length === 0 && (
        // Legacy `itemqa.skin.php:108`
        <p className="sit_empty" style={emptyStyle}>
          등록된 강의문의가 없습니다.
        </p>
      )}

      {state.status === 'ready' && state.items.length > 0 && (
        <ol id="sit_qa_ol">
          {state.items.map((question, index) => {
            const isOpen = open === index;
            return (
              <li key={question.id} className="sit_qa_li" style={cardStyle}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '15px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    {/* Legacy `itemqa.skin.php:49-60` — 답변완료는 파란 배지, 답변대기는 빨간 배지. */}
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        ...(question.answered
                          ? { background: '#dbeafe', color: '#1d4ed8' }
                          : { background: '#fee2e2', color: '#b91c1c' }),
                      }}
                    >
                      {question.answered ? '답변완료' : '답변대기'}
                    </span>
                    <button
                      type="button"
                      className="sit_qa_li_title"
                      aria-expanded={isOpen}
                      aria-controls={`sit_qa_con_${index}`}
                      onClick={() => setOpen(isOpen ? null : index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: '#1e293b',
                        textAlign: 'left',
                        cursor: 'pointer',
                        padding: 0,
                        flex: 1,
                      }}
                    >
                      {question.subject}
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span>{question.authorName}</span>
                    <span style={{ color: '#cbd5e1' }}>&bull;</span>
                    <span>
                      <i className="fa fa-clock-o" aria-hidden="true" />{' '}
                      {formatLegacyListDate(question.createdAt)}
                    </span>
                    <button
                      type="button"
                      className="sit_qa_li_title"
                      aria-expanded={isOpen}
                      aria-controls={`sit_qa_con_${index}`}
                      onClick={() => setOpen(isOpen ? null : index)}
                      style={qaToggleButtonStyle}
                    >
                      내용보기 <i className="fa fa-caret-down" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div
                  id={`sit_qa_con_${index}`}
                  className={isOpen ? 'sit_qa_con is_open' : 'sit_qa_con'}
                  style={accordionBodyStyle}
                >
                  <div className="sit_qa_p">
                    <div
                      className="sit_qa_qaq"
                      style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}
                    >
                      <span
                        className="qa_alp"
                        style={{ ...qaBadgeStyle, background: '#e2e8f0', color: '#475569' }}
                      >
                        Q
                      </span>
                      <div
                        style={{
                          flex: 1,
                          lineHeight: 1.6,
                          color: '#334155',
                          paddingTop: '3px',
                        }}
                        dangerouslySetInnerHTML={{ __html: question.questionHtml }}
                      />
                    </div>
                    {/*
                     * Legacy 는 `if(!$is_secret)` 일 때만 답변 블록을 그린다. Bridge 가 비밀글을
                     * 아예 주지 않으므로 여기 오는 문의는 전부 공개글이다 — 항상 그린다.
                     */}
                    <div className="sit_qa_qaa" style={answerBlockStyle}>
                      <span
                        className="qa_alp"
                        style={{ ...qaBadgeStyle, background: '#2a5298', color: '#fff' }}
                      >
                        A
                      </span>
                      {question.answered ? (
                        <div
                          style={{ flex: 1, lineHeight: 1.6, color: '#334155', paddingTop: '3px' }}
                          dangerouslySetInnerHTML={{ __html: question.answerHtml }}
                        />
                      ) : (
                        // Legacy `itemqa.skin.php:58`
                        <div style={{ flex: 1, lineHeight: 1.6, color: '#334155', paddingTop: '3px' }}>
                          답변이 등록되지 않았습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {state.status === 'ready' && state.hasMore && (
        <div className="sit_qa_more" style={{ textAlign: 'center', marginTop: '20px' }}>
          <a
            href={legacyRoutes.courseQuestions(courseId)}
            className="btn02"
            style={writeButtonStyle}
          >
            강의문의 더 보기 ({state.total}건)
          </a>
        </div>
      )}
    </section>
  );
}
