#!/usr/bin/env node
/**
 * Bridge Contract v1 검사기. **의존성 없이 Node 내장 모듈만** 쓴다.
 *
 * 두 가지 모드가 있다.
 *
 *   node scripts/bridge-check.mjs --fixtures [--json]
 *     오프라인. `contracts/bridge/fixtures/` 를 순회해서 정상 fixture 는 통과하고
 *     `*.invalid.json` 은 거부되는지 본다. 스키마는 파일명 접두사로 고른다.
 *     `--json` 은 판정을 기계가 읽을 수 있게 출력한다 (zod 와 대조하는 테스트가 쓴다).
 *
 *   BASE=https://nonsul-learn.com node scripts/bridge-check.mjs
 *     운영 실응답 검증 (L3 Bridge smoke). 사람이 실행한다.
 *     `SMOKE_PHPSESSID` 가 있으면 로그인 viewer 도 확인한다.
 *
 * 여기 있는 JSON Schema 검증기는 `contracts/bridge/*.schema.json` 이 실제로 쓰는 키워드만
 * 지원한다 (type, const, enum, required, properties, additionalProperties, items, oneOf,
 * 로컬 $ref, pattern, minimum, minLength). 스키마에 새 키워드를 쓰면 여기도 같이 늘려야 한다.
 */

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const CONTRACT_DIR = 'contracts/bridge';
const FIXTURE_DIR = path.join(CONTRACT_DIR, 'fixtures');

/** 스키마가 쓰도록 허락된 키워드. 알 수 없는 키워드는 조용히 통과하지 않고 터뜨린다. */
const SUPPORTED_KEYWORDS = new Set([
  '$schema',
  '$defs',
  '$ref',
  'title',
  'description',
  'type',
  'const',
  'enum',
  'required',
  'properties',
  'additionalProperties',
  'items',
  'oneOf',
  'pattern',
  'minimum',
  'minLength',
]);

// ---------------------------------------------------------------------------
// 작은 JSON Schema 검증기
// ---------------------------------------------------------------------------

function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';
  if (typeof value === 'number') return 'number';
  return typeof value;
}

function matchesType(value, expected) {
  const actual = typeOf(value);
  if (expected === 'number') return actual === 'number' || actual === 'integer';
  return actual === expected;
}

function resolveRef(ref, root) {
  if (!ref.startsWith('#/')) {
    throw new Error(`지원하지 않는 $ref 다 (로컬 참조만 가능): ${ref}`);
  }
  let node = root;
  for (const rawSegment of ref.slice(2).split('/')) {
    const segment = rawSegment.replace(/~1/g, '/').replace(/~0/g, '~');
    node = node?.[segment];
    if (node === undefined) throw new Error(`$ref 를 찾을 수 없다: ${ref}`);
  }
  return node;
}

/** 스키마를 검증한다. 반환값은 에러 메시지 배열이며, 빈 배열이면 통과다. */
function validate(value, schema, root = schema, instancePath = '') {
  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_KEYWORDS.has(keyword)) {
      throw new Error(`검증기가 모르는 키워드다: ${keyword} (scripts/bridge-check.mjs 를 늘려라)`);
    }
  }

  const at = instancePath === '' ? '(root)' : instancePath;
  const errors = [];

  if (schema.$ref !== undefined) {
    return validate(value, resolveRef(schema.$ref, root), root, instancePath);
  }

  if (schema.type !== undefined && !matchesType(value, schema.type)) {
    // 타입이 틀리면 이후 검사는 의미가 없다.
    return [`${at}: type 이 ${schema.type} 이어야 한다 (받은 값: ${typeOf(value)})`];
  }

  if (schema.const !== undefined && value !== schema.const) {
    errors.push(
      `${at}: ${JSON.stringify(schema.const)} 이어야 한다 (받은 값: ${JSON.stringify(value)})`,
    );
  }

  if (schema.enum !== undefined && !schema.enum.includes(value)) {
    errors.push(`${at}: enum 에 없는 값이다: ${JSON.stringify(value)}`);
  }

  if (schema.minimum !== undefined && typeof value === 'number' && value < schema.minimum) {
    errors.push(`${at}: ${schema.minimum} 이상이어야 한다 (받은 값: ${value})`);
  }

  if (
    schema.minLength !== undefined &&
    typeof value === 'string' &&
    value.length < schema.minLength
  ) {
    errors.push(`${at}: 길이가 ${schema.minLength} 이상이어야 한다`);
  }

  if (schema.pattern !== undefined && typeof value === 'string') {
    if (!new RegExp(schema.pattern, 'u').test(value)) {
      errors.push(`${at}: pattern ${schema.pattern} 과 맞지 않다: ${JSON.stringify(value)}`);
    }
  }

  if (schema.oneOf !== undefined) {
    const branchErrors = schema.oneOf.map((branch) => validate(value, branch, root, instancePath));
    const passing = branchErrors.filter((branch) => branch.length === 0);

    if (passing.length === 0) {
      // 어느 분기도 통과하지 못했다. 가장 가까운 분기의 사유를 보여줘야 디버깅이 된다.
      // (viewer 처럼 authenticated 로 갈라지는 union 은 이게 실제 위반 필드를 짚는다.)
      const closest = branchErrors.reduce((best, current) =>
        current.length < best.length ? current : best,
      );
      errors.push(`${at}: oneOf 분기를 하나도 만족하지 못했다`);
      errors.push(...closest.map((error) => `  └ ${error}`));
    } else if (passing.length > 1) {
      errors.push(`${at}: oneOf 분기를 ${passing.length}개 만족했다 (정확히 1개여야 한다)`);
    }
  }

  if (typeOf(value) === 'object') {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(`${at}: 필수 필드가 없다: ${key}`);
    }

    const properties = schema.properties ?? {};
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(properties, key)) {
          errors.push(`${at}: 정의되지 않은 필드다: ${key}`);
        }
      }
    }

    for (const [key, propertySchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, key)) {
        errors.push(...validate(value[key], propertySchema, root, `${instancePath}.${key}`));
      }
    }
  }

  if (typeOf(value) === 'array' && schema.items !== undefined) {
    value.forEach((entry, index) => {
      errors.push(...validate(entry, schema.items, root, `${instancePath}[${index}]`));
    });
  }

  return errors;
}

// ---------------------------------------------------------------------------
// 스키마 로딩
// ---------------------------------------------------------------------------

/** `viewer` → `viewer.v1.schema.json`. fixture 파일명 접두사가 그대로 스키마 이름이다. */
function loadSchemas() {
  const schemas = new Map();
  for (const file of readdirSync(CONTRACT_DIR).filter((f) => f.endsWith('.schema.json'))) {
    const name = file.replace(/\.v\d+\.schema\.json$/, '');
    schemas.set(name, JSON.parse(readFileSync(path.join(CONTRACT_DIR, file), 'utf8')));
  }
  return schemas;
}

// ---------------------------------------------------------------------------
// 결과 집계
// ---------------------------------------------------------------------------

let passed = 0;
const failures = [];

function report(label, errors) {
  if (errors.length === 0) {
    passed += 1;
    console.log(`  PASS  ${label}`);
    return true;
  }
  failures.push(label);
  console.log(`  FAIL  ${label}`);
  for (const error of errors) console.log(`        ${error}`);
  return false;
}

function finish(title) {
  console.log('');
  console.log(`${title}: ${passed} passed, ${failures.length} failed`);
  if (failures.length > 0) {
    for (const failure of failures) console.log(`  - ${failure}`);
    process.exit(1);
  }
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 모드 1 — fixture 검사 (오프라인)
// ---------------------------------------------------------------------------

/**
 * fixture 하나하나의 판정. `--json` 이 이 배열을 그대로 출력하고
 * `tests/contract/bridge-fixtures.test.ts` 가 zod 판정과 대조한다.
 */
function judgeFixtures(schemas) {
  return readdirSync(FIXTURE_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => {
      const base = path.basename(file, '.json');
      const name = base.slice(0, base.indexOf('.'));
      const expectedAccepted = !base.endsWith('.invalid');
      const schema = schemas.get(name);

      if (schema === undefined) {
        return {
          file,
          schema: name,
          expectedAccepted,
          accepted: false,
          errors: [`접두사 '${name}' 에 해당하는 스키마가 없다`],
          schemaMissing: true,
        };
      }

      let data;
      try {
        data = JSON.parse(readFileSync(path.join(FIXTURE_DIR, file), 'utf8'));
      } catch (cause) {
        return {
          file,
          schema: name,
          expectedAccepted,
          accepted: false,
          errors: [`JSON 파싱 실패: ${cause.message}`],
          schemaMissing: false,
        };
      }

      const errors = validate(data, schema);
      return {
        file,
        schema: name,
        expectedAccepted,
        accepted: errors.length === 0,
        errors,
        schemaMissing: false,
      };
    });
}

function checkFixtures({ asJson }) {
  const schemas = loadSchemas();
  const results = judgeFixtures(schemas);

  if (asJson) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }

  console.log(`fixture 검사 — ${FIXTURE_DIR}`);
  console.log(`스키마: ${[...schemas.keys()].sort().join(', ')}`);
  console.log('');

  if (results.length === 0) {
    report('fixture 가 하나 이상 있다', ['fixture 디렉터리가 비어 있다']);
    finish('fixtures');
  }

  for (const result of results) {
    if (result.schemaMissing) {
      report(result.file, result.errors);
      continue;
    }

    if (result.expectedAccepted) {
      report(`${result.file} → 통과해야 한다 (${result.schema}.v1)`, result.errors);
    } else {
      report(
        `${result.file} → 거부되어야 한다 (${result.schema}.v1)`,
        result.accepted ? ['거부되지 않고 통과했다'] : [],
      );
    }
  }

  const normalCount = results.filter((result) => result.expectedAccepted).length;
  console.log('');
  console.log(`정상 fixture ${normalCount}개, 거부 fixture ${results.length - normalCount}개`);
  finish('fixtures');
}

// ---------------------------------------------------------------------------
// 모드 2 — 운영 실응답 검증
// ---------------------------------------------------------------------------

/** `https://example.com` 과 `https://example.com/v2-api` 를 모두 받는다. */
function normalizeBase(raw) {
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed.endsWith('/v2-api') ? trimmed : `${trimmed}/v2-api`;
}

const TIMEOUT_MS = Number(process.env.BRIDGE_CHECK_TIMEOUT_MS ?? 10_000);

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: { Accept: 'application/json', ...(options.headers ?? {}) },
      // 리디렉션을 따라가지 않는다. Legacy 로그인 페이지로 튀는 것 자체가 실패다.
      redirect: 'manual',
      signal: controller.signal,
    });
    const text = await response.text();
    return { response, text };
  } finally {
    clearTimeout(timer);
  }
}

function isJson(contentType) {
  if (contentType === null) return false;
  const essence = contentType.split(';')[0].trim().toLowerCase();
  return essence === 'application/json' || essence.endsWith('+json');
}

/** 상태코드 + JSON content-type + 스키마를 한 번에 본다. 통과하면 파싱된 본문을 같이 돌려준다. */
function checkJsonResponse({ response, text }, { expectStatus, schema, schemaName }) {
  const errors = [];

  if (response.status !== expectStatus) {
    errors.push(`status 가 ${expectStatus} 이어야 한다 (받은 값: ${response.status})`);
  }

  const contentType = response.headers.get('content-type');
  if (!isJson(contentType)) {
    errors.push(`content-type 이 JSON 이어야 한다 (받은 값: ${contentType ?? '(없음)'})`);
    return { errors, body: null };
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch (cause) {
    errors.push(`JSON 파싱 실패: ${cause.message}`);
    return { errors, body: null };
  }

  errors.push(...validate(body, schema).map((error) => `${schemaName}: ${error}`));
  return { errors, body };
}

async function checkLive(rawBase) {
  const schemas = loadSchemas();
  const base = normalizeBase(rawBase);
  console.log(`Bridge 실응답 검증 — ${base}`);
  console.log(`timeout ${TIMEOUT_MS}ms`);
  console.log('');

  // 1. viewer — 쿠키 없이 호출하면 반드시 비로그인이다.
  const viewer = await request(`${base}/viewer.php`);
  const viewerResult = checkJsonResponse(viewer, {
    expectStatus: 200,
    schema: schemas.get('viewer'),
    schemaName: 'viewer.v1',
  });
  const viewerErrors = [...viewerResult.errors];
  if (viewerResult.body !== null && viewerResult.body.authenticated !== false) {
    viewerErrors.push('쿠키를 보내지 않았는데 authenticated 가 false 가 아니다');
  }
  const viewerCacheControl = viewer.response.headers.get('cache-control') ?? '';
  if (!viewerCacheControl.toLowerCase().includes('no-store')) {
    viewerErrors.push(`Cache-Control 에 no-store 가 없다: ${viewerCacheControl || '(없음)'}`);
  }
  for (const header of ['access-control-allow-origin', 'access-control-allow-credentials']) {
    const value = viewer.response.headers.get(header);
    if (value !== null) viewerErrors.push(`CORS 헤더가 있다: ${header}: ${value}`);
  }
  report('viewer.php — 쿠키 없음 → authenticated=false, no-store, CORS 헤더 없음', viewerErrors);

  // 2. courses 목록 — 공개 캐시이며 쿠키를 심지 않는다.
  const list = await request(`${base}/courses.php`);
  const listResult = checkJsonResponse(list, {
    expectStatus: 200,
    schema: schemas.get('courses-list'),
    schemaName: 'courses-list.v1',
  });
  const listErrors = [...listResult.errors];
  const listCacheControl = (list.response.headers.get('cache-control') ?? '').toLowerCase();
  if (!listCacheControl.includes('public')) {
    listErrors.push(`Cache-Control 에 public 이 없다: ${listCacheControl || '(없음)'}`);
  }
  if (!listCacheControl.includes('max-age')) {
    listErrors.push(`Cache-Control 에 max-age 가 없다: ${listCacheControl || '(없음)'}`);
  }
  const setCookie = list.response.headers.getSetCookie?.() ?? [];
  if (setCookie.length > 0) {
    listErrors.push(`Set-Cookie 가 있다 (${setCookie.length}개). 공개 응답은 쿠키를 심지 않는다`);
  }
  report('courses.php — public 캐시, Set-Cookie 없음, 목록 Contract', listErrors);

  // 3. 첫 항목 단건.
  const firstId = listResult.body?.items?.[0]?.id;
  if (typeof firstId === 'string') {
    const detail = await request(`${base}/courses.php?id=${encodeURIComponent(firstId)}`);
    const detailResult = checkJsonResponse(detail, {
      expectStatus: 200,
      schema: schemas.get('course-detail'),
      schemaName: 'course-detail.v1',
    });
    const detailErrors = [...detailResult.errors];
    if (detailResult.body !== null && detailResult.body.item?.id !== firstId) {
      detailErrors.push(`요청한 id(${firstId}) 와 응답 item.id 가 다르다`);
    }
    report(`courses.php?id=${firstId} — 단건 Contract`, detailErrors);
  } else {
    report('courses.php?id=<첫 항목> — 단건 Contract', [
      '목록이 비어 있어 단건을 검사할 수 없다 (목록 검사 결과를 먼저 보라)',
    ]);
  }

  // 4. 없는 id → 404 + not_found.
  const notFound = await request(`${base}/courses.php?id=zzz-no-such-id`);
  const notFoundResult = checkJsonResponse(notFound, {
    expectStatus: 404,
    schema: schemas.get('error'),
    schemaName: 'error.v1',
  });
  const notFoundErrors = [...notFoundResult.errors];
  if (notFoundResult.body !== null && notFoundResult.body.error !== 'not_found') {
    notFoundErrors.push(`error 가 not_found 여야 한다 (받은 값: ${notFoundResult.body.error})`);
  }
  report('courses.php?id=zzz-no-such-id — 404 not_found', notFoundErrors);

  // 5. 경로 탈출 시도 → 400 + invalid_id. `..%2F` 를 그대로 보내려고 URL 문자열을 직접 만든다.
  const invalidId = await request(`${base}/courses.php?id=..%2F`);
  const invalidIdResult = checkJsonResponse(invalidId, {
    expectStatus: 400,
    schema: schemas.get('error'),
    schemaName: 'error.v1',
  });
  const invalidIdErrors = [...invalidIdResult.errors];
  if (invalidIdResult.body !== null && invalidIdResult.body.error !== 'invalid_id') {
    invalidIdErrors.push(`error 가 invalid_id 여야 한다 (받은 값: ${invalidIdResult.body.error})`);
  }
  report('courses.php?id=..%2F — 400 invalid_id', invalidIdErrors);

  // 6. POST 차단. Bridge 는 읽기 전용이다.
  const post = await request(`${base}/courses.php`, { method: 'POST' });
  const postResult = checkJsonResponse(post, {
    expectStatus: 405,
    schema: schemas.get('error'),
    schemaName: 'error.v1',
  });
  const postErrors = [...postResult.errors];
  if (postResult.body !== null && postResult.body.error !== 'method_not_allowed') {
    postErrors.push(`error 가 method_not_allowed 여야 한다 (받은 값: ${postResult.body.error})`);
  }
  report('POST courses.php — 405 method_not_allowed', postErrors);

  // 7. 선택 — 로그인 viewer.
  const sessionId = process.env.SMOKE_PHPSESSID;
  if (sessionId === undefined || sessionId === '') {
    console.log('  SKIP  로그인 viewer (SMOKE_PHPSESSID 없음)');
  } else {
    const authed = await request(`${base}/viewer.php`, {
      headers: { Cookie: `PHPSESSID=${sessionId}` },
    });
    const authedResult = checkJsonResponse(authed, {
      expectStatus: 200,
      schema: schemas.get('viewer'),
      schemaName: 'viewer.v1',
    });
    const authedErrors = [...authedResult.errors];
    if (authedResult.body !== null && authedResult.body.authenticated !== true) {
      authedErrors.push(
        '세션 쿠키를 보냈는데 authenticated 가 true 가 아니다 (세션이 만료됐을 수 있다)',
      );
    }
    report('viewer.php — SMOKE_PHPSESSID → authenticated=true', authedErrors);
  }

  finish('bridge');
}

// ---------------------------------------------------------------------------

const wantsFixtures = process.argv.includes('--fixtures');
const base = process.env.BASE;

if (wantsFixtures) {
  checkFixtures({ asJson: process.argv.includes('--json') });
} else if (base !== undefined && base !== '') {
  await checkLive(base);
} else {
  console.error('사용법:');
  console.error('  node scripts/bridge-check.mjs --fixtures [--json]');
  console.error('  BASE=https://nonsul-learn.com node scripts/bridge-check.mjs');
  process.exit(2);
}
