import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// 기본 환경은 node (L1 contract, lint 경계 테스트).
// L2 component 테스트는 각 파일 맨 위 `// @vitest-environment jsdom` docblock으로 전환한다.
// tests/e2e 는 Playwright 소관이므로 Vitest 대상에서 제외한다.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    setupFiles: ['tests/setup.ts'],
  },
});
