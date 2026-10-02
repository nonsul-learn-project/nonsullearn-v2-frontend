# Upload / Storage Inventory

- Generated: 2026-09-28 17:25:12 KST
- Canonical web root: `/home/nonsul-learn.com/html2`
- Mode: READ-ONLY
- File contents: NOT READ
- Raw filenames: NOT EXPORTED
- Student content: NOT EXPORTED

## 1. Storage Root

```text
data directory: PRESENT
3.1G	/home/nonsul-learn.com/html2/data
data/file: PRESENT
2.0G	/home/nonsul-learn.com/html2/data/file
```

## 2. Top-Level Storage Aggregate

| Directory | Size | File Count |
|---|---:|---:|
| `cache` | 1.5M | 26 |
| `log` | 4.0K | 0 |
| `session` | 4.0K | 0 |
| `event` | 4.0K | 0 |
| `faq` | 4.0K | 0 |
| `item` | 264M | 737 |
| `banner` | 26M | 16 |
| `tmp` | 4.0K | 0 |
| `member_image` | 4.0K | 0 |
| `common` | 52K | 4 |
| `teacher` | 3.5M | 12 |
| `member` | 4.0K | 0 |
| `file` | 2.0G | 1114 |
| `editor` | 895M | 617 |
| `content` | 4.0K | 0 |

## 3. Board Upload Directories

| Board Directory | Size | File Count |
|---|---:|---:|
| `correcting` | 1.9G | 1109 |
| `notice` | 2.1M | 4 |
| `briefing` | 4.0K | 1 |

## 4. Correcting Storage Aggregate

```text
Correcting directory: PRESENT
File count: 1109
Total size: 1.9G
```

## 5. Correcting File Extension Aggregate

No filenames are exported.

| Extension | Count |
|---|---:|
| `jpg` | 481 |
| `pdf` | 435 |
| `jpeg` | 183 |
| `png` | 6 |
| `1` | 1 |
| `2` | 1 |
| `xlsx` | 1 |

## 6. Database Attachment Aggregate

```text
tbl_board_file rows: 779
Correcting attachment rows: 777
Correcting posts with attachment metadata: 461
tbl_write_correcting rows: 544
```

## 7. DB / Filesystem Aggregate Reconciliation

```text
DB correcting attachment rows: 777
Filesystem correcting files excluding index.php: 1108
```

Count differences do not automatically prove missing files.

## 8. data/.htaccess

```text
html2/data/.htaccess: PRESENT
SHA256: d27d3cc0472e15d1c4740af7fd76fbf68ae6d3e98ae3484a76719662cd411f05
```

## 9. Apache Storage-Related Configuration

Only structural Apache directives are collected.

```text
/etc/apache2/sites-enabled/000-default.conf:12:	DocumentRoot /var/www/html
/etc/apache2/sites-enabled/default-ssl.conf:4:	DocumentRoot /var/www/html
/etc/apache2/sites-enabled/default-ssl.conf:98:	<Directory /usr/lib/cgi-bin>
/etc/apache2/sites-enabled/sites.conf:4:	ServerAlias	www.nonsul-learn.com
/etc/apache2/sites-enabled/sites.conf:6:        DocumentRoot /home/nonsul-learn.com/html2
/etc/apache2/sites-enabled/sites.conf:8:         <Directory /home/nonsul-learn.com/html2/>
/etc/apache2/sites-enabled/sites.conf:26:	ServerAlias	www.nonsul-learn.com
/etc/apache2/sites-enabled/sites.conf:28:       DocumentRoot     /home/nonsul-learn.com/html2
/etc/apache2/sites-enabled/sites.conf:30:         <Directory /home/nonsul-learn.com/html2/>
/etc/apache2/sites-enabled/sites.conf:45:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-enabled/sites.conf:57:        ServerAlias     www.gsw2026.com
/etc/apache2/sites-enabled/sites.conf:59:        DocumentRoot /home/gsw2026.com/html
/etc/apache2/sites-enabled/sites.conf:61:         <Directory /home/gsw2026.com/html/>
/etc/apache2/sites-enabled/sites.conf:79:        ServerAlias     www.gsw2026.com
/etc/apache2/sites-enabled/sites.conf:81:       DocumentRoot     /home/gsw2026.com/html
/etc/apache2/sites-enabled/sites.conf:83:         <Directory /home/gsw2026.com/html/>
/etc/apache2/sites-enabled/sites.conf:101:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-enabled/sites.conf:111:        ServerAlias     www.kairos-susi.com
/etc/apache2/sites-enabled/sites.conf:113:        DocumentRoot /home/kairos-susi.com/html
/etc/apache2/sites-enabled/sites.conf:115:         <Directory /home/kairos-susi.com/html/>
/etc/apache2/sites-enabled/sites.conf:136:                ServerAlias     www.kairos-susi.com
/etc/apache2/sites-enabled/sites.conf:138:                DocumentRoot /home/kairos-susi.com/html
/etc/apache2/sites-enabled/sites.conf:143:         <Directory /home/kairos-susi.com/html/>
/etc/apache2/sites-enabled/sites.conf:169:                <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-enabled/sites.conf:181:        ServerAlias      www.kyh-consulting.com
/etc/apache2/sites-enabled/sites.conf:182:        DocumentRoot    /home/kyh-consulting.com/html
/etc/apache2/sites-enabled/sites.conf:184:            <Directory /home/kyh-consulting.com/html/>
/etc/apache2/sites-enabled/sites.conf:198:       ServerAlias        www.kyh-consulting.com
/etc/apache2/sites-enabled/sites.conf:200:       DocumentRoot     /home/kyh-consulting.com/html
/etc/apache2/sites-enabled/sites.conf:202:         <Directory /home/kyh-consulting.com/html/>
/etc/apache2/sites-enabled/sites.conf:217:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-enabled/sites.conf:228:        ServerAlias      www.kairosnonsul.com
/etc/apache2/sites-enabled/sites.conf:229:        DocumentRoot    /home/kairosnonsul.com/html
/etc/apache2/sites-enabled/sites.conf:231:            <Directory /home/kairosnonsul.com/html/>
/etc/apache2/sites-enabled/sites.conf:245:       ServerAlias        www.kairosnonsul.com
/etc/apache2/sites-enabled/sites.conf:247:       DocumentRoot     /home/kairosnonsul.com/html
/etc/apache2/sites-enabled/sites.conf:249:         <Directory /home/kairosnonsul.com/html/>
/etc/apache2/sites-enabled/sites.conf:264:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-enabled/sites.conf:275:        ServerAlias      www.munsayu.com
/etc/apache2/sites-enabled/sites.conf:276:        DocumentRoot    /home/unsayu.com/html
/etc/apache2/sites-enabled/sites.conf:278:            <Directory /home/unsayu.com/html/>
/etc/apache2/sites-enabled/sites.conf:293:       ServerAlias        www.munsayu.com
/etc/apache2/sites-enabled/sites.conf:295:       DocumentRoot     /home/unsayu.com/html
/etc/apache2/sites-enabled/sites.conf:297:         <Directory /home/unsayu.com/html/>
/etc/apache2/sites-enabled/sites.conf:312:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-available/000-default.conf:12:	DocumentRoot /var/www/html
/etc/apache2/sites-available/default-ssl.conf:4:	DocumentRoot /var/www/html
/etc/apache2/sites-available/default-ssl.conf:98:	<Directory /usr/lib/cgi-bin>
/etc/apache2/sites-available/sites.conf:4:	ServerAlias	www.nonsul-learn.com
/etc/apache2/sites-available/sites.conf:6:        DocumentRoot /home/nonsul-learn.com/html2
/etc/apache2/sites-available/sites.conf:8:         <Directory /home/nonsul-learn.com/html2/>
/etc/apache2/sites-available/sites.conf:26:	ServerAlias	www.nonsul-learn.com
/etc/apache2/sites-available/sites.conf:28:       DocumentRoot     /home/nonsul-learn.com/html2
/etc/apache2/sites-available/sites.conf:30:         <Directory /home/nonsul-learn.com/html2/>
/etc/apache2/sites-available/sites.conf:45:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-available/sites.conf:57:        ServerAlias     www.gsw2026.com
/etc/apache2/sites-available/sites.conf:59:        DocumentRoot /home/gsw2026.com/html
/etc/apache2/sites-available/sites.conf:61:         <Directory /home/gsw2026.com/html/>
/etc/apache2/sites-available/sites.conf:79:        ServerAlias     www.gsw2026.com
/etc/apache2/sites-available/sites.conf:81:       DocumentRoot     /home/gsw2026.com/html
/etc/apache2/sites-available/sites.conf:83:         <Directory /home/gsw2026.com/html/>
/etc/apache2/sites-available/sites.conf:101:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-available/sites.conf:111:        ServerAlias     www.kairos-susi.com
/etc/apache2/sites-available/sites.conf:113:        DocumentRoot /home/kairos-susi.com/html
/etc/apache2/sites-available/sites.conf:115:         <Directory /home/kairos-susi.com/html/>
/etc/apache2/sites-available/sites.conf:136:                ServerAlias     www.kairos-susi.com
/etc/apache2/sites-available/sites.conf:138:                DocumentRoot /home/kairos-susi.com/html
/etc/apache2/sites-available/sites.conf:143:         <Directory /home/kairos-susi.com/html/>
/etc/apache2/sites-available/sites.conf:169:                <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-available/sites.conf:181:        ServerAlias      www.kyh-consulting.com
/etc/apache2/sites-available/sites.conf:182:        DocumentRoot    /home/kyh-consulting.com/html
/etc/apache2/sites-available/sites.conf:184:            <Directory /home/kyh-consulting.com/html/>
/etc/apache2/sites-available/sites.conf:198:       ServerAlias        www.kyh-consulting.com
/etc/apache2/sites-available/sites.conf:200:       DocumentRoot     /home/kyh-consulting.com/html
/etc/apache2/sites-available/sites.conf:202:         <Directory /home/kyh-consulting.com/html/>
/etc/apache2/sites-available/sites.conf:217:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-available/sites.conf:228:        ServerAlias      www.kairosnonsul.com
/etc/apache2/sites-available/sites.conf:229:        DocumentRoot    /home/kairosnonsul.com/html
/etc/apache2/sites-available/sites.conf:231:            <Directory /home/kairosnonsul.com/html/>
/etc/apache2/sites-available/sites.conf:245:       ServerAlias        www.kairosnonsul.com
/etc/apache2/sites-available/sites.conf:247:       DocumentRoot     /home/kairosnonsul.com/html
/etc/apache2/sites-available/sites.conf:249:         <Directory /home/kairosnonsul.com/html/>
/etc/apache2/sites-available/sites.conf:264:         <Directory /usr/lib/cgi-bin>
/etc/apache2/sites-available/sites.conf:275:        ServerAlias      www.munsayu.com
/etc/apache2/sites-available/sites.conf:276:        DocumentRoot    /home/unsayu.com/html
/etc/apache2/sites-available/sites.conf:278:            <Directory /home/unsayu.com/html/>
/etc/apache2/sites-available/sites.conf:293:       ServerAlias        www.munsayu.com
/etc/apache2/sites-available/sites.conf:295:       DocumentRoot     /home/unsayu.com/html
/etc/apache2/sites-available/sites.conf:297:         <Directory /home/unsayu.com/html/>
/etc/apache2/sites-available/sites.conf:312:         <Directory /usr/lib/cgi-bin>
```

## Migration Requirements

Firebase Storage migration should preserve:


- legacy board/table identity
- legacy post identity
- attachment metadata
- object size
- old-to-new object mapping
- checksum
- authorization requirements

Correction attachments must not become public merely because
they were historically stored below the Apache web root.
