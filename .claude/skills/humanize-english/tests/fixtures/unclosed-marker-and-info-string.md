---
title: Round ten controls
summary: An opener that never closes, a wide code span, and a tilde info string.
lang: en
---

A tilde fence whose info string carries backticks is still a fence:

~~~text `orca --version`
error: can't open file, and we're done
~~~

| Command | What it prints |
|---|---|
| ``orca run `x` `` | ``error: can't open`` |
| Plain prose in a cell | it wasn't ready |

Below is a marker indented four spaces that never closes. The paragraphs after
it are prose, and the gate must still read them:

    ```

This paragraph comes after the stray marker and it isn't code.

The last line here is prose too, and we're counting on being read.
