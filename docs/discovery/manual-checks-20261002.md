[M1] 2026-10-02 10:41 — B7 해시 대조
명령: diff (local-audit B7-LOCAL 해시 목록) (v2-discovery B7 해시 목록)
결과: 11개 파일 해시 전부 일치
대상: index.php, common.php, config.php, head.php, _head.php, head.sub.php,
      tail.php, _tail.php, shop/item.php, shop/ajax.list.php, bbs/login.php

[M2] 2026-10-02 10:46 — teacher asset (확장자 없어 H5/B8 목록에서 누락된 자산)
$ curl -sI https://nonsul-learn.com/data/teacher/HP3L51W1RDDF | head -3
HTTP/1.1 200 OK
Date: Fri, 02 Oct 2026 01:46:06 GMT
Server: Apache/2.4.58 (Ubuntu)

[M3] 2026-10-02 10:46 — html2/.htaccess 전체 (로컬 baseline, M1로 운영과 동일 확인된 트리)
Header set Access-Control-Allow-Origin "*"
php_flag allow_url_fopen 1
RewriteEngine On
RewriteBase /

#RewriteCond %{HTTPS} off
#RewriteRule ^(.*)$ https://demo.edu-platform.net/$1 [L,R=301]
#RewriteCond %{HTTP_HOST} !^www\. [/NC]
#RewriteRule ^(.*)$ https://demo.edu-platform.net/$1 [L,R=301]

RewriteCond %{REQUEST_URI}      !^/uAdmin$
#RewriteRule ^([a-zA-Z0-9_]+)*$         /index.php?pCode=$1 [L]

ErrorDocument 404 /index.php

[M4] 2026-10-02 10:33 — 서버 SSH 접속 방식
run-all.sh 실행 중 SSH/SCP가 매번 비밀번호를 요구함 (키 기반 아님, 비밀번호 인증 허용 상태)

[M5] 2026-10-02 10:30 — 서버 로그인 배너
"*** System restart required ***" 표시 (보안 업데이트 적용 대기, uptime 162일)

[M6] 2026-10-01 15:03 — 장애 기록
VS Code Remote-SSH / ssh: "Connection timed out during banner exchange" (TCP 연결 성공, sshd 응답 없음).
이후 재부팅 없이 자연 회복 (B1 uptime 162일로 확인).
