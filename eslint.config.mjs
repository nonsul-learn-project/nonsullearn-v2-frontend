import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/**
 * AGENTS.md §6.2 Import 경계를 ESLint로 강제한다.
 *
 * 이 규칙이 실제로 동작하는지는 `tests/lint/boundary.test.ts`가 ESLint API로 직접 lint해 증명한다.
 * 규칙을 바꾸면 그 테스트도 같이 바뀌어야 한다.
 */

/** `@/legacy` 내부 경로 직접 import 금지. 공개 API는 `@/legacy`(index) 하나다. */
const legacyInternalsForbidden = {
  patterns: [
    {
      group: ['@/legacy/*', '@/legacy/*/**'],
      message:
        'Legacy 내부 경로를 직접 import하지 않는다. 공개 API는 `@/legacy` 하나다 (AGENTS.md §6.2).',
    },
  ],
};

/** 순수 UI 영역(design-system, components)은 Legacy와 analytics를 모른다. */
const pureUiForbidden = {
  patterns: [
    {
      group: ['@/legacy', '@/legacy/*', '@/legacy/*/**'],
      message:
        '순수 UI 영역은 Legacy를 import하지 않는다. 데이터는 prop으로 받는다 (AGENTS.md §6.2).',
    },
    {
      group: ['@/analytics', '@/analytics/*', '@/analytics/*/**'],
      message:
        '순수 UI 영역은 analytics를 import하지 않는다. 이벤트는 호출하는 쪽에서 보낸다 (AGENTS.md §6.2).',
    },
  ],
};

/** `src/env.server.ts`는 'server-only'로 1차 보장되지만, 클라이언트 컴포넌트에서의 import를 lint로도 막는다. */
const serverEnvForbidden = {
  patterns: [
    {
      group: ['@/env.server'],
      message:
        '클라이언트 컴포넌트에서 `@/env.server`를 import하지 않는다. `@/env.client`를 쓴다 (AGENTS.md §6.2).',
    },
  ],
};

/**
 * `process.env` 직접 접근 금지. 예외는 `src/env.client.ts`, `src/env.server.ts` 뿐이다.
 *
 * `no-restricted-properties`는 `process.env.FOO`를 잡지 못하므로(두 단계 멤버 접근)
 * selector로 `process.env` 자체를 잡는다.
 */
const noProcessEnv = {
  'no-restricted-syntax': [
    'error',
    {
      selector: "MemberExpression[object.name='process'][property.name='env']",
      message:
        '`process.env`에 직접 접근하지 않는다. `@/env.client` 또는 `@/env.server`를 쓴다 (AGENTS.md §6.2).',
    },
  ],
};

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'playwright-report/**',
    'test-results/**',
  ]),

  {
    name: 'nonsullearn/no-process-env',
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/env.client.ts', 'src/env.server.ts'],
    rules: noProcessEnv,
  },

  {
    name: 'nonsullearn/legacy-public-api-only',
    files: ['src/app/**/*.{ts,tsx}', 'src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', legacyInternalsForbidden],
    },
  },

  {
    name: 'nonsullearn/pure-ui',
    files: ['src/design-system/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [...pureUiForbidden.patterns, ...serverEnvForbidden.patterns] },
      ],
    },
  },

  {
    name: 'nonsullearn/legacy-internal-cross-import',
    files: ['src/legacy/**/*.{ts,tsx}'],
    rules: {
      // Legacy 폴더 안에서는 상대경로로 서로를 참조한다. `@/legacy` alias 자기 참조는 순환을 만든다.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/legacy', '@/legacy/*', '@/legacy/*/**'],
              message:
                'Legacy 폴더 내부에서는 상대경로로 참조한다. `@/legacy` 자기 참조는 순환을 만든다.',
            },
          ],
        },
      ],
    },
  },
]);
