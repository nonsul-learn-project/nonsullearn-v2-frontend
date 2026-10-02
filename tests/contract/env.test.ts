import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { clientEnvSchema } from '@/env.client';
import { assertProductionGuards, serverEnvSchema, type ServerEnv } from '@/env.server';

// Gate 1: env contract. 정상 조합은 통과하고 production 금지 조합은 실패해야 한다.
// `src/env.*.ts`를 import하면 모듈 로드 시점에 실제 process.env를 검증하므로
// 여기서는 schema와 guard 함수를 직접 호출해 테스트 환경과 분리한다.

const validClient = {
  NEXT_PUBLIC_SITE_URL: 'https://example.test',
  NEXT_PUBLIC_LEGACY_BASE_URL: '',
  NEXT_PUBLIC_LEGACY_ASSET_HOST: 'assets.example.test',
  NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
  NEXT_PUBLIC_ANALYTICS_ENABLED: 'false',
} as const;

const validServer = {
  COURSE_SOURCE: 'mock',
  LEGACY_BRIDGE_BASE: 'https://example.test/v2-api',
  LEGACY_BRIDGE_TIMEOUT_MS: '3000',
  COURSE_REVALIDATE_SECONDS: '300',
  V2_PROXY_SECRET: 'local-development-secret',
  V2_ENFORCE_PROXY: 'false',
  VERCEL_ENV: 'development',
} as const;

const parseServer = (overrides: Record<string, string | undefined>): ServerEnv =>
  serverEnvSchema.parse({ ...validServer, ...overrides });

describe('client env', () => {
  it('정상 조합을 통과한다', () => {
    expect(clientEnvSchema.safeParse(validClient).success).toBe(true);
  });

  it('NEXT_PUBLIC_ANALYTICS_ENABLED 를 생략하면 false 가 기본이다', () => {
    const parsed = clientEnvSchema.parse({
      ...validClient,
      NEXT_PUBLIC_ANALYTICS_ENABLED: undefined,
    });
    expect(parsed.NEXT_PUBLIC_ANALYTICS_ENABLED).toBe('false');
  });

  it('NEXT_PUBLIC_LEGACY_BASE_URL 은 빈 문자열(상대경로)과 URL 만 받는다', () => {
    const field = clientEnvSchema.shape.NEXT_PUBLIC_LEGACY_BASE_URL;
    expect(field.safeParse('').success).toBe(true);
    expect(field.safeParse('https://legacy.example.test').success).toBe(true);
    expect(field.safeParse('/v2-api').success).toBe(false);
  });

  it('NEXT_PUBLIC_LEGACY_ASSET_HOST 는 hostname 만 받는다', () => {
    const field = clientEnvSchema.shape.NEXT_PUBLIC_LEGACY_ASSET_HOST;
    expect(field.safeParse('assets.example.test').success).toBe(true);
    expect(field.safeParse('https://assets.example.test').success).toBe(false);
    expect(field.safeParse('assets.example.test/img').success).toBe(false);
    expect(field.safeParse('assets.example.test:8080').success).toBe(false);
  });

  it('NEXT_PUBLIC_SITE_URL 이 없거나 URL 이 아니면 실패한다', () => {
    expect(
      clientEnvSchema.safeParse({ ...validClient, NEXT_PUBLIC_SITE_URL: undefined }).success,
    ).toBe(false);
    expect(
      clientEnvSchema.safeParse({ ...validClient, NEXT_PUBLIC_SITE_URL: 'nope' }).success,
    ).toBe(false);
  });

  it('NEXT_PUBLIC_VIEWER_SOURCE 는 mock | http 만 받는다', () => {
    expect(
      clientEnvSchema.safeParse({ ...validClient, NEXT_PUBLIC_VIEWER_SOURCE: 'live' }).success,
    ).toBe(false);
  });
});

describe('server env', () => {
  it('정상 조합을 통과한다', () => {
    expect(serverEnvSchema.safeParse(validServer).success).toBe(true);
  });

  it('기본값을 채운다', () => {
    const parsed = serverEnvSchema.parse({
      COURSE_SOURCE: 'mock',
      LEGACY_BRIDGE_BASE: 'https://example.test/v2-api',
      V2_PROXY_SECRET: 'local-development-secret',
    });
    expect(parsed.LEGACY_BRIDGE_TIMEOUT_MS).toBe(3000);
    expect(parsed.COURSE_REVALIDATE_SECONDS).toBe(300);
    expect(parsed.V2_ENFORCE_PROXY).toBe('false');
    expect(parsed.VERCEL_ENV).toBe('development');
  });

  it('LEGACY_BRIDGE_BASE 끝에 / 가 있으면 실패한다', () => {
    expect(
      serverEnvSchema.safeParse({
        ...validServer,
        LEGACY_BRIDGE_BASE: 'https://example.test/v2-api/',
      }).success,
    ).toBe(false);
  });

  it('LEGACY_BRIDGE_TIMEOUT_MS 는 500~10000 범위다', () => {
    expect(
      serverEnvSchema.safeParse({ ...validServer, LEGACY_BRIDGE_TIMEOUT_MS: '499' }).success,
    ).toBe(false);
    expect(
      serverEnvSchema.safeParse({ ...validServer, LEGACY_BRIDGE_TIMEOUT_MS: '10001' }).success,
    ).toBe(false);
    expect(
      serverEnvSchema.safeParse({ ...validServer, LEGACY_BRIDGE_TIMEOUT_MS: '500' }).success,
    ).toBe(true);
  });

  it('COURSE_REVALIDATE_SECONDS 는 30 이상이다', () => {
    expect(
      serverEnvSchema.safeParse({ ...validServer, COURSE_REVALIDATE_SECONDS: '29' }).success,
    ).toBe(false);
    expect(
      serverEnvSchema.safeParse({ ...validServer, COURSE_REVALIDATE_SECONDS: '30' }).success,
    ).toBe(true);
  });

  it('V2_PROXY_SECRET 은 최소 16자다', () => {
    expect(serverEnvSchema.safeParse({ ...validServer, V2_PROXY_SECRET: 'short' }).success).toBe(
      false,
    );
    expect(
      serverEnvSchema.safeParse({ ...validServer, V2_PROXY_SECRET: 'x'.repeat(16) }).success,
    ).toBe(true);
  });

  it('DB 접속 정보는 server env schema 에 존재하지 않는다 (AGENTS.md §2)', () => {
    const keys = Object.keys(serverEnvSchema.shape);
    for (const forbidden of [
      'DB_HOST',
      'DB_PORT',
      'DB_NAME',
      'DB_USER',
      'DB_PASSWORD',
      'DATABASE_URL',
      'SESSION_SECRET',
      'DATA_ROOT',
    ]) {
      expect(keys, `forbidden env key: ${forbidden}`).not.toContain(forbidden);
    }
  });
});

describe('production 금지 조합', () => {
  const productionSecret = 'a'.repeat(32);

  it('정상 production 조합은 통과한다', () => {
    const env = parseServer({
      VERCEL_ENV: 'production',
      COURSE_SOURCE: 'http',
      V2_PROXY_SECRET: productionSecret,
    });
    expect(() => assertProductionGuards(env, 'http')).not.toThrow();
  });

  it('viewer source 가 mock 이면 실패한다', () => {
    const env = parseServer({
      VERCEL_ENV: 'production',
      COURSE_SOURCE: 'http',
      V2_PROXY_SECRET: productionSecret,
    });
    expect(() => assertProductionGuards(env, 'mock')).toThrow(/NEXT_PUBLIC_VIEWER_SOURCE/);
  });

  it('COURSE_SOURCE 가 mock 이면 실패한다', () => {
    const env = parseServer({
      VERCEL_ENV: 'production',
      COURSE_SOURCE: 'mock',
      V2_PROXY_SECRET: productionSecret,
    });
    expect(() => assertProductionGuards(env, 'http')).toThrow(/COURSE_SOURCE/);
  });

  it('V2_PROXY_SECRET 이 32자 미만이면 실패한다', () => {
    const env = parseServer({
      VERCEL_ENV: 'production',
      COURSE_SOURCE: 'http',
      V2_PROXY_SECRET: 'b'.repeat(31),
    });
    expect(() => assertProductionGuards(env, 'http')).toThrow(/V2_PROXY_SECRET/);
  });

  it('non-production 에서는 mock 과 짧은 secret 을 허용한다', () => {
    for (const vercelEnv of ['development', 'preview'] as const) {
      const env = parseServer({
        VERCEL_ENV: vercelEnv,
        COURSE_SOURCE: 'mock',
        V2_PROXY_SECRET: 'x'.repeat(16),
      });
      expect(() => assertProductionGuards(env, 'mock')).not.toThrow();
    }
  });
});

describe('.env.example', () => {
  const content = readFileSync('.env.example', 'utf8');
  const declared = new Set(
    content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((line) => line.split('=')[0]),
  );

  it('schema 가 요구하는 모든 변수를 선언한다 (GATES.md: .env.example 이 단일 진실)', () => {
    const required = [...Object.keys(clientEnvSchema.shape), ...Object.keys(serverEnvSchema.shape)];
    for (const name of required) {
      expect(declared, `.env.example 에 ${name} 이 없다`).toContain(name);
    }
  });

  it('schema 에 없는 변수를 선언하지 않는다', () => {
    const known = new Set([
      ...Object.keys(clientEnvSchema.shape),
      ...Object.keys(serverEnvSchema.shape),
    ]);
    for (const name of declared) {
      expect(known, `.env.example 의 ${name} 이 schema 에 없다`).toContain(name);
    }
  });

  it('비밀값처럼 보이는 실제 값이 커밋되지 않았다', () => {
    expect(content).not.toMatch(/DB_PASSWORD|SESSION_SECRET|PHPSESSID=/);
    // 32자 이상 hex 는 openssl rand 로 만든 실제 secret 일 가능성이 높다.
    expect(content).not.toMatch(/=[0-9a-f]{32,}/);
  });
});
