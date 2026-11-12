---
title: Once Agents Outnumber People, the Harness Belongs Outside the Sandbox
date: '2026-11-13'
summary: I was asked whether giving every agent its own VM would run out of CPU first. Answering it, I worked out why the loop, the session, and the sandbox should be split.
lang: en
tags:
  - ai-agents
  - sandbox
draft: false
---

While designing a sandbox for agents, I got a question. For one person, the simplest setup is a single VM with the harness inside it. But for a factory running thousands of agents, would giving each agent its own VM not run out of CPU first?

My answer was that at scale, the harness should move outside the sandbox. The first evidence I pointed to was a set of numbers Anthropic published when it rebuilt Claude Managed Agents. After moving the harness out of the container and creating containers only when needed, time to first token dropped by about 60% at p50 and by more than 90% at p95. That many sessions never needed to wait for a sandbox.

![A 6-minute 47-second explainer video on why the harness should move outside the sandbox](/videos/harness-outside-the-sandbox-en.mp4)

## There are three more reasons besides CPU

The question started with CPU, but putting the harness and the sandbox in one container causes more problems than that.

The first is reliability. If the harness and the loop state live in the same container, the session disappears the moment the container dies. The second is security. If credentials sit where the agent runs arbitrary code, keeping that code away from them becomes hard in itself. A proxy outside the sandbox that holds the tokens means nothing inside the sandbox can reach them in the first place. The third is startup speed. A session that does not need a sandbox can start inference right away instead of waiting for a VM to boot. That is where the 60% above comes from.

## Keeping state in the session gives you the shape of Kubernetes

The structure is easiest to explain by comparing it to a large application running on Kubernetes.

| Component | Kubernetes equivalent | Role |
|---|---|---|
| Harness · Loop | Deployment (stateless) | If it dies, start a new one |
| Session · Event Log | etcd / DB | An append-only log that lives outside the harness |
| Sandbox | Job / Pod | Start it when needed, use it, throw it away |
| Orchestration | Control Plane | Wakes the harness and prepares the sandbox |

The key is that state lives in the session, not inside the harness. Since the loop holds no state, any harness instance can read the session log and pick up where the last one left off. That is why the loop can run statelessly on shared infrastructure.

## The loop spends most of its time waiting for the LLM

Back to the original question: once the loop moves outside, the CPU problem changes shape. Most of what the loop does is wait for LLM responses, so it has no reason to hold a VM. A VM is only needed while the agent is actually running code or touching files.

So instead of handing out always-on VMs, you start them per task. For short runs, a FaaS such as AWS Lambda or Cloud Run functions is enough. For long, heavy runs like Computer-Use or Browser-Use, you start a VM each time and push any overflow onto a Queue to process in order.

Recent tools make this direction easier. With Code mode or a virtual bash and file system, reading, searching, and small edits finish without a VM. Durable execution platforms such as Durable Objects, Vercel Workflows, and Temporal take on the job of keeping loop state outside.

## You can also keep the VM and free up only the CPU

Some people solve the same problem differently. Reading two posts side by side makes the difference clear.

[mendral](https://mendral.com/blog/agent-harness-belongs-outside-sandbox) runs the harness on the backend and wakes the sandbox only to run commands. The sandbox is paused while the LLM is being called, and waking it again takes about 25ms. That is the same direction as Managed Agents.

[Agent Substrate](https://ate.dev) goes the other way and gives each agent its own microVM or gVisor sandbox. In exchange, an idle agent is paused, and any ready worker can resume it within 500ms with its memory and file system state intact. The VM stays, and only the CPU is freed.

With the second approach, you can keep a VM per agent and still cut the CPU bottleneck by a lot. Which approach fits which kind of work is something I have not measured myself yet. That part is still waiting to be verified.

## What is still missing for the brain and the hands

Once the harness is outside, the remaining question is whether the tools for building the brain and the hands are mature enough. My view is that about half of them are.

For reasoning, you can put several LLMs behind one proxy, and sharing skills as knowledge through a plugin marketplace has become an established practice. For the hands, an MCP Gateway can serve both as the entry point to internal systems and as the proxy that holds credentials outside the sandbox.

The gaps are memory and execution. For short-term memory, the context window is already at its limit, so you need a separate mechanism that organizes memory between sessions, like Dreaming in Managed Agents. For long-term memory, vector search alone loses relationships and context, so on top of a knowledge base like an LLM Wiki, internal documents need to be linked into a graph or an ontology. On the execution side, you still need VMs that actually run scripts, Computer-Use, and Browser-Use.

## Three things to design together with the harness

The brain and the hands alone do not keep an agent moving steadily in the intended direction. There are three more things I think belong in the harness design.

- **Eyes and ears (Perception)**: a feedback loop that observes what the hands did and sends the result back to the brain. I put Self-Reflection, where the agent reviews its own results after acting, here as well.
- **Autonomic nervous system (Guardrails)**: it blocks actions such as dropping a whole database, paying without permission, or looping forever, and asks a human for approval before execution. Online Eval, where an LLM-as-a-Judge takes another look before the hands move, also belongs here.
- **Control engine (Orchestration)**: it manages the whole cycle of thinking, acting, and checking, and retries or takes another route when something fails. The state it needs also lives in the session, not in the loop.

I left out Observability and Offline Eval here, because they do not take part in real-time execution directly.

## Open questions

I do not have an answer yet on which kind of work suits harness separation and which suits keeping the VM. My guess is that harness separation wins for agents that mostly make short tool calls, and keeping the VM wins for agents that hold a browser open for a long time, but it is still a guess. I will write a follow-up once I have measured it.

## References

- [Scaling Managed Agents with stable interfaces](https://www.anthropic.com/research/managed-agents) — Anthropic
- [The Agent Harness Belongs Outside the Sandbox](https://mendral.com/blog/agent-harness-belongs-outside-sandbox) — mendral
- [Agent Substrate](https://ate.dev)
