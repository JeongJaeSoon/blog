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

I keep the main agent focused on difficult judgment, breaking work apart, and
integrating the result. Independent work can go to a subagent, but that does
not mean every subtask should be delegated. I delegate only when the expected
savings are greater than the cost of describing the work, transferring the
right context, and reviewing what comes back.

That distinction matters. Splitting a short, tightly coupled task can add
latency and tokens while interrupting the line of reasoning. Delegation is not
the default workflow; it is an optimization for work where it can reduce total
time and cost without compromising the quality bar.

## Decide whether to delegate first

The main agent should usually handle work directly when it:

- ends after one or two quick checks or a small edit;
- takes less effort to do than to explain;
- produces a result needed immediately for the next decision; or
- costs more to review than the split saves.

Delegation is a better fit when a task can proceed independently, has a clear
and substantial scope, and benefits from running alongside the main work. That
includes well-bounded research, review, and implementation. When the tradeoff
is unclear, the main agent keeps the task.

## Pick the subagent model by difficulty

Once a task earns delegation, its difficulty determines the model used.

| Task difficulty | Subagent model | Good fit |
| --- | --- | --- |
| Simple | `gpt-5.6-luna` | Bounded checks, short summaries, straightforward edits |
| General | `gpt-5.6-terra` | Research or implementation that can complete independently |
| Complex | `gpt-5.6-sol` | Analysis or design that must weigh several conditions |

The operating rule is not to use Astra for subagents. The main model is kept
for deep judgment and integration; work that can be separated without losing
quality gets the least expensive model that meets its needs.

## What is confirmed, and what is not

As of September 11, 2026, the local configuration confirmed `gpt-6-astra` as
the main model with `high` reasoning effort, and `gpt-5.6-terra` as the default
subagent model. The delegation policy also records the explicit Luna, Terra,
and Sol selection rule for simple, general, and complex work.

The runtime record confirmed a main Astra run and a subagent run explicitly
assigned to Luna. An isolated check with CLI 0.153.4 also loaded and returned
the Terra default.

Those checks have limits. They do not prove that every task is classified or
delegated automatically. This run did not verify that omitting a subagent model
selects Terra, because the observed subagent run named Luna explicitly. The
policy is behavioral guidance for agents, not an enforced routing mechanism.
An exhaustive strict validation of the whole configuration also did not finish
because of an unrelated, unsupported setting.

I have not measured a reduction in token count, spend, or account usage.
Delegation always carries context-transfer and review costs, so it cannot
guarantee lower total usage. The practical rule is intentionally narrower:
delegate only the work for which those costs are likely to be repaid.
