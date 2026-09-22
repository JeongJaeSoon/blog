---
title: Using Codex model delegation where it actually pays off
date: '2026-09-11'
summary: >-
  A subagent is not the default. A task has to clear a bar before I hand it over —
  this is the bar, the model each difficulty gets, and what I still have not measured.
lang: en
tags:
  - codex
  - ai-agents
  - workflow
---

On September 11, 2026, my local Codex settings had `gpt-6-astra` as the main
model and `gpt-5.6-terra` as the default subagent model. Two separate values mean
that handing work off moves it to something cheaper, which makes every
splittable task look worth splitting.

Every hand-off also adds a brief to write, a wait, and another result to verify,
so a small edit or a question whose answer is needed for the next step is
usually faster to do in the main thread. That rules out a lot of tempting splits.

What stays with the main agent is the work that needs judgment: deciding what to
do, where to split it, and how to combine the result.

## When the call is close, I don't split

I keep a task in the main thread when a couple of checks or a small change will
finish it, when the brief would be longer than the work, or when its result is
needed immediately. I delegate bounded research, review, and implementation
that can run independently. When it is a close call, it stays in the main thread.

## Each difficulty has a different cheapest model

Once a task is worth delegating, I choose the model by the difficulty of that
specific task.

| Task difficulty | Subagent model | Good fit |
| --- | --- | --- |
| Simple | `gpt-5.6-luna` | Bounded checks, short summaries, straightforward edits |
| General | `gpt-5.6-terra` | Research or implementation that can complete independently |
| Complex | `gpt-5.6-sol` | Analysis or design that must weigh several conditions |

Astra never runs as a subagent. The main model stays on judgment and
integration, and separable work gets the least expensive model that can meet
the bar.

## What is confirmed, and what is not

The settings above came out of that day's local configuration, where the main
model also carried `high` reasoning effort. The delegation policy records the
Luna, Terra, and Sol choices above.

The runtime record also showed a main Astra run and a subagent explicitly
started with Luna. In an isolated check, CLI 0.153.4 read back the Terra
default.

There are limits to those checks. I did not test a subagent launch with its
model omitted, so I have not verified that it selects Terra in practice. The
policy is guidance for the agent, not an enforced router. Strict validation of
the whole configuration also stopped on an unrelated unsupported setting.

I have not measured token, spend, or account-usage savings. Every delegation
still has a context-transfer and review cost. The rule is deliberately narrow:
delegate only when that cost is likely to be paid back.
