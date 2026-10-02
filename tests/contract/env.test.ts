import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { clientEnvSchema, parseClientEnv } from '@/env.client';
import { parseServerEnv, serverEnvSchema } from '@/env.server';

describe('single environment contract', () => {
  it('env가 하나도 없어도 mock과 Legacy 기본값으로 파싱한다', () => {
    expect(parseClientEnv({})).toMatchObject({
      NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
      NEXT_PUBLIC_LEGACY_BASE_URL: 'https://nonsul-learn.com',
      NEXT_PUBLIC_LEGACY_ASSET_HOST: 'nonsul-learn.com',
    });
    expect(parseServerEnv({})).toMatchObject({ COURSE_SOURCE: 'mock' });
  });

  it('VERCEL_ENV=production이어도 env 없이 같은 기본값을 사용한다', () => {
    expect(parseClientEnv({ VERCEL_ENV: 'production' })).toMatchObject({
      NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
      NEXT_PUBLIC_LEGACY_BASE_URL: 'https://nonsul-learn.com',
    });
    expect(parseServerEnv({ VERCEL_ENV: 'production' })).toMatchObject({
      COURSE_SOURCE: 'mock',
    });
  });

  it('client env 결과에는 localhost가 없다', () => {
    expect(JSON.stringify(parseClientEnv({}))).not.toContain('localhost');
  });
});

describe('optional env validation', () => {
  it('http source용 Bridge URL은 optional이며 형식은 검증한다', () => {
    expect(serverEnvSchema.parse({ COURSE_SOURCE: 'mock' }).LEGACY_BRIDGE_BASE).toBeUndefined();
    expect(
      serverEnvSchema.safeParse({
        COURSE_SOURCE: 'http',
        LEGACY_BRIDGE_BASE: 'https://legacy.example.test/v2-api/',
      }).success,
    ).toBe(false);
  });

  it('site URL은 optional이며 제공되면 URL이어야 한다', () => {
    expect(clientEnvSchema.parse({}).NEXT_PUBLIC_SITE_URL).toBeUndefined();
    expect(clientEnvSchema.safeParse({ NEXT_PUBLIC_SITE_URL: 'nope' }).success).toBe(false);
  });
});

describe('.env.example', () => {
  const content = readFileSync('.env.example', 'utf8');

  it('모든 항목을 주석 처리하고 실제 값을 담지 않는다', () => {
    for (const name of [...Object.keys(clientEnvSchema.shape), ...Object.keys(serverEnvSchema.shape)]) {
      expect(content).toMatch(new RegExp(`^#\\s*${name}=`, 'm'));
    }
    expect(content).not.toMatch(/^\s*[^#\s][A-Z0-9_]*=/m);
  });
});
