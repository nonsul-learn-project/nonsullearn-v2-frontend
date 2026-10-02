# Legacy URL Map

작성일: 2026-10-02  
근거 파일: `local-audit-20261002-1033.txt`, `manual-checks-20261002.md`  
상태: DONE-BASELINE (M1 대상 파일 기반 행은 DONE)

| 기능 | URL | 파라미터 | 로그인 필요 | 근거 |
|---|---|---|---|---|
| 로그인 | `/bbs/login.php` | `url` 복귀 URL | 아니오 | local-audit:A5, html2/head.php:116, manual:M1 |
| 로그아웃 | `/bbs/logout.php` | 없음 | 예 | local-audit:A5, html2/head.php:108, manual:M1 |
| 회원가입 | `/bbs/register.php` | 없음 | 아니오 | local-audit:A5, html2/head.php:112, manual:M1 |
| 정보수정 | `/bbs/member_confirm.php` | `url=register_form.php` | 예 | html2/head.php:103, manual:M1 |
| 나의강의실 | `/lecture/mypage.php` | 없음 | 예 | local-audit:A5, html2/head.php:88, manual:M1 |
| 첨삭제출현황 | `/bbs/board.php` | `bo_table=correcting` | level > 7 | html2/head.php:84-87, manual:M1 |
| 공지사항 | `/bbs/board.php` | `bo_table=notice` | 아니오 | html2/head.php:90, manual:M1 |
| 현장강의설명회 | `/bbs/board.php` | `bo_table=briefing` | 아니오 | html2/head.php:39, manual:M1 |
| 소개 | `/ceo_message`, `/teacher`, `/correction.php` | 없음 | 아니오 | html2/head.php:36-38, manual:M1 |
| 강좌 목록 | `/shop/list.php` | `ca_id` | 아니오 | html2/head.php:45-75, manual:M1 |
| 강좌 상세 | `/shop/item.php` | `it_id` | 아니오 | local-audit:A6, manual:M1 |
| 관리자 | `/uAdmin` | 없음 | 관리자 | local-audit:A5,A11 |

## 강사별 `ca_id`

| 분류 | 강사 / ca_id | 근거 |
|---|---|---|
| 인문논술 | 김윤환 1010, 임찬우 1020, 하태진 1030 | html2/head.php:45-51, manual:M1 |
| 수리논술 | 김태훈 3020, 이현진 3040, 민준호 3050 | html2/head.php:57-63, manual:M1 |
| 약술논술 | 구제범 4010, 배제형 4020, 이현진 4030 | html2/head.php:69-75, manual:M1 |

## 홈 외부 단축 링크

| URL | 근거 |
|---|---|
| `https://vo.la/NERFJS9` | html2/index.php:402, manual:M1 |
| `https://vo.la/zbillKT` | html2/index.php:414, manual:M1 |
| `https://vo.la/Eea5MFN` | html2/index.php:427, manual:M1 |

강좌 상세는 `get_shop_item_with_category`, `it_use`/`ca_use`, soldout, 전화문의, 가격 계산을 포함하며 hit UPDATE와 `ck_it_id` 쿠키 부수효과가 있다. 근거: local-audit:A6, manual:M1.
