// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaqContent } from '@/features/public-pages/PublicPages';

describe('FaqContent', () => {
  it('keeps the Legacy search and accordion markup', () => {
    const { container } = render(
      <FaqContent
        faq={{
          v: 1,
          id: 1,
          title: '인문논술 김윤환T',
          masters: [{ id: 1, title: '인문논술 김윤환T' }],
          headerImage: null,
          footerImage: null,
          items: [{ id: 8, questionHtml: '<p>기본반 공부법</p>', answerHtml: '<p>답변</p>' }],
        }}
        headerHtml=""
        footerHtml=""
      />,
    );

    expect(container.querySelector('form[name="faq_search_form"]')).toBeInTheDocument();
    expect(
      container.querySelector('#faqAccordion [data-bs-parent="#faqAccordion"]'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /기본반 공부법/ })).toHaveStyle({
      fontSize: '1.05rem',
    });

    fireEvent.click(screen.getByRole('button', { name: /기본반 공부법/ }));
    expect(container.querySelector('#faq_collapse_0')).toHaveClass('show');
  });
});
