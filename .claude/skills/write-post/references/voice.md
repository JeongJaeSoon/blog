# House voice

Scope: this file owns **English** style, plus the structural rules that apply to
all three languages.

It does **not** own Korean or Japanese sentence style. Those have real
taxonomies behind them and the skills are enabled for this repo:

- ko → `humanize-korean` (plugin `im-not-ai`, 10 categories / 70 patterns)
- ja → `humanize-japanese` (plugin `im-not-ai-ja`)

Do not re-derive their rules here. A flat ban list is worse than a taxonomy that
weighs repetition, co-occurrence and register — and worse than one that knows
`-습니다` and `です・ます` are not AI tells.

The voice itself is already on disk. Before editing, read one existing post in
the language you are working in: `content/posts/rebuilding-this-site/en.md` and
`content/posts/obsidian-nas-remote-mcp/ko.md` are the reference renditions.

## What the voice is

First person, past tense, specific. The author did a thing, some of it failed,
here are the parts worth keeping. Claims land flat and unhedged because they
were observed, not reasoned about.

> Nothing in it was mine. The demo author was still called Artur Carter.

> 막상 해보니 설치 순서보다 Portainer의 제약, CLI 옵션, MCP SDK 버전 차이를
> 알아내는 데 시간이 더 들었습니다.

Both name something real. Neither announces what the paragraph is going to do.

## Cut on sight — English

| Pattern | Instead |
|---|---|
| "In this post, I'll walk through…" | The first real sentence of the story |
| "Let's dive in", "Let's take a look at" | Nothing. Show the thing. |
| "It's important to note that", "It's worth mentioning" | State it, or cut it |
| "can be a powerful tool", "a game changer", "seamlessly", "robust" | What it does, measured |
| "simply", "just", "easily" | Delete. It was not easy or you would not be writing about it. |
| "leverage", "utilize" | "use" |
| "delve into", "explore", "unpack" | The verb for what you actually did |
| "Whether you're a beginner or an expert…" | Delete. There is one reader. |
| "Not only … but also", "That said," opening every third paragraph | Vary or cut the connective |
| "In conclusion", "To sum up" | Delete the sentence; keep the finding |
| Em-dash asides in three consecutive sentences | One per paragraph at most |
| Rule-of-three lists that fill out to three | Two is a fine number of reasons |

One hit is not a finding. Judge on repetition and co-occurrence, the way the ko
and ja taxonomies do — a single "just" in a 1,500-word post is not the problem.

Hedging is the loudest tell. "This might potentially help improve performance in
some cases" describes nothing. Either it got faster and you have the number, or
you do not mention it.

## Korean and Japanese — what stays here

Only the things a general-purpose humanizer cannot know, because they are about
this blog rather than about the language:

- `-습니다`체로 통일합니다. 기존 글이 전부 그렇습니다. 문체 판단 자체는
  `humanize-korean`에 맡기고, 여기서는 기존 글과의 일관성만 봅니다.
- 첫 문장은 실제 상황입니다. "이 글에서는 ~를 살펴보겠습니다" 같은 예고로 열지
  않습니다.
- 실패한 시도와 막힌 지점을 지우지 않습니다. 윤문 과정에서 가장 먼저 매끈하게
  다듬어 없어지는 부분이고, 이 블로그에서 가장 읽을 만한 부분입니다.
- 수치, 파일 경로, 설정 키, 식별자는 보호어로 넘깁니다. 윤문이 이것들을
  "자연스럽게" 바꾸면 글이 틀려집니다.

## Structural tells, all three languages

- Every section the same length.
- Every section ending with a sentence that restates the section.
- A closing summary that lists each heading back as a bullet.
- Bold applied to whole sentences rather than to a term.
- A table whose cells are adjectives.
- No dead ends anywhere. Real work has them; a post without any was not written
  from real work.

## Check

```sh
.claude/skills/write-post/scripts/tells.sh content/posts/<slug>
```

This is a grep net for the obvious English cases, with a thin Korean net kept as
a pre-check before `humanize-korean` runs. It is not the standard — a draft can
pass it and still read like an essay generated from a heading list.
