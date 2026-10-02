/**
 * Bridge 실패 사유. AGENTS.md §6.4: Bridge 실패는 예외가 아니라 **상태**다.
 *
 * 호출자는 이 타입으로 왜 실패했는지 구분해 로깅하고, UI에는 `unavailable`만 전달한다.
 */
export type BridgeErrorKind =
  /** 네트워크 자체가 실패했다 (DNS, 연결 끊김). */
  | 'network'
  /** `LEGACY_BRIDGE_TIMEOUT_MS`를 넘겼다. */
  | 'timeout'
  /** 2xx가 아니다. */
  | 'http'
  /**
   * JSON이 아닌 응답이 왔다.
   * Legacy Apache는 없는 경로에 `ErrorDocument 404 /index.php`로 **홈 HTML**을 돌려준다
   * (docs/discovery/bridge-risks.md "404 fallback"). 그래서 content-type 검사가 반드시 필요하다.
   */
  | 'not-json'
  /** JSON이지만 파싱이 깨졌다. */
  | 'malformed-json'
  /** JSON이지만 Contract와 맞지 않다. 버전 불일치나 금지 필드 유입을 포함한다. */
  | 'contract';

export class BridgeError extends Error {
  readonly kind: BridgeErrorKind;
  readonly path: string;
  readonly status: number | null;

  constructor(
    kind: BridgeErrorKind,
    path: string,
    message: string,
    options?: { status?: number | null; cause?: unknown },
  ) {
    super(`[bridge:${kind}] ${path} — ${message}`, { cause: options?.cause });
    this.name = 'BridgeError';
    this.kind = kind;
    this.path = path;
    this.status = options?.status ?? null;
  }
}

export function isBridgeError(value: unknown): value is BridgeError {
  return value instanceof BridgeError;
}

/** 응답이 JSON이라고 주장하는지 확인한다. charset 등 파라미터는 무시한다. */
export function isJsonContentType(contentType: string | null): boolean {
  if (contentType === null) return false;
  const essence = contentType.split(';')[0]?.trim().toLowerCase() ?? '';
  return essence === 'application/json' || essence.endsWith('+json');
}
