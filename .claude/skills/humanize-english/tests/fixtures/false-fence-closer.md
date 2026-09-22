---
title: Round nine controls
summary: A false fence closer, and a pipe escaped inside a table cell.
lang: en
---

A fenced example that draws a fence. The four-space marker below is content,
not the closer, so everything up to the real closer stays code:

~~~text
    ```
    error: can't open file
    ```
we aren't out of the fence yet, and we've still got a line to go
~~~

Out of the fence, and this sentence does not contract.

| Command | What it prints |
|---|---|
| `orca run \| tee log` | `error: can't open \| retry` |
| A cell that is plain prose | it doesn't retry, and everyone's waiting |

One closing fence indented three spaces is still a closer:

   ```sh
   $ orca build
   it isn't ready
   ```

The last line is prose and carries no contraction.
