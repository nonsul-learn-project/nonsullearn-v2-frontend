# Production Schema Verification

- Generated: 2026-09-28 17:25:12 KST
- Database: `nonsullearndb`
- Mode: READ-ONLY
- Credentials: NOT COLLECTED

## 1. Database Identity

```text
Database: nonsullearndb
MariaDB version: 10.11.14-MariaDB-0ubuntu0.24.04.1
Character set: utf8mb4
Collation: utf8mb4_general_ci
Session timezone: SYSTEM
```

## 2. Schema Counts

```text
Tables: 66
Columns: 1438
Index entries: 176
Declared foreign keys: 0
Views: 0
Triggers: 0
Routines: 0
Events: 0
```

## 3. Storage Engines

| Engine | Tables |
|---|---:|
| InnoDB | 61 |
| MyISAM | 5 |

## 4. Production Table Inventory

| Table | Engine | Collation | Approx Rows |
|---|---|---|---:|
| `tbl_auth` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_autosave` | InnoDB | utf8mb3_general_ci | 27 |
| `tbl_board` | InnoDB | utf8mb3_general_ci | 3 |
| `tbl_board_file` | InnoDB | utf8mb3_general_ci | 779 |
| `tbl_board_good` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_board_new` | InnoDB | utf8mb3_general_ci | 151 |
| `tbl_cert_history` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_config` | InnoDB | utf8mb3_general_ci | 1 |
| `tbl_content` | InnoDB | utf8mb3_general_ci | 4 |
| `tbl_faq` | InnoDB | utf8mb3_general_ci | 14 |
| `tbl_faq_master` | InnoDB | utf8mb3_general_ci | 4 |
| `tbl_group` | InnoDB | utf8mb3_general_ci | 2 |
| `tbl_group_member` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_lec_item_content` | MyISAM | utf8mb3_general_ci | 250 |
| `tbl_lec_item_content_log` | MyISAM | utf8mb3_general_ci | 487 |
| `tbl_lec_item_exam_license` | InnoDB | utf8mb4_general_ci | 0 |
| `tbl_lec_item_exam_result` | InnoDB | utf8mb4_general_ci | 0 |
| `tbl_lec_item_exam_tasks` | InnoDB | utf8mb4_general_ci | 0 |
| `tbl_lec_item_teacher` | MyISAM | utf8mb3_general_ci | 8 |
| `tbl_lec_order_member` | MyISAM | utf8mb3_general_ci | 200 |
| `tbl_login` | InnoDB | utf8mb3_general_ci | 7 |
| `tbl_mail` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_member` | InnoDB | utf8mb3_general_ci | 330 |
| `tbl_member_cert_history` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_member_social_profiles` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_memo` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_menu` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_new_win` | InnoDB | utf8mb3_general_ci | 1 |
| `tbl_point` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_poll` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_poll_etc` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_popular` | InnoDB | utf8mb3_general_ci | 279 |
| `tbl_qa_config` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_qa_content` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_rlec_item_exam` | MyISAM | utf8mb3_general_ci | 0 |
| `tbl_scrap` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_banner` | InnoDB | utf8mb3_general_ci | 15 |
| `tbl_shop_cart` | InnoDB | utf8mb3_general_ci | 291 |
| `tbl_shop_category` | InnoDB | utf8mb3_general_ci | 35 |
| `tbl_shop_coupon` | InnoDB | utf8mb3_general_ci | 25 |
| `tbl_shop_coupon_log` | InnoDB | utf8mb3_general_ci | 17 |
| `tbl_shop_coupon_zone` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_default` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_event` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_event_item` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_inicis_log` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_item` | InnoDB | utf8mb3_general_ci | 37 |
| `tbl_shop_item_option` | InnoDB | utf8mb3_general_ci | 5 |
| `tbl_shop_item_qa` | InnoDB | utf8mb3_general_ci | 4 |
| `tbl_shop_item_relation` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_item_stocksms` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_item_use` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_order` | InnoDB | utf8mb3_general_ci | 200 |
| `tbl_shop_order_address` | InnoDB | utf8mb3_general_ci | 144 |
| `tbl_shop_order_data` | InnoDB | utf8mb3_general_ci | 53 |
| `tbl_shop_order_delete` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_order_post_log` | InnoDB | utf8mb3_general_ci | 2 |
| `tbl_shop_personalpay` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_sendcost` | InnoDB | utf8mb3_general_ci | 0 |
| `tbl_shop_wish` | InnoDB | utf8mb3_general_ci | 5 |
| `tbl_uniqid` | InnoDB | utf8mb3_general_ci | 8074 |
| `tbl_visit` | InnoDB | utf8mb3_general_ci | 53636 |
| `tbl_visit_sum` | InnoDB | utf8mb3_general_ci | 229 |
| `tbl_write_briefing` | InnoDB | utf8mb3_general_ci | 12 |
| `tbl_write_correcting` | InnoDB | utf8mb3_general_ci | 528 |
| `tbl_write_notice` | InnoDB | utf8mb3_general_ci | 10 |

## 5. Exam Table Conflict

```text
tbl_rlec_item_exam: PRESENT
tbl_lec_item_exam: ABSENT
```

## 6. correc_cnt

| Table | Column | Type | Nullable | Default |
|---|---|---|---|---|
| `tbl_lec_order_member` | `correc_cnt` | tinyint(4) | NO | 12 |

## 7. Primary Keys

| Table | Column | Sequence |
|---|---|---:|
| `tbl_auth` | `mb_id` | 1 |
| `tbl_auth` | `au_menu` | 2 |
| `tbl_autosave` | `as_id` | 1 |
| `tbl_board` | `bo_table` | 1 |
| `tbl_board_file` | `bo_table` | 1 |
| `tbl_board_file` | `wr_id` | 2 |
| `tbl_board_file` | `bf_no` | 3 |
| `tbl_board_good` | `bg_id` | 1 |
| `tbl_board_new` | `bn_id` | 1 |
| `tbl_cert_history` | `cr_id` | 1 |
| `tbl_config` | `cf_id` | 1 |
| `tbl_content` | `co_id` | 1 |
| `tbl_faq` | `fa_id` | 1 |
| `tbl_faq_master` | `fm_id` | 1 |
| `tbl_group` | `gr_id` | 1 |
| `tbl_group_member` | `gm_id` | 1 |
| `tbl_lec_item_content` | `ic_id` | 1 |
| `tbl_lec_item_content_log` | `icl_id` | 1 |
| `tbl_lec_item_exam_license` | `iel_id` | 1 |
| `tbl_lec_item_exam_result` | `ier_id` | 1 |
| `tbl_lec_item_exam_tasks` | `iet_id` | 1 |
| `tbl_lec_item_teacher` | `ir_id` | 1 |
| `tbl_lec_order_member` | `lol_no` | 1 |
| `tbl_login` | `lo_id` | 1 |
| `tbl_mail` | `ma_id` | 1 |
| `tbl_member` | `mb_no` | 1 |
| `tbl_member_cert_history` | `ch_id` | 1 |
| `tbl_member_social_profiles` | `mp_no` | 1 |
| `tbl_memo` | `me_id` | 1 |
| `tbl_menu` | `me_id` | 1 |
| `tbl_new_win` | `nw_id` | 1 |
| `tbl_point` | `po_id` | 1 |
| `tbl_poll` | `po_id` | 1 |
| `tbl_poll_etc` | `pc_id` | 1 |
| `tbl_popular` | `pp_id` | 1 |
| `tbl_qa_config` | `qa_id` | 1 |
| `tbl_qa_content` | `qa_id` | 1 |
| `tbl_rlec_item_exam` | `ie_id` | 1 |
| `tbl_scrap` | `ms_id` | 1 |
| `tbl_shop_banner` | `bn_id` | 1 |
| `tbl_shop_cart` | `ct_id` | 1 |
| `tbl_shop_category` | `ca_id` | 1 |
| `tbl_shop_coupon` | `cp_no` | 1 |
| `tbl_shop_coupon_log` | `cl_id` | 1 |
| `tbl_shop_coupon_zone` | `cz_id` | 1 |
| `tbl_shop_default` | `de_id` | 1 |
| `tbl_shop_event` | `ev_id` | 1 |
| `tbl_shop_event_item` | `ev_id` | 1 |
| `tbl_shop_event_item` | `it_id` | 2 |
| `tbl_shop_inicis_log` | `oid` | 1 |
| `tbl_shop_item` | `it_id` | 1 |
| `tbl_shop_item_option` | `io_no` | 1 |
| `tbl_shop_item_qa` | `iq_id` | 1 |
| `tbl_shop_item_relation` | `it_id` | 1 |
| `tbl_shop_item_relation` | `it_id2` | 2 |
| `tbl_shop_item_stocksms` | `ss_id` | 1 |
| `tbl_shop_item_use` | `is_id` | 1 |
| `tbl_shop_order` | `od_id` | 1 |
| `tbl_shop_order_address` | `ad_id` | 1 |
| `tbl_shop_order_delete` | `de_id` | 1 |
| `tbl_shop_order_post_log` | `log_id` | 1 |
| `tbl_shop_personalpay` | `pp_id` | 1 |
| `tbl_shop_sendcost` | `sc_id` | 1 |
| `tbl_shop_wish` | `wi_id` | 1 |
| `tbl_uniqid` | `uq_id` | 1 |
| `tbl_visit` | `vi_id` | 1 |
| `tbl_visit_sum` | `vs_date` | 1 |
| `tbl_write_briefing` | `wr_id` | 1 |
| `tbl_write_correcting` | `wr_id` | 1 |
| `tbl_write_notice` | `wr_id` | 1 |

## 8. Tables Without Primary Keys

```text
tbl_shop_order_data
```

## 9. Runtime-DDL Sensitive Structures

Current Production column structures only.

### `tbl_config`

| Column | Type | Nullable | Default | Key | Extra |
|---|---|---|---|---|---|
| `cf_id` | int(11) | NO | NULL | PRI | auto_increment |
| `cf_title` | varchar(255) | NO | '' |  |  |
| `cf_theme` | varchar(100) | NO | '' |  |  |
| `cf_admin` | varchar(100) | NO | '' |  |  |
| `cf_admin_email` | varchar(100) | NO | '' |  |  |
| `cf_admin_email_name` | varchar(100) | NO | '' |  |  |
| `cf_add_script` | text | NO | NULL |  |  |
| `cf_use_point` | tinyint(4) | NO | 0 |  |  |
| `cf_point_term` | int(11) | NO | 0 |  |  |
| `cf_use_copy_log` | tinyint(4) | NO | 0 |  |  |
| `cf_use_email_certify` | tinyint(4) | NO | 0 |  |  |
| `cf_login_point` | int(11) | NO | 0 |  |  |
| `cf_cut_name` | tinyint(4) | NO | 0 |  |  |
| `cf_nick_modify` | int(11) | NO | 0 |  |  |
| `cf_new_skin` | varchar(50) | NO | '' |  |  |
| `cf_new_rows` | int(11) | NO | 0 |  |  |
| `cf_search_skin` | varchar(50) | NO | '' |  |  |
| `cf_connect_skin` | varchar(50) | NO | '' |  |  |
| `cf_faq_skin` | varchar(50) | NO | '' |  |  |
| `cf_read_point` | int(11) | NO | 0 |  |  |
| `cf_write_point` | int(11) | NO | 0 |  |  |
| `cf_comment_point` | int(11) | NO | 0 |  |  |
| `cf_download_point` | int(11) | NO | 0 |  |  |
| `cf_write_pages` | int(11) | NO | 0 |  |  |
| `cf_mobile_pages` | int(11) | NO | 0 |  |  |
| `cf_link_target` | varchar(50) | NO | '' |  |  |
| `cf_bbs_rewrite` | tinyint(4) | NO | 0 |  |  |
| `cf_delay_sec` | int(11) | NO | 0 |  |  |
| `cf_filter` | text | NO | NULL |  |  |
| `cf_possible_ip` | text | NO | NULL |  |  |
| `cf_intercept_ip` | text | NO | NULL |  |  |
| `cf_analytics` | text | NO | NULL |  |  |
| `cf_add_meta` | text | NO | NULL |  |  |
| `cf_syndi_token` | varchar(255) | NO | NULL |  |  |
| `cf_syndi_except` | text | NO | NULL |  |  |
| `cf_member_skin` | varchar(50) | NO | '' |  |  |
| `cf_use_homepage` | tinyint(4) | NO | 0 |  |  |
| `cf_req_homepage` | tinyint(4) | NO | 0 |  |  |
| `cf_use_tel` | tinyint(4) | NO | 0 |  |  |
| `cf_req_tel` | tinyint(4) | NO | 0 |  |  |
| `cf_use_hp` | tinyint(4) | NO | 0 |  |  |
| `cf_req_hp` | tinyint(4) | NO | 0 |  |  |
| `cf_use_addr` | tinyint(4) | NO | 0 |  |  |
| `cf_req_addr` | tinyint(4) | NO | 0 |  |  |
| `cf_use_signature` | tinyint(4) | NO | 0 |  |  |
| `cf_req_signature` | tinyint(4) | NO | 0 |  |  |
| `cf_use_profile` | tinyint(4) | NO | 0 |  |  |
| `cf_req_profile` | tinyint(4) | NO | 0 |  |  |
| `cf_register_level` | tinyint(4) | NO | 0 |  |  |
| `cf_register_point` | int(11) | NO | 0 |  |  |
| `cf_icon_level` | tinyint(4) | NO | 0 |  |  |
| `cf_use_recommend` | tinyint(4) | NO | 0 |  |  |
| `cf_recommend_point` | int(11) | NO | 0 |  |  |
| `cf_leave_day` | int(11) | NO | 0 |  |  |
| `cf_search_part` | int(11) | NO | 0 |  |  |
| `cf_email_use` | tinyint(4) | NO | 0 |  |  |
| `cf_email_wr_super_admin` | tinyint(4) | NO | 0 |  |  |
| `cf_email_wr_group_admin` | tinyint(4) | NO | 0 |  |  |
| `cf_email_wr_board_admin` | tinyint(4) | NO | 0 |  |  |
| `cf_email_wr_write` | tinyint(4) | NO | 0 |  |  |
| `cf_email_wr_comment_all` | tinyint(4) | NO | 0 |  |  |
| `cf_email_mb_super_admin` | tinyint(4) | NO | 0 |  |  |
| `cf_email_mb_member` | tinyint(4) | NO | 0 |  |  |
| `cf_email_po_super_admin` | tinyint(4) | NO | 0 |  |  |
| `cf_prohibit_id` | text | NO | NULL |  |  |
| `cf_prohibit_email` | text | NO | NULL |  |  |
| `cf_new_del` | int(11) | NO | 0 |  |  |
| `cf_memo_del` | int(11) | NO | 0 |  |  |
| `cf_visit_del` | int(11) | NO | 0 |  |  |
| `cf_popular_del` | int(11) | NO | 0 |  |  |
| `cf_optimize_date` | date | NO | '0000-00-00' |  |  |
| `cf_use_member_icon` | tinyint(4) | NO | 0 |  |  |
| `cf_member_icon_size` | int(11) | NO | 0 |  |  |
| `cf_member_icon_width` | int(11) | NO | 0 |  |  |
| `cf_member_icon_height` | int(11) | NO | 0 |  |  |
| `cf_member_img_size` | int(11) | NO | 0 |  |  |
| `cf_member_img_width` | int(11) | NO | 0 |  |  |
| `cf_member_img_height` | int(11) | NO | 0 |  |  |
| `cf_login_minutes` | int(11) | NO | 0 |  |  |
| `cf_image_extension` | varchar(255) | NO | '' |  |  |
| `cf_flash_extension` | varchar(255) | NO | '' |  |  |
| `cf_movie_extension` | varchar(255) | NO | '' |  |  |
| `cf_formmail_is_member` | tinyint(4) | NO | 0 |  |  |
| `cf_page_rows` | int(11) | NO | 0 |  |  |
| `cf_mobile_page_rows` | int(11) | NO | 0 |  |  |
| `cf_visit` | varchar(255) | NO | '' |  |  |
| `cf_max_po_id` | int(11) | NO | 0 |  |  |
| `cf_stipulation` | text | NO | NULL |  |  |
| `cf_privacy` | text | NO | NULL |  |  |
| `cf_use_promotion` | tinyint(1) | NO | 0 |  |  |
| `cf_open_modify` | int(11) | NO | 0 |  |  |
| `cf_memo_send_point` | int(11) | NO | 0 |  |  |
| `cf_mobile_new_skin` | varchar(50) | NO | '' |  |  |
| `cf_mobile_search_skin` | varchar(50) | NO | '' |  |  |
| `cf_mobile_connect_skin` | varchar(50) | NO | '' |  |  |
| `cf_mobile_faq_skin` | varchar(50) | NO | '' |  |  |
| `cf_mobile_member_skin` | varchar(50) | NO | '' |  |  |
| `cf_captcha_mp3` | varchar(255) | NO | '' |  |  |
| `cf_editor` | varchar(50) | NO | '' |  |  |
| `cf_cert_use` | tinyint(4) | NO | 0 |  |  |
| `cf_cert_find` | tinyint(4) | NO | 0 |  |  |
| `cf_cert_ipin` | varchar(255) | NO | '' |  |  |
| `cf_cert_hp` | varchar(255) | NO | '' |  |  |
| `cf_cert_simple` | varchar(255) | NO | '' |  |  |
| `cf_cert_kg_cd` | varchar(255) | NO | '' |  |  |
| `cf_cert_kg_mid` | varchar(255) | NO | '' |  |  |
| `cf_cert_use_seed` | tinyint(4) | NO | 1 |  |  |
| `cf_cert_kcb_cd` | varchar(255) | NO | '' |  |  |
| `cf_cert_kcp_cd` | varchar(255) | NO | '' |  |  |
| `cf_cert_kcp_enckey` | varchar(100) | NO | '' |  |  |
| `cf_lg_mid` | varchar(100) | NO | '' |  |  |
| `cf_lg_mert_key` | varchar(100) | NO | '' |  |  |
| `cf_toss_client_key` | varchar(100) | NO | '' |  |  |
| `cf_toss_secret_key` | varchar(100) | NO | '' |  |  |
| `cf_cert_limit` | int(11) | NO | 0 |  |  |
| `cf_cert_req` | tinyint(4) | NO | 0 |  |  |
| `cf_sms_use` | varchar(255) | NO | '' |  |  |
| `cf_sms_type` | varchar(10) | NO | '' |  |  |
| `cf_icode_id` | varchar(255) | NO | '' |  |  |
| `cf_icode_pw` | varchar(255) | NO | '' |  |  |
| `cf_icode_server_ip` | varchar(50) | NO | '' |  |  |
| `cf_icode_server_port` | varchar(50) | NO | '' |  |  |
| `cf_icode_token_key` | varchar(100) | NO | '' |  |  |
| `cf_googl_shorturl_apikey` | varchar(50) | NO | '' |  |  |
| `cf_social_login_use` | tinyint(4) | NO | 0 |  |  |
| `cf_social_servicelist` | varchar(255) | NO | '' |  |  |
| `cf_payco_clientid` | varchar(100) | NO | '' |  |  |
| `cf_payco_secret` | varchar(100) | NO | '' |  |  |
| `cf_facebook_appid` | varchar(100) | NO | NULL |  |  |
| `cf_facebook_secret` | varchar(100) | NO | NULL |  |  |
| `cf_twitter_key` | varchar(100) | NO | NULL |  |  |
| `cf_twitter_secret` | varchar(100) | NO | NULL |  |  |
| `cf_google_clientid` | varchar(100) | NO | '' |  |  |
| `cf_google_secret` | varchar(100) | NO | '' |  |  |
| `cf_naver_clientid` | varchar(100) | NO | '' |  |  |
| `cf_naver_secret` | varchar(100) | NO | '' |  |  |
| `cf_kakao_rest_key` | varchar(100) | NO | '' |  |  |
| `cf_kakao_client_secret` | varchar(100) | NO | '' |  |  |
| `cf_kakao_js_apikey` | varchar(100) | NO | NULL |  |  |
| `cf_captcha` | varchar(100) | NO | '' |  |  |
| `cf_recaptcha_site_key` | varchar(100) | NO | '' |  |  |
| `cf_recaptcha_secret_key` | varchar(100) | NO | '' |  |  |
| `cf_1_subj` | varchar(255) | NO | '' |  |  |
| `cf_2_subj` | varchar(255) | NO | '' |  |  |
| `cf_3_subj` | varchar(255) | NO | '' |  |  |
| `cf_4_subj` | varchar(255) | NO | '' |  |  |
| `cf_5_subj` | varchar(255) | NO | '' |  |  |
| `cf_6_subj` | varchar(255) | NO | '' |  |  |
| `cf_7_subj` | varchar(255) | NO | '' |  |  |
| `cf_8_subj` | varchar(255) | NO | '' |  |  |
| `cf_9_subj` | varchar(255) | NO | '' |  |  |
| `cf_10_subj` | varchar(255) | NO | '' |  |  |
| `cf_1` | varchar(255) | NO | '' |  |  |
| `cf_2` | varchar(255) | NO | '' |  |  |
| `cf_3` | varchar(255) | NO | '' |  |  |
| `cf_4` | varchar(255) | NO | '' |  |  |
| `cf_5` | varchar(255) | NO | '' |  |  |
| `cf_6` | varchar(255) | NO | '' |  |  |
| `cf_7` | varchar(255) | NO | '' |  |  |
| `cf_8` | varchar(255) | NO | '' |  |  |
| `cf_9` | varchar(255) | NO | '' |  |  |
| `cf_10` | varchar(255) | NO | '' |  |  |

### `tbl_member`

| Column | Type | Nullable | Default | Key | Extra |
|---|---|---|---|---|---|
| `mb_no` | int(11) | NO | NULL | PRI | auto_increment |
| `mb_id` | varchar(20) | NO | '' | UNI |  |
| `mb_password` | varchar(255) | NO | '' |  |  |
| `mb_name` | varchar(255) | NO | '' |  |  |
| `mb_nick` | varchar(255) | NO | '' |  |  |
| `mb_nick_date` | date | NO | '0000-00-00' |  |  |
| `mb_email` | varchar(255) | NO | '' |  |  |
| `mb_homepage` | varchar(255) | NO | '' |  |  |
| `mb_level` | tinyint(4) | NO | 0 |  |  |
| `mb_sex` | char(1) | NO | '' |  |  |
| `mb_birth` | varchar(255) | NO | '' |  |  |
| `mb_tel` | varchar(255) | NO | '' |  |  |
| `mb_hp` | varchar(255) | NO | '' |  |  |
| `mb_certify` | varchar(20) | NO | '' |  |  |
| `mb_adult` | tinyint(4) | NO | 0 |  |  |
| `mb_dupinfo` | varchar(255) | NO | '' |  |  |
| `mb_zip1` | char(3) | NO | '' |  |  |
| `mb_zip2` | char(3) | NO | '' |  |  |
| `mb_addr1` | varchar(255) | NO | '' |  |  |
| `mb_addr2` | varchar(255) | NO | '' |  |  |
| `mb_addr3` | varchar(255) | NO | '' |  |  |
| `mb_addr_jibeon` | varchar(255) | NO | '' |  |  |
| `mb_signature` | text | NO | NULL |  |  |
| `mb_recommend` | varchar(255) | NO | '' |  |  |
| `mb_point` | int(11) | NO | 0 |  |  |
| `mb_today_login` | datetime | NO | '0000-00-00 00:00:00' | MUL |  |
| `mb_login_ip` | varchar(255) | NO | '' |  |  |
| `mb_datetime` | datetime | NO | '0000-00-00 00:00:00' | MUL |  |
| `mb_ip` | varchar(255) | NO | '' |  |  |
| `mb_leave_date` | varchar(8) | NO | '' |  |  |
| `mb_intercept_date` | varchar(8) | NO | '' |  |  |
| `mb_email_certify` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `mb_email_certify2` | varchar(255) | NO | '' |  |  |
| `mb_memo` | text | NO | NULL |  |  |
| `mb_lost_certify` | varchar(255) | NO | NULL |  |  |
| `mb_mailling` | tinyint(4) | NO | 0 |  |  |
| `mb_mailling_date` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `mb_sms` | tinyint(4) | NO | 0 |  |  |
| `mb_sms_date` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `mb_open` | tinyint(4) | NO | 0 |  |  |
| `mb_open_date` | date | NO | '0000-00-00' |  |  |
| `mb_profile` | text | NO | NULL |  |  |
| `mb_memo_call` | varchar(255) | NO | '' |  |  |
| `mb_memo_cnt` | int(11) | NO | 0 |  |  |
| `mb_scrap_cnt` | int(11) | NO | 0 |  |  |
| `mb_marketing_agree` | tinyint(1) | NO | 0 |  |  |
| `mb_marketing_date` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `mb_thirdparty_agree` | tinyint(1) | NO | 0 |  |  |
| `mb_thirdparty_date` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `mb_agree_log` | text | NO | NULL |  |  |
| `mb_1` | varchar(255) | NO | '' |  |  |
| `mb_2` | varchar(255) | NO | '' |  |  |
| `mb_3` | varchar(255) | NO | '' |  |  |
| `mb_4` | varchar(255) | NO | '' |  |  |
| `mb_5` | varchar(255) | NO | '' |  |  |
| `mb_6` | varchar(255) | NO | '' |  |  |
| `mb_7` | varchar(255) | NO | '' |  |  |
| `mb_8` | varchar(255) | NO | '' |  |  |
| `mb_9` | varchar(255) | NO | '' |  |  |
| `mb_10` | varchar(255) | NO | '' |  |  |

### `tbl_shop_default`

| Column | Type | Nullable | Default | Key | Extra |
|---|---|---|---|---|---|
| `de_id` | int(11) | NO | NULL | PRI | auto_increment |
| `de_admin_company_owner` | varchar(255) | NO | '' |  |  |
| `de_admin_company_name` | varchar(255) | NO | '' |  |  |
| `de_admin_company_saupja_no` | varchar(255) | NO | '' |  |  |
| `de_admin_company_tel` | varchar(255) | NO | '' |  |  |
| `de_admin_company_fax` | varchar(255) | NO | '' |  |  |
| `de_admin_tongsin_no` | varchar(255) | NO | '' |  |  |
| `de_admin_company_zip` | varchar(255) | NO | '' |  |  |
| `de_admin_company_addr` | varchar(255) | NO | '' |  |  |
| `de_admin_info_name` | varchar(255) | NO | '' |  |  |
| `de_admin_info_email` | varchar(255) | NO | '' |  |  |
| `de_shop_skin` | varchar(255) | NO | '' |  |  |
| `de_shop_mobile_skin` | varchar(255) | NO | '' |  |  |
| `de_type1_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_type1_list_skin` | varchar(255) | NO | '' |  |  |
| `de_type1_list_mod` | int(11) | NO | 0 |  |  |
| `de_type1_list_row` | int(11) | NO | 0 |  |  |
| `de_type1_img_width` | int(11) | NO | 0 |  |  |
| `de_type1_img_height` | int(11) | NO | 0 |  |  |
| `de_type2_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_type2_list_skin` | varchar(255) | NO | '' |  |  |
| `de_type2_list_mod` | int(11) | NO | 0 |  |  |
| `de_type2_list_row` | int(11) | NO | 0 |  |  |
| `de_type2_img_width` | int(11) | NO | 0 |  |  |
| `de_type2_img_height` | int(11) | NO | 0 |  |  |
| `de_type3_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_type3_list_skin` | varchar(255) | NO | '' |  |  |
| `de_type3_list_mod` | int(11) | NO | 0 |  |  |
| `de_type3_list_row` | int(11) | NO | 0 |  |  |
| `de_type3_img_width` | int(11) | NO | 0 |  |  |
| `de_type3_img_height` | int(11) | NO | 0 |  |  |
| `de_type4_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_type4_list_skin` | varchar(255) | NO | '' |  |  |
| `de_type4_list_mod` | int(11) | NO | 0 |  |  |
| `de_type4_list_row` | int(11) | NO | 0 |  |  |
| `de_type4_img_width` | int(11) | NO | 0 |  |  |
| `de_type4_img_height` | int(11) | NO | 0 |  |  |
| `de_type5_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_type5_list_skin` | varchar(255) | NO | '' |  |  |
| `de_type5_list_mod` | int(11) | NO | 0 |  |  |
| `de_type5_list_row` | int(11) | NO | 0 |  |  |
| `de_type5_img_width` | int(11) | NO | 0 |  |  |
| `de_type5_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_type1_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_mobile_type1_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_type1_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_type1_list_row` | int(11) | NO | 0 |  |  |
| `de_mobile_type1_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_type1_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_type2_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_mobile_type2_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_type2_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_type2_list_row` | int(11) | NO | 0 |  |  |
| `de_mobile_type2_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_type2_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_type3_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_mobile_type3_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_type3_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_type3_list_row` | int(11) | NO | 0 |  |  |
| `de_mobile_type3_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_type3_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_type4_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_mobile_type4_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_type4_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_type4_list_row` | int(11) | NO | 0 |  |  |
| `de_mobile_type4_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_type4_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_type5_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_mobile_type5_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_type5_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_type5_list_row` | int(11) | NO | 0 |  |  |
| `de_mobile_type5_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_type5_img_height` | int(11) | NO | 0 |  |  |
| `de_rel_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_rel_list_skin` | varchar(255) | NO | '' |  |  |
| `de_rel_list_mod` | int(11) | NO | 0 |  |  |
| `de_rel_img_width` | int(11) | NO | 0 |  |  |
| `de_rel_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_rel_list_use` | tinyint(4) | NO | 0 |  |  |
| `de_mobile_rel_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_rel_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_rel_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_rel_img_height` | int(11) | NO | 0 |  |  |
| `de_search_list_skin` | varchar(255) | NO | '' |  |  |
| `de_search_list_mod` | int(11) | NO | 0 |  |  |
| `de_search_list_row` | int(11) | NO | 0 |  |  |
| `de_search_img_width` | int(11) | NO | 0 |  |  |
| `de_search_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_search_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_search_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_search_list_row` | int(11) | NO | 0 |  |  |
| `de_mobile_search_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_search_img_height` | int(11) | NO | 0 |  |  |
| `de_listtype_list_skin` | varchar(255) | NO | '' |  |  |
| `de_listtype_list_mod` | int(11) | NO | 0 |  |  |
| `de_listtype_list_row` | int(11) | NO | 0 |  |  |
| `de_listtype_img_width` | int(11) | NO | 0 |  |  |
| `de_listtype_img_height` | int(11) | NO | 0 |  |  |
| `de_mobile_listtype_list_skin` | varchar(255) | NO | '' |  |  |
| `de_mobile_listtype_list_mod` | int(11) | NO | 0 |  |  |
| `de_mobile_listtype_list_row` | int(11) | NO | 0 |  |  |
| `de_mobile_listtype_img_width` | int(11) | NO | 0 |  |  |
| `de_mobile_listtype_img_height` | int(11) | NO | 0 |  |  |
| `de_bank_use` | int(11) | NO | 0 |  |  |
| `de_bank_account` | text | NO | NULL |  |  |
| `de_card_test` | int(11) | NO | 0 |  |  |
| `de_card_use` | int(11) | NO | 0 |  |  |
| `de_card_noint_use` | tinyint(4) | NO | 0 |  |  |
| `de_card_point` | int(11) | NO | 0 |  |  |
| `de_settle_min_point` | int(11) | NO | 0 |  |  |
| `de_settle_max_point` | int(11) | NO | 0 |  |  |
| `de_settle_point_unit` | int(11) | NO | 0 |  |  |
| `de_level_sell` | int(11) | NO | 0 |  |  |
| `de_delivery_company` | varchar(255) | NO | '' |  |  |
| `de_send_cost_case` | varchar(255) | NO | '' |  |  |
| `de_send_cost_limit` | varchar(255) | NO | '' |  |  |
| `de_send_cost_list` | varchar(255) | NO | '' |  |  |
| `de_hope_date_use` | int(11) | NO | 0 |  |  |
| `de_hope_date_after` | int(11) | NO | 0 |  |  |
| `de_baesong_content` | text | NO | NULL |  |  |
| `de_change_content` | text | NO | NULL |  |  |
| `de_point_days` | int(11) | NO | 0 |  |  |
| `de_simg_width` | int(11) | NO | 0 |  |  |
| `de_simg_height` | int(11) | NO | 0 |  |  |
| `de_mimg_width` | int(11) | NO | 0 |  |  |
| `de_mimg_height` | int(11) | NO | 0 |  |  |
| `de_sms_cont1` | text | NO | NULL |  |  |
| `de_sms_cont2` | text | NO | NULL |  |  |
| `de_sms_cont3` | text | NO | NULL |  |  |
| `de_sms_cont4` | text | NO | NULL |  |  |
| `de_sms_cont5` | text | NO | NULL |  |  |
| `de_sms_use1` | tinyint(4) | NO | 0 |  |  |
| `de_sms_use2` | tinyint(4) | NO | 0 |  |  |
| `de_sms_use3` | tinyint(4) | NO | 0 |  |  |
| `de_sms_use4` | tinyint(4) | NO | 0 |  |  |
| `de_sms_use5` | tinyint(4) | NO | 0 |  |  |
| `de_sms_hp` | varchar(255) | NO | '' |  |  |
| `de_pg_service` | varchar(255) | NO | '' |  |  |
| `de_kcp_mid` | varchar(255) | NO | '' |  |  |
| `de_kcp_site_key` | varchar(255) | NO | '' |  |  |
| `de_inicis_mid` | varchar(255) | NO | '' |  |  |
| `de_inicis_iniapi_key` | varchar(30) | NO | '' |  |  |
| `de_inicis_iniapi_iv` | varchar(30) | NO | '' |  |  |
| `de_inicis_sign_key` | varchar(255) | NO | '' |  |  |
| `de_iche_use` | tinyint(4) | NO | 0 |  |  |
| `de_easy_pay_use` | tinyint(4) | NO | 0 |  |  |
| `de_easy_pay_services` | varchar(255) | NO | '' |  |  |
| `de_samsung_pay_use` | tinyint(4) | NO | 0 |  |  |
| `de_inicis_lpay_use` | tinyint(4) | NO | 0 |  |  |
| `de_inicis_kakaopay_use` | tinyint(4) | NO | 0 |  |  |
| `de_inicis_cartpoint_use` | tinyint(4) | NO | 0 |  |  |
| `de_nicepay_mid` | varchar(30) | NO | '' |  |  |
| `de_nicepay_key` | varchar(255) | NO | '' |  |  |
| `de_item_use_use` | tinyint(4) | NO | 0 |  |  |
| `de_item_use_write` | tinyint(4) | NO | 0 |  |  |
| `de_code_dup_use` | tinyint(4) | NO | 0 |  |  |
| `de_cart_keep_term` | int(11) | NO | 0 |  |  |
| `de_guest_cart_use` | tinyint(4) | NO | 0 |  |  |
| `de_admin_buga_no` | varchar(255) | NO | '' |  |  |
| `de_vbank_use` | varchar(255) | NO | '' |  |  |
| `de_taxsave_use` | tinyint(4) | NO | NULL |  |  |
| `de_taxsave_types` | set('account','vbank','transfer') | NO | 'account' |  |  |
| `de_guest_privacy` | text | NO | NULL |  |  |
| `de_hp_use` | tinyint(4) | NO | 0 |  |  |
| `de_escrow_use` | tinyint(4) | NO | 0 |  |  |
| `de_tax_flag_use` | tinyint(4) | NO | 0 |  |  |
| `de_kakaopay_mid` | varchar(255) | NO | '' |  |  |
| `de_kakaopay_key` | varchar(255) | NO | '' |  |  |
| `de_kakaopay_enckey` | varchar(255) | NO | '' |  |  |
| `de_kakaopay_hashkey` | varchar(255) | NO | '' |  |  |
| `de_kakaopay_cancelpwd` | varchar(255) | NO | '' |  |  |
| `de_naverpay_mid` | varchar(255) | NO | '' |  |  |
| `de_naverpay_cert_key` | varchar(255) | NO | '' |  |  |
| `de_naverpay_button_key` | varchar(255) | NO | '' |  |  |
| `de_naverpay_test` | tinyint(4) | NO | 0 |  |  |
| `de_naverpay_mb_id` | varchar(255) | NO | '' |  |  |
| `de_naverpay_sendcost` | varchar(255) | NO | '' |  |  |
| `de_member_reg_coupon_use` | tinyint(4) | NO | 0 |  |  |
| `de_member_reg_coupon_term` | int(11) | NO | 0 |  |  |
| `de_member_reg_coupon_price` | int(11) | NO | 0 |  |  |
| `de_member_reg_coupon_minimum` | int(11) | NO | 0 |  |  |

### `tbl_shop_order`

| Column | Type | Nullable | Default | Key | Extra |
|---|---|---|---|---|---|
| `od_id` | bigint(20) unsigned | NO | NULL | PRI |  |
| `mb_id` | varchar(255) | NO | '' | MUL |  |
| `od_name` | varchar(20) | NO | '' |  |  |
| `od_email` | varchar(100) | NO | '' |  |  |
| `od_tel` | varchar(20) | NO | '' |  |  |
| `od_hp` | varchar(20) | NO | '' |  |  |
| `od_zip1` | char(3) | NO | '' |  |  |
| `od_zip2` | char(3) | NO | '' |  |  |
| `od_addr1` | varchar(100) | NO | '' |  |  |
| `od_addr2` | varchar(100) | NO | '' |  |  |
| `od_addr3` | varchar(255) | NO | '' |  |  |
| `od_addr_jibeon` | varchar(255) | NO | '' |  |  |
| `od_deposit_name` | varchar(20) | NO | '' |  |  |
| `od_b_name` | varchar(20) | NO | '' |  |  |
| `od_b_tel` | varchar(20) | NO | '' |  |  |
| `od_b_hp` | varchar(20) | NO | '' |  |  |
| `od_b_zip1` | char(3) | NO | '' |  |  |
| `od_b_zip2` | char(3) | NO | '' |  |  |
| `od_b_addr1` | varchar(100) | NO | '' |  |  |
| `od_b_addr2` | varchar(100) | NO | '' |  |  |
| `od_b_addr3` | varchar(255) | NO | '' |  |  |
| `od_b_addr_jibeon` | varchar(255) | NO | '' |  |  |
| `od_memo` | text | NO | NULL |  |  |
| `od_cart_count` | int(11) | NO | 0 |  |  |
| `od_cart_price` | int(11) | NO | 0 |  |  |
| `od_cart_coupon` | int(11) | NO | 0 |  |  |
| `od_send_cost` | int(11) | NO | 0 |  |  |
| `od_send_cost2` | int(11) | NO | 0 |  |  |
| `od_send_coupon` | int(11) | NO | 0 |  |  |
| `od_receipt_price` | int(11) | NO | 0 |  |  |
| `od_cancel_price` | int(11) | NO | 0 |  |  |
| `od_receipt_point` | int(11) | NO | 0 |  |  |
| `od_refund_price` | int(11) | NO | 0 |  |  |
| `od_bank_account` | varchar(255) | NO | '' |  |  |
| `od_receipt_time` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `od_coupon` | int(11) | NO | 0 |  |  |
| `od_misu` | int(11) | NO | 0 |  |  |
| `od_shop_memo` | text | NO | NULL |  |  |
| `od_mod_history` | text | NO | NULL |  |  |
| `od_status` | varchar(255) | NO | '' |  |  |
| `od_hope_date` | date | NO | '0000-00-00' |  |  |
| `od_settle_case` | varchar(255) | NO | '' |  |  |
| `od_other_pay_type` | varchar(100) | NO | '' |  |  |
| `od_test` | tinyint(4) | NO | 0 |  |  |
| `od_mobile` | tinyint(4) | NO | 0 |  |  |
| `od_pg` | varchar(255) | NO | '' |  |  |
| `od_tno` | varchar(255) | NO | '' |  |  |
| `od_app_no` | varchar(20) | NO | '' |  |  |
| `od_escrow` | tinyint(4) | NO | 0 |  |  |
| `od_casseqno` | varchar(255) | NO | '' |  |  |
| `od_tax_flag` | tinyint(4) | NO | 0 |  |  |
| `od_tax_mny` | int(11) | NO | 0 |  |  |
| `od_vat_mny` | int(11) | NO | 0 |  |  |
| `od_free_mny` | int(11) | NO | 0 |  |  |
| `od_delivery_company` | varchar(255) | NO | '0' |  |  |
| `od_invoice` | varchar(255) | NO | '' |  |  |
| `od_invoice_time` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `od_cash` | tinyint(4) | NO | NULL |  |  |
| `od_cash_no` | varchar(255) | NO | NULL |  |  |
| `od_cash_info` | text | NO | NULL |  |  |
| `od_time` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `od_pwd` | varchar(255) | NO | '' |  |  |
| `od_ip` | varchar(25) | NO | '' |  |  |

### `tbl_lec_order_member`

| Column | Type | Nullable | Default | Key | Extra |
|---|---|---|---|---|---|
| `lol_no` | int(11) | NO | NULL | PRI | auto_increment |
| `od_id` | varchar(255) | NO | '' | MUL |  |
| `freeuse` | tinyint(3) | NO | 0 |  |  |
| `it_id` | varchar(20) | NO | '' | MUL |  |
| `mb_id` | varchar(255) | NO | '' | MUL |  |
| `ca_id` | varchar(255) | NO | '' | MUL |  |
| `lec_qty` | varchar(255) | NO | '' |  |  |
| `it_name` | varchar(255) | NO | NULL |  |  |
| `progress` | tinyint(4) | NO | 0 |  |  |
| `od_status` | varchar(10) | NO | '' |  |  |
| `od_name` | varchar(255) | NO | '' |  |  |
| `od_tel` | varchar(255) | NO | '' |  |  |
| `od_hp` | varchar(255) | NO | '' |  |  |
| `od_zip` | varchar(255) | NO | '' |  |  |
| `od_addr` | varchar(255) | NO | '' |  |  |
| `od_memo` | text | NO | NULL |  |  |
| `correc_cnt` | tinyint(4) | NO | 12 |  |  |
| `start_date` | date | NO | '0000-00-00' |  |  |
| `end_date` | date | NO | '0000-00-00' |  |  |
| `sleeper` | int(1) | NO | 0 |  |  |
| `sleeper_start_date` | date | NO | '0000-00-00' |  |  |
| `sleeper_end_date` | date | NO | '0000-00-00' |  |  |
| `reg_date` | datetime | NO | '0000-00-00 00:00:00' |  |  |

### `tbl_rlec_item_exam`

| Column | Type | Nullable | Default | Key | Extra |
|---|---|---|---|---|---|
| `ie_id` | int(11) | NO | NULL | PRI | auto_increment |
| `ca_id` | varchar(10) | NO | '0' | MUL |  |
| `ie_question` | mediumtext | NO | NULL |  |  |
| `ie_response1` | mediumtext | NO | NULL |  |  |
| `ie_response2` | mediumtext | NO | NULL |  |  |
| `ie_response3` | mediumtext | NO | NULL |  |  |
| `ie_response4` | mediumtext | NO | NULL |  |  |
| `ie_answer` | tinyint(4) | NO | 0 |  |  |
| `ie_order` | int(11) | NO | 0 | MUL |  |
| `ie_memo` | text | YES | NULL |  |  |
| `ie_ip` | varchar(255) | NO | NULL |  |  |
| `ie_use` | tinyint(4) | NO | 0 | MUL |  |
| `ie_datetime` | datetime | NO | '0000-00-00 00:00:00' |  |  |
| `ie_update_time` | datetime | NO | '0000-00-00 00:00:00' |  |  |

## Verification Purpose

Compare this live Production structure against the migration schema inventory.

Legacy SQL dumps are not considered authoritative.
