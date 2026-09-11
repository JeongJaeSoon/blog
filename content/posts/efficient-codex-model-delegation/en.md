---
title: Using Codex model delegation where it actually pays off
date: '2026-09-11'
summary: >-
  Delegation is not a default. I use a subagent only when the expected savings
  exceed the overhead of briefing it, transferring context, and reviewing its work.
lang: en
tags:
  - codex
  - ai-agents
  - workflow
---

I use the main agent for the work that needs judgment: deciding what to do,
where to split it, and how to combine the result. A subagent earns its place
only when the time saved is greater than the time spent briefing it, handing
over context, and checking its output.

That rules out a lot of tempting splits. A small edit or a question whose
answer is needed for the next step is usually faster to do in the main thread.
Breaking it out adds a hand-off, a wait, and another result to verify.

## Decide whether to delegate first

I keep a task in the main thread when a couple of checks or a small change will
finish it, when the brief would be longer than the work, or when its result is
needed immediately. I delegate bounded research, review, and implementation
that can run independently. If the calculation is close, I do it directly.

## Pick the subagent model by difficulty

Once a task is worth delegating, I choose the model by the difficulty of that
specific task.

| Task difficulty | Subagent model | Good fit |
| --- | --- | --- |
| Simple | `gpt-5.6-luna` | Bounded checks, short summaries, straightforward edits |
| General | `gpt-5.6-terra` | Research or implementation that can complete independently |
| Complex | `gpt-5.6-sol` | Analysis or design that must weigh several conditions |

The rule is simple: Astra is not used for subagents. The main model stays on
judgment and integration; separable work gets the least expensive model that
can meet the bar.

## What is confirmed, and what is not

On September 11, 2026, I confirmed that the local configuration used
`gpt-6-astra` with `high` reasoning effort for the main model, and
`gpt-5.6-terra` as the default subagent model. The delegation policy records
the Luna, Terra, and Sol choices above.

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
