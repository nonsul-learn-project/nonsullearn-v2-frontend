# Nonsul-Learn Production Data Baseline

- Generated: `2026-09-28 13:44:07`
- Database: `nonsullearndb`
- MariaDB: `10.11.14-MariaDB-0ubuntu0.24.04.1`
- Mode: `READ-ONLY DISCOVERY`
- PII/raw user content/password hashes: `NOT COLLECTED`

## 1. Database Environment

| Property | Value |
|---|---|
| Database | `nonsullearndb` |
| Version | `10.11.14-MariaDB-0ubuntu0.24.04.1` |
| Character Set | `utf8mb4` |
| Collation | `utf8mb4_general_ci` |
| System Time Zone | `KST` |
| Session Time Zone | `SYSTEM` |

## 2. Storage Engines

| Engine | Tables |
|---|---:|
| InnoDB | 61 |
| MyISAM | 5 |

## 3. Critical Exact Row Counts

> These are exact COUNT(*) values, not INFORMATION_SCHEMA estimates.

| Domain | Table | Exact Rows |
|---|---|---:|
| Identity | `tbl_member` | 330 |
| Commerce | `tbl_shop_item` | 61 |
| Commerce | `tbl_shop_order` | 200 |
| Commerce | `tbl_shop_cart` | 292 |
| Learning | `tbl_lec_order_member` | 200 |
| Learning | `tbl_lec_item_content` | 253 |
| Learning | `tbl_lec_item_content_log` | 486 |
| Correction | `tbl_write_correcting` | 545 |
| Files | `tbl_board_file` | 780 |

## 4. Declared Foreign Keys

| Table | Constraint | Column | Referenced Table | Referenced Column |
|---|---|---|---|---|

**Declared FK count:** `0`

## 5. Known Schema Drift Checks

### Lecture Exam Table Names

| Table | Exists |
|---|---|
| `tbl_rlec_item_exam` | YES |
| `tbl_lec_item_exam` | NO |

### `correc_cnt` Column

| Table | Column | Type |
|---|---|---|
| `tbl_lec_order_member` | `correc_cnt` | `tinyint(4)` |

**correc_cnt occurrence count:** `1`

## 6. Relationship Integrity

> Aggregate counts only. No member IDs or order IDs are exposed.

| Relationship Check | Orphan Rows |
|---|---:|
| `tbl_lec_order_member.mb_id -> tbl_member.mb_id` | 0 |
| `tbl_lec_order_member.od_id -> tbl_shop_order.od_id` | 0 |
| `tbl_shop_order.mb_id -> tbl_member.mb_id` | 0 |

## 7. Order Status Vocabulary

> Aggregate status counts only.

| Order Status | Rows |
|---|---:|
| `완료` | 141 |
| `취소` | 31 |
| `입금` | 19 |
| `준비` | 6 |
| `배송` | 3 |

## 8. Settlement Method Vocabulary

| Settlement Method | Rows |
|---|---:|
| `신용카드` | 156 |
| `무통장` | 44 |

## 9. Test Order Distribution

| od_test | Rows |
|---|---:|
| `0` | 199 |
| `1` | 1 |

## 10. Payment Gateway Vocabulary

| PG | Rows |
|---|---:|
| `lg` | 199 |
| `toss` | 1 |

## 11. Critical Table Engine / Collation

| Table | Engine | Collation |
|---|---|---|
| `tbl_board_file` | InnoDB | utf8mb3_general_ci |
| `tbl_lec_item_content` | MyISAM | utf8mb3_general_ci |
| `tbl_lec_item_content_log` | MyISAM | utf8mb3_general_ci |
| `tbl_lec_order_member` | MyISAM | utf8mb3_general_ci |
| `tbl_member` | InnoDB | utf8mb3_general_ci |
| `tbl_rlec_item_exam` | MyISAM | utf8mb3_general_ci |
| `tbl_shop_cart` | InnoDB | utf8mb3_general_ci |
| `tbl_shop_item` | InnoDB | utf8mb3_general_ci |
| `tbl_shop_order` | InnoDB | utf8mb3_general_ci |
| `tbl_write_correcting` | InnoDB | utf8mb3_general_ci |

## 12. Discovery Summary

- Production tables: `66`
- Production columns: `1438`
- Declared foreign keys: `0`
- MyISAM tables: `5`

## 13. Next Discovery

- PHP write/read path mapping
- Learning entitlement/status semantics
- Correction workflow semantics
- Authentication hash compatibility profiling
- DB/file reconciliation
- Payment/refund reconciliation
- Cron/runtime dependency inventory
- Backup/recovery verification

> This document is a read-only production discovery artifact. It does not contain raw member rows, password hashes, transaction IDs, or user-generated content.
