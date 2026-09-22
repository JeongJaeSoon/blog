---
title: Round fourteen controls
summary: A fence on the marker line, an escape inside a span, backticks across cells.
lang: en
---

A fence may open on the list-marker line itself:

- ~~~text
  error: can't open file
  ~~~

A backslash does not escape inside a code span, so the span closes at the
backtick after it and `code \` can't edit` leaves a contraction in the open.

| left ` | can't edit | right ` |
|---|---|---|
| a | b | c |

The closing line contracts nothing.
