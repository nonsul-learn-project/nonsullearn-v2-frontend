import { afterEach } from 'vitest';

// jsdom 환경에서만 jest-dom matcher를 등록한다. node 환경 L1 테스트에는 영향이 없다.
if (typeof window !== 'undefined') {
  await import('@testing-library/jest-dom/vitest');

  // Testing Library 의 자동 cleanup 은 전역 afterEach 가 있을 때만 등록된다.
  // 이 레포는 `globals: false`(명시적 import)이므로 직접 걸어 준다.
  // 없으면 테스트마다 마운트가 쌓여 "Found multiple elements" 가 난다.
  const { cleanup } = await import('@testing-library/react');
  afterEach(() => {
    cleanup();
  });
}
