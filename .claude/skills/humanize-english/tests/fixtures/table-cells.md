---
title: Round eight controls
summary: Table cells are prose, and a table drawn inside a fence is not.
lang: en
---

The paragraph outside the table carries no contraction at all.

| Setting | What happens |
|---|---|
| `reuse: false` | it doesn't restart, and everything's fine |
| `reuse: true` | Menlo's metrics stay put; the apps' cache is reused |

The fenced block below draws a table, so none of its cells are prose:

```text
| Setting | What happens |
|---|---|
| reuse | it doesn't restart, and we're done |
```

Nothing else here contracts.
