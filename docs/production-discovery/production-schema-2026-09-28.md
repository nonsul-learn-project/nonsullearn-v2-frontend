# Nonsul-Learn Production Database Schema

- Generated: `2026-09-28 12:23:55`
- Database: `nonsullearndb`
- MariaDB version: `10.11.14-MariaDB-0ubuntu0.24.04.1`
- Tables: `66`
- Columns: `1438`
- Index entries: `176`

## Database Objects

- Views: 0
- Triggers: 0
- Routines: 0
- Events: 0

## Storage Engines

| Engine | Tables |
|---|---:|
| InnoDB | 61 |
| MyISAM | 5 |

## Table Overview

| Table | Engine | Estimated Rows | Collation |
|---|---|---:|---|
| `tbl_auth` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_autosave` | InnoDB | 27 | utf8mb3_general_ci |
| `tbl_board` | InnoDB | 3 | utf8mb3_general_ci |
| `tbl_board_file` | InnoDB | 780 | utf8mb3_general_ci |
| `tbl_board_good` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_board_new` | InnoDB | 152 | utf8mb3_general_ci |
| `tbl_cert_history` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_config` | InnoDB | 1 | utf8mb3_general_ci |
| `tbl_content` | InnoDB | 4 | utf8mb3_general_ci |
| `tbl_faq` | InnoDB | 14 | utf8mb3_general_ci |
| `tbl_faq_master` | InnoDB | 4 | utf8mb3_general_ci |
| `tbl_group` | InnoDB | 2 | utf8mb3_general_ci |
| `tbl_group_member` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_lec_item_content` | MyISAM | 253 | utf8mb3_general_ci |
| `tbl_lec_item_content_log` | MyISAM | 486 | utf8mb3_general_ci |
| `tbl_lec_item_exam_license` | InnoDB | 0 | utf8mb4_general_ci |
| `tbl_lec_item_exam_result` | InnoDB | 0 | utf8mb4_general_ci |
| `tbl_lec_item_exam_tasks` | InnoDB | 0 | utf8mb4_general_ci |
| `tbl_lec_item_teacher` | MyISAM | 8 | utf8mb3_general_ci |
| `tbl_lec_order_member` | MyISAM | 200 | utf8mb3_general_ci |
| `tbl_login` | InnoDB | 5 | utf8mb3_general_ci |
| `tbl_mail` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_member` | InnoDB | 330 | utf8mb3_general_ci |
| `tbl_member_cert_history` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_member_social_profiles` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_memo` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_menu` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_new_win` | InnoDB | 1 | utf8mb3_general_ci |
| `tbl_point` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_poll` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_poll_etc` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_popular` | InnoDB | 289 | utf8mb3_general_ci |
| `tbl_qa_config` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_qa_content` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_rlec_item_exam` | MyISAM | 0 | utf8mb3_general_ci |
| `tbl_scrap` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_banner` | InnoDB | 15 | utf8mb3_general_ci |
| `tbl_shop_cart` | InnoDB | 291 | utf8mb3_general_ci |
| `tbl_shop_category` | InnoDB | 35 | utf8mb3_general_ci |
| `tbl_shop_coupon` | InnoDB | 25 | utf8mb3_general_ci |
| `tbl_shop_coupon_log` | InnoDB | 17 | utf8mb3_general_ci |
| `tbl_shop_coupon_zone` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_default` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_event` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_event_item` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_inicis_log` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_item` | InnoDB | 37 | utf8mb3_general_ci |
| `tbl_shop_item_option` | InnoDB | 5 | utf8mb3_general_ci |
| `tbl_shop_item_qa` | InnoDB | 4 | utf8mb3_general_ci |
| `tbl_shop_item_relation` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_item_stocksms` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_item_use` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_order` | InnoDB | 200 | utf8mb3_general_ci |
| `tbl_shop_order_address` | InnoDB | 144 | utf8mb3_general_ci |
| `tbl_shop_order_data` | InnoDB | 53 | utf8mb3_general_ci |
| `tbl_shop_order_delete` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_order_post_log` | InnoDB | 2 | utf8mb3_general_ci |
| `tbl_shop_personalpay` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_sendcost` | InnoDB | 0 | utf8mb3_general_ci |
| `tbl_shop_wish` | InnoDB | 5 | utf8mb3_general_ci |
| `tbl_uniqid` | InnoDB | 8054 | utf8mb3_general_ci |
| `tbl_visit` | InnoDB | 53602 | utf8mb3_general_ci |
| `tbl_visit_sum` | InnoDB | 229 | utf8mb3_general_ci |
| `tbl_write_briefing` | InnoDB | 12 | utf8mb3_general_ci |
| `tbl_write_correcting` | InnoDB | 529 | utf8mb3_general_ci |
| `tbl_write_notice` | InnoDB | 10 | utf8mb3_general_ci |

## Columns


### `tbl_auth`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `mb_id` | `varchar(20)` | NO | PRI | `''` | - |
| 2 | `au_menu` | `varchar(50)` | NO | PRI | `''` | - |
| 3 | `au_auth` | `set('r','w','d')` | NO | - | `''` | - |

### `tbl_autosave`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `as_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(20)` | NO | MUL | `NULL` | - |
| 3 | `as_uid` | `bigint(20) unsigned` | NO | UNI | `NULL` | - |
| 4 | `as_subject` | `varchar(255)` | NO | - | `NULL` | - |
| 5 | `as_content` | `text` | NO | - | `NULL` | - |
| 6 | `as_datetime` | `datetime` | NO | - | `NULL` | - |

### `tbl_board`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `bo_table` | `varchar(20)` | NO | PRI | `''` | - |
| 2 | `gr_id` | `varchar(255)` | NO | - | `''` | - |
| 3 | `bo_subject` | `varchar(255)` | NO | - | `''` | - |
| 4 | `bo_mobile_subject` | `varchar(255)` | NO | - | `''` | - |
| 5 | `bo_device` | `enum('both','pc','mobile')` | NO | - | `'both'` | - |
| 6 | `bo_admin` | `varchar(255)` | NO | - | `''` | - |
| 7 | `bo_list_level` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `bo_read_level` | `tinyint(4)` | NO | - | `0` | - |
| 9 | `bo_write_level` | `tinyint(4)` | NO | - | `0` | - |
| 10 | `bo_reply_level` | `tinyint(4)` | NO | - | `0` | - |
| 11 | `bo_comment_level` | `tinyint(4)` | NO | - | `0` | - |
| 12 | `bo_upload_level` | `tinyint(4)` | NO | - | `0` | - |
| 13 | `bo_download_level` | `tinyint(4)` | NO | - | `0` | - |
| 14 | `bo_html_level` | `tinyint(4)` | NO | - | `0` | - |
| 15 | `bo_link_level` | `tinyint(4)` | NO | - | `0` | - |
| 16 | `bo_count_delete` | `tinyint(4)` | NO | - | `0` | - |
| 17 | `bo_count_modify` | `tinyint(4)` | NO | - | `0` | - |
| 18 | `bo_read_point` | `int(11)` | NO | - | `0` | - |
| 19 | `bo_write_point` | `int(11)` | NO | - | `0` | - |
| 20 | `bo_comment_point` | `int(11)` | NO | - | `0` | - |
| 21 | `bo_download_point` | `int(11)` | NO | - | `0` | - |
| 22 | `bo_use_category` | `tinyint(4)` | NO | - | `0` | - |
| 23 | `bo_category_list` | `text` | NO | - | `NULL` | - |
| 24 | `bo_use_sideview` | `tinyint(4)` | NO | - | `0` | - |
| 25 | `bo_use_file_content` | `tinyint(4)` | NO | - | `0` | - |
| 26 | `bo_use_secret` | `tinyint(4)` | NO | - | `0` | - |
| 27 | `bo_use_dhtml_editor` | `tinyint(4)` | NO | - | `0` | - |
| 28 | `bo_select_editor` | `varchar(50)` | NO | - | `''` | - |
| 29 | `bo_use_rss_view` | `tinyint(4)` | NO | - | `0` | - |
| 30 | `bo_use_good` | `tinyint(4)` | NO | - | `0` | - |
| 31 | `bo_use_nogood` | `tinyint(4)` | NO | - | `0` | - |
| 32 | `bo_use_name` | `tinyint(4)` | NO | - | `0` | - |
| 33 | `bo_use_signature` | `tinyint(4)` | NO | - | `0` | - |
| 34 | `bo_use_ip_view` | `tinyint(4)` | NO | - | `0` | - |
| 35 | `bo_use_list_view` | `tinyint(4)` | NO | - | `0` | - |
| 36 | `bo_use_list_file` | `tinyint(4)` | NO | - | `0` | - |
| 37 | `bo_use_list_content` | `tinyint(4)` | NO | - | `0` | - |
| 38 | `bo_table_width` | `int(11)` | NO | - | `0` | - |
| 39 | `bo_subject_len` | `int(11)` | NO | - | `0` | - |
| 40 | `bo_mobile_subject_len` | `int(11)` | NO | - | `0` | - |
| 41 | `bo_page_rows` | `int(11)` | NO | - | `0` | - |
| 42 | `bo_mobile_page_rows` | `int(11)` | NO | - | `0` | - |
| 43 | `bo_new` | `int(11)` | NO | - | `0` | - |
| 44 | `bo_hot` | `int(11)` | NO | - | `0` | - |
| 45 | `bo_image_width` | `int(11)` | NO | - | `0` | - |
| 46 | `bo_skin` | `varchar(255)` | NO | - | `''` | - |
| 47 | `bo_mobile_skin` | `varchar(255)` | NO | - | `''` | - |
| 48 | `bo_include_head` | `varchar(255)` | NO | - | `''` | - |
| 49 | `bo_include_tail` | `varchar(255)` | NO | - | `''` | - |
| 50 | `bo_content_head` | `text` | NO | - | `NULL` | - |
| 51 | `bo_mobile_content_head` | `text` | NO | - | `NULL` | - |
| 52 | `bo_content_tail` | `text` | NO | - | `NULL` | - |
| 53 | `bo_mobile_content_tail` | `text` | NO | - | `NULL` | - |
| 54 | `bo_insert_content` | `text` | NO | - | `NULL` | - |
| 55 | `bo_gallery_cols` | `int(11)` | NO | - | `0` | - |
| 56 | `bo_gallery_width` | `int(11)` | NO | - | `0` | - |
| 57 | `bo_gallery_height` | `int(11)` | NO | - | `0` | - |
| 58 | `bo_mobile_gallery_width` | `int(11)` | NO | - | `0` | - |
| 59 | `bo_mobile_gallery_height` | `int(11)` | NO | - | `0` | - |
| 60 | `bo_upload_size` | `int(11)` | NO | - | `0` | - |
| 61 | `bo_reply_order` | `tinyint(4)` | NO | - | `0` | - |
| 62 | `bo_use_search` | `tinyint(4)` | NO | - | `0` | - |
| 63 | `bo_order` | `int(11)` | NO | - | `0` | - |
| 64 | `bo_count_write` | `int(11)` | NO | - | `0` | - |
| 65 | `bo_count_comment` | `int(11)` | NO | - | `0` | - |
| 66 | `bo_write_min` | `int(11)` | NO | - | `0` | - |
| 67 | `bo_write_max` | `int(11)` | NO | - | `0` | - |
| 68 | `bo_comment_min` | `int(11)` | NO | - | `0` | - |
| 69 | `bo_comment_max` | `int(11)` | NO | - | `0` | - |
| 70 | `bo_notice` | `text` | NO | - | `NULL` | - |
| 71 | `bo_upload_count` | `tinyint(4)` | NO | - | `0` | - |
| 72 | `bo_use_email` | `tinyint(4)` | NO | - | `0` | - |
| 73 | `bo_use_cert` | `enum('','cert','adult','hp-cert','hp-adult')` | NO | - | `''` | - |
| 74 | `bo_use_sns` | `tinyint(4)` | NO | - | `0` | - |
| 75 | `bo_use_captcha` | `tinyint(4)` | NO | - | `0` | - |
| 76 | `bo_sort_field` | `varchar(255)` | NO | - | `''` | - |
| 77 | `bo_1_subj` | `varchar(255)` | NO | - | `''` | - |
| 78 | `bo_2_subj` | `varchar(255)` | NO | - | `''` | - |
| 79 | `bo_3_subj` | `varchar(255)` | NO | - | `''` | - |
| 80 | `bo_4_subj` | `varchar(255)` | NO | - | `''` | - |
| 81 | `bo_5_subj` | `varchar(255)` | NO | - | `''` | - |
| 82 | `bo_6_subj` | `varchar(255)` | NO | - | `''` | - |
| 83 | `bo_7_subj` | `varchar(255)` | NO | - | `''` | - |
| 84 | `bo_8_subj` | `varchar(255)` | NO | - | `''` | - |
| 85 | `bo_9_subj` | `varchar(255)` | NO | - | `''` | - |
| 86 | `bo_10_subj` | `varchar(255)` | NO | - | `''` | - |
| 87 | `bo_1` | `varchar(255)` | NO | - | `''` | - |
| 88 | `bo_2` | `varchar(255)` | NO | - | `''` | - |
| 89 | `bo_3` | `varchar(255)` | NO | - | `''` | - |
| 90 | `bo_4` | `varchar(255)` | NO | - | `''` | - |
| 91 | `bo_5` | `varchar(255)` | NO | - | `''` | - |
| 92 | `bo_6` | `varchar(255)` | NO | - | `''` | - |
| 93 | `bo_7` | `varchar(255)` | NO | - | `''` | - |
| 94 | `bo_8` | `varchar(255)` | NO | - | `''` | - |
| 95 | `bo_9` | `varchar(255)` | NO | - | `''` | - |
| 96 | `bo_10` | `varchar(255)` | NO | - | `''` | - |

### `tbl_board_file`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `bo_table` | `varchar(20)` | NO | PRI | `''` | - |
| 2 | `wr_id` | `int(11)` | NO | PRI | `0` | - |
| 3 | `bf_no` | `int(11)` | NO | PRI | `0` | - |
| 4 | `bf_source` | `varchar(255)` | NO | - | `''` | - |
| 5 | `bf_file` | `varchar(255)` | NO | - | `''` | - |
| 6 | `bf_download` | `int(11)` | NO | - | `NULL` | - |
| 7 | `bf_content` | `text` | NO | - | `NULL` | - |
| 8 | `bf_fileurl` | `varchar(255)` | NO | - | `''` | - |
| 9 | `bf_thumburl` | `varchar(255)` | NO | - | `''` | - |
| 10 | `bf_storage` | `varchar(50)` | NO | - | `''` | - |
| 11 | `bf_filesize` | `int(11)` | NO | - | `0` | - |
| 12 | `bf_width` | `int(11)` | NO | - | `0` | - |
| 13 | `bf_height` | `smallint(6)` | NO | - | `0` | - |
| 14 | `bf_type` | `tinyint(4)` | NO | - | `0` | - |
| 15 | `bf_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_board_good`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `bg_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `bo_table` | `varchar(20)` | NO | MUL | `''` | - |
| 3 | `wr_id` | `int(11)` | NO | - | `0` | - |
| 4 | `mb_id` | `varchar(20)` | NO | - | `''` | - |
| 5 | `bg_flag` | `varchar(255)` | NO | - | `''` | - |
| 6 | `bg_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_board_new`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `bn_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `bo_table` | `varchar(20)` | NO | - | `''` | - |
| 3 | `wr_id` | `int(11)` | NO | - | `0` | - |
| 4 | `wr_parent` | `int(11)` | NO | - | `0` | - |
| 5 | `bn_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 6 | `mb_id` | `varchar(20)` | NO | MUL | `''` | - |

### `tbl_cert_history`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `cr_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(20)` | NO | MUL | `''` | - |
| 3 | `cr_company` | `varchar(255)` | NO | - | `''` | - |
| 4 | `cr_method` | `varchar(255)` | NO | - | `''` | - |
| 5 | `cr_ip` | `varchar(255)` | NO | - | `''` | - |
| 6 | `cr_date` | `date` | NO | - | `'0000-00-00'` | - |
| 7 | `cr_time` | `time` | NO | - | `'00:00:00'` | - |

### `tbl_config`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `cf_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `cf_title` | `varchar(255)` | NO | - | `''` | - |
| 3 | `cf_theme` | `varchar(100)` | NO | - | `''` | - |
| 4 | `cf_admin` | `varchar(100)` | NO | - | `''` | - |
| 5 | `cf_admin_email` | `varchar(100)` | NO | - | `''` | - |
| 6 | `cf_admin_email_name` | `varchar(100)` | NO | - | `''` | - |
| 7 | `cf_add_script` | `text` | NO | - | `NULL` | - |
| 8 | `cf_use_point` | `tinyint(4)` | NO | - | `0` | - |
| 9 | `cf_point_term` | `int(11)` | NO | - | `0` | - |
| 10 | `cf_use_copy_log` | `tinyint(4)` | NO | - | `0` | - |
| 11 | `cf_use_email_certify` | `tinyint(4)` | NO | - | `0` | - |
| 12 | `cf_login_point` | `int(11)` | NO | - | `0` | - |
| 13 | `cf_cut_name` | `tinyint(4)` | NO | - | `0` | - |
| 14 | `cf_nick_modify` | `int(11)` | NO | - | `0` | - |
| 15 | `cf_new_skin` | `varchar(50)` | NO | - | `''` | - |
| 16 | `cf_new_rows` | `int(11)` | NO | - | `0` | - |
| 17 | `cf_search_skin` | `varchar(50)` | NO | - | `''` | - |
| 18 | `cf_connect_skin` | `varchar(50)` | NO | - | `''` | - |
| 19 | `cf_faq_skin` | `varchar(50)` | NO | - | `''` | - |
| 20 | `cf_read_point` | `int(11)` | NO | - | `0` | - |
| 21 | `cf_write_point` | `int(11)` | NO | - | `0` | - |
| 22 | `cf_comment_point` | `int(11)` | NO | - | `0` | - |
| 23 | `cf_download_point` | `int(11)` | NO | - | `0` | - |
| 24 | `cf_write_pages` | `int(11)` | NO | - | `0` | - |
| 25 | `cf_mobile_pages` | `int(11)` | NO | - | `0` | - |
| 26 | `cf_link_target` | `varchar(50)` | NO | - | `''` | - |
| 27 | `cf_bbs_rewrite` | `tinyint(4)` | NO | - | `0` | - |
| 28 | `cf_delay_sec` | `int(11)` | NO | - | `0` | - |
| 29 | `cf_filter` | `text` | NO | - | `NULL` | - |
| 30 | `cf_possible_ip` | `text` | NO | - | `NULL` | - |
| 31 | `cf_intercept_ip` | `text` | NO | - | `NULL` | - |
| 32 | `cf_analytics` | `text` | NO | - | `NULL` | - |
| 33 | `cf_add_meta` | `text` | NO | - | `NULL` | - |
| 34 | `cf_syndi_token` | `varchar(255)` | NO | - | `NULL` | - |
| 35 | `cf_syndi_except` | `text` | NO | - | `NULL` | - |
| 36 | `cf_member_skin` | `varchar(50)` | NO | - | `''` | - |
| 37 | `cf_use_homepage` | `tinyint(4)` | NO | - | `0` | - |
| 38 | `cf_req_homepage` | `tinyint(4)` | NO | - | `0` | - |
| 39 | `cf_use_tel` | `tinyint(4)` | NO | - | `0` | - |
| 40 | `cf_req_tel` | `tinyint(4)` | NO | - | `0` | - |
| 41 | `cf_use_hp` | `tinyint(4)` | NO | - | `0` | - |
| 42 | `cf_req_hp` | `tinyint(4)` | NO | - | `0` | - |
| 43 | `cf_use_addr` | `tinyint(4)` | NO | - | `0` | - |
| 44 | `cf_req_addr` | `tinyint(4)` | NO | - | `0` | - |
| 45 | `cf_use_signature` | `tinyint(4)` | NO | - | `0` | - |
| 46 | `cf_req_signature` | `tinyint(4)` | NO | - | `0` | - |
| 47 | `cf_use_profile` | `tinyint(4)` | NO | - | `0` | - |
| 48 | `cf_req_profile` | `tinyint(4)` | NO | - | `0` | - |
| 49 | `cf_register_level` | `tinyint(4)` | NO | - | `0` | - |
| 50 | `cf_register_point` | `int(11)` | NO | - | `0` | - |
| 51 | `cf_icon_level` | `tinyint(4)` | NO | - | `0` | - |
| 52 | `cf_use_recommend` | `tinyint(4)` | NO | - | `0` | - |
| 53 | `cf_recommend_point` | `int(11)` | NO | - | `0` | - |
| 54 | `cf_leave_day` | `int(11)` | NO | - | `0` | - |
| 55 | `cf_search_part` | `int(11)` | NO | - | `0` | - |
| 56 | `cf_email_use` | `tinyint(4)` | NO | - | `0` | - |
| 57 | `cf_email_wr_super_admin` | `tinyint(4)` | NO | - | `0` | - |
| 58 | `cf_email_wr_group_admin` | `tinyint(4)` | NO | - | `0` | - |
| 59 | `cf_email_wr_board_admin` | `tinyint(4)` | NO | - | `0` | - |
| 60 | `cf_email_wr_write` | `tinyint(4)` | NO | - | `0` | - |
| 61 | `cf_email_wr_comment_all` | `tinyint(4)` | NO | - | `0` | - |
| 62 | `cf_email_mb_super_admin` | `tinyint(4)` | NO | - | `0` | - |
| 63 | `cf_email_mb_member` | `tinyint(4)` | NO | - | `0` | - |
| 64 | `cf_email_po_super_admin` | `tinyint(4)` | NO | - | `0` | - |
| 65 | `cf_prohibit_id` | `text` | NO | - | `NULL` | - |
| 66 | `cf_prohibit_email` | `text` | NO | - | `NULL` | - |
| 67 | `cf_new_del` | `int(11)` | NO | - | `0` | - |
| 68 | `cf_memo_del` | `int(11)` | NO | - | `0` | - |
| 69 | `cf_visit_del` | `int(11)` | NO | - | `0` | - |
| 70 | `cf_popular_del` | `int(11)` | NO | - | `0` | - |
| 71 | `cf_optimize_date` | `date` | NO | - | `'0000-00-00'` | - |
| 72 | `cf_use_member_icon` | `tinyint(4)` | NO | - | `0` | - |
| 73 | `cf_member_icon_size` | `int(11)` | NO | - | `0` | - |
| 74 | `cf_member_icon_width` | `int(11)` | NO | - | `0` | - |
| 75 | `cf_member_icon_height` | `int(11)` | NO | - | `0` | - |
| 76 | `cf_member_img_size` | `int(11)` | NO | - | `0` | - |
| 77 | `cf_member_img_width` | `int(11)` | NO | - | `0` | - |
| 78 | `cf_member_img_height` | `int(11)` | NO | - | `0` | - |
| 79 | `cf_login_minutes` | `int(11)` | NO | - | `0` | - |
| 80 | `cf_image_extension` | `varchar(255)` | NO | - | `''` | - |
| 81 | `cf_flash_extension` | `varchar(255)` | NO | - | `''` | - |
| 82 | `cf_movie_extension` | `varchar(255)` | NO | - | `''` | - |
| 83 | `cf_formmail_is_member` | `tinyint(4)` | NO | - | `0` | - |
| 84 | `cf_page_rows` | `int(11)` | NO | - | `0` | - |
| 85 | `cf_mobile_page_rows` | `int(11)` | NO | - | `0` | - |
| 86 | `cf_visit` | `varchar(255)` | NO | - | `''` | - |
| 87 | `cf_max_po_id` | `int(11)` | NO | - | `0` | - |
| 88 | `cf_stipulation` | `text` | NO | - | `NULL` | - |
| 89 | `cf_privacy` | `text` | NO | - | `NULL` | - |
| 90 | `cf_use_promotion` | `tinyint(1)` | NO | - | `0` | - |
| 91 | `cf_open_modify` | `int(11)` | NO | - | `0` | - |
| 92 | `cf_memo_send_point` | `int(11)` | NO | - | `0` | - |
| 93 | `cf_mobile_new_skin` | `varchar(50)` | NO | - | `''` | - |
| 94 | `cf_mobile_search_skin` | `varchar(50)` | NO | - | `''` | - |
| 95 | `cf_mobile_connect_skin` | `varchar(50)` | NO | - | `''` | - |
| 96 | `cf_mobile_faq_skin` | `varchar(50)` | NO | - | `''` | - |
| 97 | `cf_mobile_member_skin` | `varchar(50)` | NO | - | `''` | - |
| 98 | `cf_captcha_mp3` | `varchar(255)` | NO | - | `''` | - |
| 99 | `cf_editor` | `varchar(50)` | NO | - | `''` | - |
| 100 | `cf_cert_use` | `tinyint(4)` | NO | - | `0` | - |
| 101 | `cf_cert_find` | `tinyint(4)` | NO | - | `0` | - |
| 102 | `cf_cert_ipin` | `varchar(255)` | NO | - | `''` | - |
| 103 | `cf_cert_hp` | `varchar(255)` | NO | - | `''` | - |
| 104 | `cf_cert_simple` | `varchar(255)` | NO | - | `''` | - |
| 105 | `cf_cert_kg_cd` | `varchar(255)` | NO | - | `''` | - |
| 106 | `cf_cert_kg_mid` | `varchar(255)` | NO | - | `''` | - |
| 107 | `cf_cert_use_seed` | `tinyint(4)` | NO | - | `1` | - |
| 108 | `cf_cert_kcb_cd` | `varchar(255)` | NO | - | `''` | - |
| 109 | `cf_cert_kcp_cd` | `varchar(255)` | NO | - | `''` | - |
| 110 | `cf_cert_kcp_enckey` | `varchar(100)` | NO | - | `''` | - |
| 111 | `cf_lg_mid` | `varchar(100)` | NO | - | `''` | - |
| 112 | `cf_lg_mert_key` | `varchar(100)` | NO | - | `''` | - |
| 113 | `cf_toss_client_key` | `varchar(100)` | NO | - | `''` | - |
| 114 | `cf_toss_secret_key` | `varchar(100)` | NO | - | `''` | - |
| 115 | `cf_cert_limit` | `int(11)` | NO | - | `0` | - |
| 116 | `cf_cert_req` | `tinyint(4)` | NO | - | `0` | - |
| 117 | `cf_sms_use` | `varchar(255)` | NO | - | `''` | - |
| 118 | `cf_sms_type` | `varchar(10)` | NO | - | `''` | - |
| 119 | `cf_icode_id` | `varchar(255)` | NO | - | `''` | - |
| 120 | `cf_icode_pw` | `varchar(255)` | NO | - | `''` | - |
| 121 | `cf_icode_server_ip` | `varchar(50)` | NO | - | `''` | - |
| 122 | `cf_icode_server_port` | `varchar(50)` | NO | - | `''` | - |
| 123 | `cf_icode_token_key` | `varchar(100)` | NO | - | `''` | - |
| 124 | `cf_googl_shorturl_apikey` | `varchar(50)` | NO | - | `''` | - |
| 125 | `cf_social_login_use` | `tinyint(4)` | NO | - | `0` | - |
| 126 | `cf_social_servicelist` | `varchar(255)` | NO | - | `''` | - |
| 127 | `cf_payco_clientid` | `varchar(100)` | NO | - | `''` | - |
| 128 | `cf_payco_secret` | `varchar(100)` | NO | - | `''` | - |
| 129 | `cf_facebook_appid` | `varchar(100)` | NO | - | `NULL` | - |
| 130 | `cf_facebook_secret` | `varchar(100)` | NO | - | `NULL` | - |
| 131 | `cf_twitter_key` | `varchar(100)` | NO | - | `NULL` | - |
| 132 | `cf_twitter_secret` | `varchar(100)` | NO | - | `NULL` | - |
| 133 | `cf_google_clientid` | `varchar(100)` | NO | - | `''` | - |
| 134 | `cf_google_secret` | `varchar(100)` | NO | - | `''` | - |
| 135 | `cf_naver_clientid` | `varchar(100)` | NO | - | `''` | - |
| 136 | `cf_naver_secret` | `varchar(100)` | NO | - | `''` | - |
| 137 | `cf_kakao_rest_key` | `varchar(100)` | NO | - | `''` | - |
| 138 | `cf_kakao_client_secret` | `varchar(100)` | NO | - | `''` | - |
| 139 | `cf_kakao_js_apikey` | `varchar(100)` | NO | - | `NULL` | - |
| 140 | `cf_captcha` | `varchar(100)` | NO | - | `''` | - |
| 141 | `cf_recaptcha_site_key` | `varchar(100)` | NO | - | `''` | - |
| 142 | `cf_recaptcha_secret_key` | `varchar(100)` | NO | - | `''` | - |
| 143 | `cf_1_subj` | `varchar(255)` | NO | - | `''` | - |
| 144 | `cf_2_subj` | `varchar(255)` | NO | - | `''` | - |
| 145 | `cf_3_subj` | `varchar(255)` | NO | - | `''` | - |
| 146 | `cf_4_subj` | `varchar(255)` | NO | - | `''` | - |
| 147 | `cf_5_subj` | `varchar(255)` | NO | - | `''` | - |
| 148 | `cf_6_subj` | `varchar(255)` | NO | - | `''` | - |
| 149 | `cf_7_subj` | `varchar(255)` | NO | - | `''` | - |
| 150 | `cf_8_subj` | `varchar(255)` | NO | - | `''` | - |
| 151 | `cf_9_subj` | `varchar(255)` | NO | - | `''` | - |
| 152 | `cf_10_subj` | `varchar(255)` | NO | - | `''` | - |
| 153 | `cf_1` | `varchar(255)` | NO | - | `''` | - |
| 154 | `cf_2` | `varchar(255)` | NO | - | `''` | - |
| 155 | `cf_3` | `varchar(255)` | NO | - | `''` | - |
| 156 | `cf_4` | `varchar(255)` | NO | - | `''` | - |
| 157 | `cf_5` | `varchar(255)` | NO | - | `''` | - |
| 158 | `cf_6` | `varchar(255)` | NO | - | `''` | - |
| 159 | `cf_7` | `varchar(255)` | NO | - | `''` | - |
| 160 | `cf_8` | `varchar(255)` | NO | - | `''` | - |
| 161 | `cf_9` | `varchar(255)` | NO | - | `''` | - |
| 162 | `cf_10` | `varchar(255)` | NO | - | `''` | - |

### `tbl_content`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `co_id` | `varchar(20)` | NO | PRI | `''` | - |
| 2 | `co_html` | `tinyint(4)` | NO | - | `0` | - |
| 3 | `co_subject` | `varchar(255)` | NO | - | `''` | - |
| 4 | `co_content` | `longtext` | NO | - | `NULL` | - |
| 5 | `co_seo_title` | `varchar(255)` | NO | MUL | `''` | - |
| 6 | `co_mobile_content` | `longtext` | NO | - | `NULL` | - |
| 7 | `co_skin` | `varchar(255)` | NO | - | `''` | - |
| 8 | `co_mobile_skin` | `varchar(255)` | NO | - | `''` | - |
| 9 | `co_tag_filter_use` | `tinyint(4)` | NO | - | `0` | - |
| 10 | `co_hit` | `int(11)` | NO | - | `0` | - |
| 11 | `co_include_head` | `varchar(255)` | NO | - | `NULL` | - |
| 12 | `co_include_tail` | `varchar(255)` | NO | - | `NULL` | - |

### `tbl_faq`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `fa_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `fm_id` | `int(11)` | NO | MUL | `0` | - |
| 3 | `fa_subject` | `text` | NO | - | `NULL` | - |
| 4 | `fa_content` | `text` | NO | - | `NULL` | - |
| 5 | `fa_order` | `int(11)` | NO | - | `0` | - |

### `tbl_faq_master`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `fm_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `fm_subject` | `varchar(255)` | NO | - | `''` | - |
| 3 | `fm_head_html` | `text` | NO | - | `NULL` | - |
| 4 | `fm_tail_html` | `text` | NO | - | `NULL` | - |
| 5 | `fm_mobile_head_html` | `text` | NO | - | `NULL` | - |
| 6 | `fm_mobile_tail_html` | `text` | NO | - | `NULL` | - |
| 7 | `fm_order` | `int(11)` | NO | - | `0` | - |

### `tbl_group`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `gr_id` | `varchar(10)` | NO | PRI | `''` | - |
| 2 | `gr_subject` | `varchar(255)` | NO | - | `''` | - |
| 3 | `gr_device` | `enum('both','pc','mobile')` | NO | - | `'both'` | - |
| 4 | `gr_admin` | `varchar(255)` | NO | - | `''` | - |
| 5 | `gr_use_access` | `tinyint(4)` | NO | - | `0` | - |
| 6 | `gr_order` | `int(11)` | NO | - | `0` | - |
| 7 | `gr_1_subj` | `varchar(255)` | NO | - | `''` | - |
| 8 | `gr_2_subj` | `varchar(255)` | NO | - | `''` | - |
| 9 | `gr_3_subj` | `varchar(255)` | NO | - | `''` | - |
| 10 | `gr_4_subj` | `varchar(255)` | NO | - | `''` | - |
| 11 | `gr_5_subj` | `varchar(255)` | NO | - | `''` | - |
| 12 | `gr_6_subj` | `varchar(255)` | NO | - | `''` | - |
| 13 | `gr_7_subj` | `varchar(255)` | NO | - | `''` | - |
| 14 | `gr_8_subj` | `varchar(255)` | NO | - | `''` | - |
| 15 | `gr_9_subj` | `varchar(255)` | NO | - | `''` | - |
| 16 | `gr_10_subj` | `varchar(255)` | NO | - | `''` | - |
| 17 | `gr_1` | `varchar(255)` | NO | - | `''` | - |
| 18 | `gr_2` | `varchar(255)` | NO | - | `''` | - |
| 19 | `gr_3` | `varchar(255)` | NO | - | `''` | - |
| 20 | `gr_4` | `varchar(255)` | NO | - | `''` | - |
| 21 | `gr_5` | `varchar(255)` | NO | - | `''` | - |
| 22 | `gr_6` | `varchar(255)` | NO | - | `''` | - |
| 23 | `gr_7` | `varchar(255)` | NO | - | `''` | - |
| 24 | `gr_8` | `varchar(255)` | NO | - | `''` | - |
| 25 | `gr_9` | `varchar(255)` | NO | - | `''` | - |
| 26 | `gr_10` | `varchar(255)` | NO | - | `''` | - |

### `tbl_group_member`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `gm_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `gr_id` | `varchar(255)` | NO | MUL | `''` | - |
| 3 | `mb_id` | `varchar(20)` | NO | MUL | `''` | - |
| 4 | `gm_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_lec_item_content`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ic_id` | `varchar(20)` | NO | PRI | `NULL` | - |
| 2 | `ca_id` | `varchar(10)` | NO | MUL | `'0'` | - |
| 3 | `it_id` | `varchar(20)` | NO | - | `NULL` | - |
| 4 | `ic_name` | `varchar(255)` | NO | MUL | `''` | - |
| 5 | `ic_maker` | `varchar(255)` | YES | - | `''` | - |
| 6 | `ic_content_type` | `enum('file','movurl','cdndoubled','mediakey','flash')` | NO | - | `NULL` | - |
| 7 | `ic_content` | `mediumtext` | NO | - | `NULL` | - |
| 8 | `ic_explan` | `mediumtext` | YES | - | `NULL` | - |
| 9 | `ic_playtime` | `int(11)` | NO | - | `0` | - |
| 10 | `ic_type` | `tinyint(4)` | NO | - | `0` | - |
| 11 | `ic_free` | `tinyint(4)` | NO | - | `0` | - |
| 12 | `ic_order` | `int(11)` | NO | MUL | `0` | - |
| 13 | `ic_memo` | `text` | YES | - | `NULL` | - |
| 14 | `ic_ip` | `varchar(25)` | NO | - | `''` | - |
| 15 | `ic_use` | `tinyint(4)` | NO | MUL | `0` | - |
| 16 | `ic_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 17 | `ic_update_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_lec_item_content_log`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `icl_id` | `int(11) unsigned` | NO | PRI | `NULL` | auto_increment |
| 2 | `ic_id` | `varchar(255)` | NO | MUL | `''` | - |
| 3 | `ic_name` | `varchar(255)` | NO | - | `''` | - |
| 4 | `it_id` | `varchar(255)` | NO | - | `''` | - |
| 5 | `ca_id` | `varchar(255)` | NO | MUL | `''` | - |
| 6 | `mb_id` | `varchar(255)` | NO | MUL | `''` | - |
| 7 | `view_cnt` | `int(11)` | NO | - | `0` | - |
| 8 | `progress` | `tinyint(4)` | NO | - | `0` | - |
| 9 | `icl_ip` | `varchar(255)` | NO | - | `''` | - |
| 10 | `icl_datetime` | `timestamp` | NO | - | `current_timestamp()` | on update current_timestamp() |
| 11 | `icl_updatetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_lec_item_exam_license`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `iel_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `iet_id` | `int(11)` | NO | MUL | `0` | - |
| 3 | `ca_id` | `varchar(11)` | NO | MUL | `'0'` | - |
| 4 | `mb_id` | `varchar(255)` | NO | MUL | `'0'` | - |
| 5 | `mb_phase` | `varchar(255)` | YES | MUL | `NULL` | - |
| 6 | `iel_status` | `tinyint(4)` | NO | - | `0` | - |
| 7 | `iel_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 8 | `iel_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_lec_item_exam_result`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ier_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `ie_id` | `int(11)` | NO | MUL | `0` | - |
| 3 | `lolId` | `int(11)` | NO | MUL | `0` | - |
| 4 | `ca_id` | `varchar(11)` | NO | MUL | `'0'` | - |
| 5 | `mb_id` | `varchar(255)` | NO | MUL | `'0'` | - |
| 6 | `mb_phase` | `varchar(255)` | YES | MUL | `NULL` | - |
| 7 | `ier_answer` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `ier_res` | `tinyint(4)` | NO | MUL | `0` | - |
| 9 | `ier_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 10 | `ier_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_lec_item_exam_tasks`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `iet_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `ca_id` | `varchar(11)` | NO | MUL | `'0'` | - |
| 3 | `mb_id` | `varchar(255)` | NO | MUL | `'0'` | - |
| 4 | `mb_phase` | `varchar(255)` | YES | MUL | `NULL` | - |
| 5 | `iet_task_content` | `longtext` | YES | - | `NULL` | - |
| 6 | `iet_task_url` | `varchar(255)` | YES | - | `NULL` | - |
| 7 | `ier_result_score` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `iet_status` | `tinyint(4)` | NO | - | `0` | - |
| 9 | `iet_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 10 | `iet_tasks_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 11 | `ier_stime_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 12 | `ier_etime_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 13 | `iet_tasks_datetime` | `datetime` | YES | - | `'0000-00-00 00:00:00'` | - |
| 14 | `iet_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_lec_item_teacher`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ir_id` | `varchar(20)` | NO | PRI | `NULL` | - |
| 2 | `ca_id` | `varchar(10)` | NO | MUL | `'0'` | - |
| 3 | `ir_name` | `varchar(255)` | NO | MUL | `''` | - |
| 4 | `ir_ability` | `mediumtext` | YES | - | `NULL` | - |
| 5 | `ir_career` | `mediumtext` | YES | - | `NULL` | - |
| 6 | `ir_order` | `int(11)` | NO | MUL | `0` | - |
| 7 | `ir_memo` | `text` | YES | - | `NULL` | - |
| 8 | `ir_ip` | `varchar(25)` | NO | - | `''` | - |
| 9 | `ir_use` | `tinyint(4)` | NO | MUL | `0` | - |
| 10 | `ir_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 11 | `ir_update_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_lec_order_member`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `lol_no` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `od_id` | `varchar(255)` | NO | MUL | `''` | - |
| 3 | `freeuse` | `tinyint(3)` | NO | - | `0` | - |
| 4 | `it_id` | `varchar(20)` | NO | MUL | `''` | - |
| 5 | `mb_id` | `varchar(255)` | NO | MUL | `''` | - |
| 6 | `ca_id` | `varchar(255)` | NO | MUL | `''` | - |
| 7 | `lec_qty` | `varchar(255)` | NO | - | `''` | - |
| 8 | `it_name` | `varchar(255)` | NO | - | `NULL` | - |
| 9 | `progress` | `tinyint(4)` | NO | - | `0` | - |
| 10 | `od_status` | `varchar(10)` | NO | - | `''` | - |
| 11 | `od_name` | `varchar(255)` | NO | - | `''` | - |
| 12 | `od_tel` | `varchar(255)` | NO | - | `''` | - |
| 13 | `od_hp` | `varchar(255)` | NO | - | `''` | - |
| 14 | `od_zip` | `varchar(255)` | NO | - | `''` | - |
| 15 | `od_addr` | `varchar(255)` | NO | - | `''` | - |
| 16 | `od_memo` | `text` | NO | - | `NULL` | - |
| 17 | `correc_cnt` | `tinyint(4)` | NO | - | `12` | - |
| 18 | `start_date` | `date` | NO | - | `'0000-00-00'` | - |
| 19 | `end_date` | `date` | NO | - | `'0000-00-00'` | - |
| 20 | `sleeper` | `int(1)` | NO | - | `0` | - |
| 21 | `sleeper_start_date` | `date` | NO | - | `'0000-00-00'` | - |
| 22 | `sleeper_end_date` | `date` | NO | - | `'0000-00-00'` | - |
| 23 | `reg_date` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_login`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `lo_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `lo_ip` | `varchar(100)` | NO | UNI | `''` | - |
| 3 | `mb_id` | `varchar(20)` | NO | - | `''` | - |
| 4 | `lo_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 5 | `lo_location` | `text` | NO | - | `NULL` | - |
| 6 | `lo_url` | `text` | NO | - | `NULL` | - |

### `tbl_mail`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ma_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `ma_subject` | `varchar(255)` | NO | - | `''` | - |
| 3 | `ma_content` | `mediumtext` | NO | - | `NULL` | - |
| 4 | `ma_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 5 | `ma_ip` | `varchar(255)` | NO | - | `''` | - |
| 6 | `ma_last_option` | `text` | NO | - | `NULL` | - |

### `tbl_member`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `mb_no` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(20)` | NO | UNI | `''` | - |
| 3 | `mb_password` | `varchar(255)` | NO | - | `''` | - |
| 4 | `mb_name` | `varchar(255)` | NO | - | `''` | - |
| 5 | `mb_nick` | `varchar(255)` | NO | - | `''` | - |
| 6 | `mb_nick_date` | `date` | NO | - | `'0000-00-00'` | - |
| 7 | `mb_email` | `varchar(255)` | NO | - | `''` | - |
| 8 | `mb_homepage` | `varchar(255)` | NO | - | `''` | - |
| 9 | `mb_level` | `tinyint(4)` | NO | - | `0` | - |
| 10 | `mb_sex` | `char(1)` | NO | - | `''` | - |
| 11 | `mb_birth` | `varchar(255)` | NO | - | `''` | - |
| 12 | `mb_tel` | `varchar(255)` | NO | - | `''` | - |
| 13 | `mb_hp` | `varchar(255)` | NO | - | `''` | - |
| 14 | `mb_certify` | `varchar(20)` | NO | - | `''` | - |
| 15 | `mb_adult` | `tinyint(4)` | NO | - | `0` | - |
| 16 | `mb_dupinfo` | `varchar(255)` | NO | - | `''` | - |
| 17 | `mb_zip1` | `char(3)` | NO | - | `''` | - |
| 18 | `mb_zip2` | `char(3)` | NO | - | `''` | - |
| 19 | `mb_addr1` | `varchar(255)` | NO | - | `''` | - |
| 20 | `mb_addr2` | `varchar(255)` | NO | - | `''` | - |
| 21 | `mb_addr3` | `varchar(255)` | NO | - | `''` | - |
| 22 | `mb_addr_jibeon` | `varchar(255)` | NO | - | `''` | - |
| 23 | `mb_signature` | `text` | NO | - | `NULL` | - |
| 24 | `mb_recommend` | `varchar(255)` | NO | - | `''` | - |
| 25 | `mb_point` | `int(11)` | NO | - | `0` | - |
| 26 | `mb_today_login` | `datetime` | NO | MUL | `'0000-00-00 00:00:00'` | - |
| 27 | `mb_login_ip` | `varchar(255)` | NO | - | `''` | - |
| 28 | `mb_datetime` | `datetime` | NO | MUL | `'0000-00-00 00:00:00'` | - |
| 29 | `mb_ip` | `varchar(255)` | NO | - | `''` | - |
| 30 | `mb_leave_date` | `varchar(8)` | NO | - | `''` | - |
| 31 | `mb_intercept_date` | `varchar(8)` | NO | - | `''` | - |
| 32 | `mb_email_certify` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 33 | `mb_email_certify2` | `varchar(255)` | NO | - | `''` | - |
| 34 | `mb_memo` | `text` | NO | - | `NULL` | - |
| 35 | `mb_lost_certify` | `varchar(255)` | NO | - | `NULL` | - |
| 36 | `mb_mailling` | `tinyint(4)` | NO | - | `0` | - |
| 37 | `mb_mailling_date` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 38 | `mb_sms` | `tinyint(4)` | NO | - | `0` | - |
| 39 | `mb_sms_date` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 40 | `mb_open` | `tinyint(4)` | NO | - | `0` | - |
| 41 | `mb_open_date` | `date` | NO | - | `'0000-00-00'` | - |
| 42 | `mb_profile` | `text` | NO | - | `NULL` | - |
| 43 | `mb_memo_call` | `varchar(255)` | NO | - | `''` | - |
| 44 | `mb_memo_cnt` | `int(11)` | NO | - | `0` | - |
| 45 | `mb_scrap_cnt` | `int(11)` | NO | - | `0` | - |
| 46 | `mb_marketing_agree` | `tinyint(1)` | NO | - | `0` | - |
| 47 | `mb_marketing_date` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 48 | `mb_thirdparty_agree` | `tinyint(1)` | NO | - | `0` | - |
| 49 | `mb_thirdparty_date` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 50 | `mb_agree_log` | `text` | NO | - | `NULL` | - |
| 51 | `mb_1` | `varchar(255)` | NO | - | `''` | - |
| 52 | `mb_2` | `varchar(255)` | NO | - | `''` | - |
| 53 | `mb_3` | `varchar(255)` | NO | - | `''` | - |
| 54 | `mb_4` | `varchar(255)` | NO | - | `''` | - |
| 55 | `mb_5` | `varchar(255)` | NO | - | `''` | - |
| 56 | `mb_6` | `varchar(255)` | NO | - | `''` | - |
| 57 | `mb_7` | `varchar(255)` | NO | - | `''` | - |
| 58 | `mb_8` | `varchar(255)` | NO | - | `''` | - |
| 59 | `mb_9` | `varchar(255)` | NO | - | `''` | - |
| 60 | `mb_10` | `varchar(255)` | NO | - | `''` | - |

### `tbl_member_cert_history`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ch_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(20)` | NO | MUL | `''` | - |
| 3 | `ch_name` | `varchar(255)` | NO | - | `''` | - |
| 4 | `ch_hp` | `varchar(255)` | NO | - | `''` | - |
| 5 | `ch_birth` | `varchar(255)` | NO | - | `''` | - |
| 6 | `ch_type` | `varchar(20)` | NO | - | `''` | - |
| 7 | `ch_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_member_social_profiles`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `mp_no` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(255)` | NO | MUL | `''` | - |
| 3 | `provider` | `varchar(50)` | NO | MUL | `''` | - |
| 4 | `object_sha` | `varchar(45)` | NO | - | `''` | - |
| 5 | `identifier` | `varchar(255)` | NO | - | `''` | - |
| 6 | `profileurl` | `varchar(255)` | NO | - | `''` | - |
| 7 | `photourl` | `varchar(255)` | NO | - | `''` | - |
| 8 | `displayname` | `varchar(150)` | NO | - | `''` | - |
| 9 | `description` | `varchar(255)` | NO | - | `''` | - |
| 10 | `mp_register_day` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 11 | `mp_latest_day` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_memo`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `me_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `me_recv_mb_id` | `varchar(20)` | NO | MUL | `''` | - |
| 3 | `me_send_mb_id` | `varchar(20)` | NO | - | `''` | - |
| 4 | `me_send_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 5 | `me_read_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 6 | `me_memo` | `text` | NO | - | `NULL` | - |
| 7 | `me_send_id` | `int(11)` | NO | - | `0` | - |
| 8 | `me_type` | `enum('send','recv')` | NO | - | `'recv'` | - |
| 9 | `me_send_ip` | `varchar(100)` | NO | - | `''` | - |

### `tbl_menu`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `me_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `me_code` | `varchar(255)` | NO | - | `''` | - |
| 3 | `me_name` | `varchar(255)` | NO | - | `''` | - |
| 4 | `me_link` | `varchar(255)` | NO | - | `''` | - |
| 5 | `me_target` | `varchar(255)` | NO | - | `''` | - |
| 6 | `me_order` | `int(11)` | NO | - | `0` | - |
| 7 | `me_use` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `me_mobile_use` | `tinyint(4)` | NO | - | `0` | - |

### `tbl_new_win`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `nw_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `nw_division` | `varchar(10)` | NO | - | `'both'` | - |
| 3 | `nw_device` | `varchar(10)` | NO | - | `'both'` | - |
| 4 | `nw_begin_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 5 | `nw_end_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 6 | `nw_disable_hours` | `int(11)` | NO | - | `0` | - |
| 7 | `nw_left` | `int(11)` | NO | - | `0` | - |
| 8 | `nw_top` | `int(11)` | NO | - | `0` | - |
| 9 | `nw_height` | `int(11)` | NO | - | `0` | - |
| 10 | `nw_width` | `int(11)` | NO | - | `0` | - |
| 11 | `nw_subject` | `text` | NO | - | `NULL` | - |
| 12 | `nw_content` | `text` | NO | - | `NULL` | - |
| 13 | `nw_content_html` | `tinyint(4)` | NO | - | `0` | - |

### `tbl_point`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `po_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(20)` | NO | MUL | `''` | - |
| 3 | `po_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 4 | `po_content` | `varchar(255)` | NO | - | `''` | - |
| 5 | `po_point` | `int(11)` | NO | - | `0` | - |
| 6 | `po_use_point` | `int(11)` | NO | - | `0` | - |
| 7 | `po_expired` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `po_expire_date` | `date` | NO | MUL | `'0000-00-00'` | - |
| 9 | `po_mb_point` | `int(11)` | NO | - | `0` | - |
| 10 | `po_rel_table` | `varchar(20)` | NO | - | `''` | - |
| 11 | `po_rel_id` | `varchar(20)` | NO | - | `''` | - |
| 12 | `po_rel_action` | `varchar(100)` | NO | - | `''` | - |

### `tbl_poll`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `po_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `po_subject` | `varchar(255)` | NO | - | `''` | - |
| 3 | `po_poll1` | `varchar(255)` | NO | - | `''` | - |
| 4 | `po_poll2` | `varchar(255)` | NO | - | `''` | - |
| 5 | `po_poll3` | `varchar(255)` | NO | - | `''` | - |
| 6 | `po_poll4` | `varchar(255)` | NO | - | `''` | - |
| 7 | `po_poll5` | `varchar(255)` | NO | - | `''` | - |
| 8 | `po_poll6` | `varchar(255)` | NO | - | `''` | - |
| 9 | `po_poll7` | `varchar(255)` | NO | - | `''` | - |
| 10 | `po_poll8` | `varchar(255)` | NO | - | `''` | - |
| 11 | `po_poll9` | `varchar(255)` | NO | - | `''` | - |
| 12 | `po_cnt1` | `int(11)` | NO | - | `0` | - |
| 13 | `po_cnt2` | `int(11)` | NO | - | `0` | - |
| 14 | `po_cnt3` | `int(11)` | NO | - | `0` | - |
| 15 | `po_cnt4` | `int(11)` | NO | - | `0` | - |
| 16 | `po_cnt5` | `int(11)` | NO | - | `0` | - |
| 17 | `po_cnt6` | `int(11)` | NO | - | `0` | - |
| 18 | `po_cnt7` | `int(11)` | NO | - | `0` | - |
| 19 | `po_cnt8` | `int(11)` | NO | - | `0` | - |
| 20 | `po_cnt9` | `int(11)` | NO | - | `0` | - |
| 21 | `po_etc` | `varchar(255)` | NO | - | `''` | - |
| 22 | `po_level` | `tinyint(4)` | NO | - | `0` | - |
| 23 | `po_point` | `int(11)` | NO | - | `0` | - |
| 24 | `po_date` | `date` | NO | - | `'0000-00-00'` | - |
| 25 | `po_ips` | `mediumtext` | NO | - | `NULL` | - |
| 26 | `mb_ids` | `text` | NO | - | `NULL` | - |
| 27 | `po_use` | `tinyint(4)` | NO | - | `0` | - |

### `tbl_poll_etc`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `pc_id` | `int(11)` | NO | PRI | `0` | - |
| 2 | `po_id` | `int(11)` | NO | - | `0` | - |
| 3 | `mb_id` | `varchar(20)` | NO | - | `''` | - |
| 4 | `pc_name` | `varchar(255)` | NO | - | `''` | - |
| 5 | `pc_idea` | `varchar(255)` | NO | - | `''` | - |
| 6 | `pc_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_popular`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `pp_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `pp_word` | `varchar(50)` | NO | - | `''` | - |
| 3 | `pp_date` | `date` | NO | MUL | `'0000-00-00'` | - |
| 4 | `pp_ip` | `varchar(50)` | NO | - | `''` | - |

### `tbl_qa_config`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `qa_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `qa_title` | `varchar(255)` | NO | - | `''` | - |
| 3 | `qa_category` | `varchar(255)` | NO | - | `''` | - |
| 4 | `qa_skin` | `varchar(255)` | NO | - | `''` | - |
| 5 | `qa_mobile_skin` | `varchar(255)` | NO | - | `''` | - |
| 6 | `qa_use_email` | `tinyint(4)` | NO | - | `0` | - |
| 7 | `qa_req_email` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `qa_use_hp` | `tinyint(4)` | NO | - | `0` | - |
| 9 | `qa_req_hp` | `tinyint(4)` | NO | - | `0` | - |
| 10 | `qa_use_sms` | `tinyint(4)` | NO | - | `0` | - |
| 11 | `qa_send_number` | `varchar(255)` | NO | - | `'0'` | - |
| 12 | `qa_admin_hp` | `varchar(255)` | NO | - | `''` | - |
| 13 | `qa_admin_email` | `varchar(255)` | NO | - | `''` | - |
| 14 | `qa_use_editor` | `tinyint(4)` | NO | - | `0` | - |
| 15 | `qa_subject_len` | `int(11)` | NO | - | `0` | - |
| 16 | `qa_mobile_subject_len` | `int(11)` | NO | - | `0` | - |
| 17 | `qa_page_rows` | `int(11)` | NO | - | `0` | - |
| 18 | `qa_mobile_page_rows` | `int(11)` | NO | - | `0` | - |
| 19 | `qa_image_width` | `int(11)` | NO | - | `0` | - |
| 20 | `qa_upload_size` | `int(11)` | NO | - | `0` | - |
| 21 | `qa_insert_content` | `text` | NO | - | `NULL` | - |
| 22 | `qa_include_head` | `varchar(255)` | NO | - | `''` | - |
| 23 | `qa_include_tail` | `varchar(255)` | NO | - | `''` | - |
| 24 | `qa_content_head` | `text` | NO | - | `NULL` | - |
| 25 | `qa_content_tail` | `text` | NO | - | `NULL` | - |
| 26 | `qa_mobile_content_head` | `text` | NO | - | `NULL` | - |
| 27 | `qa_mobile_content_tail` | `text` | NO | - | `NULL` | - |
| 28 | `qa_1_subj` | `varchar(255)` | NO | - | `''` | - |
| 29 | `qa_2_subj` | `varchar(255)` | NO | - | `''` | - |
| 30 | `qa_3_subj` | `varchar(255)` | NO | - | `''` | - |
| 31 | `qa_4_subj` | `varchar(255)` | NO | - | `''` | - |
| 32 | `qa_5_subj` | `varchar(255)` | NO | - | `''` | - |
| 33 | `qa_1` | `varchar(255)` | NO | - | `''` | - |
| 34 | `qa_2` | `varchar(255)` | NO | - | `''` | - |
| 35 | `qa_3` | `varchar(255)` | NO | - | `''` | - |
| 36 | `qa_4` | `varchar(255)` | NO | - | `''` | - |
| 37 | `qa_5` | `varchar(255)` | NO | - | `''` | - |

### `tbl_qa_content`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `qa_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `qa_num` | `int(11)` | NO | MUL | `0` | - |
| 3 | `qa_parent` | `int(11)` | NO | - | `0` | - |
| 4 | `qa_related` | `int(11)` | NO | - | `0` | - |
| 5 | `mb_id` | `varchar(20)` | NO | - | `''` | - |
| 6 | `qa_name` | `varchar(255)` | NO | - | `''` | - |
| 7 | `qa_email` | `varchar(255)` | NO | - | `''` | - |
| 8 | `qa_hp` | `varchar(255)` | NO | - | `''` | - |
| 9 | `qa_type` | `tinyint(4)` | NO | - | `0` | - |
| 10 | `qa_category` | `varchar(255)` | NO | - | `''` | - |
| 11 | `qa_email_recv` | `tinyint(4)` | NO | - | `0` | - |
| 12 | `qa_sms_recv` | `tinyint(4)` | NO | - | `0` | - |
| 13 | `qa_html` | `tinyint(4)` | NO | - | `0` | - |
| 14 | `qa_subject` | `varchar(255)` | NO | - | `''` | - |
| 15 | `qa_content` | `text` | NO | - | `NULL` | - |
| 16 | `qa_status` | `tinyint(4)` | NO | - | `0` | - |
| 17 | `qa_file1` | `varchar(255)` | NO | - | `''` | - |
| 18 | `qa_source1` | `varchar(255)` | NO | - | `''` | - |
| 19 | `qa_file2` | `varchar(255)` | NO | - | `''` | - |
| 20 | `qa_source2` | `varchar(255)` | NO | - | `''` | - |
| 21 | `qa_ip` | `varchar(255)` | NO | - | `''` | - |
| 22 | `qa_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 23 | `qa_1` | `varchar(255)` | NO | - | `''` | - |
| 24 | `qa_2` | `varchar(255)` | NO | - | `''` | - |
| 25 | `qa_3` | `varchar(255)` | NO | - | `''` | - |
| 26 | `qa_4` | `varchar(255)` | NO | - | `''` | - |
| 27 | `qa_5` | `varchar(255)` | NO | - | `''` | - |

### `tbl_rlec_item_exam`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ie_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `ca_id` | `varchar(10)` | NO | MUL | `'0'` | - |
| 3 | `ie_question` | `mediumtext` | NO | - | `NULL` | - |
| 4 | `ie_response1` | `mediumtext` | NO | - | `NULL` | - |
| 5 | `ie_response2` | `mediumtext` | NO | - | `NULL` | - |
| 6 | `ie_response3` | `mediumtext` | NO | - | `NULL` | - |
| 7 | `ie_response4` | `mediumtext` | NO | - | `NULL` | - |
| 8 | `ie_answer` | `tinyint(4)` | NO | - | `0` | - |
| 9 | `ie_order` | `int(11)` | NO | MUL | `0` | - |
| 10 | `ie_memo` | `text` | YES | - | `NULL` | - |
| 11 | `ie_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 12 | `ie_use` | `tinyint(4)` | NO | MUL | `0` | - |
| 13 | `ie_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 14 | `ie_update_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_scrap`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ms_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(20)` | NO | MUL | `''` | - |
| 3 | `bo_table` | `varchar(20)` | NO | - | `''` | - |
| 4 | `wr_id` | `varchar(15)` | NO | - | `''` | - |
| 5 | `ms_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_banner`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `bn_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `bn_alt` | `varchar(255)` | NO | - | `''` | - |
| 3 | `bn_url` | `varchar(255)` | NO | - | `''` | - |
| 4 | `bn_device` | `varchar(10)` | NO | - | `''` | - |
| 5 | `bn_position` | `varchar(255)` | NO | - | `''` | - |
| 6 | `bn_border` | `tinyint(4)` | NO | - | `0` | - |
| 7 | `bn_new_win` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `bn_begin_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 9 | `bn_end_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 10 | `bn_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 11 | `bn_hit` | `int(11)` | NO | - | `0` | - |
| 12 | `bn_order` | `int(11)` | NO | - | `0` | - |

### `tbl_shop_cart`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ct_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `od_id` | `bigint(20) unsigned` | NO | MUL | `NULL` | - |
| 3 | `mb_id` | `varchar(255)` | NO | - | `''` | - |
| 4 | `it_id` | `varchar(20)` | NO | MUL | `''` | - |
| 5 | `it_name` | `varchar(255)` | NO | - | `''` | - |
| 6 | `it_sc_type` | `tinyint(4)` | NO | - | `0` | - |
| 7 | `it_sc_method` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `it_sc_price` | `int(11)` | NO | - | `0` | - |
| 9 | `it_sc_minimum` | `int(11)` | NO | - | `0` | - |
| 10 | `it_sc_qty` | `int(11)` | NO | - | `0` | - |
| 11 | `ct_status` | `varchar(255)` | NO | MUL | `''` | - |
| 12 | `ct_history` | `text` | NO | - | `NULL` | - |
| 13 | `ct_price` | `int(11)` | NO | - | `0` | - |
| 14 | `ct_point` | `int(11)` | NO | - | `0` | - |
| 15 | `cp_price` | `int(11)` | NO | - | `0` | - |
| 16 | `ct_point_use` | `tinyint(4)` | NO | - | `0` | - |
| 17 | `ct_stock_use` | `tinyint(4)` | NO | - | `0` | - |
| 18 | `ct_option` | `varchar(255)` | NO | - | `''` | - |
| 19 | `ct_qty` | `int(11)` | NO | - | `0` | - |
| 20 | `ct_notax` | `tinyint(4)` | NO | - | `0` | - |
| 21 | `io_id` | `varchar(255)` | NO | - | `''` | - |
| 22 | `io_type` | `tinyint(4)` | NO | - | `0` | - |
| 23 | `io_price` | `int(11)` | NO | - | `0` | - |
| 24 | `ct_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 25 | `ct_ip` | `varchar(25)` | NO | - | `''` | - |
| 26 | `ct_send_cost` | `tinyint(4)` | NO | - | `0` | - |
| 27 | `ct_direct` | `tinyint(4)` | NO | - | `0` | - |
| 28 | `ct_select` | `tinyint(4)` | NO | - | `0` | - |
| 29 | `ct_select_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_category`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ca_id` | `varchar(10)` | NO | PRI | `'0'` | - |
| 2 | `ca_name` | `varchar(255)` | NO | - | `''` | - |
| 3 | `ca_order` | `int(11)` | NO | MUL | `0` | - |
| 4 | `ca_skin_dir` | `varchar(255)` | NO | - | `''` | - |
| 5 | `ca_mobile_skin_dir` | `varchar(255)` | NO | - | `''` | - |
| 6 | `ca_skin` | `varchar(255)` | NO | - | `''` | - |
| 7 | `ca_mobile_skin` | `varchar(255)` | NO | - | `''` | - |
| 8 | `ca_img_width` | `int(11)` | NO | - | `0` | - |
| 9 | `ca_img_height` | `int(11)` | NO | - | `0` | - |
| 10 | `ca_mobile_img_width` | `int(11)` | NO | - | `0` | - |
| 11 | `ca_mobile_img_height` | `int(11)` | NO | - | `0` | - |
| 12 | `ca_sell_email` | `varchar(255)` | NO | - | `''` | - |
| 13 | `ca_use` | `tinyint(4)` | NO | - | `0` | - |
| 14 | `ca_stock_qty` | `int(11)` | NO | - | `0` | - |
| 15 | `ca_explan_html` | `tinyint(4)` | NO | - | `0` | - |
| 16 | `ca_head_html` | `text` | NO | - | `NULL` | - |
| 17 | `ca_tail_html` | `text` | NO | - | `NULL` | - |
| 18 | `ca_mobile_head_html` | `text` | NO | - | `NULL` | - |
| 19 | `ca_mobile_tail_html` | `text` | NO | - | `NULL` | - |
| 20 | `ca_list_mod` | `int(11)` | NO | - | `0` | - |
| 21 | `ca_list_row` | `int(11)` | NO | - | `0` | - |
| 22 | `ca_mobile_list_mod` | `int(11)` | NO | - | `0` | - |
| 23 | `ca_mobile_list_row` | `int(11)` | NO | - | `0` | - |
| 24 | `ca_include_head` | `varchar(255)` | NO | - | `''` | - |
| 25 | `ca_include_tail` | `varchar(255)` | NO | - | `''` | - |
| 26 | `ca_mb_id` | `varchar(255)` | NO | - | `''` | - |
| 27 | `ca_cert_use` | `tinyint(4)` | NO | - | `0` | - |
| 28 | `ca_adult_use` | `tinyint(4)` | NO | - | `0` | - |
| 29 | `ca_nocoupon` | `tinyint(4)` | NO | - | `0` | - |
| 30 | `ca_1_subj` | `varchar(255)` | NO | - | `''` | - |
| 31 | `ca_2_subj` | `varchar(255)` | NO | - | `''` | - |
| 32 | `ca_3_subj` | `varchar(255)` | NO | - | `''` | - |
| 33 | `ca_4_subj` | `varchar(255)` | NO | - | `''` | - |
| 34 | `ca_5_subj` | `varchar(255)` | NO | - | `''` | - |
| 35 | `ca_6_subj` | `varchar(255)` | NO | - | `''` | - |
| 36 | `ca_7_subj` | `varchar(255)` | NO | - | `''` | - |
| 37 | `ca_8_subj` | `varchar(255)` | NO | - | `''` | - |
| 38 | `ca_9_subj` | `varchar(255)` | NO | - | `''` | - |
| 39 | `ca_10_subj` | `varchar(255)` | NO | - | `''` | - |
| 40 | `ca_1` | `varchar(255)` | NO | - | `''` | - |
| 41 | `ca_2` | `varchar(255)` | NO | - | `''` | - |
| 42 | `ca_3` | `varchar(255)` | NO | - | `''` | - |
| 43 | `ca_4` | `varchar(255)` | NO | - | `''` | - |
| 44 | `ca_5` | `varchar(255)` | NO | - | `''` | - |
| 45 | `ca_6` | `varchar(255)` | NO | - | `''` | - |
| 46 | `ca_7` | `varchar(255)` | NO | - | `''` | - |
| 47 | `ca_8` | `varchar(255)` | NO | - | `''` | - |
| 48 | `ca_9` | `varchar(255)` | NO | - | `''` | - |
| 49 | `ca_10` | `varchar(255)` | NO | - | `''` | - |

### `tbl_shop_coupon`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `cp_no` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `cp_id` | `varchar(100)` | NO | UNI | `''` | - |
| 3 | `cp_subject` | `varchar(255)` | NO | - | `''` | - |
| 4 | `cp_method` | `tinyint(4)` | NO | - | `0` | - |
| 5 | `cp_target` | `varchar(255)` | NO | - | `''` | - |
| 6 | `mb_id` | `varchar(255)` | NO | MUL | `''` | - |
| 7 | `cz_id` | `int(11)` | NO | - | `0` | - |
| 8 | `cp_start` | `date` | NO | - | `'0000-00-00'` | - |
| 9 | `cp_end` | `date` | NO | - | `'0000-00-00'` | - |
| 10 | `cp_price` | `int(11)` | NO | - | `0` | - |
| 11 | `cp_type` | `tinyint(4)` | NO | - | `0` | - |
| 12 | `cp_trunc` | `int(11)` | NO | - | `0` | - |
| 13 | `cp_minimum` | `int(11)` | NO | - | `0` | - |
| 14 | `cp_maximum` | `int(11)` | NO | - | `0` | - |
| 15 | `od_id` | `bigint(20) unsigned` | NO | - | `NULL` | - |
| 16 | `cp_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_coupon_log`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `cl_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `cp_id` | `varchar(100)` | NO | - | `''` | - |
| 3 | `mb_id` | `varchar(100)` | NO | MUL | `''` | - |
| 4 | `od_id` | `bigint(20)` | NO | MUL | `NULL` | - |
| 5 | `cp_price` | `int(11)` | NO | - | `0` | - |
| 6 | `cl_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_coupon_zone`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `cz_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `cz_type` | `tinyint(4)` | NO | - | `0` | - |
| 3 | `cz_subject` | `varchar(255)` | NO | - | `''` | - |
| 4 | `cz_start` | `date` | NO | - | `'0000-00-00'` | - |
| 5 | `cz_end` | `date` | NO | - | `'0000-00-00'` | - |
| 6 | `cz_file` | `varchar(255)` | NO | - | `''` | - |
| 7 | `cz_period` | `int(11)` | NO | - | `0` | - |
| 8 | `cz_point` | `int(11)` | NO | - | `0` | - |
| 9 | `cp_method` | `tinyint(4)` | NO | - | `0` | - |
| 10 | `cp_target` | `varchar(255)` | NO | - | `''` | - |
| 11 | `cp_price` | `int(11)` | NO | - | `0` | - |
| 12 | `cp_type` | `tinyint(4)` | NO | - | `0` | - |
| 13 | `cp_trunc` | `int(11)` | NO | - | `0` | - |
| 14 | `cp_minimum` | `int(11)` | NO | - | `0` | - |
| 15 | `cp_maximum` | `int(11)` | NO | - | `0` | - |
| 16 | `cz_download` | `int(11)` | NO | - | `0` | - |
| 17 | `cz_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_default`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `de_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `de_admin_company_owner` | `varchar(255)` | NO | - | `''` | - |
| 3 | `de_admin_company_name` | `varchar(255)` | NO | - | `''` | - |
| 4 | `de_admin_company_saupja_no` | `varchar(255)` | NO | - | `''` | - |
| 5 | `de_admin_company_tel` | `varchar(255)` | NO | - | `''` | - |
| 6 | `de_admin_company_fax` | `varchar(255)` | NO | - | `''` | - |
| 7 | `de_admin_tongsin_no` | `varchar(255)` | NO | - | `''` | - |
| 8 | `de_admin_company_zip` | `varchar(255)` | NO | - | `''` | - |
| 9 | `de_admin_company_addr` | `varchar(255)` | NO | - | `''` | - |
| 10 | `de_admin_info_name` | `varchar(255)` | NO | - | `''` | - |
| 11 | `de_admin_info_email` | `varchar(255)` | NO | - | `''` | - |
| 12 | `de_shop_skin` | `varchar(255)` | NO | - | `''` | - |
| 13 | `de_shop_mobile_skin` | `varchar(255)` | NO | - | `''` | - |
| 14 | `de_type1_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 15 | `de_type1_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 16 | `de_type1_list_mod` | `int(11)` | NO | - | `0` | - |
| 17 | `de_type1_list_row` | `int(11)` | NO | - | `0` | - |
| 18 | `de_type1_img_width` | `int(11)` | NO | - | `0` | - |
| 19 | `de_type1_img_height` | `int(11)` | NO | - | `0` | - |
| 20 | `de_type2_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 21 | `de_type2_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 22 | `de_type2_list_mod` | `int(11)` | NO | - | `0` | - |
| 23 | `de_type2_list_row` | `int(11)` | NO | - | `0` | - |
| 24 | `de_type2_img_width` | `int(11)` | NO | - | `0` | - |
| 25 | `de_type2_img_height` | `int(11)` | NO | - | `0` | - |
| 26 | `de_type3_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 27 | `de_type3_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 28 | `de_type3_list_mod` | `int(11)` | NO | - | `0` | - |
| 29 | `de_type3_list_row` | `int(11)` | NO | - | `0` | - |
| 30 | `de_type3_img_width` | `int(11)` | NO | - | `0` | - |
| 31 | `de_type3_img_height` | `int(11)` | NO | - | `0` | - |
| 32 | `de_type4_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 33 | `de_type4_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 34 | `de_type4_list_mod` | `int(11)` | NO | - | `0` | - |
| 35 | `de_type4_list_row` | `int(11)` | NO | - | `0` | - |
| 36 | `de_type4_img_width` | `int(11)` | NO | - | `0` | - |
| 37 | `de_type4_img_height` | `int(11)` | NO | - | `0` | - |
| 38 | `de_type5_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 39 | `de_type5_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 40 | `de_type5_list_mod` | `int(11)` | NO | - | `0` | - |
| 41 | `de_type5_list_row` | `int(11)` | NO | - | `0` | - |
| 42 | `de_type5_img_width` | `int(11)` | NO | - | `0` | - |
| 43 | `de_type5_img_height` | `int(11)` | NO | - | `0` | - |
| 44 | `de_mobile_type1_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 45 | `de_mobile_type1_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 46 | `de_mobile_type1_list_mod` | `int(11)` | NO | - | `0` | - |
| 47 | `de_mobile_type1_list_row` | `int(11)` | NO | - | `0` | - |
| 48 | `de_mobile_type1_img_width` | `int(11)` | NO | - | `0` | - |
| 49 | `de_mobile_type1_img_height` | `int(11)` | NO | - | `0` | - |
| 50 | `de_mobile_type2_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 51 | `de_mobile_type2_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 52 | `de_mobile_type2_list_mod` | `int(11)` | NO | - | `0` | - |
| 53 | `de_mobile_type2_list_row` | `int(11)` | NO | - | `0` | - |
| 54 | `de_mobile_type2_img_width` | `int(11)` | NO | - | `0` | - |
| 55 | `de_mobile_type2_img_height` | `int(11)` | NO | - | `0` | - |
| 56 | `de_mobile_type3_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 57 | `de_mobile_type3_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 58 | `de_mobile_type3_list_mod` | `int(11)` | NO | - | `0` | - |
| 59 | `de_mobile_type3_list_row` | `int(11)` | NO | - | `0` | - |
| 60 | `de_mobile_type3_img_width` | `int(11)` | NO | - | `0` | - |
| 61 | `de_mobile_type3_img_height` | `int(11)` | NO | - | `0` | - |
| 62 | `de_mobile_type4_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 63 | `de_mobile_type4_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 64 | `de_mobile_type4_list_mod` | `int(11)` | NO | - | `0` | - |
| 65 | `de_mobile_type4_list_row` | `int(11)` | NO | - | `0` | - |
| 66 | `de_mobile_type4_img_width` | `int(11)` | NO | - | `0` | - |
| 67 | `de_mobile_type4_img_height` | `int(11)` | NO | - | `0` | - |
| 68 | `de_mobile_type5_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 69 | `de_mobile_type5_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 70 | `de_mobile_type5_list_mod` | `int(11)` | NO | - | `0` | - |
| 71 | `de_mobile_type5_list_row` | `int(11)` | NO | - | `0` | - |
| 72 | `de_mobile_type5_img_width` | `int(11)` | NO | - | `0` | - |
| 73 | `de_mobile_type5_img_height` | `int(11)` | NO | - | `0` | - |
| 74 | `de_rel_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 75 | `de_rel_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 76 | `de_rel_list_mod` | `int(11)` | NO | - | `0` | - |
| 77 | `de_rel_img_width` | `int(11)` | NO | - | `0` | - |
| 78 | `de_rel_img_height` | `int(11)` | NO | - | `0` | - |
| 79 | `de_mobile_rel_list_use` | `tinyint(4)` | NO | - | `0` | - |
| 80 | `de_mobile_rel_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 81 | `de_mobile_rel_list_mod` | `int(11)` | NO | - | `0` | - |
| 82 | `de_mobile_rel_img_width` | `int(11)` | NO | - | `0` | - |
| 83 | `de_mobile_rel_img_height` | `int(11)` | NO | - | `0` | - |
| 84 | `de_search_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 85 | `de_search_list_mod` | `int(11)` | NO | - | `0` | - |
| 86 | `de_search_list_row` | `int(11)` | NO | - | `0` | - |
| 87 | `de_search_img_width` | `int(11)` | NO | - | `0` | - |
| 88 | `de_search_img_height` | `int(11)` | NO | - | `0` | - |
| 89 | `de_mobile_search_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 90 | `de_mobile_search_list_mod` | `int(11)` | NO | - | `0` | - |
| 91 | `de_mobile_search_list_row` | `int(11)` | NO | - | `0` | - |
| 92 | `de_mobile_search_img_width` | `int(11)` | NO | - | `0` | - |
| 93 | `de_mobile_search_img_height` | `int(11)` | NO | - | `0` | - |
| 94 | `de_listtype_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 95 | `de_listtype_list_mod` | `int(11)` | NO | - | `0` | - |
| 96 | `de_listtype_list_row` | `int(11)` | NO | - | `0` | - |
| 97 | `de_listtype_img_width` | `int(11)` | NO | - | `0` | - |
| 98 | `de_listtype_img_height` | `int(11)` | NO | - | `0` | - |
| 99 | `de_mobile_listtype_list_skin` | `varchar(255)` | NO | - | `''` | - |
| 100 | `de_mobile_listtype_list_mod` | `int(11)` | NO | - | `0` | - |
| 101 | `de_mobile_listtype_list_row` | `int(11)` | NO | - | `0` | - |
| 102 | `de_mobile_listtype_img_width` | `int(11)` | NO | - | `0` | - |
| 103 | `de_mobile_listtype_img_height` | `int(11)` | NO | - | `0` | - |
| 104 | `de_bank_use` | `int(11)` | NO | - | `0` | - |
| 105 | `de_bank_account` | `text` | NO | - | `NULL` | - |
| 106 | `de_card_test` | `int(11)` | NO | - | `0` | - |
| 107 | `de_card_use` | `int(11)` | NO | - | `0` | - |
| 108 | `de_card_noint_use` | `tinyint(4)` | NO | - | `0` | - |
| 109 | `de_card_point` | `int(11)` | NO | - | `0` | - |
| 110 | `de_settle_min_point` | `int(11)` | NO | - | `0` | - |
| 111 | `de_settle_max_point` | `int(11)` | NO | - | `0` | - |
| 112 | `de_settle_point_unit` | `int(11)` | NO | - | `0` | - |
| 113 | `de_level_sell` | `int(11)` | NO | - | `0` | - |
| 114 | `de_delivery_company` | `varchar(255)` | NO | - | `''` | - |
| 115 | `de_send_cost_case` | `varchar(255)` | NO | - | `''` | - |
| 116 | `de_send_cost_limit` | `varchar(255)` | NO | - | `''` | - |
| 117 | `de_send_cost_list` | `varchar(255)` | NO | - | `''` | - |
| 118 | `de_hope_date_use` | `int(11)` | NO | - | `0` | - |
| 119 | `de_hope_date_after` | `int(11)` | NO | - | `0` | - |
| 120 | `de_baesong_content` | `text` | NO | - | `NULL` | - |
| 121 | `de_change_content` | `text` | NO | - | `NULL` | - |
| 122 | `de_point_days` | `int(11)` | NO | - | `0` | - |
| 123 | `de_simg_width` | `int(11)` | NO | - | `0` | - |
| 124 | `de_simg_height` | `int(11)` | NO | - | `0` | - |
| 125 | `de_mimg_width` | `int(11)` | NO | - | `0` | - |
| 126 | `de_mimg_height` | `int(11)` | NO | - | `0` | - |
| 127 | `de_sms_cont1` | `text` | NO | - | `NULL` | - |
| 128 | `de_sms_cont2` | `text` | NO | - | `NULL` | - |
| 129 | `de_sms_cont3` | `text` | NO | - | `NULL` | - |
| 130 | `de_sms_cont4` | `text` | NO | - | `NULL` | - |
| 131 | `de_sms_cont5` | `text` | NO | - | `NULL` | - |
| 132 | `de_sms_use1` | `tinyint(4)` | NO | - | `0` | - |
| 133 | `de_sms_use2` | `tinyint(4)` | NO | - | `0` | - |
| 134 | `de_sms_use3` | `tinyint(4)` | NO | - | `0` | - |
| 135 | `de_sms_use4` | `tinyint(4)` | NO | - | `0` | - |
| 136 | `de_sms_use5` | `tinyint(4)` | NO | - | `0` | - |
| 137 | `de_sms_hp` | `varchar(255)` | NO | - | `''` | - |
| 138 | `de_pg_service` | `varchar(255)` | NO | - | `''` | - |
| 139 | `de_kcp_mid` | `varchar(255)` | NO | - | `''` | - |
| 140 | `de_kcp_site_key` | `varchar(255)` | NO | - | `''` | - |
| 141 | `de_inicis_mid` | `varchar(255)` | NO | - | `''` | - |
| 142 | `de_inicis_iniapi_key` | `varchar(30)` | NO | - | `''` | - |
| 143 | `de_inicis_iniapi_iv` | `varchar(30)` | NO | - | `''` | - |
| 144 | `de_inicis_sign_key` | `varchar(255)` | NO | - | `''` | - |
| 145 | `de_iche_use` | `tinyint(4)` | NO | - | `0` | - |
| 146 | `de_easy_pay_use` | `tinyint(4)` | NO | - | `0` | - |
| 147 | `de_easy_pay_services` | `varchar(255)` | NO | - | `''` | - |
| 148 | `de_samsung_pay_use` | `tinyint(4)` | NO | - | `0` | - |
| 149 | `de_inicis_lpay_use` | `tinyint(4)` | NO | - | `0` | - |
| 150 | `de_inicis_kakaopay_use` | `tinyint(4)` | NO | - | `0` | - |
| 151 | `de_inicis_cartpoint_use` | `tinyint(4)` | NO | - | `0` | - |
| 152 | `de_nicepay_mid` | `varchar(30)` | NO | - | `''` | - |
| 153 | `de_nicepay_key` | `varchar(255)` | NO | - | `''` | - |
| 154 | `de_item_use_use` | `tinyint(4)` | NO | - | `0` | - |
| 155 | `de_item_use_write` | `tinyint(4)` | NO | - | `0` | - |
| 156 | `de_code_dup_use` | `tinyint(4)` | NO | - | `0` | - |
| 157 | `de_cart_keep_term` | `int(11)` | NO | - | `0` | - |
| 158 | `de_guest_cart_use` | `tinyint(4)` | NO | - | `0` | - |
| 159 | `de_admin_buga_no` | `varchar(255)` | NO | - | `''` | - |
| 160 | `de_vbank_use` | `varchar(255)` | NO | - | `''` | - |
| 161 | `de_taxsave_use` | `tinyint(4)` | NO | - | `NULL` | - |
| 162 | `de_taxsave_types` | `set('account','vbank','transfer')` | NO | - | `'account'` | - |
| 163 | `de_guest_privacy` | `text` | NO | - | `NULL` | - |
| 164 | `de_hp_use` | `tinyint(4)` | NO | - | `0` | - |
| 165 | `de_escrow_use` | `tinyint(4)` | NO | - | `0` | - |
| 166 | `de_tax_flag_use` | `tinyint(4)` | NO | - | `0` | - |
| 167 | `de_kakaopay_mid` | `varchar(255)` | NO | - | `''` | - |
| 168 | `de_kakaopay_key` | `varchar(255)` | NO | - | `''` | - |
| 169 | `de_kakaopay_enckey` | `varchar(255)` | NO | - | `''` | - |
| 170 | `de_kakaopay_hashkey` | `varchar(255)` | NO | - | `''` | - |
| 171 | `de_kakaopay_cancelpwd` | `varchar(255)` | NO | - | `''` | - |
| 172 | `de_naverpay_mid` | `varchar(255)` | NO | - | `''` | - |
| 173 | `de_naverpay_cert_key` | `varchar(255)` | NO | - | `''` | - |
| 174 | `de_naverpay_button_key` | `varchar(255)` | NO | - | `''` | - |
| 175 | `de_naverpay_test` | `tinyint(4)` | NO | - | `0` | - |
| 176 | `de_naverpay_mb_id` | `varchar(255)` | NO | - | `''` | - |
| 177 | `de_naverpay_sendcost` | `varchar(255)` | NO | - | `''` | - |
| 178 | `de_member_reg_coupon_use` | `tinyint(4)` | NO | - | `0` | - |
| 179 | `de_member_reg_coupon_term` | `int(11)` | NO | - | `0` | - |
| 180 | `de_member_reg_coupon_price` | `int(11)` | NO | - | `0` | - |
| 181 | `de_member_reg_coupon_minimum` | `int(11)` | NO | - | `0` | - |

### `tbl_shop_event`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ev_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `ev_skin` | `varchar(255)` | NO | - | `''` | - |
| 3 | `ev_mobile_skin` | `varchar(255)` | NO | - | `''` | - |
| 4 | `ev_img_width` | `int(11)` | NO | - | `0` | - |
| 5 | `ev_img_height` | `int(11)` | NO | - | `0` | - |
| 6 | `ev_list_mod` | `int(11)` | NO | - | `0` | - |
| 7 | `ev_list_row` | `int(11)` | NO | - | `0` | - |
| 8 | `ev_mobile_img_width` | `int(11)` | NO | - | `0` | - |
| 9 | `ev_mobile_img_height` | `int(11)` | NO | - | `0` | - |
| 10 | `ev_mobile_list_mod` | `int(11)` | NO | - | `0` | - |
| 11 | `ev_mobile_list_row` | `int(11)` | NO | - | `0` | - |
| 12 | `ev_subject` | `varchar(255)` | NO | - | `''` | - |
| 13 | `ev_subject_strong` | `tinyint(4)` | NO | - | `0` | - |
| 14 | `ev_head_html` | `text` | NO | - | `NULL` | - |
| 15 | `ev_tail_html` | `text` | NO | - | `NULL` | - |
| 16 | `ev_use` | `tinyint(4)` | NO | - | `0` | - |

### `tbl_shop_event_item`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ev_id` | `int(11)` | NO | PRI | `0` | - |
| 2 | `it_id` | `varchar(20)` | NO | PRI | `''` | - |

### `tbl_shop_inicis_log`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `oid` | `bigint(20) unsigned` | NO | PRI | `NULL` | - |
| 2 | `P_TID` | `varchar(255)` | NO | - | `''` | - |
| 3 | `P_MID` | `varchar(255)` | NO | - | `''` | - |
| 4 | `P_AUTH_DT` | `varchar(255)` | NO | - | `''` | - |
| 5 | `P_STATUS` | `varchar(255)` | NO | - | `''` | - |
| 6 | `P_TYPE` | `varchar(255)` | NO | - | `''` | - |
| 7 | `P_OID` | `varchar(255)` | NO | - | `''` | - |
| 8 | `P_FN_NM` | `varchar(255)` | NO | - | `''` | - |
| 9 | `P_AUTH_NO` | `varchar(255)` | NO | - | `''` | - |
| 10 | `P_AMT` | `int(11)` | NO | - | `0` | - |
| 11 | `P_RMESG1` | `varchar(255)` | NO | - | `''` | - |
| 12 | `post_data` | `text` | NO | - | `NULL` | - |
| 13 | `is_mail_send` | `tinyint(4)` | NO | - | `1` | - |

### `tbl_shop_item`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `it_id` | `varchar(20)` | NO | PRI | `''` | - |
| 2 | `ca_id` | `varchar(10)` | NO | MUL | `'0'` | - |
| 3 | `ca_id2` | `varchar(255)` | NO | - | `''` | - |
| 4 | `ca_id3` | `varchar(255)` | NO | - | `''` | - |
| 5 | `it_skin` | `varchar(255)` | NO | - | `''` | - |
| 6 | `it_mobile_skin` | `varchar(255)` | NO | - | `''` | - |
| 7 | `it_name` | `varchar(255)` | NO | MUL | `''` | - |
| 8 | `it_seo_title` | `varchar(200)` | NO | MUL | `''` | - |
| 9 | `it_maker` | `varchar(255)` | NO | - | `''` | - |
| 10 | `it_origin` | `varchar(255)` | NO | - | `''` | - |
| 11 | `it_brand` | `varchar(255)` | NO | - | `''` | - |
| 12 | `it_model` | `varchar(255)` | NO | - | `''` | - |
| 13 | `it_option_subject` | `varchar(255)` | NO | - | `''` | - |
| 14 | `it_supply_subject` | `varchar(255)` | NO | - | `''` | - |
| 15 | `it_type1` | `tinyint(4)` | NO | - | `0` | - |
| 16 | `it_type2` | `tinyint(4)` | NO | - | `0` | - |
| 17 | `it_type3` | `tinyint(4)` | NO | - | `0` | - |
| 18 | `it_type4` | `tinyint(4)` | NO | - | `0` | - |
| 19 | `it_type5` | `tinyint(4)` | NO | - | `0` | - |
| 20 | `it_basic` | `text` | NO | - | `NULL` | - |
| 21 | `it_explan` | `mediumtext` | NO | - | `NULL` | - |
| 22 | `it_explan2` | `mediumtext` | NO | - | `NULL` | - |
| 23 | `it_mobile_explan` | `mediumtext` | NO | - | `NULL` | - |
| 24 | `it_cust_price` | `int(11)` | NO | - | `0` | - |
| 25 | `it_price` | `int(11)` | NO | - | `0` | - |
| 26 | `it_point` | `int(11)` | NO | - | `0` | - |
| 27 | `it_point_type` | `tinyint(4)` | NO | - | `0` | - |
| 28 | `it_supply_point` | `int(11)` | NO | - | `0` | - |
| 29 | `it_notax` | `tinyint(4)` | NO | - | `0` | - |
| 30 | `it_sell_email` | `varchar(255)` | NO | - | `''` | - |
| 31 | `it_use` | `tinyint(4)` | NO | - | `0` | - |
| 32 | `it_nocoupon` | `tinyint(4)` | NO | - | `0` | - |
| 33 | `it_soldout` | `tinyint(4)` | NO | - | `0` | - |
| 34 | `it_stock_qty` | `int(11)` | NO | - | `0` | - |
| 35 | `it_correction_qty` | `int(11)` | NO | - | `0` | - |
| 36 | `it_stock_sms` | `tinyint(4)` | NO | - | `0` | - |
| 37 | `it_noti_qty` | `int(11)` | NO | - | `0` | - |
| 38 | `it_sc_type` | `tinyint(4)` | NO | - | `0` | - |
| 39 | `it_sc_method` | `tinyint(4)` | NO | - | `0` | - |
| 40 | `it_sc_price` | `int(11)` | NO | - | `0` | - |
| 41 | `it_sc_minimum` | `int(11)` | NO | - | `0` | - |
| 42 | `it_sc_qty` | `int(11)` | NO | - | `0` | - |
| 43 | `it_buy_min_qty` | `int(11)` | NO | - | `0` | - |
| 44 | `it_buy_max_qty` | `int(11)` | NO | - | `0` | - |
| 45 | `it_head_html` | `text` | NO | - | `NULL` | - |
| 46 | `it_tail_html` | `text` | NO | - | `NULL` | - |
| 47 | `it_mobile_head_html` | `text` | NO | - | `NULL` | - |
| 48 | `it_mobile_tail_html` | `text` | NO | - | `NULL` | - |
| 49 | `it_hit` | `int(11)` | NO | - | `0` | - |
| 50 | `it_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 51 | `it_update_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 52 | `it_ip` | `varchar(25)` | NO | - | `''` | - |
| 53 | `it_order` | `int(11)` | NO | MUL | `0` | - |
| 54 | `it_tel_inq` | `tinyint(4)` | NO | - | `0` | - |
| 55 | `it_info_gubun` | `varchar(50)` | NO | - | `''` | - |
| 56 | `it_info_value` | `text` | NO | - | `NULL` | - |
| 57 | `it_sum_qty` | `int(11)` | NO | - | `0` | - |
| 58 | `it_use_cnt` | `int(11)` | NO | - | `0` | - |
| 59 | `it_use_avg` | `decimal(2,1)` | NO | - | `NULL` | - |
| 60 | `it_shop_memo` | `text` | NO | - | `NULL` | - |
| 61 | `ec_mall_pid` | `varchar(255)` | NO | - | `''` | - |
| 62 | `it_img1` | `varchar(255)` | NO | - | `''` | - |
| 63 | `it_img2` | `varchar(255)` | NO | - | `''` | - |
| 64 | `it_img3` | `varchar(255)` | NO | - | `''` | - |
| 65 | `it_img4` | `varchar(255)` | NO | - | `''` | - |
| 66 | `it_img5` | `varchar(255)` | NO | - | `''` | - |
| 67 | `it_img6` | `varchar(255)` | NO | - | `''` | - |
| 68 | `it_img7` | `varchar(255)` | NO | - | `''` | - |
| 69 | `it_img8` | `varchar(255)` | NO | - | `''` | - |
| 70 | `it_img9` | `varchar(255)` | NO | - | `''` | - |
| 71 | `it_img10` | `varchar(255)` | NO | - | `''` | - |
| 72 | `it_1_subj` | `varchar(255)` | NO | - | `''` | - |
| 73 | `it_2_subj` | `varchar(255)` | NO | - | `''` | - |
| 74 | `it_3_subj` | `varchar(255)` | NO | - | `''` | - |
| 75 | `it_4_subj` | `varchar(255)` | NO | - | `''` | - |
| 76 | `it_5_subj` | `varchar(255)` | NO | - | `''` | - |
| 77 | `it_6_subj` | `varchar(255)` | NO | - | `''` | - |
| 78 | `it_7_subj` | `varchar(255)` | NO | - | `''` | - |
| 79 | `it_8_subj` | `varchar(255)` | NO | - | `''` | - |
| 80 | `it_9_subj` | `varchar(255)` | NO | - | `''` | - |
| 81 | `it_10_subj` | `varchar(255)` | NO | - | `''` | - |
| 82 | `it_1` | `varchar(255)` | NO | - | `''` | - |
| 83 | `it_2` | `varchar(255)` | NO | - | `''` | - |
| 84 | `it_3` | `varchar(255)` | NO | - | `''` | - |
| 85 | `it_4` | `varchar(255)` | NO | - | `''` | - |
| 86 | `it_5` | `varchar(255)` | NO | - | `''` | - |
| 87 | `it_6` | `varchar(255)` | NO | - | `''` | - |
| 88 | `it_7` | `varchar(255)` | NO | - | `''` | - |
| 89 | `it_8` | `varchar(255)` | NO | - | `''` | - |
| 90 | `it_9` | `varchar(255)` | NO | - | `''` | - |
| 91 | `it_10` | `varchar(255)` | NO | - | `''` | - |

### `tbl_shop_item_option`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `io_no` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `io_id` | `varchar(255)` | NO | MUL | `'0'` | - |
| 3 | `io_type` | `tinyint(4)` | NO | - | `0` | - |
| 4 | `it_id` | `varchar(20)` | NO | MUL | `''` | - |
| 5 | `io_price` | `int(11)` | NO | - | `0` | - |
| 6 | `io_stock_qty` | `int(11)` | NO | - | `0` | - |
| 7 | `io_noti_qty` | `int(11)` | NO | - | `0` | - |
| 8 | `io_use` | `tinyint(4)` | NO | - | `0` | - |

### `tbl_shop_item_qa`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `iq_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `it_id` | `varchar(20)` | NO | - | `''` | - |
| 3 | `mb_id` | `varchar(255)` | NO | - | `''` | - |
| 4 | `iq_secret` | `tinyint(4)` | NO | - | `0` | - |
| 5 | `iq_name` | `varchar(255)` | NO | - | `''` | - |
| 6 | `iq_email` | `varchar(255)` | NO | - | `''` | - |
| 7 | `iq_hp` | `varchar(255)` | NO | - | `''` | - |
| 8 | `iq_password` | `varchar(255)` | NO | - | `''` | - |
| 9 | `iq_subject` | `varchar(255)` | NO | - | `''` | - |
| 10 | `iq_question` | `text` | NO | - | `NULL` | - |
| 11 | `iq_answer` | `text` | NO | - | `NULL` | - |
| 12 | `iq_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 13 | `iq_ip` | `varchar(25)` | NO | - | `''` | - |

### `tbl_shop_item_relation`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `it_id` | `varchar(20)` | NO | PRI | `''` | - |
| 2 | `it_id2` | `varchar(20)` | NO | PRI | `''` | - |
| 3 | `ir_no` | `int(11)` | NO | - | `0` | - |

### `tbl_shop_item_stocksms`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ss_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `it_id` | `varchar(20)` | NO | - | `''` | - |
| 3 | `ss_hp` | `varchar(255)` | NO | - | `''` | - |
| 4 | `ss_send` | `tinyint(4)` | NO | - | `0` | - |
| 5 | `ss_send_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 6 | `ss_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 7 | `ss_ip` | `varchar(25)` | NO | - | `''` | - |

### `tbl_shop_item_use`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `is_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `it_id` | `varchar(20)` | NO | MUL | `'0'` | - |
| 3 | `mb_id` | `varchar(255)` | NO | - | `''` | - |
| 4 | `is_name` | `varchar(255)` | NO | - | `''` | - |
| 5 | `is_password` | `varchar(255)` | NO | - | `''` | - |
| 6 | `is_score` | `tinyint(4)` | NO | - | `0` | - |
| 7 | `is_subject` | `varchar(255)` | NO | - | `''` | - |
| 8 | `is_content` | `text` | NO | - | `NULL` | - |
| 9 | `is_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 10 | `is_ip` | `varchar(25)` | NO | - | `''` | - |
| 11 | `is_confirm` | `tinyint(4)` | NO | - | `0` | - |

### `tbl_shop_order`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `od_id` | `bigint(20) unsigned` | NO | PRI | `NULL` | - |
| 2 | `mb_id` | `varchar(255)` | NO | MUL | `''` | - |
| 3 | `od_name` | `varchar(20)` | NO | - | `''` | - |
| 4 | `od_email` | `varchar(100)` | NO | - | `''` | - |
| 5 | `od_tel` | `varchar(20)` | NO | - | `''` | - |
| 6 | `od_hp` | `varchar(20)` | NO | - | `''` | - |
| 7 | `od_zip1` | `char(3)` | NO | - | `''` | - |
| 8 | `od_zip2` | `char(3)` | NO | - | `''` | - |
| 9 | `od_addr1` | `varchar(100)` | NO | - | `''` | - |
| 10 | `od_addr2` | `varchar(100)` | NO | - | `''` | - |
| 11 | `od_addr3` | `varchar(255)` | NO | - | `''` | - |
| 12 | `od_addr_jibeon` | `varchar(255)` | NO | - | `''` | - |
| 13 | `od_deposit_name` | `varchar(20)` | NO | - | `''` | - |
| 14 | `od_b_name` | `varchar(20)` | NO | - | `''` | - |
| 15 | `od_b_tel` | `varchar(20)` | NO | - | `''` | - |
| 16 | `od_b_hp` | `varchar(20)` | NO | - | `''` | - |
| 17 | `od_b_zip1` | `char(3)` | NO | - | `''` | - |
| 18 | `od_b_zip2` | `char(3)` | NO | - | `''` | - |
| 19 | `od_b_addr1` | `varchar(100)` | NO | - | `''` | - |
| 20 | `od_b_addr2` | `varchar(100)` | NO | - | `''` | - |
| 21 | `od_b_addr3` | `varchar(255)` | NO | - | `''` | - |
| 22 | `od_b_addr_jibeon` | `varchar(255)` | NO | - | `''` | - |
| 23 | `od_memo` | `text` | NO | - | `NULL` | - |
| 24 | `od_cart_count` | `int(11)` | NO | - | `0` | - |
| 25 | `od_cart_price` | `int(11)` | NO | - | `0` | - |
| 26 | `od_cart_coupon` | `int(11)` | NO | - | `0` | - |
| 27 | `od_send_cost` | `int(11)` | NO | - | `0` | - |
| 28 | `od_send_cost2` | `int(11)` | NO | - | `0` | - |
| 29 | `od_send_coupon` | `int(11)` | NO | - | `0` | - |
| 30 | `od_receipt_price` | `int(11)` | NO | - | `0` | - |
| 31 | `od_cancel_price` | `int(11)` | NO | - | `0` | - |
| 32 | `od_receipt_point` | `int(11)` | NO | - | `0` | - |
| 33 | `od_refund_price` | `int(11)` | NO | - | `0` | - |
| 34 | `od_bank_account` | `varchar(255)` | NO | - | `''` | - |
| 35 | `od_receipt_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 36 | `od_coupon` | `int(11)` | NO | - | `0` | - |
| 37 | `od_misu` | `int(11)` | NO | - | `0` | - |
| 38 | `od_shop_memo` | `text` | NO | - | `NULL` | - |
| 39 | `od_mod_history` | `text` | NO | - | `NULL` | - |
| 40 | `od_status` | `varchar(255)` | NO | - | `''` | - |
| 41 | `od_hope_date` | `date` | NO | - | `'0000-00-00'` | - |
| 42 | `od_settle_case` | `varchar(255)` | NO | - | `''` | - |
| 43 | `od_other_pay_type` | `varchar(100)` | NO | - | `''` | - |
| 44 | `od_test` | `tinyint(4)` | NO | - | `0` | - |
| 45 | `od_mobile` | `tinyint(4)` | NO | - | `0` | - |
| 46 | `od_pg` | `varchar(255)` | NO | - | `''` | - |
| 47 | `od_tno` | `varchar(255)` | NO | - | `''` | - |
| 48 | `od_app_no` | `varchar(20)` | NO | - | `''` | - |
| 49 | `od_escrow` | `tinyint(4)` | NO | - | `0` | - |
| 50 | `od_casseqno` | `varchar(255)` | NO | - | `''` | - |
| 51 | `od_tax_flag` | `tinyint(4)` | NO | - | `0` | - |
| 52 | `od_tax_mny` | `int(11)` | NO | - | `0` | - |
| 53 | `od_vat_mny` | `int(11)` | NO | - | `0` | - |
| 54 | `od_free_mny` | `int(11)` | NO | - | `0` | - |
| 55 | `od_delivery_company` | `varchar(255)` | NO | - | `'0'` | - |
| 56 | `od_invoice` | `varchar(255)` | NO | - | `''` | - |
| 57 | `od_invoice_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 58 | `od_cash` | `tinyint(4)` | NO | - | `NULL` | - |
| 59 | `od_cash_no` | `varchar(255)` | NO | - | `NULL` | - |
| 60 | `od_cash_info` | `text` | NO | - | `NULL` | - |
| 61 | `od_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 62 | `od_pwd` | `varchar(255)` | NO | - | `''` | - |
| 63 | `od_ip` | `varchar(25)` | NO | - | `''` | - |

### `tbl_shop_order_address`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `ad_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(255)` | NO | MUL | `''` | - |
| 3 | `ad_subject` | `varchar(255)` | NO | - | `''` | - |
| 4 | `ad_default` | `tinyint(4)` | NO | - | `0` | - |
| 5 | `ad_name` | `varchar(255)` | NO | - | `''` | - |
| 6 | `ad_tel` | `varchar(255)` | NO | - | `''` | - |
| 7 | `ad_hp` | `varchar(255)` | NO | - | `''` | - |
| 8 | `ad_zip1` | `char(3)` | NO | - | `''` | - |
| 9 | `ad_zip2` | `char(3)` | NO | - | `''` | - |
| 10 | `ad_addr1` | `varchar(255)` | NO | - | `''` | - |
| 11 | `ad_addr2` | `varchar(255)` | NO | - | `''` | - |
| 12 | `ad_addr3` | `varchar(255)` | NO | - | `''` | - |
| 13 | `ad_jibeon` | `varchar(255)` | NO | - | `''` | - |

### `tbl_shop_order_data`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `od_id` | `bigint(20) unsigned` | NO | MUL | `NULL` | - |
| 2 | `cart_id` | `bigint(20) unsigned` | NO | - | `NULL` | - |
| 3 | `mb_id` | `varchar(20)` | NO | - | `''` | - |
| 4 | `dt_pg` | `varchar(255)` | NO | - | `''` | - |
| 5 | `dt_data` | `text` | NO | - | `NULL` | - |
| 6 | `dt_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_order_delete`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `de_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `de_key` | `varchar(255)` | NO | - | `''` | - |
| 3 | `de_data` | `longtext` | NO | - | `NULL` | - |
| 4 | `mb_id` | `varchar(20)` | NO | - | `''` | - |
| 5 | `de_ip` | `varchar(255)` | NO | - | `''` | - |
| 6 | `de_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_order_post_log`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `log_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `oid` | `bigint(20) unsigned` | NO | - | `NULL` | - |
| 3 | `mb_id` | `varchar(255)` | NO | - | `''` | - |
| 4 | `post_data` | `text` | NO | - | `NULL` | - |
| 5 | `ol_code` | `varchar(255)` | NO | - | `''` | - |
| 6 | `ol_msg` | `text` | NO | - | `NULL` | - |
| 7 | `ol_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 8 | `ol_ip` | `varchar(25)` | NO | - | `''` | - |

### `tbl_shop_personalpay`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `pp_id` | `bigint(20) unsigned` | NO | PRI | `NULL` | - |
| 2 | `od_id` | `bigint(20) unsigned` | NO | MUL | `NULL` | - |
| 3 | `pp_name` | `varchar(255)` | NO | - | `''` | - |
| 4 | `pp_email` | `varchar(255)` | NO | - | `''` | - |
| 5 | `pp_hp` | `varchar(255)` | NO | - | `''` | - |
| 6 | `pp_content` | `text` | NO | - | `NULL` | - |
| 7 | `pp_use` | `tinyint(4)` | NO | - | `0` | - |
| 8 | `pp_price` | `int(11)` | NO | - | `0` | - |
| 9 | `pp_pg` | `varchar(255)` | NO | - | `''` | - |
| 10 | `pp_tno` | `varchar(255)` | NO | - | `''` | - |
| 11 | `pp_app_no` | `varchar(20)` | NO | - | `''` | - |
| 12 | `pp_casseqno` | `varchar(255)` | NO | - | `''` | - |
| 13 | `pp_receipt_price` | `int(11)` | NO | - | `0` | - |
| 14 | `pp_settle_case` | `varchar(255)` | NO | - | `''` | - |
| 15 | `pp_bank_account` | `varchar(255)` | NO | - | `''` | - |
| 16 | `pp_deposit_name` | `varchar(255)` | NO | - | `''` | - |
| 17 | `pp_receipt_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 18 | `pp_receipt_ip` | `varchar(255)` | NO | - | `''` | - |
| 19 | `pp_shop_memo` | `text` | NO | - | `NULL` | - |
| 20 | `pp_cash` | `tinyint(4)` | NO | - | `0` | - |
| 21 | `pp_cash_no` | `varchar(255)` | NO | - | `''` | - |
| 22 | `pp_cash_info` | `text` | NO | - | `NULL` | - |
| 23 | `pp_ip` | `varchar(255)` | NO | - | `''` | - |
| 24 | `pp_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |

### `tbl_shop_sendcost`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `sc_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `sc_name` | `varchar(255)` | NO | - | `''` | - |
| 3 | `sc_zip1` | `varchar(10)` | NO | MUL | `''` | - |
| 4 | `sc_zip2` | `varchar(10)` | NO | MUL | `''` | - |
| 5 | `sc_price` | `int(11)` | NO | - | `0` | - |

### `tbl_shop_wish`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `wi_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `mb_id` | `varchar(255)` | NO | MUL | `''` | - |
| 3 | `it_id` | `varchar(20)` | NO | - | `'0'` | - |
| 4 | `wi_time` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 5 | `wi_ip` | `varchar(25)` | NO | - | `''` | - |

### `tbl_uniqid`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `uq_id` | `bigint(20) unsigned` | NO | PRI | `NULL` | - |
| 2 | `uq_ip` | `varchar(255)` | NO | - | `NULL` | - |

### `tbl_visit`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `vi_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `vi_ip` | `varchar(100)` | NO | MUL | `''` | - |
| 3 | `vi_date` | `date` | NO | MUL | `'0000-00-00'` | - |
| 4 | `vi_time` | `time` | NO | - | `'00:00:00'` | - |
| 5 | `vi_referer` | `text` | NO | - | `NULL` | - |
| 6 | `vi_agent` | `varchar(200)` | NO | - | `''` | - |
| 7 | `vi_browser` | `varchar(255)` | NO | - | `''` | - |
| 8 | `vi_os` | `varchar(255)` | NO | - | `''` | - |
| 9 | `vi_device` | `varchar(255)` | NO | - | `''` | - |

### `tbl_visit_sum`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `vs_date` | `date` | NO | PRI | `'0000-00-00'` | - |
| 2 | `vs_count` | `int(11)` | NO | MUL | `0` | - |

### `tbl_write_briefing`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `wr_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `wr_num` | `int(11)` | NO | MUL | `0` | - |
| 3 | `wr_reply` | `varchar(10)` | NO | - | `NULL` | - |
| 4 | `wr_parent` | `int(11)` | NO | - | `0` | - |
| 5 | `wr_is_comment` | `tinyint(4)` | NO | MUL | `0` | - |
| 6 | `wr_comment` | `int(11)` | NO | - | `0` | - |
| 7 | `wr_comment_reply` | `varchar(5)` | NO | - | `NULL` | - |
| 8 | `ca_name` | `varchar(255)` | NO | - | `NULL` | - |
| 9 | `wr_option` | `set('html1','html2','secret','mail')` | NO | - | `NULL` | - |
| 10 | `wr_subject` | `varchar(255)` | NO | - | `NULL` | - |
| 11 | `wr_content` | `text` | NO | - | `NULL` | - |
| 12 | `wr_seo_title` | `varchar(255)` | NO | MUL | `''` | - |
| 13 | `wr_link1` | `text` | NO | - | `NULL` | - |
| 14 | `wr_link2` | `text` | NO | - | `NULL` | - |
| 15 | `wr_link1_hit` | `int(11)` | NO | - | `0` | - |
| 16 | `wr_link2_hit` | `int(11)` | NO | - | `0` | - |
| 17 | `wr_hit` | `int(11)` | NO | - | `0` | - |
| 18 | `wr_good` | `int(11)` | NO | - | `0` | - |
| 19 | `wr_nogood` | `int(11)` | NO | - | `0` | - |
| 20 | `mb_id` | `varchar(20)` | NO | - | `NULL` | - |
| 21 | `wr_password` | `varchar(255)` | NO | - | `NULL` | - |
| 22 | `wr_name` | `varchar(255)` | NO | - | `NULL` | - |
| 23 | `wr_email` | `varchar(255)` | NO | - | `NULL` | - |
| 24 | `wr_homepage` | `varchar(255)` | NO | - | `NULL` | - |
| 25 | `wr_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 26 | `wr_file` | `tinyint(4)` | NO | - | `0` | - |
| 27 | `wr_last` | `varchar(19)` | NO | - | `NULL` | - |
| 28 | `wr_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 29 | `wr_facebook_user` | `varchar(255)` | NO | - | `NULL` | - |
| 30 | `wr_twitter_user` | `varchar(255)` | NO | - | `NULL` | - |
| 31 | `wr_1` | `varchar(255)` | NO | - | `NULL` | - |
| 32 | `wr_2` | `varchar(255)` | NO | - | `NULL` | - |
| 33 | `wr_3` | `varchar(255)` | NO | - | `NULL` | - |
| 34 | `wr_4` | `varchar(255)` | NO | - | `NULL` | - |
| 35 | `wr_5` | `varchar(255)` | NO | - | `NULL` | - |
| 36 | `wr_6` | `varchar(255)` | NO | - | `NULL` | - |
| 37 | `wr_7` | `varchar(255)` | NO | - | `NULL` | - |
| 38 | `wr_8` | `varchar(255)` | NO | - | `NULL` | - |
| 39 | `wr_9` | `varchar(255)` | NO | - | `NULL` | - |
| 40 | `wr_10` | `varchar(255)` | NO | - | `NULL` | - |

### `tbl_write_correcting`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `wr_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `wr_num` | `int(11)` | NO | MUL | `0` | - |
| 3 | `wr_reply` | `varchar(10)` | NO | - | `NULL` | - |
| 4 | `wr_parent` | `int(11)` | NO | - | `0` | - |
| 5 | `wr_is_comment` | `tinyint(4)` | NO | MUL | `0` | - |
| 6 | `wr_comment` | `int(11)` | NO | - | `0` | - |
| 7 | `wr_comment_reply` | `varchar(5)` | NO | - | `NULL` | - |
| 8 | `ca_name` | `varchar(255)` | NO | - | `NULL` | - |
| 9 | `wr_option` | `set('html1','html2','secret','mail')` | NO | - | `NULL` | - |
| 10 | `wr_subject` | `varchar(255)` | NO | - | `NULL` | - |
| 11 | `wr_content` | `text` | NO | - | `NULL` | - |
| 12 | `wr_seo_title` | `varchar(255)` | NO | MUL | `NULL` | - |
| 13 | `wr_link1` | `text` | NO | - | `NULL` | - |
| 14 | `wr_link2` | `text` | NO | - | `NULL` | - |
| 15 | `wr_link1_hit` | `int(11)` | NO | - | `0` | - |
| 16 | `wr_link2_hit` | `int(11)` | NO | - | `0` | - |
| 17 | `wr_hit` | `int(11)` | NO | - | `0` | - |
| 18 | `wr_good` | `int(11)` | NO | - | `0` | - |
| 19 | `wr_nogood` | `int(11)` | NO | - | `0` | - |
| 20 | `mb_id` | `varchar(20)` | NO | - | `NULL` | - |
| 21 | `wr_password` | `varchar(255)` | NO | - | `NULL` | - |
| 22 | `wr_name` | `varchar(255)` | NO | - | `NULL` | - |
| 23 | `wr_email` | `varchar(255)` | NO | - | `NULL` | - |
| 24 | `wr_homepage` | `varchar(255)` | NO | - | `NULL` | - |
| 25 | `wr_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 26 | `wr_file` | `tinyint(4)` | NO | - | `0` | - |
| 27 | `wr_last` | `varchar(19)` | NO | - | `NULL` | - |
| 28 | `wr_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 29 | `wr_facebook_user` | `varchar(255)` | NO | - | `NULL` | - |
| 30 | `wr_twitter_user` | `varchar(255)` | NO | - | `NULL` | - |
| 31 | `wr_1` | `varchar(255)` | NO | - | `NULL` | - |
| 32 | `wr_2` | `varchar(255)` | NO | - | `NULL` | - |
| 33 | `wr_3` | `varchar(255)` | NO | - | `NULL` | - |
| 34 | `wr_4` | `varchar(255)` | NO | - | `NULL` | - |
| 35 | `wr_5` | `varchar(255)` | NO | - | `NULL` | - |
| 36 | `wr_6` | `varchar(255)` | NO | - | `NULL` | - |
| 37 | `wr_7` | `varchar(255)` | NO | - | `NULL` | - |
| 38 | `wr_8` | `varchar(255)` | NO | - | `NULL` | - |
| 39 | `wr_9` | `varchar(255)` | NO | - | `NULL` | - |
| 40 | `wr_10` | `varchar(255)` | NO | - | `NULL` | - |

### `tbl_write_notice`

| # | Column | Type | Nullable | Key | Default | Extra |
|---:|---|---|---|---|---|---|
| 1 | `wr_id` | `int(11)` | NO | PRI | `NULL` | auto_increment |
| 2 | `wr_num` | `int(11)` | NO | MUL | `0` | - |
| 3 | `wr_reply` | `varchar(10)` | NO | - | `NULL` | - |
| 4 | `wr_parent` | `int(11)` | NO | - | `0` | - |
| 5 | `wr_is_comment` | `tinyint(4)` | NO | MUL | `0` | - |
| 6 | `wr_comment` | `int(11)` | NO | - | `0` | - |
| 7 | `wr_comment_reply` | `varchar(5)` | NO | - | `NULL` | - |
| 8 | `ca_name` | `varchar(255)` | NO | - | `NULL` | - |
| 9 | `wr_option` | `set('html1','html2','secret','mail')` | NO | - | `NULL` | - |
| 10 | `wr_subject` | `varchar(255)` | NO | - | `NULL` | - |
| 11 | `wr_content` | `text` | NO | - | `NULL` | - |
| 12 | `wr_seo_title` | `varchar(255)` | NO | MUL | `NULL` | - |
| 13 | `wr_link1` | `text` | NO | - | `NULL` | - |
| 14 | `wr_link2` | `text` | NO | - | `NULL` | - |
| 15 | `wr_link1_hit` | `int(11)` | NO | - | `0` | - |
| 16 | `wr_link2_hit` | `int(11)` | NO | - | `0` | - |
| 17 | `wr_hit` | `int(11)` | NO | - | `0` | - |
| 18 | `wr_good` | `int(11)` | NO | - | `0` | - |
| 19 | `wr_nogood` | `int(11)` | NO | - | `0` | - |
| 20 | `mb_id` | `varchar(20)` | NO | - | `NULL` | - |
| 21 | `wr_password` | `varchar(255)` | NO | - | `NULL` | - |
| 22 | `wr_name` | `varchar(255)` | NO | - | `NULL` | - |
| 23 | `wr_email` | `varchar(255)` | NO | - | `NULL` | - |
| 24 | `wr_homepage` | `varchar(255)` | NO | - | `NULL` | - |
| 25 | `wr_datetime` | `datetime` | NO | - | `'0000-00-00 00:00:00'` | - |
| 26 | `wr_file` | `tinyint(4)` | NO | - | `0` | - |
| 27 | `wr_last` | `varchar(19)` | NO | - | `NULL` | - |
| 28 | `wr_ip` | `varchar(255)` | NO | - | `NULL` | - |
| 29 | `wr_facebook_user` | `varchar(255)` | NO | - | `NULL` | - |
| 30 | `wr_twitter_user` | `varchar(255)` | NO | - | `NULL` | - |
| 31 | `wr_1` | `varchar(255)` | NO | - | `NULL` | - |
| 32 | `wr_2` | `varchar(255)` | NO | - | `NULL` | - |
| 33 | `wr_3` | `varchar(255)` | NO | - | `NULL` | - |
| 34 | `wr_4` | `varchar(255)` | NO | - | `NULL` | - |
| 35 | `wr_5` | `varchar(255)` | NO | - | `NULL` | - |
| 36 | `wr_6` | `varchar(255)` | NO | - | `NULL` | - |
| 37 | `wr_7` | `varchar(255)` | NO | - | `NULL` | - |
| 38 | `wr_8` | `varchar(255)` | NO | - | `NULL` | - |
| 39 | `wr_9` | `varchar(255)` | NO | - | `NULL` | - |
| 40 | `wr_10` | `varchar(255)` | NO | - | `NULL` | - |

## Indexes

| Table | Index | Unique | Seq | Column | Type |
|---|---|---|---:|---|---|
| `tbl_auth` | `PRIMARY` | YES | 1 | `mb_id` | BTREE |
| `tbl_auth` | `PRIMARY` | YES | 2 | `au_menu` | BTREE |
| `tbl_autosave` | `as_uid` | YES | 1 | `as_uid` | BTREE |
| `tbl_autosave` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_autosave` | `PRIMARY` | YES | 1 | `as_id` | BTREE |
| `tbl_board` | `PRIMARY` | YES | 1 | `bo_table` | BTREE |
| `tbl_board_file` | `PRIMARY` | YES | 1 | `bo_table` | BTREE |
| `tbl_board_file` | `PRIMARY` | YES | 2 | `wr_id` | BTREE |
| `tbl_board_file` | `PRIMARY` | YES | 3 | `bf_no` | BTREE |
| `tbl_board_good` | `fkey1` | YES | 1 | `bo_table` | BTREE |
| `tbl_board_good` | `fkey1` | YES | 2 | `wr_id` | BTREE |
| `tbl_board_good` | `fkey1` | YES | 3 | `mb_id` | BTREE |
| `tbl_board_good` | `PRIMARY` | YES | 1 | `bg_id` | BTREE |
| `tbl_board_new` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_board_new` | `PRIMARY` | YES | 1 | `bn_id` | BTREE |
| `tbl_cert_history` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_cert_history` | `PRIMARY` | YES | 1 | `cr_id` | BTREE |
| `tbl_config` | `PRIMARY` | YES | 1 | `cf_id` | BTREE |
| `tbl_content` | `co_seo_title` | NO | 1 | `co_seo_title` | BTREE |
| `tbl_content` | `PRIMARY` | YES | 1 | `co_id` | BTREE |
| `tbl_faq` | `fm_id` | NO | 1 | `fm_id` | BTREE |
| `tbl_faq` | `PRIMARY` | YES | 1 | `fa_id` | BTREE |
| `tbl_faq_master` | `PRIMARY` | YES | 1 | `fm_id` | BTREE |
| `tbl_group` | `PRIMARY` | YES | 1 | `gr_id` | BTREE |
| `tbl_group_member` | `gr_id` | NO | 1 | `gr_id` | BTREE |
| `tbl_group_member` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_group_member` | `PRIMARY` | YES | 1 | `gm_id` | BTREE |
| `tbl_lec_item_content` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_lec_item_content` | `ic_name` | NO | 1 | `ic_name` | BTREE |
| `tbl_lec_item_content` | `ic_ord` | NO | 1 | `ic_order` | BTREE |
| `tbl_lec_item_content` | `ic_use` | NO | 1 | `ic_use` | BTREE |
| `tbl_lec_item_content` | `PRIMARY` | YES | 1 | `ic_id` | BTREE |
| `tbl_lec_item_content_log` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_lec_item_content_log` | `ic_id` | NO | 1 | `ic_id` | BTREE |
| `tbl_lec_item_content_log` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_lec_item_content_log` | `PRIMARY` | YES | 1 | `icl_id` | BTREE |
| `tbl_lec_item_exam_license` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_lec_item_exam_license` | `iet_id` | NO | 1 | `iet_id` | BTREE |
| `tbl_lec_item_exam_license` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_lec_item_exam_license` | `mb_phase` | NO | 1 | `mb_phase` | BTREE |
| `tbl_lec_item_exam_license` | `PRIMARY` | YES | 1 | `iel_id` | BTREE |
| `tbl_lec_item_exam_result` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_lec_item_exam_result` | `ier_res` | NO | 1 | `ier_res` | BTREE |
| `tbl_lec_item_exam_result` | `ie_id` | NO | 1 | `ie_id` | BTREE |
| `tbl_lec_item_exam_result` | `lolId` | NO | 1 | `lolId` | BTREE |
| `tbl_lec_item_exam_result` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_lec_item_exam_result` | `mb_phase` | NO | 1 | `mb_phase` | BTREE |
| `tbl_lec_item_exam_result` | `PRIMARY` | YES | 1 | `ier_id` | BTREE |
| `tbl_lec_item_exam_tasks` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_lec_item_exam_tasks` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_lec_item_exam_tasks` | `mb_phase` | NO | 1 | `mb_phase` | BTREE |
| `tbl_lec_item_exam_tasks` | `PRIMARY` | YES | 1 | `iet_id` | BTREE |
| `tbl_lec_item_teacher` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_lec_item_teacher` | `ic_ord` | NO | 1 | `ir_order` | BTREE |
| `tbl_lec_item_teacher` | `ic_use` | NO | 1 | `ir_use` | BTREE |
| `tbl_lec_item_teacher` | `itc_name` | NO | 1 | `ir_name` | BTREE |
| `tbl_lec_item_teacher` | `PRIMARY` | YES | 1 | `ir_id` | BTREE |
| `tbl_lec_order_member` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_lec_order_member` | `it_id` | NO | 1 | `it_id` | BTREE |
| `tbl_lec_order_member` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_lec_order_member` | `od_id` | NO | 1 | `od_id` | BTREE |
| `tbl_lec_order_member` | `PRIMARY` | YES | 1 | `lol_no` | BTREE |
| `tbl_login` | `lo_ip_unique` | YES | 1 | `lo_ip` | BTREE |
| `tbl_login` | `PRIMARY` | YES | 1 | `lo_id` | BTREE |
| `tbl_mail` | `PRIMARY` | YES | 1 | `ma_id` | BTREE |
| `tbl_member` | `mb_datetime` | NO | 1 | `mb_datetime` | BTREE |
| `tbl_member` | `mb_id` | YES | 1 | `mb_id` | BTREE |
| `tbl_member` | `mb_today_login` | NO | 1 | `mb_today_login` | BTREE |
| `tbl_member` | `PRIMARY` | YES | 1 | `mb_no` | BTREE |
| `tbl_member_cert_history` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_member_cert_history` | `PRIMARY` | YES | 1 | `ch_id` | BTREE |
| `tbl_member_social_profiles` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_member_social_profiles` | `PRIMARY` | YES | 1 | `mp_no` | BTREE |
| `tbl_member_social_profiles` | `provider` | NO | 1 | `provider` | BTREE |
| `tbl_memo` | `me_recv_mb_id` | NO | 1 | `me_recv_mb_id` | BTREE |
| `tbl_memo` | `PRIMARY` | YES | 1 | `me_id` | BTREE |
| `tbl_menu` | `PRIMARY` | YES | 1 | `me_id` | BTREE |
| `tbl_new_win` | `PRIMARY` | YES | 1 | `nw_id` | BTREE |
| `tbl_point` | `index1` | NO | 1 | `mb_id` | BTREE |
| `tbl_point` | `index1` | NO | 2 | `po_rel_table` | BTREE |
| `tbl_point` | `index1` | NO | 3 | `po_rel_id` | BTREE |
| `tbl_point` | `index1` | NO | 4 | `po_rel_action` | BTREE |
| `tbl_point` | `index2` | NO | 1 | `po_expire_date` | BTREE |
| `tbl_point` | `PRIMARY` | YES | 1 | `po_id` | BTREE |
| `tbl_poll` | `PRIMARY` | YES | 1 | `po_id` | BTREE |
| `tbl_poll_etc` | `PRIMARY` | YES | 1 | `pc_id` | BTREE |
| `tbl_popular` | `index1` | YES | 1 | `pp_date` | BTREE |
| `tbl_popular` | `index1` | YES | 2 | `pp_word` | BTREE |
| `tbl_popular` | `index1` | YES | 3 | `pp_ip` | BTREE |
| `tbl_popular` | `PRIMARY` | YES | 1 | `pp_id` | BTREE |
| `tbl_qa_config` | `PRIMARY` | YES | 1 | `qa_id` | BTREE |
| `tbl_qa_content` | `PRIMARY` | YES | 1 | `qa_id` | BTREE |
| `tbl_qa_content` | `qa_num_parent` | NO | 1 | `qa_num` | BTREE |
| `tbl_qa_content` | `qa_num_parent` | NO | 2 | `qa_parent` | BTREE |
| `tbl_rlec_item_exam` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_rlec_item_exam` | `ie_order` | NO | 1 | `ie_order` | BTREE |
| `tbl_rlec_item_exam` | `ie_use` | NO | 1 | `ie_use` | BTREE |
| `tbl_rlec_item_exam` | `PRIMARY` | YES | 1 | `ie_id` | BTREE |
| `tbl_scrap` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_scrap` | `PRIMARY` | YES | 1 | `ms_id` | BTREE |
| `tbl_shop_banner` | `PRIMARY` | YES | 1 | `bn_id` | BTREE |
| `tbl_shop_cart` | `ct_status` | NO | 1 | `ct_status` | BTREE |
| `tbl_shop_cart` | `it_id` | NO | 1 | `it_id` | BTREE |
| `tbl_shop_cart` | `od_id` | NO | 1 | `od_id` | BTREE |
| `tbl_shop_cart` | `PRIMARY` | YES | 1 | `ct_id` | BTREE |
| `tbl_shop_category` | `ca_order` | NO | 1 | `ca_order` | BTREE |
| `tbl_shop_category` | `PRIMARY` | YES | 1 | `ca_id` | BTREE |
| `tbl_shop_coupon` | `cp_id` | YES | 1 | `cp_id` | BTREE |
| `tbl_shop_coupon` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_shop_coupon` | `PRIMARY` | YES | 1 | `cp_no` | BTREE |
| `tbl_shop_coupon_log` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_shop_coupon_log` | `od_id` | NO | 1 | `od_id` | BTREE |
| `tbl_shop_coupon_log` | `PRIMARY` | YES | 1 | `cl_id` | BTREE |
| `tbl_shop_coupon_zone` | `PRIMARY` | YES | 1 | `cz_id` | BTREE |
| `tbl_shop_default` | `PRIMARY` | YES | 1 | `de_id` | BTREE |
| `tbl_shop_event` | `PRIMARY` | YES | 1 | `ev_id` | BTREE |
| `tbl_shop_event_item` | `it_id` | NO | 1 | `it_id` | BTREE |
| `tbl_shop_event_item` | `PRIMARY` | YES | 1 | `ev_id` | BTREE |
| `tbl_shop_event_item` | `PRIMARY` | YES | 2 | `it_id` | BTREE |
| `tbl_shop_inicis_log` | `PRIMARY` | YES | 1 | `oid` | BTREE |
| `tbl_shop_item` | `ca_id` | NO | 1 | `ca_id` | BTREE |
| `tbl_shop_item` | `it_name` | NO | 1 | `it_name` | BTREE |
| `tbl_shop_item` | `it_order` | NO | 1 | `it_order` | BTREE |
| `tbl_shop_item` | `it_seo_title` | NO | 1 | `it_seo_title` | BTREE |
| `tbl_shop_item` | `PRIMARY` | YES | 1 | `it_id` | BTREE |
| `tbl_shop_item_option` | `io_id` | NO | 1 | `io_id` | BTREE |
| `tbl_shop_item_option` | `it_id` | NO | 1 | `it_id` | BTREE |
| `tbl_shop_item_option` | `PRIMARY` | YES | 1 | `io_no` | BTREE |
| `tbl_shop_item_qa` | `PRIMARY` | YES | 1 | `iq_id` | BTREE |
| `tbl_shop_item_relation` | `PRIMARY` | YES | 1 | `it_id` | BTREE |
| `tbl_shop_item_relation` | `PRIMARY` | YES | 2 | `it_id2` | BTREE |
| `tbl_shop_item_stocksms` | `PRIMARY` | YES | 1 | `ss_id` | BTREE |
| `tbl_shop_item_use` | `index1` | NO | 1 | `it_id` | BTREE |
| `tbl_shop_item_use` | `PRIMARY` | YES | 1 | `is_id` | BTREE |
| `tbl_shop_order` | `index2` | NO | 1 | `mb_id` | BTREE |
| `tbl_shop_order` | `PRIMARY` | YES | 1 | `od_id` | BTREE |
| `tbl_shop_order_address` | `mb_id` | NO | 1 | `mb_id` | BTREE |
| `tbl_shop_order_address` | `PRIMARY` | YES | 1 | `ad_id` | BTREE |
| `tbl_shop_order_data` | `od_id` | NO | 1 | `od_id` | BTREE |
| `tbl_shop_order_delete` | `PRIMARY` | YES | 1 | `de_id` | BTREE |
| `tbl_shop_order_post_log` | `PRIMARY` | YES | 1 | `log_id` | BTREE |
| `tbl_shop_personalpay` | `od_id` | NO | 1 | `od_id` | BTREE |
| `tbl_shop_personalpay` | `PRIMARY` | YES | 1 | `pp_id` | BTREE |
| `tbl_shop_sendcost` | `PRIMARY` | YES | 1 | `sc_id` | BTREE |
| `tbl_shop_sendcost` | `sc_zip1` | NO | 1 | `sc_zip1` | BTREE |
| `tbl_shop_sendcost` | `sc_zip2` | NO | 1 | `sc_zip2` | BTREE |
| `tbl_shop_wish` | `index1` | NO | 1 | `mb_id` | BTREE |
| `tbl_shop_wish` | `PRIMARY` | YES | 1 | `wi_id` | BTREE |
| `tbl_uniqid` | `PRIMARY` | YES | 1 | `uq_id` | BTREE |
| `tbl_visit` | `index1` | YES | 1 | `vi_ip` | BTREE |
| `tbl_visit` | `index1` | YES | 2 | `vi_date` | BTREE |
| `tbl_visit` | `index2` | NO | 1 | `vi_date` | BTREE |
| `tbl_visit` | `PRIMARY` | YES | 1 | `vi_id` | BTREE |
| `tbl_visit_sum` | `index1` | NO | 1 | `vs_count` | BTREE |
| `tbl_visit_sum` | `PRIMARY` | YES | 1 | `vs_date` | BTREE |
| `tbl_write_briefing` | `PRIMARY` | YES | 1 | `wr_id` | BTREE |
| `tbl_write_briefing` | `wr_is_comment` | NO | 1 | `wr_is_comment` | BTREE |
| `tbl_write_briefing` | `wr_is_comment` | NO | 2 | `wr_id` | BTREE |
| `tbl_write_briefing` | `wr_num_reply_parent` | NO | 1 | `wr_num` | BTREE |
| `tbl_write_briefing` | `wr_num_reply_parent` | NO | 2 | `wr_reply` | BTREE |
| `tbl_write_briefing` | `wr_num_reply_parent` | NO | 3 | `wr_parent` | BTREE |
| `tbl_write_briefing` | `wr_seo_title` | NO | 1 | `wr_seo_title` | BTREE |
| `tbl_write_correcting` | `PRIMARY` | YES | 1 | `wr_id` | BTREE |
| `tbl_write_correcting` | `wr_is_comment` | NO | 1 | `wr_is_comment` | BTREE |
| `tbl_write_correcting` | `wr_is_comment` | NO | 2 | `wr_id` | BTREE |
| `tbl_write_correcting` | `wr_num_reply_parent` | NO | 1 | `wr_num` | BTREE |
| `tbl_write_correcting` | `wr_num_reply_parent` | NO | 2 | `wr_reply` | BTREE |
| `tbl_write_correcting` | `wr_num_reply_parent` | NO | 3 | `wr_parent` | BTREE |
| `tbl_write_correcting` | `wr_seo_title` | NO | 1 | `wr_seo_title` | BTREE |
| `tbl_write_notice` | `PRIMARY` | YES | 1 | `wr_id` | BTREE |
| `tbl_write_notice` | `wr_is_comment` | NO | 1 | `wr_is_comment` | BTREE |
| `tbl_write_notice` | `wr_is_comment` | NO | 2 | `wr_id` | BTREE |
| `tbl_write_notice` | `wr_num_reply_parent` | NO | 1 | `wr_num` | BTREE |
| `tbl_write_notice` | `wr_num_reply_parent` | NO | 2 | `wr_reply` | BTREE |
| `tbl_write_notice` | `wr_num_reply_parent` | NO | 3 | `wr_parent` | BTREE |
| `tbl_write_notice` | `wr_seo_title` | NO | 1 | `wr_seo_title` | BTREE |

## Constraints

| Table | Constraint | Type | Column | References Table | References Column |
|---|---|---|---|---|---|
| `tbl_auth` | `PRIMARY` | PRIMARY KEY | `mb_id` | `-` | `-` |
| `tbl_auth` | `PRIMARY` | PRIMARY KEY | `au_menu` | `-` | `-` |
| `tbl_autosave` | `as_uid` | UNIQUE | `as_uid` | `-` | `-` |
| `tbl_autosave` | `PRIMARY` | PRIMARY KEY | `as_id` | `-` | `-` |
| `tbl_board` | `PRIMARY` | PRIMARY KEY | `bo_table` | `-` | `-` |
| `tbl_board_file` | `PRIMARY` | PRIMARY KEY | `bo_table` | `-` | `-` |
| `tbl_board_file` | `PRIMARY` | PRIMARY KEY | `wr_id` | `-` | `-` |
| `tbl_board_file` | `PRIMARY` | PRIMARY KEY | `bf_no` | `-` | `-` |
| `tbl_board_good` | `fkey1` | UNIQUE | `bo_table` | `-` | `-` |
| `tbl_board_good` | `fkey1` | UNIQUE | `wr_id` | `-` | `-` |
| `tbl_board_good` | `fkey1` | UNIQUE | `mb_id` | `-` | `-` |
| `tbl_board_good` | `PRIMARY` | PRIMARY KEY | `bg_id` | `-` | `-` |
| `tbl_board_new` | `PRIMARY` | PRIMARY KEY | `bn_id` | `-` | `-` |
| `tbl_cert_history` | `PRIMARY` | PRIMARY KEY | `cr_id` | `-` | `-` |
| `tbl_config` | `PRIMARY` | PRIMARY KEY | `cf_id` | `-` | `-` |
| `tbl_content` | `PRIMARY` | PRIMARY KEY | `co_id` | `-` | `-` |
| `tbl_faq` | `PRIMARY` | PRIMARY KEY | `fa_id` | `-` | `-` |
| `tbl_faq_master` | `PRIMARY` | PRIMARY KEY | `fm_id` | `-` | `-` |
| `tbl_group` | `PRIMARY` | PRIMARY KEY | `gr_id` | `-` | `-` |
| `tbl_group_member` | `PRIMARY` | PRIMARY KEY | `gm_id` | `-` | `-` |
| `tbl_lec_item_content` | `PRIMARY` | PRIMARY KEY | `ic_id` | `-` | `-` |
| `tbl_lec_item_content_log` | `PRIMARY` | PRIMARY KEY | `icl_id` | `-` | `-` |
| `tbl_lec_item_exam_license` | `PRIMARY` | PRIMARY KEY | `iel_id` | `-` | `-` |
| `tbl_lec_item_exam_result` | `PRIMARY` | PRIMARY KEY | `ier_id` | `-` | `-` |
| `tbl_lec_item_exam_tasks` | `PRIMARY` | PRIMARY KEY | `iet_id` | `-` | `-` |
| `tbl_lec_item_teacher` | `PRIMARY` | PRIMARY KEY | `ir_id` | `-` | `-` |
| `tbl_lec_order_member` | `PRIMARY` | PRIMARY KEY | `lol_no` | `-` | `-` |
| `tbl_login` | `lo_ip_unique` | UNIQUE | `lo_ip` | `-` | `-` |
| `tbl_login` | `PRIMARY` | PRIMARY KEY | `lo_id` | `-` | `-` |
| `tbl_mail` | `PRIMARY` | PRIMARY KEY | `ma_id` | `-` | `-` |
| `tbl_member` | `mb_id` | UNIQUE | `mb_id` | `-` | `-` |
| `tbl_member` | `PRIMARY` | PRIMARY KEY | `mb_no` | `-` | `-` |
| `tbl_member_cert_history` | `PRIMARY` | PRIMARY KEY | `ch_id` | `-` | `-` |
| `tbl_member_social_profiles` | `PRIMARY` | PRIMARY KEY | `mp_no` | `-` | `-` |
| `tbl_memo` | `PRIMARY` | PRIMARY KEY | `me_id` | `-` | `-` |
| `tbl_menu` | `PRIMARY` | PRIMARY KEY | `me_id` | `-` | `-` |
| `tbl_new_win` | `PRIMARY` | PRIMARY KEY | `nw_id` | `-` | `-` |
| `tbl_point` | `PRIMARY` | PRIMARY KEY | `po_id` | `-` | `-` |
| `tbl_poll` | `PRIMARY` | PRIMARY KEY | `po_id` | `-` | `-` |
| `tbl_poll_etc` | `PRIMARY` | PRIMARY KEY | `pc_id` | `-` | `-` |
| `tbl_popular` | `index1` | UNIQUE | `pp_date` | `-` | `-` |
| `tbl_popular` | `index1` | UNIQUE | `pp_word` | `-` | `-` |
| `tbl_popular` | `index1` | UNIQUE | `pp_ip` | `-` | `-` |
| `tbl_popular` | `PRIMARY` | PRIMARY KEY | `pp_id` | `-` | `-` |
| `tbl_qa_config` | `PRIMARY` | PRIMARY KEY | `qa_id` | `-` | `-` |
| `tbl_qa_content` | `PRIMARY` | PRIMARY KEY | `qa_id` | `-` | `-` |
| `tbl_rlec_item_exam` | `PRIMARY` | PRIMARY KEY | `ie_id` | `-` | `-` |
| `tbl_scrap` | `PRIMARY` | PRIMARY KEY | `ms_id` | `-` | `-` |
| `tbl_shop_banner` | `PRIMARY` | PRIMARY KEY | `bn_id` | `-` | `-` |
| `tbl_shop_cart` | `PRIMARY` | PRIMARY KEY | `ct_id` | `-` | `-` |
| `tbl_shop_category` | `PRIMARY` | PRIMARY KEY | `ca_id` | `-` | `-` |
| `tbl_shop_coupon` | `cp_id` | UNIQUE | `cp_id` | `-` | `-` |
| `tbl_shop_coupon` | `PRIMARY` | PRIMARY KEY | `cp_no` | `-` | `-` |
| `tbl_shop_coupon_log` | `PRIMARY` | PRIMARY KEY | `cl_id` | `-` | `-` |
| `tbl_shop_coupon_zone` | `PRIMARY` | PRIMARY KEY | `cz_id` | `-` | `-` |
| `tbl_shop_default` | `PRIMARY` | PRIMARY KEY | `de_id` | `-` | `-` |
| `tbl_shop_event` | `PRIMARY` | PRIMARY KEY | `ev_id` | `-` | `-` |
| `tbl_shop_event_item` | `PRIMARY` | PRIMARY KEY | `ev_id` | `-` | `-` |
| `tbl_shop_event_item` | `PRIMARY` | PRIMARY KEY | `it_id` | `-` | `-` |
| `tbl_shop_inicis_log` | `PRIMARY` | PRIMARY KEY | `oid` | `-` | `-` |
| `tbl_shop_item` | `PRIMARY` | PRIMARY KEY | `it_id` | `-` | `-` |
| `tbl_shop_item_option` | `PRIMARY` | PRIMARY KEY | `io_no` | `-` | `-` |
| `tbl_shop_item_qa` | `PRIMARY` | PRIMARY KEY | `iq_id` | `-` | `-` |
| `tbl_shop_item_relation` | `PRIMARY` | PRIMARY KEY | `it_id` | `-` | `-` |
| `tbl_shop_item_relation` | `PRIMARY` | PRIMARY KEY | `it_id2` | `-` | `-` |
| `tbl_shop_item_stocksms` | `PRIMARY` | PRIMARY KEY | `ss_id` | `-` | `-` |
| `tbl_shop_item_use` | `PRIMARY` | PRIMARY KEY | `is_id` | `-` | `-` |
| `tbl_shop_order` | `PRIMARY` | PRIMARY KEY | `od_id` | `-` | `-` |
| `tbl_shop_order_address` | `PRIMARY` | PRIMARY KEY | `ad_id` | `-` | `-` |
| `tbl_shop_order_delete` | `PRIMARY` | PRIMARY KEY | `de_id` | `-` | `-` |
| `tbl_shop_order_post_log` | `PRIMARY` | PRIMARY KEY | `log_id` | `-` | `-` |
| `tbl_shop_personalpay` | `PRIMARY` | PRIMARY KEY | `pp_id` | `-` | `-` |
| `tbl_shop_sendcost` | `PRIMARY` | PRIMARY KEY | `sc_id` | `-` | `-` |
| `tbl_shop_wish` | `PRIMARY` | PRIMARY KEY | `wi_id` | `-` | `-` |
| `tbl_uniqid` | `PRIMARY` | PRIMARY KEY | `uq_id` | `-` | `-` |
| `tbl_visit` | `index1` | UNIQUE | `vi_ip` | `-` | `-` |
| `tbl_visit` | `index1` | UNIQUE | `vi_date` | `-` | `-` |
| `tbl_visit` | `PRIMARY` | PRIMARY KEY | `vi_id` | `-` | `-` |
| `tbl_visit_sum` | `PRIMARY` | PRIMARY KEY | `vs_date` | `-` | `-` |
| `tbl_write_briefing` | `PRIMARY` | PRIMARY KEY | `wr_id` | `-` | `-` |
| `tbl_write_correcting` | `PRIMARY` | PRIMARY KEY | `wr_id` | `-` | `-` |
| `tbl_write_notice` | `PRIMARY` | PRIMARY KEY | `wr_id` | `-` | `-` |
