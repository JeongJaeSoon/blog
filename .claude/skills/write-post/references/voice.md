# House voice — English and Korean

Japanese is not covered here. Use the `humanize-japanese` skill for `ja.md`.

The voice is already on disk. Before editing, read one existing post in the
language you are working in — `content/posts/obsidian-nas-remote-mcp/ko.md` and
`content/posts/rebuilding-this-site/en.md` are the reference renditions.

## What the voice is

First person, past tense, specific. The author did a thing, some of it failed,
here are the parts worth keeping. Claims land flat and unhedged because they
were observed, not reasoned about.

> Nothing in it was mine. The demo author was still called Artur Carter.

> 막상 해보니 설치 순서보다 Portainer의 제약, CLI 옵션, MCP SDK 버전 차이를
> 알아내는 데 시간이 더 들었습니다.

Both name something real. Neither announces what the paragraph is going to do.

Korean runs on `-습니다`. English uses contractions where speech would.

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

Hedging is the loudest tell. "This might potentially help improve performance in
some cases" describes nothing. Either it got faster and you have the number, or
you do not mention it.

## Cut on sight — Korean

| Pattern | Instead |
|---|---|
| "이 글에서는 ~에 대해 알아보겠습니다" | 첫 문장부터 실제 상황 |
| "~에 대해 살펴보겠습니다", "함께 알아봅시다" | 삭제 |
| "~하는 것이 중요합니다", "~하는 것이 좋습니다" | 실제로 무엇이 일어났는지 |
| "효율적으로", "적절히", "손쉽게", "간편하게" | 삭제하거나 수치로 |
| "다양한", "여러 가지", "많은" (수량 없이) | 실제 개수 |
| "~할 수 있습니다"의 반복 | "~합니다" / "~했습니다" |
| "~라고 할 수 있습니다", "~인 것 같습니다" (관찰한 사실에) | 단정 |
| "먼저 / 다음으로 / 마지막으로" 문단 머리 | 접속 없이 이어 쓰기 |
| "정리하자면", "결론적으로" | 삭제하고 발견만 남기기 |
| 번역투 "~에 대한", "~을 통해", "~에 의해" 남용 | 능동태로 다시 쓰기 |
| 소제목마다 같은 길이의 요약 문단 | 필요한 곳에만 |

`-는다`체와 `-습니다`체를 한 글에서 섞지 않습니다. 기존 글은 전부 `-습니다`체입니다.

## Structural tells, both languages

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

Every hit needs a fix or a reason. The script is a net for the obvious cases,
not the standard — a draft can pass it and still read like an essay generated
from a heading list.
