# Gate 5-B Universal Template Content Resolution

Gate 5-A showed that no trustworthy per-course inventory or override set is available yet. The provider therefore resolves every **supported** category from its verified type default first, then applies an optional verified course override.

```text
category resolver → type default → optional override → JSON Schema/Zod validation
                                                └ invalid → null → CourseDetail
```

The resolved object receives the API course ID; `__default__` remains a defaults-file-only marker. Template copy is JSON-owned, while the renderer continues to take name, price, inventory, options, gallery, Legacy HTML and SEO from `CourseFull`.

No real course ID or marketing claim was added. Gate 5-C content authoring remains out of scope.
