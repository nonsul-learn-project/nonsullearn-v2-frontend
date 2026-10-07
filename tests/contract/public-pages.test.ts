import { describe, expect, it } from 'vitest';
import { contentResponseSchema, faqResponseSchema, teachersResponseSchema } from '@/legacy/contracts/public-pages';
import { sanitizeLegacyHtml } from '@/lib/sanitize-legacy-html';

describe('public-page Bridge contracts', () => {
  it('accepts the observed teachers response shape and rejects legacy fields', () => {
    const response = { v: 1, items: [{ id: 'HP3L51W1RDDF', name: '인문논술 - 김윤환', categoryId: '1010', categoryName: '김윤환 선생님', ability: '* 약력', career: '현) 강사', image: '/data/teacher/HP3L51W1RDDF?ver=2026-06-05', updatedAt: '2026-06-05 15:38:58' }] };
    expect(teachersResponseSchema.safeParse(response).success).toBe(true);
    expect(teachersResponseSchema.safeParse({ ...response, items: [{ ...response.items[0], ir_id: 'x' }] }).success).toBe(false);
  });
  it('accepts observed content and FAQ response shapes', () => {
    expect(contentResponseSchema.safeParse({ v: 1, id: 'provision', title: '서비스 이용약관', contentHtml: '<p>약관</p>' }).success).toBe(true);
    expect(faqResponseSchema.safeParse({ v: 1, id: 1, title: '인문논술 김윤환T', masters: [{ id: 1, title: '인문논술 김윤환T' }], headerImage: null, footerImage: null, items: [{ id: 8, questionHtml: '<p>질문</p>', answerHtml: '<p>답변</p>' }] }).success).toBe(true);
  });
  it('removes unsafe HTML and rewrites legacy data assets', () => {
    const html = sanitizeLegacyHtml('<img src="/data/faq/1_h"><script>alert(1)</script>');
    expect(html).toContain('https://'); expect(html).not.toContain('script');
  });
});
