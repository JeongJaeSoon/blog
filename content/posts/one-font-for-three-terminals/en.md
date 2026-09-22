---
title: Making three terminals agree took everything except a font
date: '2026-09-22'
summary: >-
  Merging Menlo, UDEV Gothic NF and D2Coding into one family was the quick part.
  VSCode, iTerm2 and Orca still drew it three different ways, and every reason
  turned out to live outside the font file.
lang: en
tags:
  - fonts
  - terminal
  - macos
draft: true
---

With VSCode, iTerm2 and Orca open side by side on the same file, Korean looked different in all three. The size was 14px everywhere, but the weight varied, and in some of them Hangul lined up with the Latin grid while in others it didn't. Each app was falling back to a different font.

Merging them into one font looked like the whole job. The merge really did come down to three scripts. What came after is what took the time: same font, same size, three different results, and none of the causes were in the font file.

The scripts are at [JeongJaeSoon/menlocjk](https://github.com/JeongJaeSoon/menlocjk). Installation is written up there, so this is only what I learned along the way.

## No fallback chain can be written the same way three times

All three apps handle font fallback differently.

| App | Fallback model |
|---|---|
| VSCode | A CSS font list, as long as you like |
| iTerm2 | Two slots — ASCII font and non-ASCII font — plus codepoint-range exceptions (Special Font Config) |
| Orca | One family. It wraps whatever you type in quotes and drops it into CSS |

There is no way to write `Menlo, UDEV Gothic NF, D2Coding` into all three. VSCode takes it verbatim, iTerm2 needs it split across two slots, and Orca treats the entire string as a single family name. So the fallback had to come out of the app settings and go into the font file.

Off the shelf there is Sarasa Term K and friends. I built my own because I wanted to keep Menlo's Latin and its line spacing exactly as they were.

## fontTools does most of the merging

`prep.py` normalises the three sources to 2048 upem and drops `GSUB`, `GPOS`, `GDEF`, `DSIG`, `morx` and `kern`. Terminals never ask for shaping features. D2Coding ships at 1000 upem, so `scaleUpem` takes it to 2048.

`merge.py` fuses them. Cmap conflicts resolve to the first font, so the order is the priority.

| Characters | Source |
|---|---|
| Latin, digits, symbols, box drawing, blocks | Menlo |
| Kana and kanji, Nerd Font icons, Powerline | UDEV Gothic NF |
| Hangul syllables and jamo | D2Coding |

D2Coding is in there for one reason: UDEV Gothic NF has no Hangul. Japanese and the icons are covered by UDEV alone, Hangul leaves a hole, and that is how a two-font merge became a three-font one.

Vertical metrics get overwritten with Menlo's. `ascent`, `descent` and `lineGap` from `hhea`, plus the typo and win metrics from `OS/2`, have to come across or the line spacing shifts. Advance widths are untouched: `A` is 1233 (0.602em), `가` and `漢` are 2048, and all twelve faces built later carry the same values. Leaving the widths alone keeps the terminal grid intact and puts every glyph where the old fallback chain put it.

The merged font carries 54,587 glyphs. A build takes about six minutes on my Mac — that's a rough figure, not a measured one.

## The weight ramp is pinned to a 27-unit grid

I threw the first ramp away. The steps were unevenly spaced and 600 wasn't sitting on Menlo's drawn Bold. On screen some steps were invisible and others jumped.

Menlo only designs two weights, with stems of 172 and 227 — a gap of 55. At 14px a third of that doesn't read, so I set the step to 27, the smallest one I could actually see, and rebuilt the ramp on it. That drops Menlo's Bold onto 600: 172 + 2×27 = 226, against an original of 227.

| Weight | Stem | Source |
|---|---|---|
| 400 Regular | 172 | Menlo Regular, as drawn |
| 500 Medium | 199 | Synthesised |
| 600 SemiBold | 227 | Menlo Bold, as drawn |
| 700 Bold | 254 | Synthesised |
| 800 ExtraBold | 281 | Synthesised |
| 900 Black | 308 | Synthesised |

Six roman and six italic, twelve faces. The synthesised ones come from skia-pathops: union the outline with a stroked copy of itself. Stroke width lands half on each side of the stem, so a 27-unit stroke raises the stem by exactly 27. One or two glyphs per face fail the union, and those keep their original outline.

Name IDs 16 (typographic family) and 17 (subfamily) are what make macOS treat all twelve as one family.

There's a cost. 700 is no longer Menlo's drawn Bold but one step heavier than it, and ANSI bold in a terminal reaches for 700, so bold text comes out thicker than the original. Pointing the app's bold weight at 600 gets the drawn Bold back — `Bold Font Weight` in Orca, `terminal.integrated.fontWeightBold` in VSCode.

## One font, three apps, three renderings

This is where the time went. The font was identical and the output wasn't, for four separate reasons.

### iTerm2 defaults Thin Strokes to Always

iTerm2 alone came out light. Thin Strokes defaults to `3` (Always), and with it on CoreText draws the strokes thinner. Chromium has no equivalent behaviour, so VSCode and Orca are untouched by it. Setting it to `0` (Never) lines it up.

### Orca puts font-smoothing on body

Orca's bundled CSS sets `-webkit-font-smoothing: antialiased` on `body`. VSCode doesn't. On macOS Chromium that property is the switch from subpixel AA to grayscale AA, and the same face comes out lighter under it.

Overriding the CSS looked like the fix. Hunting for a way to inject styles from a plugin, I found `injectCSS` in the bundle — it turned out to be a TipTap editor internal, not a plugin API. What a plugin manifest's `contributes` accepts is keybindings, panels, vmRecipes, agents and languagePacks. There is nowhere to put CSS.

So the compensation went into the font instead. One step up on the weight and Orca's 500 (stem 199) reads the same as 400 (stem 172) everywhere else. The 27-unit grid earned its keep here.

### Chromium caches the family it saw at launch

I installed the new faces, changed the weight in Orca, and got 400 and 500 looking identical with a sudden jump at 600. I assumed I'd built the font wrong.

It was the CSS weight matching rules. With only 400 and 700 in a family, 500 resolves down to 400 and anything 600 or above resolves up to 700 — which means the family Orca was looking at had none of the new intermediate weights in it. Chromium caches the family composition from launch, so until it restarts the new faces may as well not exist.

Flipping that symptom from "the font is wrong" to "the app hasn't seen the font yet" was the turn. Until then I was rebuilding the font.

### iTerm2 doesn't find bold through usWeightClass

When I first generated the twelve faces, every non-italic one got `fsSelection = 0x40` and `macStyle = 0`. `usWeightClass` was correct, 400 through 900. VSCode and Orca were fine; only iTerm2 got bold wrong.

iTerm2 picks a font by PostScript name and handles bold with a single "Use Bold Font" toggle. Finding the heavier face is left to CoreText style linking, and that reads the bold bits in `fsSelection` and `macStyle`, not `usWeightClass`. Stamping REGULAR onto every face is what cost 700 its bold bit.

The end state: Bold alone carries `fsSelection = 0x0020` / `macStyle = 0x01`, BoldItalic alone `0x0021` / `0x03`. The rest carry REGULAR or ITALIC.

## Edits to a running app's config file get reverted

Writing `apply.py` to keep the settings in code, I hit the same wall in two apps.

iTerm2, when it uses a custom prefs folder, writes its in-memory state over the file on exit. I tried patching the plist three times; the mtime changed and the contents didn't, and no backup file appeared either. Giving up on the disk, I drove the running app over its Python API instead.

```python
for partial in await iterm2.PartialProfile.async_query(connection):
    profile = await partial.async_get_full_profile()
    diff = {k: v for k, v in wanted.items() if profile._simple_get(k) != v}
    for key, value in diff.items():
        await profile._async_simple_set(key, value)
```

Keys the public API doesn't expose — `Thin Strokes`, `Special Font Config` — go through `_simple_get` and `_async_simple_set` directly. Which is why `apply.py` does nothing for iTerm2 when the app is closed, and only prints what to do.

Orca is the mirror image. It rewrites `orca-data.json` from memory every few seconds. I wrote the values in, watched the file with a background watcher, and saw them revert. Orca's font input wraps whatever you type in quotes before it reaches CSS, so injecting a quote of your own lets you smuggle in a fallback chain. It does land in the CSS — and then the running app writes the value back and it's gone.

Orca can only be edited while it's closed, and closing it is cheap. Cmd+Q doesn't kill the agent sessions: the PTYs belong to a detached daemon (`daemon-entry.js`, ppid 1) and the app is a viewer that attaches and detaches. Quit, edit, relaunch actually works.

`apply.py --check` reports the whole state:

```text
$ python3 apply.py --check
[  ok] fonts: 12 faces installed
[  ok] vscode: already set
[  ok] iterm2: Default: already set
[  ok] iterm2: tmux: already set
[warn] orca: running - quit it and rerun, or set it by hand in Settings > Terminal
```

## The combination that matched

Matched by eye with all three side by side. Orca sits one step up.

| | Font | Size | Weight | Stem |
|---|---|---:|---:|---:|
| VSCode | `MenloCJK` | 14 | 400 | 172 |
| iTerm2 | `MenloCJK-Regular` | 14 | 400 | 172 |
| Orca | `MenloCJK` | 14 | 500 | 199 |

In iTerm2, turn off "Use a different font for non-ASCII text" and empty the Special Font Config. The fallback lives inside the font now, so there's no reason to use the second slot, and anything left in it wins first. Thin Strokes goes to Never.

## The build output can't be redistributed

| Source | License | Redistributable |
|---|---|---|
| Menlo | Apple proprietary (bundled with macOS) | No |
| UDEV Gothic NF | SIL OFL 1.1 | Yes |
| D2Coding | SIL OFL 1.1 | Yes |

With Menlo in the mix the result stays on my own Mac. That's why the repository has the scripts and no `.ttf` — everyone builds it themselves.

For a redistributable variant, swap Menlo out of `prep.py` for MesloLGS NF. It's Apache-2.0, it's a Menlo clone, and its advance is the same 1233, so the grid worked out above survives the swap.

## Still open

Orca's 500 isn't a calculated value. It's what matched by eye with the three windows next to each other. If Orca ever drops `-webkit-font-smoothing`, that compensation becomes wrong. Given a way to touch CSS from a plugin, the right move is to delete the font-side compensation and turn the smoothing off directly.
