import 'server-only';

import sanitizeHtml from 'sanitize-html';

import { legacyAssetUrl } from '@/legacy';

/**
 * Bridge 가 주는 Html 필드를 렌더 전에 좁힌다.
 *
 * "Legacy 에서 왔으니 믿어도 된다"가 성립하지 않는다. `it_explan`, `is_content`, `iq_question` 은
 * 관리자나 회원이 에디터로 쓴 값이고, Legacy 는 `conv_content()` 로 출력 시점에 처리한다.
 * V2 는 `dangerouslySetInnerHTML` 로 넣으므로 같은 자리에서 같은 일을 해야 한다.
 *
 * Legacy 와 다른 점은 없어야 한다 — 태그를 지우는 것이 목적이 아니라 script/이벤트 핸들러만
 * 떼는 것이 목적이다. 그래서 allowlist 는 Legacy 에디터가 실제로 쓰는 태그를 전부 포함한다.
 */

/**
 * `sanitize-html` 기본 allowlist + Legacy 에디터(SmartEditor)가 쓰는 태그.
 *
 * `img`/`table` 계열이 기본 allowlist 에 없어서 명시해야 한다. `it_explan` 에는
 * 표와 이미지가 들어간다.
 */
const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  'img',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'col',
  'colgroup',
  'span',
  'font',
  'u',
  's',
  'strike',
  'hr',
  'br',
  'center',
];

/**
 * `style` 을 허용한다. Legacy 본문의 색·배경색·굵기가 전부 inline style 이라
 * 빼면 화면이 달라진다 (`style="color:rgb(255,0,0)"` 같은 것).
 * `sanitize-html` 은 style 값을 CSS 파서로 다시 쓰므로 `expression()` 류는 남지 않는다.
 */
const allowedAttributes: sanitizeHtml.IOptions['allowedAttributes'] = {
  '*': ['class', 'style', 'id', 'title', 'lang', 'xml:lang', 'dir', 'align'],
  a: ['href', 'rel', 'target', 'name'],
  img: ['src', 'alt', 'width', 'height'],
  table: ['width', 'border', 'cellpadding', 'cellspacing'],
  td: ['width', 'height', 'colspan', 'rowspan', 'valign'],
  th: ['width', 'height', 'colspan', 'rowspan', 'valign', 'scope'],
  col: ['width', 'span'],
  font: ['color', 'size', 'face'],
};

/**
 * Legacy 본문 안의 `/data/...` 상대경로를 asset host 에 붙인다.
 *
 * Legacy 는 같은 도메인에서 서빙되므로 상대경로가 그냥 동작하지만, V2 는 Gate 6 컷오버 전까지
 * Vercel 도메인에서도 렌더된다. `legacyAssetUrl()` 과 같은 규칙을 쓴다 (`src/legacy/assets.ts`).
 *
 * `/data/` 로 시작하는 것만 바꾼다. 다른 경로(`/shop/...` 링크 등)는 Legacy 라우팅이므로
 * Apache 정문이 처리한다.
 */
const LEGACY_DATA_URL = /\b(src|href)=(["'])(\/data\/[^"']*)\2/gi;

function rewriteLegacyDataUrls(html: string): string {
  return html.replace(
    LEGACY_DATA_URL,
    (_all, attribute: string, quote: string, path: string) =>
      `${attribute}=${quote}${legacyAssetUrl(path)}${quote}`,
  );
}

/** 빈 문자열은 그대로 돌려준다. Bridge 는 값이 없을 때 `""` 를 준다. */
export function sanitizeLegacyHtml(html: string): string {
  if (html === '') return '';

  return sanitizeHtml(rewriteLegacyDataUrls(html), {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    // `<a target="_blank">` 에 rel 을 보강한다. Legacy 본문에 외부 링크가 섞여 있다.
    transformTags: {
      a: (tagName, attribs) =>
        attribs.target === '_blank'
          ? { tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }
          : { tagName, attribs },
    },
  });
}
