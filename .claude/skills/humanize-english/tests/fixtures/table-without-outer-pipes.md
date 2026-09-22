---
lang: en
title: Round sixteen controls
summary: Outer pipes are optional, and this line ends the front matter.
---

A table without outer pipes is still a table:

Command | What it prints
--- | ---
`orca build` | it doesn't restart
a | Additionally, this line is anchored.

A line with a pipe in it, such as `a | b` in running prose, is not a table and
it isn't treated as one.

A fence opened three spaces past a list item's content column:

- Run it.

     ```text
     error: can't open
        ```
     we haven't left yet
     ```

Nothing at the margin contracts.
