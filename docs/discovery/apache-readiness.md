# Apache Gate 4 Readiness

작성일: 2026-10-02  
근거 파일: `v2-discovery-20261002-1033.txt`, `http-20261002-1033.txt`, `manual-checks-20261002.md`  
상태: PARTIAL

| 항목 | 현재 | 필요 | 조치 | 근거 |
|---|---|---|---|---|
| Apache/MPM | 2.4.58, prefork + itk | Gate 4 proxy | 영향 검토 | v2-discovery:B2 |
| 모듈 | rewrite/headers/ssl 로드, proxy/proxy_http 미로드 | proxy, proxy_http | sudo 후 enable 및 configtest | v2-discovery:B2 |
| vhost | `/etc/apache2/sites-enabled/sites.conf:23`, `_default_:443` 다중 사용 | 좁은 V2 whitelist | 전체 vhost 영향 검토 | v2-discovery:B2,B3 |
| Directory | AllowOverride All, MultiViews | V2 경로 명시 처리 | MultiViews/404 fallback 회피 | v2-discovery:B3 |
| sudo | 비밀번호 필요 | config 변경 권한 | 권한 방식 결정 | v2-discovery:B10 |
| reload | 7개 vhost 동거 | 안전한 rollback | 저부하 시간, 전체 영향 공지 | v2-discovery:B2,B3 |
| configtest | 현재 실행 증거 없음 | 변경 전/후 검사 | `apachectl configtest` 후 reload | v2-discovery:B2 |

## 용량

현재 911MB 중 가용 238MB, swap 0, Apache 평균 RSS 약 23MB, `MaxRequestWorkers=150`, mysqld RSS 235MB다. 단순 최대 Apache RSS는 `150 × 23MB = 약 3,450MB`로 물리 메모리 911MB를 초과한다. 이는 실제 동시 최대 사용량의 측정값이 아니라 위험 신호다. 근거: v2-discovery:B1,B4.

선택지: (1) swap 추가, (2) `MaxRequestWorkers` 하향, (3) KeepAliveTimeout/Timeout 조정, (4) instance upgrade. 권장 순서는 측정 후 (2)+(3) 또는 (4) 결정이다. 하향 계산식은 `(가용 메모리 − DB − 운영 여유) / 프로세스당 RSS`; DB·여유 예산은 증거에 없어 확정값을 제시하지 않는다. [결정](decisions-needed.md#1-서버-용량-조치).

[추론] CloudWatch memory/CPU 및 Apache error.log의 worker 경고가 있어야 적정값을 확정할 수 있다. 근거: v2-discovery:B1,B4,B11.
