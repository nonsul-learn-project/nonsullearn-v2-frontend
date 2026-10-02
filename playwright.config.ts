import { defineConfig, devices } from '@playwright/test';

/**
 * L3 — Preview E2E (HARNESS.md §5). 로컬에서는 mock env 로 실제 빌드를 띄워 검증한다.
 *
 * `pnpm build && pnpm start` 를 쓰는 이유: dev 서버는 robots/metadata/proxy 동작이
 * 운영과 다르다. L3 는 "빌드된 결과물"을 봐야 의미가 있다.
 *
 * Chromium 만 돈다. Gate 1 의 목적은 브라우저 호환성이 아니라 라우팅·SEO·모바일 레이아웃이다.
 */

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/** mock 조합. 운영 도메인이나 실제 secret 을 쓰지 않는다. */
const mockEnv = {
  NEXT_PUBLIC_SITE_URL: BASE_URL,
  NEXT_PUBLIC_LEGACY_BASE_URL: '',
  NEXT_PUBLIC_LEGACY_ASSET_HOST: 'localhost',
  NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
  NEXT_PUBLIC_ANALYTICS_ENABLED: 'false',
  COURSE_SOURCE: 'mock',
  LEGACY_BRIDGE_BASE: `${BASE_URL}/v2-api`,
  LEGACY_BRIDGE_TIMEOUT_MS: '3000',
  COURSE_REVALIDATE_SECONDS: '300',
  V2_PROXY_SECRET: 'e2e-local-secret-not-production',
  V2_ENFORCE_PROXY: 'false',
  VERCEL_ENV: 'development',
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: mockEnv,
  },
});
