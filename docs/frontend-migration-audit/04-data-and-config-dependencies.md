# Data and configuration dependencies

Static source names the GnuBoard `$g5` tables. The prior read-only schema artifact (`docs/production-discovery/01-production-schema-verification.md`) confirms relevant tables: `tbl_config`, `tbl_member`, `tbl_board`, `tbl_write_{briefing,correcting,notice}`, `tbl_shop_{banner,category,item,item_option,cart,coupon,order,*}`, `tbl_lec_item_{content,content_log,teacher}`, and `tbl_lec_order_member`.

Key columns observed in source: member `mb_id`, `mb_level`, `mb_name`, point/contact fields; item `it_id`, `it_name`, `it_price`, `it_use`, stock fields; LMS `od_status`, `start_date`, `end_date`, `progress`, `correc_cnt`, `lol_no`; board `bo_*`; post `wr_*`.

`data/dbconfig.php` is intentionally ignored and required to boot. `$config` and `$default` are runtime rows loaded by `common.php`; exact live values must remain confidential and are not in Git. Banner markup/file URLs depend on runtime `tbl_shop_banner` values and ignored `data/file/` assets.
