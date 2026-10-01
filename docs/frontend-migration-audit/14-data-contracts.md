# Data contract draft

Interfaces below describe only repository-confirmed concepts; fields marked optional require runtime shape verification.

```ts
interface Viewer { id: string; name: string; level: number; points?: number }
interface Banner { slot: number; imageUrl: string; href?: string; target?: string; alt?: string }
interface Teacher { id: string; categoryId: string; categoryName?: string; order: number; name?: string; bioHtml?: string; imageUrl?: string }
interface CatalogueItem { id: string; name: string; categoryId: string; displayPrice?: number; telephoneInquiry?: boolean; soldOut?: boolean; imageUrl?: string }
interface LearningEnrollment { orderId: string; itemId: string; name: string; startDate: string; endDate: string; progress: number; correctionRemaining: number; status: string }
```

Source of truth: PHP/GnuBoard and MariaDB. `displayPrice`, `soldOut`, and enrollment access must be produced/verified by PHP logic; the actual banner/teacher/item field mapping is **UNKNOWN** until Production data inspection.
