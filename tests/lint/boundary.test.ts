import { ESLint } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * AGENTS.md §6.2 경계 규칙이 **실제로 동작하는지** 증명한다.
 *
 * 규칙을 eslint.config.mjs 에 적어 두는 것만으로는 부족하다. files/ignores 패턴이 어긋나면
 * 규칙이 조용히 아무 파일에도 적용되지 않는다. 그래서 위반 샘플을 ESLint API 로 직접 lint 해
 * 에러가 나는지, 그리고 허용돼야 하는 코드는 통과하는지 양쪽을 확인한다.
 */

let eslint: ESLint;

/**
 * `new ESLint()` 는 싸지만 **첫 `lintText()` 가 비싸다** — flat config 를 해석하면서
 * eslint-config-next 와 TypeScript parser 를 끌어온다 (단독 실행에도 ~3초).
 *
 * 그 비용을 첫 `it` 안에서 치르면, 테스트 파일이 병렬로 돌 때 그 하나가 기본 5초 timeout 을
 * 넘겨 간헐적으로 실패한다. 여기서 미리 한 번 돌려 캐시를 덮혀 두면 개별 테스트는 수십 ms 다.
 * 검사 기준을 완화한 것이 아니라 준비 비용을 옮긴 것이다.
 */
beforeAll(async () => {
  eslint = new ESLint({ cwd: process.cwd() });
  await eslint.lintText('export const warmup = 1;\n', { filePath: 'src/app/page.tsx' });
}, 60_000);

/** 해당 경로로 코드를 lint 하고 발생한 ruleId 목록을 돌려준다. */
async function lint(filePath: string, code: string): Promise<string[]> {
  const results = await eslint.lintText(code, { filePath });
  return (results[0]?.messages ?? [])
    .map((message) => message.ruleId)
    .filter((ruleId): ruleId is string => ruleId !== null);
}

const expectViolation = async (filePath: string, code: string, ruleId: string): Promise<void> => {
  expect(await lint(filePath, code), `${filePath} 에서 ${ruleId} 가 발동해야 한다`).toContain(
    ruleId,
  );
};

const expectClean = async (filePath: string, code: string, ruleId: string): Promise<void> => {
  expect(
    await lint(filePath, code),
    `${filePath} 에서 ${ruleId} 가 발동하면 안 된다`,
  ).not.toContain(ruleId);
};

describe('process.env 직접 접근 금지', () => {
  const rule = 'no-restricted-syntax';

  it.each([
    'src/app/page.tsx',
    'src/features/header/AuthArea.tsx',
    'src/components/Card.tsx',
    'src/legacy/client/bridge-fetch.ts',
    'src/lib/format.ts',
    'src/analytics/track.ts',
  ])('%s 에서 process.env 를 읽으면 에러다', async (filePath) => {
    await expectViolation(filePath, 'export const a = process.env.NEXT_PUBLIC_SITE_URL;\n', rule);
  });

  it.each(['src/env.client.ts', 'src/env.server.ts'])('%s 은 예외다', async (filePath) => {
    await expectClean(filePath, 'export const a = process.env.NEXT_PUBLIC_SITE_URL;\n', rule);
  });

  it('env 를 거친 접근은 통과한다', async () => {
    await expectClean(
      'src/app/page.tsx',
      "import { clientEnv } from '@/env.client';\nexport const a = clientEnv.NEXT_PUBLIC_SITE_URL;\n",
      rule,
    );
  });
});

describe('@/legacy 내부 경로 직접 import 금지', () => {
  const rule = 'no-restricted-imports';

  it.each([
    "import { x } from '@/legacy/client/bridge-fetch';",
    "import { x } from '@/legacy/adapters/viewer';",
    "import { x } from '@/legacy/contracts/viewer';",
    "import { x } from '@/legacy/handoff/routes';",
  ])('app 에서 %s 는 에러다', async (statement) => {
    await expectViolation('src/app/page.tsx', `${statement}\nexport const a = x;\n`, rule);
  });

  it.each([
    "import { x } from '@/legacy/client/bridge-fetch';",
    "import { x } from '@/legacy/adapters/viewer';",
  ])('features 에서 %s 는 에러다', async (statement) => {
    await expectViolation(
      'src/features/header/AuthArea.tsx',
      `${statement}\nexport const a = x;\n`,
      rule,
    );
  });

  it.each(['src/app/page.tsx', 'src/features/header/AuthArea.tsx'])(
    '%s 에서 @/legacy (공개 API) 는 통과한다',
    async (filePath) => {
      await expectClean(
        filePath,
        "import { legacyRoutes } from '@/legacy';\nexport const a = legacyRoutes;\n",
        rule,
      );
    },
  );
});

describe('순수 UI 영역은 legacy / analytics 를 모른다', () => {
  const rule = 'no-restricted-imports';

  it.each(['src/design-system/primitives/Button.tsx', 'src/components/Card.tsx'])(
    '%s 에서 @/legacy 는 에러다',
    async (filePath) => {
      await expectViolation(
        filePath,
        "import { legacyRoutes } from '@/legacy';\nexport const a = legacyRoutes;\n",
        rule,
      );
    },
  );

  it.each(['src/design-system/primitives/Button.tsx', 'src/components/Card.tsx'])(
    '%s 에서 @/analytics 는 에러다',
    async (filePath) => {
      await expectViolation(
        filePath,
        "import { track } from '@/analytics';\nexport const a = track;\n",
        rule,
      );
    },
  );

  it('순수 UI 가 design-system 내부를 import 하는 것은 통과한다', async () => {
    await expectClean(
      'src/components/Card.tsx',
      "import { Container } from '@/design-system/primitives/Container';\nexport const a = Container;\n",
      rule,
    );
  });
});

describe('클라이언트 쪽에서 @/env.server import 금지', () => {
  const rule = 'no-restricted-imports';

  it.each(['src/design-system/primitives/Button.tsx', 'src/components/Card.tsx'])(
    '%s 에서 @/env.server 는 에러다',
    async (filePath) => {
      await expectViolation(
        filePath,
        "import { serverEnv } from '@/env.server';\nexport const a = serverEnv;\n",
        rule,
      );
    },
  );

  it('@/env.client 는 통과한다', async () => {
    await expectClean(
      'src/components/Card.tsx',
      "import { clientEnv } from '@/env.client';\nexport const a = clientEnv;\n",
      rule,
    );
  });
});

describe('legacy 폴더 내부는 상대경로로 참조한다', () => {
  const rule = 'no-restricted-imports';

  it('@/legacy 자기 참조는 에러다', async () => {
    await expectViolation(
      'src/legacy/adapters/viewer/http.ts',
      "import { x } from '@/legacy';\nexport const a = x;\n",
      rule,
    );
  });

  it('상대경로 참조는 통과한다', async () => {
    await expectClean(
      'src/legacy/adapters/viewer/http.ts',
      "import { x } from '../../client/bridge-fetch';\nexport const a = x;\n",
      rule,
    );
  });
});

describe('@/legacy 공개 API 는 index 와 server 두 개다 (ADR 0004)', () => {
  const rule = 'no-restricted-imports';

  it.each(['src/app/courses/page.tsx', 'src/features/home/CourseList.tsx'])(
    '%s 에서 @/legacy/server 는 통과한다',
    async (filePath) => {
      await expectClean(
        filePath,
        "import { getCourses } from '@/legacy/server';\nexport const a = getCourses;\n",
        rule,
      );
    },
  );

  it('@/legacy/server 와 비슷해 보이는 내부 경로는 여전히 막힌다', async () => {
    await expectViolation(
      'src/app/page.tsx',
      "import { x } from '@/legacy/server/internal';\nexport const a = x;\n",
      rule,
    );
  });

  it.each(['src/design-system/primitives/Button.tsx', 'src/components/Card.tsx'])(
    '순수 UI 영역인 %s 에서는 @/legacy/server 도 에러다',
    async (filePath) => {
      await expectViolation(
        filePath,
        "import { getCourses } from '@/legacy/server';\nexport const a = getCourses;\n",
        rule,
      );
    },
  );
});
