---
title: Round eleven controls
summary: Mismatched backtick runs are prose, matched ones are code.
lang: en
---

One backtick open and two closed is not a code span, so `isn't`` stays prose.

Two open and one closed is not one either, so ``wasn't` stays prose too.

A matched single run is code: `it doesn't restart` is pasted output.

A matched double run is code as well: ``error: can't open`` is pasted too.

| Cell | Note |
|---|---|
| `didn't restart` | code, and silent |
| ``couldn't start`` | code, and silent |
| `aren't`` mismatched | prose, and counted |

The closing line carries no contraction of its own.
