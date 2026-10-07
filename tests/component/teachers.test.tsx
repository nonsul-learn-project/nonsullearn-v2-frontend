// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TeachersContent } from '@/features/public-pages/PublicPages';
import type { Teacher } from '@/legacy/server';

const teacherRows: readonly [id: string, name: string, version: string][] = [
  ['HP3L51W1RDDF', '인문논술 - 김윤환', '2026-06-05%2015%3A38%3A58'],
  ['FGZJJNY8YHBD', '인문논술 - 임찬우', '2026-06-06%2008%3A52%3A56'],
  ['2NBAYVL146EW', '인문논술 - 하태진', '2026-06-06%2013%3A42%3A44'],
  ['ELEWR9U7QDUX', '수리논술 - 김태훈', '2026-07-24%2020%3A20%3A29'],
  ['E4VW5Z2UPL9R', '수리논술 - 민준호', '2026-07-24%2021%3A35%3A17'],
  ['1Y3KKRWL9F3W', '수리논술 / 약술논술 - 이현진', '2026-06-06%2008%3A51%3A57'],
  ['ZX7JHDWL68ZL', '약술논술 - 구제범', '2026-06-06%2014%3A03%3A23'],
  ['UUYZJBNJQ3V3', '약술논술 - 배제형', '2026-06-05%2015%3A40%3A13'],
];

const teachers: Teacher[] = teacherRows.map(([id, name, version]) => ({
  id,
  name,
  categoryId: '1010',
  categoryName: `${name} 선생님`,
  ability: '',
  career: '',
  image: `/data/teacher/${id}?ver=${version}`,
  updatedAt: '2026-06-05 15:38:58',
}));

describe('TeachersContent', () => {
  it('renders every Bridge teacher image as its direct Legacy URL without lazy loading', () => {
    const { container } = render(<TeachersContent teachers={teachers} />);
    const images = [...container.querySelectorAll('.teacher-img-wrap img')];

    expect(images).toHaveLength(8);
    expect(images.map((image) => image.getAttribute('src'))).toEqual(
      teachers.map((teacher) => `https://nonsul-learn.com${teacher.image}`),
    );
    expect(images.every((image) => image.getAttribute('loading') === 'eager')).toBe(true);
    expect(images.some((image) => image.getAttribute('src')?.startsWith('/_next/image'))).toBe(
      false,
    );
  });
});
