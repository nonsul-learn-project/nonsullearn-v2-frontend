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

  it('keeps the hero slide DOM identical to legacy index.php', () => {
    const { container } = render(<HeroCarousel />);
    const slides = [...container.querySelectorAll('.carousel-item')];

    expect(slides).toHaveLength(3);

    // 사진 슬라이드: 카드가 flex 하단 정렬이고 .instructor-info 가 margin-top: auto 로 바닥에 붙는다.
    const photoCard = slides[0]?.querySelector('.instructor-single-box');
    expect(photoCard?.className).toBe(
      'instructor-single-box position-relative overflow-hidden rounded-4 shadow',
    );
    const photoInfo = slides[0]?.querySelector('.instructor-info');
    expect(photoInfo?.className).toBe('instructor-info text-center text-white p-4 w-100');
    expect(photoInfo?.getAttribute('style')).toContain('margin-top: auto');

    // 아이콘 슬라이드: 유틸 클래스도 margin-top: auto 도 없어야 아이콘+문구가 카드 세로 가운데에 모인다.
    for (const slide of slides.slice(1)) {
      expect(slide.querySelector('.instructor-single-box')?.className).toBe(
        'instructor-single-box',
      );
      const info = slide.querySelector('.instructor-info');
      expect(info?.className).toBe('instructor-info text-center text-white');
      expect(info?.getAttribute('style')).toBeNull();
    }
  });

  it('breaks hero copy with bare <br> like legacy, without wrapper elements', () => {
    const { container } = render(<HeroCarousel />);
    const title = container.querySelector('.hero-title');

    expect(title?.querySelectorAll('br')).toHaveLength(1);
    expect(title?.querySelectorAll('span')).toHaveLength(0);
    expect([...(title?.childNodes ?? [])].map((node) => node.nodeName)).toEqual([
      '#text',
      'BR',
      '#text',
    ]);
    // legacy 슬라이드 3 설명은 한 줄이라 <br> 이 없다.
    expect(
      container
        .querySelectorAll('.carousel-item')[2]
        ?.querySelector('.hero-desc')
        ?.querySelectorAll('br'),
    ).toHaveLength(0);
  });

  it('reproduces the legacy CTA button classes and inline style per slide', () => {
    const { container } = render(<HeroCarousel />);
    const buttons = [...container.querySelectorAll('.hero-btn-wrapper > a')];

    expect(buttons.map((button) => button.className)).toEqual([
      'btn btn-primary btn-lg rounded-pill px-4 shadow-sm',
      'btn btn-light btn-lg rounded-pill px-4 text-primary fw-bold',
      'btn btn-warning btn-lg rounded-pill px-4 fw-bold',
    ]);
    // legacy 슬라이드 1 버튼의 `background:var(--accent-color); border:none;` 재현.
    // jsdom(cssstyle)은 border 단축 속성을 직렬화하지 않아 여기서는 배경만 확인한다.
    // `border: none` 이 빠지면 버튼 높이가 46px → 48px 로 커지는데, 그건 Playwright
    // parity 측정(docs/parity/home-hero.md)에서 잡는다.
    expect(buttons[0]?.getAttribute('style')).toContain('background: var(--nonsul-color-accent)');
    expect(buttons[1]?.getAttribute('style')).toBeNull();
    expect(buttons[2]?.getAttribute('style')).toBeNull();
  });

  it('uses legacy image originals instead of the same-origin Next image optimizer', () => {
    const { container } = render(<HeroCarousel />);
    const sources = [...container.querySelectorAll('img')].map((image) =>
      image.getAttribute('src'),
    );

    expect(sources.some((source) => source?.startsWith('/_next/image'))).toBe(false);
    expect(sources).toContain('https://nonsul-learn.com/src/nonsul-learn/img/visualbg001.jpg');
    expect(sources).toContain('https://nonsul-learn.com/data/teacher/HP3L51W1RDDF');
  });
});
