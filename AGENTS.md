<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Writing posts

Read `.claude/skills/write-post/SKILL.md` before touching anything under
`content/posts/`, including translations and tone edits. It carries the
three-file contract that `lib/posts.ts` enforces, the house voice, and the
AI-tone pass — `humanize-korean` for `ko.md`, `humanize-japanese` for `ja.md`,
and `references/voice.md` plus `scripts/tells.sh` for `en.md`.

Both plugins are enabled in `.claude/settings.json`, **for this repo only**:
`humanize-korean` from `epoko77-ai/im-not-ai` (pinned `v2.3.2`) and
`humanize-japanese` from `JeongJaeSoon/im-not-ai-ja`. Nothing goes into
`~/.claude` — do not run either repo's `install.sh`.
