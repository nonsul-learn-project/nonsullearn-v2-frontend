import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// 기본 환경은 node (L1 contract, lint 경계 테스트).
// L2 component 테스트는 각 파일 맨 위 `// @vitest-environment jsdom` docblock으로 전환한다.
// tests/e2e 는 Playwright 소관이므로 Vitest 대상에서 제외한다.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // `server-only`는 react-server 조건이 아닌 곳에서 일부러 throw한다.
      // Next 빌드에서는 그게 목적이지만 테스트 런너에서는 패키지가 제공하는
      // no-op 구현으로 바꿔야 `@/env.server` 같은 서버 모듈을 검증할 수 있다.
      'server-only': fileURLToPath(new URL('./node_modules/server-only/empty.js', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    setupFiles: ['tests/setup.ts'],
    // 테스트도 env 없이 동작하는 Gate 4 전 단일 환경 기본값을 사용한다.
    env: {
      NEXT_PUBLIC_LEGACY_BASE_URL: 'https://nonsul-learn.com',
      NEXT_PUBLIC_LEGACY_ASSET_HOST: 'nonsul-learn.com',
    },
  },
});
