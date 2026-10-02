# Authentication Hash Profile

- Generated: 2026-09-28 17:25:12 KST
- Database: `nonsullearndb`
- Mode: READ-ONLY / AGGREGATE ONLY
- Raw password hashes: NOT COLLECTED
- Member IDs: NOT COLLECTED
- PII: NOT COLLECTED

## 1. Member Counts

```text
Total members: 330
Non-empty password values: 325
Empty password values: 5
```

## 2. Password Length Distribution

| Length | Count |
|---:|---:|
| 78 | 325 |

## 3. Hash Format Classification

Classification only. No raw hash values are exported.

| Format | Count |
|---|---:|
| OTHER_LENGTH_78 | 325 |

## 4. Account-State Aggregate

| Metric | Count |
|---|---:|
| Total | 330 |
| Leave-date present | 3 |
| Intercept-date present | 0 |

## Migration Interpretation

Hash algorithms must NOT be inferred from length alone.

Firebase migration strategy must be determined using:


1. this aggregate profile
2. legacy password verification implementation
3. Firebase-supported password import algorithms

Possible outcomes:

- direct password import
- lazy migration
- forced password reset

No raw password hash was exported.
