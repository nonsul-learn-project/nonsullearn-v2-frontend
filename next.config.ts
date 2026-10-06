import type { NextConfig } from 'next';

/**
 * Gate 4 방법 C: PHP gateway가 HTML만 전달하므로, browser bundle은 Vercel origin에서
 * 직접 받아야 한다. 값이 없으면 기존의 same-origin 개발 동작을 보존한다.
 *
 * next.config는 Next가 읽는 build-time 설정이라 env module을 import할 수 없다.
 * V2_ASSET_PREFIX의 계약/검증은 src/env.server.ts에도 같은 형태로 명시한다.
 */
const assetPrefix = process.env.V2_ASSET_PREFIX;

const nextConfig: NextConfig = {
  ...(assetPrefix === undefined || assetPrefix === '' ? {} : { assetPrefix }),
};

export default nextConfig;
