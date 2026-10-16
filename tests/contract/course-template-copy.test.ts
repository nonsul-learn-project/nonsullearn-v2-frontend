import { describe, expect, it } from 'vitest';

import { getTemplateDefault } from '@/content/course-templates';

describe('source template copy defaults', () => {
  it.each([
    ['humanities', '읽는 데서 멈추지 말고, 정확한 답안으로 써보세요.', '커리큘럼 보기'],
    ['math', '푸는 데서 멈추지 말고, 풀이를 답안으로 써보세요.', '강의 구성 살펴보기'],
    ['short-answer', '아는 데서 멈추지 말고, 정확한 답안으로 써보세요.', '강의 구성 살펴보기'],
  ] as const)('keeps the documented %s hero copy', (templateType, marketingHeadline, ctaLabel) => {
    const content = getTemplateDefault(templateType);
    expect(content.hero.marketingHeadline).toBe(marketingHeadline);
    expect(content.hero.ctaLabel).toBe(ctaLabel);
    expect('eyebrow' in content.hero).toBe(false);
  });

  it.each(['humanities', 'math', 'short-answer'] as const)('keeps unverified course-specific sections hidden for %s', (templateType) => {
    const content = getTemplateDefault(templateType);
    const visible = (id: string) => content.sections.find((section) => section.id === id)?.visible;
    expect(visible('proof')).toBe(false);
    expect(visible('curriculum')).toBe(false);
    expect(visible('faq')).toBe(false);
  });
});
