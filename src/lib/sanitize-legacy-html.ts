import 'server-only';

import sanitizeHtml from 'sanitize-html';
import { legacyAssetUrl } from '@/legacy';

const allowedTags = [...sanitizeHtml.defaults.allowedTags, 'img', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'span', 'hr'];
const allowedAttributes = { '*': ['class', 'style', 'id', 'title', 'lang', 'xml:lang'], a: ['href', 'rel', 'target'], img: ['src', 'alt', 'width', 'height'] };

/** Bridge HTML is untrusted even though it originates from Legacy; only legacy data URLs are rewritten. */
export function sanitizeLegacyHtml(html: string): string {
  const rewritten = html.replace(/\b(src|href)=(['"])(\/data\/[^'"]*)\2/gi, (_all, attribute: string, quote: string, path: string) => `${attribute}=${quote}${legacyAssetUrl(path)}${quote}`);
  return sanitizeHtml(rewritten, { allowedTags, allowedAttributes, allowedSchemes: ['http', 'https', 'mailto'], allowedSchemesByTag: { img: ['http', 'https'] } });
}
