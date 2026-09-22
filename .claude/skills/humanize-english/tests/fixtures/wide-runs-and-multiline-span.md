---
title: Round twelve controls
summary: Three backticks closed by two, and a code span that wraps a line.
lang: en
---

Three open and two closed is not a span, so ```isn't`` stays prose.

A span may wrap a line, and this one does:
`error: can't
open file` is pasted output, so it is silent.

An equal pair closes: ``wasn't`` is code, and ```hasn't``` is code too.

| Cell | Note |
|---|---|
| ```aren't`` | mismatched, so prose |
| ``didn't`` | matched, so code |

The closing line contracts nothing.
