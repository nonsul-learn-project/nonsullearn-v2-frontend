import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Gate 1 scaffold 불변식을 고정한다. AGENTS.md §6.1(strict), §5(명령어 이름),
// 기술 기준(pnpm 고정)이 나중에 조용히 되돌아가는 것을 막는다.

const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'));

describe('tsconfig', () => {
  const tsconfig = readJson('tsconfig.json') as {
    compilerOptions: Record<string, unknown>;
  };

  it('strict 와 noUncheckedIndexedAccess 가 켜져 있다', () => {
    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
  });

  it('@/* alias 가 src 를 가리킨다', () => {
    expect(tsconfig.compilerOptions.paths).toMatchObject({ '@/*': ['./src/*'] });
  });
});

describe('package.json', () => {
  const pkg = readJson('package.json') as {
    packageManager?: string;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  it('packageManager 로 pnpm 을 고정한다', () => {
    expect(pkg.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+/);
  });

  it('AGENTS.md §5 가 요구하는 script 이름이 전부 있다', () => {
    const required = [
      'dev',
      'build',
      'start',
      'lint',
      'typecheck',
      'test',
      'test:contract',
      'test:component',
      'test:e2e',
      'test:visual',
      'smoke:prod',
      'format',
      'check',
    ];
    for (const name of required) {
      expect(pkg.scripts, `missing script: ${name}`).toHaveProperty(name);
    }
  });

  it('check 가 lint, typecheck, test, build 를 모두 포함한다', () => {
    for (const step of ['lint', 'typecheck', 'test', 'build']) {
      expect(pkg.scripts.check).toContain(step);
    }
  });

  it('AGENTS.md §2 가 금지한 DB 드라이버 의존성이 없다', () => {
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const forbidden of ['mysql', 'mysql2', 'mariadb', 'prisma', '@prisma/client', 'drizzle-orm', 'pg', 'knex', 'sequelize', 'typeorm']) {
      expect(all, `forbidden dependency: ${forbidden}`).not.toHaveProperty(forbidden);
    }
  });

  it('Tailwind 를 설치하지 않는다 (Gate 2는 legacy CSS 재사용)', () => {
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(all).not.toHaveProperty('tailwindcss');
  });
});
