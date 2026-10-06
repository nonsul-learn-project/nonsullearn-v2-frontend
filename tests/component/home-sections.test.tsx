// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BriefingPartners } from '@/features/home/BriefingPartners';
import { CeoMessage } from '@/features/home/CeoMessage';
import { CompareTable } from '@/features/home/CompareTable';
import { CurriculumSection } from '@/features/home/CurriculumSection';
import { FaqAccordion } from '@/features/home/FaqAccordion';
import { HeroCarousel } from '@/features/home/HeroCarousel';
import { ProcessSteps } from '@/features/home/ProcessSteps';
import { StatsBar } from '@/features/home/StatsBar';
import { Testimonials } from '@/features/home/Testimonials';
import { WhySection } from '@/features/home/WhySection';

describe('Gate 5 home sections', () => {
  it.each([
    ['HeroCarousel', HeroCarousel, '논술, 이제'],
    ['StatsBar', StatsBar, '누적 합격자 수'],
    ['CurriculumSection', CurriculumSection, '인문논술 기본압축 개념반'],
    ['WhySection', WhySection, '논술런만의 4가지 차별점'],
    ['CompareTable', CompareTable, '일반 온라인 논술강의'],
    ['ProcessSteps', ProcessSteps, '답안 작성 및 제출'],
    ['CeoMessage', CeoMessage, '논술은 운이 아니라, 시스템입니다'],
    ['BriefingPartners', BriefingPartners, '시대인재'],
    ['Testimonials', Testimonials, '2026 고려대 미디어학과 합격'],
    ['FaqAccordion', FaqAccordion, '지방 거주 수험생도 대치동과 동일한 첨삭을 받을 수 있나요?'],
  ] as const)('%s renders its populated legacy fixture content', (_name, Component, expected) => {
    render(<Component />);
    expect(screen.getByText(expected, { exact: false })).toBeInTheDocument();
  });

  it('uses legacy image originals instead of the same-origin Next image optimizer', () => {
    const { container } = render(<HeroCarousel />);
    const sources = [...container.querySelectorAll('img')].map((image) => image.getAttribute('src'));

    expect(sources.some((source) => source?.startsWith('/_next/image'))).toBe(false);
    expect(sources).toContain('https://nonsul-learn.com/src/nonsul-learn/img/visualbg001.jpg');
    expect(sources).toContain('https://nonsul-learn.com/data/teacher/HP3L51W1RDDF');
  });
});
