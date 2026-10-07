import type { CSSProperties } from 'react';

/**
 * Legacy 스킨이 **inline `style` 로** 넣는 값들.
 *
 * `style_2.css` 로 옮기지 않고 inline 으로 두는 이유: Legacy 가 inline 이라서다.
 * 클래스로 옮기면 우선순위가 달라지고, 나중에 legacy CSS 를 다시 동기화할 때
 * 어느 쪽이 원본인지 분간이 안 된다 (AGENTS.md §6.5, ADR 0002).
 *
 * 각 상수 주석의 파일·줄 번호가 원본이다 (`nonsul-learn-html1/html2/skin/shop/basic/`).
 */

/** `item.info.skin.php:33`, `:58` — "강의 정보 고시" / "상세 강의 소개" 제목. */
export const sectionTitleStyle: CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 700,
  margin: '20px 0 10px',
  color: '#1e293b',
};

/** `itemuse.skin.php:12`, `itemqa.skin.php:12` — 목록 머리말 줄. */
export const listHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '25px',
  borderBottom: '2px solid #e2e8f0',
  paddingBottom: '15px',
};

/** `itemuse.skin.php:13`, `itemqa.skin.php:13` — "수강생 강의후기" / "수강생 강의문의". */
export const listHeadingStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#1e293b',
  margin: 0,
};

/** `itemuse.skin.php:15`, `itemqa.skin.php:15` — `.btn02` 쓰기 버튼. */
export const writeButtonStyle: CSSProperties = {
  display: 'inline-block',
  background: '#2a5298',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '6px',
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '0.95rem',
};

/** `itemuse.skin.php:100`, `itemqa.skin.php:108` — `<p class="sit_empty">`. */
export const emptyStyle: CSSProperties = {
  textAlign: 'center',
  padding: '50px 0',
  color: '#94a3b8',
};

/** `itemuse.skin.php:51`, `itemqa.skin.php:65` — 후기/문의 카드. */
export const cardStyle: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  marginBottom: '15px',
  padding: '20px',
  background: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
};

/** `itemuse.skin.php:66` — "내용보기" 토글 버튼. */
export const toggleButtonStyle: CSSProperties = {
  background: '#f1f5f9',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  color: '#475569',
  fontWeight: 500,
};

/** `itemqa.skin.php:75` — 문의 목록의 "내용보기"(오른쪽). */
export const qaToggleButtonStyle: CSSProperties = {
  ...toggleButtonStyle,
  padding: '6px 12px',
  fontSize: '0.85rem',
  marginLeft: '10px',
};

/** `itemuse.skin.php:69`, `itemqa.skin.php:79` — 아코디언 본문. `display` 는 class 가 담당한다. */
export const accordionBodyStyle: CSSProperties = {
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px dashed #e2e8f0',
};

/** `itemuse.skin.php:82` — 관리자 답변 블록. */
export const replyBlockStyle: CSSProperties = {
  marginTop: '20px',
  background: '#f8fafc',
  padding: '15px',
  borderRadius: '8px',
  borderLeft: '3px solid #2a5298',
};

/** `itemqa.skin.php:86` — 답변(A) 블록. */
export const answerBlockStyle: CSSProperties = {
  display: 'flex',
  gap: '12px',
  background: '#f8fafc',
  padding: '15px',
  borderRadius: '8px',
  borderLeft: '3px solid #2a5298',
};

/** `itemqa.skin.php:82`, `:87` — Q/A 동그라미. */
export const qaBadgeStyle: CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.85rem',
  flexShrink: 0,
};

/** `itemuse.skin.php:20` — 총평점 박스. */
export const scoreSummaryStyle: CSSProperties = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '30px',
};
