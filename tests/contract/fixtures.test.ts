import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { courseItemResponseSchema, courseListResponseSchema } from '@/legacy/contracts/course';
import { viewerResponseSchema } from '@/legacy/contracts/viewer';

/**
 * L1 — Contract (HARNESS.md §3).
 *
 * fixture 디렉터리를 자동 순회한다. 새 fixture를 추가하면 테스트가 자동으로 늘어나고,
 * 짝이 되는 정상/invalid fixture가 없으면 커버리지 검사에서 실패한다.
 *
 * 이 테스트를 통과시키려고 fixture나 schema를 실제 Legacy 응답과 다르게 바꾸지 않는다 (AGENTS.md §9).
 */

const FIXTURE_DIR = 'src/legacy/contracts/fixtures';

/**
 * contract 이름 → schema.
 *
 * `course`는 목록 envelope(`items`)과 단건 envelope(`item`) 두 가지를 쓰므로 union이다.
 * envelope별 검증은 아래 "course envelope" 블록에서 따로 한다.
 */
const schemas: Record<string, z.ZodType<unknown>> = {
  viewer: viewerResponseSchema,
  course: z.union([courseItemResponseSchema, courseListResponseSchema]),
};

interface Fixture {
  file: string;
  contract: string;
  scenario: string;
  isInvalid: boolean;
  data: unknown;
}

const fixtures: Fixture[] = readdirSync(FIXTURE_DIR)
  .filter((file) => file.endsWith('.json'))
  .sort()
  .map((file) => {
    // `<contract>.<scenario>.json` — scenario 에 `.` 이 더 있을 수 있다 (invalid.has-mb_id).
    const base = path.basename(file, '.json');
    const firstDot = base.indexOf('.');
    const contract = base.slice(0, firstDot);
    const scenario = base.slice(firstDot + 1);
    return {
      file,
      contract,
      scenario,
      isInvalid: scenario.startsWith('invalid'),
      data: JSON.parse(readFileSync(path.join(FIXTURE_DIR, file), 'utf8')),
    };
  });

it('fixture 가 하나 이상 있다', () => {
  expect(fixtures.length).toBeGreaterThan(0);
});

describe('fixture 순회', () => {
  it.each(fixtures.map((fixture) => [fixture.file, fixture] as const))('%s', (_file, fixture) => {
    const schema = schemas[fixture.contract];
    expect(schema, `${fixture.contract} contract 의 schema 가 등록되지 않았다`).toBeDefined();

    const result = schema!.safeParse(fixture.data);
    // 정상 fixture 는 parse 성공, invalid.* 는 parse 실패여야 한다.
    expect(result.success).toBe(!fixture.isInvalid);
  });
});

describe('커버리지 (HARNESS.md §3)', () => {
  it.each(Object.keys(schemas))('%s contract 에 정상 fixture 가 1개 이상 있다', (contract) => {
    const normal = fixtures.filter((f) => f.contract === contract && !f.isInvalid);
    expect(normal.length).toBeGreaterThanOrEqual(1);
  });

  it.each(Object.keys(schemas))('%s contract 에 invalid fixture 가 1개 이상 있다', (contract) => {
    const invalid = fixtures.filter((f) => f.contract === contract && f.isInvalid);
    expect(invalid.length).toBeGreaterThanOrEqual(1);
  });

  it('schema 가 등록되지 않은 contract 의 fixture 가 없다', () => {
    const unknown = fixtures.filter((f) => schemas[f.contract] === undefined);
    expect(unknown.map((f) => f.file)).toEqual([]);
  });
});

describe('course envelope', () => {
  it('course.list 는 목록 envelope 이다', () => {
    const listFixture = fixtures.find((f) => f.file === 'course.list.json');
    expect(listFixture).toBeDefined();
    expect(courseListResponseSchema.safeParse(listFixture!.data).success).toBe(true);
    expect(courseItemResponseSchema.safeParse(listFixture!.data).success).toBe(false);
  });

  it.each(['course.on-sale.json', 'course.sold-out.json', 'course.missing.json'])(
    '%s 는 단건 envelope 이다',
    (file) => {
      const fixture = fixtures.find((f) => f.file === file);
      expect(fixture).toBeDefined();
      expect(courseItemResponseSchema.safeParse(fixture!.data).success).toBe(true);
      expect(courseListResponseSchema.safeParse(fixture!.data).success).toBe(false);
    },
  );
});

describe('fixture 에 실제 회원 정보가 없다 (HARNESS.md §2)', () => {
  it.each(fixtures.map((f) => [f.file, f] as const))('%s', (_file, fixture) => {
    const serialized = JSON.stringify(fixture.data);
    // 이메일, 한국 휴대폰 번호 모양, 주민번호 모양이 fixture 에 들어오면 안 된다.
    expect(serialized).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(serialized).not.toMatch(/01[016-9]-?\d{3,4}-?\d{4}/);
    expect(serialized).not.toMatch(/\d{6}-?[1-4]\d{6}/);
  });
});
