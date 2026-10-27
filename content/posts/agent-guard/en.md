---
title: Why I Built Agent Guard - My Coding Agent Kept Leaking Secrets at Work
date: '2026-10-28'
summary: Claude Code kept reading .env files during real work and putting live API keys into transcripts, so I built a local guardrail that blocks the read, masks the output, and scans the commit.
lang: en
tags:
  - claude-code
  - security
  - ai-agents
draft: false
---

I did not build this tool because the problem sounded interesting. I built it because it kept happening in front of me.

At work we use Claude Code heavily for real development. More than once, a session went wrong in the same quiet way. The agent read a `.env` file during an ordinary task, and a real API key ended up inside the transcript. The key went to the LLM, stayed in the session logs, and sat one copy-paste away from somewhere it should never be. No alarm went off. Nobody did anything reckless. The agent was doing its job, and its job is reading files and running commands.

Threads on r/ClaudeCode tell the same story. One developer found the agent had taken several providers' keys out of `.env` and run tests against a different provider to save tokens. Another found their agent sending their email address in HTTP headers to sites that asked for one. The details differ. The shape is the same: once the model has seen a secret, nobody controls where that secret goes next.

The tools I already had did not cover this. Secret scanners watch Git, so they catch a key at commit time, after the key has already been in the transcript. Deny rules cover the Read tool. They do not cover `cat .env` in bash, and they do not cover the config your own program prints when it crashes. Instructions in `CLAUDE.md` are requests to the model, not enforcement. A model that decides a task needs the file will argue with your instructions, and sometimes it wins.

So I built the control I wanted: a check that runs outside the model. It runs before a tool executes, after output comes back, and before anything enters Git. That is [Agent Guard](https://github.com/JeongJaeSoon/agent-guard).

## What it does

Agent Guard is a local-first guardrail for Claude Code and Codex. It also ships a native Git hook and a GitHub Action.

- Before a tool runs, it blocks risky `.env` reads. When an agent runs `git commit` or `git push`, it scans the staged lines with gitleaks first and blocks the command if it finds a secret-like value. The agent cannot switch the check off. Agent Guard refuses `--no-verify` and `--no-gpg-sign` on Git commands an agent runs.
- After output comes back, it masks secret-like values in supported tool output before the model sees them. The key can come from a file, a command, or your program's error output. The masking does not care which.
- In Git itself, the native pre-commit hook scans every local commit, whoever makes it. The GitHub Action scans pushes and pull requests again as a backstop.

![Agent Guard in action: reads of a .env holding a private key are blocked, and shell output shows the key as [REDACTED]](https://raw.githubusercontent.com/JeongJaeSoon/agent-guard/main/docs/demo.gif)

## What the project is aiming for

Three principles shaped the design.

**Few dependencies.** The runtime is portable shell, `awk`, `git`, `jq`, and gitleaks. There is no daemon, no runtime framework, and no package ecosystem to audit. A security tool that brings its own supply chain becomes part of the problem it claims to solve.

**Fast enough to stay invisible.** A guardrail that slows the loop down gets disabled. The commit gate scans the staged added lines, not the whole tree, and the checks run inside the workflow the agent was already performing.

**Lightweight and local.** There is no hosted account, no telemetry, and no developer service. Default processing is local and ephemeral. A tool that watches for your secrets should not send data anywhere, including to me.

## The hard parts

The idea is simple. The surface it has to cover is not. Most of the work went into cases like these.

**There are more than a dozen ways to spell a commit.** `git commit -a`, `--patch`, a pathspec, `--include`, `--only`, interactive staging of untracked files, `git add -f` on ignored files. Each one changes what the commit contains. The gate has to scan what the commit would actually include, including the changes Git stages by itself, not only what sits in the index.

**Agents hide commands inside other commands.** Shell code arrives through `bash -c`, here-strings, `env -S`, and `eval`. Git aliases expand to other commands. A `!` alias runs arbitrary shell. `help.autoCorrect` can guess a different subcommand than the one typed. Agent Guard checks all of that the way it checks the command itself. When part of a command line is only known at run time, as in `git commit $FLAGS`, the honest answer is to scan everything and let policy decide the rest.

**A scan is a snapshot.** The gate scans files as they are when the command starts. If an earlier part of the same command line writes a file first, the scan cannot see the result. That is why the plugin is not the only layer. The native pre-commit hook scans after Git has staged the final content.

**A scan that did not run is not a clean scan.** If gitleaks is missing or fails and the commit goes through as safe, the guardrail fails open at the worst moment. Agent Guard makes this case explicit and configurable. The default warns that protection is degraded. `AGENT_GUARD_INFRA_FAILURE_MODE=closed` blocks instead. The native hook and the Action fail closed either way.

**Setup cannot prove protection.** A plugin can install cleanly and still protect nothing if the host never dispatches its hooks. The project ships live verification probes, harmless checks you run in a real session, because "installed" and "working" are different claims. A security tool should not blur them.

## Quick start

Install the plugin (see the [installation guide](https://github.com/JeongJaeSoon/agent-guard/blob/main/docs/installation.md)), then run the guided setup:

```text
# Claude Code
/agent-guard:setup-agent-guard

# Codex
$setup-agent-guard
```

You can also check a repository directly, with no agent involved:

```sh
agent-guard scan-working-tree
agent-guard scan-staged
agent-guard scan-path .
```

You need macOS or Linux, `git`, `jq`, and gitleaks 8.30 or newer.

## Where this is headed: PII filtering

Secrets are not the only thing that leaks. The email story above is the proof. Agents also put personal data (email addresses, phone numbers, names) into requests, headers, and logs, and nobody notices, because no scanner is looking for it.

That is where I am putting the weight next. The configuration already has early, opt-in PII support. The goal is to treat PII the way Agent Guard treats secrets: detect personal data in tool input and output, and redact it before the model sees it or a log keeps it. The hard part is balance. A filter that mangles ordinary code with false positives gets switched off within a day, so precision matters as much as coverage.

Three more directions are open:

- **More hosts.** The same leak happens in Cursor, Gemini CLI, and other agents. Each host dispatches hooks differently, so support means per-host verification, not a new logo on the README.
- **Windows.** Not supported today. The project is portable shell by design, and Windows needs a different answer rather than a port.
- **Continuous verification.** Hosts change how hooks behave between versions. The benchmark and live-probe work continues, so "protected" stays a tested claim instead of an assumption.

## Honest limits

Agent Guard is defense in depth. It is not a vault and not a DLP system. It does not rotate credentials, and it does not replace GitHub Secret Scanning, Push Protection, code review, or sane key management (separate keys per tool, spending caps, short lifetimes). What it removes is the accident I kept watching: a secret entering a transcript, a log, or a commit before anyone noticed it was there.

A key the model never sees is a key it cannot leak, spend, or commit.

Agent Guard is MIT-licensed and open source: [github.com/JeongJaeSoon/agent-guard](https://github.com/JeongJaeSoon/agent-guard). If it keeps a secret out of a transcript for you, a star helps other developers find it.
