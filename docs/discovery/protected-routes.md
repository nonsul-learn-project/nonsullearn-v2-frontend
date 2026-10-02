# Protected Legacy Routes

작성일: 2026-10-02  
근거 파일: `local-audit-20261002-1033.txt`, `v2-discovery-20261002-1033.txt`  
상태: DONE-BASELINE

Gate 4는 화이트리스트 방식이다. 명시한 V2 경로만 프록시하므로 이 목록은 “검증용 금지 목록”이며 절대 Vercel로 보내면 안 된다. 근거: `GATES.md` Gate 4, local-audit:A11.

| 패턴/경로 | 보호 이유 | 근거 |
|---|---|---|
| `/shop/{inicis,kcp,lg,toss,nicepay,kakaopay}/**` | PG callback/return | local-audit:A11 |
| `/mobile/shop/**` | 모바일 PG/order 처리 | local-audit:A11 |
| `/plugin/{inicert,kcpcert,lgxpay}/**` | 인증/PG plugin | local-audit:A11 |
| `**/*orderformupdate.php`, `**/*personalpay*` | 결제/개인결제 write | local-audit:A11 |
| `/bbs/**`, `/uAdmin/**`, `/plugin/editor/**` | 업로드·auth·admin 가능 영역 | local-audit:A11 |
| `/lecture/**`, `/data/**` | LMS 및 Legacy runtime data | local-audit:A11 |
| `/v2-api/**` | Thin PHP Bridge는 PHP 유지 | local-audit:A11, v2-discovery:B3 |

<details>
<summary>확인된 개별 예시</summary>

`mobile/shop/inicis/pay_approval.php`, `pay_result.php`, `pay_return.php`; `mobile/shop/kcp/order_approval.php`, `personalpay_approval_form.php`; `mobile/shop/lg/returnurl.php`; `mobile/shop/nicepay/nicepay_result.php`; `mobile/shop/toss/returnurl.php`; `shop/inicis/inistdpay_result.php`, `inistdpay_return.php`; `shop/kakaopay/inicis_kk_return.php`.

</details>
