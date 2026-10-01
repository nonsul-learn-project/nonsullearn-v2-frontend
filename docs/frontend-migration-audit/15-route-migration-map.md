# Route migration map

Phase 1 candidate V2 routes: `/`, `/ceo_message`, `/teacher`, `/correction`; redirect old `.php` URLs only after parity and SEO redirect plan. Phase 2 read routes: catalogue/category/item, notice/briefing/FAQ/search. Phase 3 keeps `/bbs/*`, `/shop/*` writes/checkout and `/lecture/*` behind legacy URLs or adapter-proxied boundary. Preserve query keys including `ca_id`, `it_id`, `bo_table`, `wr_id`, `page`, `sfl`, `stx`, `sort`, `sortodr`, and login `url`.
