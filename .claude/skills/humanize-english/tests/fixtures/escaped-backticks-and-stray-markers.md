---
title: Round thirteen controls
summary: Escaped backticks, a stray indented marker pair, and an indented quote.
lang: en
---

Escaped backticks are literal, so \`it doesn't restart\` stays prose.

  > A quote indented two spaces: we aren't reading this one.

> A quote at the margin: they haven't read this one either.

Two stray four-space markers at the top level are content, and the prose
between them must still be read:

    ```

This paragraph sits between the markers and it wasn't scanned before.

    ```

A fence under a list item is still a fence, even at four spaces:

1. Run it and read the output.

    ```sh
    error: can't open file
    ```

The closing line contracts nothing.
