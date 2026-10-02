export {};

// jsdom 환경에서만 jest-dom matcher를 등록한다. node 환경 L1 테스트에는 영향이 없다.
if (typeof window !== 'undefined') {
  await import('@testing-library/jest-dom/vitest');
}
