import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { courseCommunityResponseSchema } from '@/legacy/contracts/course-community';
import {
  bridgeErrorResponseSchema,
  courseItemResponseSchema,
  courseListResponseSchema,
} from '@/legacy/contracts/course';
import { courseFullResponseSchema } from '@/legacy/contracts/course-full';
import { viewerResponseSchema } from '@/legacy/contracts/viewer';

/**
 * L1 — Bridge Contract v1 (HARNESS.md §3).
 *
 * `contracts/bridge/` 가 단일 원본이고, `src/legacy/contracts/` 의 zod 는 그 사본이다.
 * 이 테스트의 핵심은 **두 검증기의 판정이 모든 fixture 에서 같다**는 것이다.
 * 한쪽만 고치면 여기서 깨진다.
 *
 * 이 테스트를 통과시키려고 fixture 나 schema 를 실제 Legacy 응답과 다르게 바꾸지 않는다
 * (AGENTS.md §9).
 */

const FIXTURE_DIR = 'contracts/bridge/fixtures';

/** fixture 파일명 접두사 → zod schema. JSON Schema 쪽은 같은 접두사로 스키마를 고른다. */
const schemas: Record<string, z.ZodType<unknown>> = {
  viewer: viewerResponseSchema,
  'courses-list': courseListResponseSchema,
  'course-detail': courseItemResponseSchema,
  // Gate 8 — `/v2-api/course-detail.php` 와 `/v2-api/course-community.php`.
  'course-full': courseFullResponseSchema,
  'course-community': courseCommunityResponseSchema,
  error: bridgeErrorResponseSchema,
};

interface Fixture {
  file: string;
  /** 파일명 접두사. 스키마 이름이기도 하다. */
  name: string;
  /** `*.invalid.json` 이면 false — 거부되어야 하는 응답이다. */
  expectedAccepted: boolean;
  data: unknown;
}

const fixtures: Fixture[] = readdirSync(FIXTURE_DIR)
  .filter((file) => file.endsWith('.json'))
  .sort()
  .map((file) => {
    const base = path.basename(file, '.json');
    return {
      file,
      name: base.slice(0, base.indexOf('.')),
      expectedAccepted: !base.endsWith('.invalid'),
      data: JSON.parse(readFileSync(path.join(FIXTURE_DIR, file), 'utf8')),
    };
  });

/** 검사기(`scripts/bridge-check.mjs`)의 판정. 실제 CLI 를 실행해서 받는다. */
interface CheckerVerdict {
  file: string;
  schema: string;
  expectedAccepted: boolean;
  accepted: boolean;
  errors: string[];
  schemaMissing: boolean;
}

const checkerVerdicts: CheckerVerdict[] = JSON.parse(
  execFileSync('node', ['scripts/bridge-check.mjs', '--fixtures', '--json'], {
    encoding: 'utf8',
  }),
);

const zodAccepts = (fixture: Fixture): boolean => {
  const schema = schemas[fixture.name];
  if (schema === undefined) throw new Error(`zod schema 가 없다: ${fixture.name}`);
  return schema.safeParse(fixture.data).success;
};

it('fixture 가 하나 이상 있다', () => {
  expect(fixtures.length).toBeGreaterThan(0);
});

describe('zod 판정', () => {
  it.each(fixtures.map((fixture) => [fixture.file, fixture] as const))('%s', (_file, fixture) => {
    expect(schemas[fixture.name], `접두사 '${fixture.name}' 의 zod schema 가 없다`).toBeDefined();
    expect(zodAccepts(fixture)).toBe(fixture.expectedAccepted);
  });
});

describe('JSON Schema 판정 (scripts/bridge-check.mjs)', () => {
  it('검사기가 모든 fixture 를 봤다', () => {
    expect(checkerVerdicts.map((verdict) => verdict.file)).toEqual(
      fixtures.map((fixture) => fixture.file),
    );
  });

  it.each(fixtures.map((fixture) => [fixture.file, fixture] as const))('%s', (file, fixture) => {
    const verdict = checkerVerdicts.find((candidate) => candidate.file === file);
    expect(verdict, `검사기 결과에 ${file} 이 없다`).toBeDefined();
    expect(verdict!.schemaMissing).toBe(false);
    expect(verdict!.accepted).toBe(fixture.expectedAccepted);
  });
});

describe('zod 와 JSON Schema 의 판정이 같다', () => {
  it.each(fixtures.map((fixture) => [fixture.file, fixture] as const))('%s', (file, fixture) => {
    const verdict = checkerVerdicts.find((candidate) => candidate.file === file);
    expect(
      zodAccepts(fixture),
      `zod 와 contracts/bridge/${fixture.name}.v1.schema.json 의 판정이 다르다. ` +
        `JSON Schema 쪽 사유: ${verdict?.errors.join(' / ') || '(없음)'}`,
    ).toBe(verdict!.accepted);
  });
});

describe('거부 fixture 가 막아야 하는 것을 실제로 막는다', () => {
  it('viewer 에 mb_id 가 섞이면 거부한다 (ADR 0003)', () => {
    const leak = fixtures.find((fixture) => fixture.file === 'viewer.leaks-mb_id.invalid.json');
    expect(leak).toBeDefined();
    expect(JSON.stringify(leak!.data)).toContain('mb_id');
    expect(zodAccepts(leak!)).toBe(false);
  });

  it('viewer 에 raw level 이 섞이면 거부한다 (AGENTS.md §6.4)', () => {
    const raw = fixtures.find((fixture) => fixture.file === 'viewer.raw-level.invalid.json');
    expect(raw).toBeDefined();
    expect(JSON.stringify(raw!.data)).toContain('level');
    expect(zodAccepts(raw!)).toBe(false);
  });

  it('image 가 절대 URL 이면 거부한다 (호스트 결합은 legacyAssetUrl 이 한다)', () => {
    const absolute = fixtures.find(
      (fixture) => fixture.file === 'course-detail.absolute-image.invalid.json',
    );
    expect(absolute).toBeDefined();
    expect(JSON.stringify(absolute!.data)).toContain('https://');
    expect(zodAccepts(absolute!)).toBe(false);
  });
});

describe('커버리지 (HARNESS.md §3)', () => {
  it.each(Object.keys(schemas))('%s 에 정상 fixture 가 1개 이상 있다', (name) => {
    expect(fixtures.filter((f) => f.name === name && f.expectedAccepted).length).toBeGreaterThan(0);
  });

  it('schema 가 등록되지 않은 fixture 가 없다', () => {
    expect(fixtures.filter((f) => schemas[f.name] === undefined).map((f) => f.file)).toEqual([]);
  });

  it('거부 fixture 가 3개 이상 있다 (개인정보 2 + 이미지 1)', () => {
    expect(fixtures.filter((f) => !f.expectedAccepted).length).toBeGreaterThanOrEqual(3);
  });

  it('모든 zod schema 에 대응하는 JSON Schema 파일이 있다', () => {
    const schemaFiles = readdirSync('contracts/bridge').filter((file) =>
      file.endsWith('.schema.json'),
    );
    for (const name of Object.keys(schemas)) {
      expect(schemaFiles, `${name} 의 JSON Schema 가 없다`).toContain(`${name}.v1.schema.json`);
    }
  });
});

describe('envelope 이 서로 섞이지 않는다', () => {
  it('목록 응답은 단건 schema 로 파싱되지 않는다', () => {
    const list = fixtures.find((f) => f.file === 'courses-list.basic.json')!;
    expect(courseListResponseSchema.safeParse(list.data).success).toBe(true);
    expect(courseItemResponseSchema.safeParse(list.data).success).toBe(false);
  });

  it('단건 응답은 목록 schema 로 파싱되지 않는다', () => {
    const detail = fixtures.find((f) => f.file === 'course-detail.basic.json')!;
    expect(courseItemResponseSchema.safeParse(detail.data).success).toBe(true);
    expect(courseListResponseSchema.safeParse(detail.data).success).toBe(false);
  });

  it('error 응답은 데이터 envelope 로 파싱되지 않는다', () => {
    const error = fixtures.find((f) => f.file === 'error.not_found.json')!;
    expect(bridgeErrorResponseSchema.safeParse(error.data).success).toBe(true);
    expect(courseItemResponseSchema.safeParse(error.data).success).toBe(false);
    expect(courseListResponseSchema.safeParse(error.data).success).toBe(false);
  });

  it('단건 envelope 의 item 은 null 이 될 수 없다 (없는 강좌는 404 + error)', () => {
    expect(courseItemResponseSchema.safeParse({ v: 1, item: null }).success).toBe(false);
  });
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
