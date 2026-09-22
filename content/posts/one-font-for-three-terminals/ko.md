---
title: 터미널 세 개의 글자를 같게 만드는 데 걸린 것은 폰트가 아니었습니다
date: '2026-09-22'
summary: >-
  Menlo와 UDEV Gothic NF, D2Coding을 한 패밀리로 합치고 나서도 VSCode·iTerm2·Orca는
  같은 글자를 서로 다르게 그렸습니다. 막힌 지점은 전부 폰트 바깥, 앱의 렌더링 설정에 있었습니다.
lang: ko
tags:
  - fonts
  - terminal
  - macos
draft: true
---

VSCode와 iTerm2, Orca를 한 화면에 나란히 띄워 놓고 같은 파일을 열면 한글이 셋 다 다르게 보였습니다. 크기는 전부 14px로 맞춰 놨는데도 그랬습니다. 세 앱이 한글을 서로 다른 폰트에서 가져오고 있었기 때문입니다.

폰트 하나로 합치면 끝날 문제라고 봤습니다. 합치는 쪽은 실제로 스크립트 세 개로 끝났습니다. 문제는 그다음이었습니다. 세 앱에 같은 폰트를 물리고 같은 크기를 넣었는데도 여전히 다르게 보였고, 원인은 전부 폰트 파일 바깥에 있었습니다.

결과물은 [JeongJaeSoon/menlocjk](https://github.com/JeongJaeSoon/menlocjk)에 있습니다. 설치 절차는 저장소에 적어 뒀으니 여기서는 그 과정에서 알아낸 것만 남깁니다.

## 폴백 체인을 세 앱에 똑같이 넣는 방법이 없습니다

세 앱이 폰트 폴백을 다루는 방식이 전부 다릅니다.

| 앱 | 폴백 방식 |
|---|---|
| VSCode | CSS 폰트 목록. 개수 제한 없음 |
| iTerm2 | ASCII 폰트 / 비ASCII 폰트 2슬롯 + 코드포인트 범위 예외(Special Font Config) |
| Orca | 패밀리 한 개. 입력값을 통째로 따옴표로 감싸 CSS에 넣음 |

`Menlo, UDEV Gothic NF, D2Coding`이라는 체인을 셋에 똑같이 적어 넣을 수가 없습니다. VSCode는 그대로 받고, iTerm2는 두 칸에 나눠 담아야 하고, Orca는 저 문자열 전체를 패밀리 이름 하나로 받습니다. 그래서 폴백을 앱 설정에서 빼고 폰트 파일 안으로 밀어 넣는 쪽을 택했습니다.

기성품으로는 Sarasa Term K 같은 선택지가 이미 있습니다. 직접 합친 이유는 쓰던 Menlo의 라틴 글자와 줄 간격을 그대로 두고 싶어서입니다.

## 합치는 쪽은 fontTools가 거의 다 해 줍니다

`prep.py`가 세 소스를 2048 upem으로 맞추고 `GSUB`, `GPOS`, `GDEF`, `DSIG`, `morx`, `kern`을 떼어 냅니다. 터미널은 셰이핑 기능을 요구하지 않으니 없어도 됩니다. D2Coding은 upem이 1000이라 `scaleUpem`으로 2048까지 올립니다.

`merge.py`가 그 셋을 하나로 붙입니다. cmap이 겹치면 앞 폰트가 이기므로 순서가 곧 우선순위입니다.

| 문자 | 출처 |
|---|---|
| 라틴·숫자·기호, 박스 드로잉, 블록 | Menlo |
| 가나·한자, Nerd Font 아이콘, Powerline | UDEV Gothic NF |
| 한글 음절·자모 | D2Coding |

D2Coding이 들어간 이유는 하나입니다. UDEV Gothic NF에 한글이 없습니다. 일본어와 아이콘까지는 UDEV 하나로 덮이는데 한글에서 구멍이 나서 소스가 셋이 됐습니다.

세로 메트릭은 Menlo 값으로 덮어씁니다. `hhea`의 `ascent`, `descent`, `lineGap`과 `OS/2`의 typo·win 메트릭을 Menlo에서 그대로 가져와야 줄 간격이 기존과 같습니다. advance는 손대지 않았습니다. `A`가 1233(0.602em), `가`와 `漢`이 2048이고, 나중에 만든 12개 페이스 전부 이 값이 같습니다. 폭을 건드리지 않으니 터미널 격자가 그대로 유지되고, 결과물이 원래의 폴백 체인과 같은 자리에 글자를 찍습니다.

합쳐진 폰트의 글리프는 54,587자입니다. 빌드는 제 맥에서 6.4분 걸립니다.

## 굵기는 27 단위 그리드 위에 다시 세웠습니다

처음 만든 웨이트 램프는 버렸습니다. 단계 간격이 제각각이었고, 600이 Menlo가 그린 Bold 자리에 있지 않았습니다. 화면에서 보면 어떤 구간은 차이가 안 보이고 어떤 구간은 확 뛰었습니다.

Menlo에 실제로 그려진 웨이트는 둘뿐이고 스템이 172와 227입니다. 차이가 55밖에 안 됩니다. 14px 화면에서 그 1/3은 구분되지 않아서, 눈에 실제로 보이는 최소 단위인 27을 한 칸으로 잡고 다시 짰습니다. 그러면 Menlo의 Bold가 600 자리에 떨어집니다. 172 + 2×27 = 226이고 원본이 227입니다.

| 웨이트 | 스템 | 출처 |
|---|---|---|
| 400 Regular | 172 | Menlo Regular 원본 |
| 500 Medium | 199 | 합성 |
| 600 SemiBold | 227 | Menlo Bold 원본 |
| 700 Bold | 254 | 합성 |
| 800 ExtraBold | 281 | 합성 |
| 900 Black | 308 | 합성 |

로만과 이탤릭 각 6종, 모두 12개 페이스입니다. 합성은 skia-pathops로 원본 아웃라인과 그것을 스트로크한 사본을 union해서 만듭니다. 스트로크 폭이 좌우 절반씩 스템에 더해지므로 폭 27짜리 스트로크가 스템을 정확히 27 올립니다. 페이스당 한두 자는 union이 실패하는데, 그 글리프는 원본 아웃라인을 그대로 둡니다.

macOS가 12개를 한 패밀리로 묶게 name ID 16(typographic family)과 17(subfamily)을 썼습니다.

대가가 하나 있습니다. 700은 더 이상 Menlo가 그린 Bold가 아니라 그보다 한 칸 굵은 합성입니다. 터미널의 ANSI 볼드는 700을 쓰니 볼드가 원본보다 굵어집니다. Orca와 VSCode에서는 볼드 웨이트를 600으로 내려 원본 Bold를 되찾을 수 있습니다(`Bold Font Weight`, `terminal.integrated.fontWeightBold`). iTerm2에는 그 설정이 없습니다. 볼드 페이스를 `fsSelection`의 bold 비트로 고르는데 그 비트는 700에만 있기 때문입니다. 세 앱을 같게 맞추는 게 목적이라면 700이 기본이고, 600은 나머지 둘에서만 쓸 수 있는 선택지입니다.

## 두 번 굵어진 글리프 1,412자

`embolden()`이 글리프 순서대로 돌면서 `glyf`를 제자리에서 갈아엎고 있었습니다. 합성 글리프는 그릴 때 컴포넌트를 `glyf`에서 실시간으로 꺼내 쓰는데, 컴포넌트가 순서상 먼저 나와 있으면 이미 굵어진 컴포넌트에 스트로크가 한 번 더 들어갑니다. `A`와 `Aacute`의 글리프 폭을 나란히 재면 그대로 보입니다.

| 페이스 | A | Aacute | 차이 |
|---|---:|---:|---:|
| Regular(원본) | 1159.0 | 1159.0 | 0.0 |
| Medium | 1185.8 | 1212.6 | +26.8 |
| Bold | 1193.5 | 1220.7 | +27.2 |
| Black | 1247.3 | 1327.7 | +80.4 |

차이가 그 페이스에 들어간 스트로크 폭과 같습니다. Medium은 한 칸(27), Black은 세 칸(81)을 통째로 한 번 더 먹었다는 뜻입니다. 해당하는 글리프는 1,412자, 엠볼딩이 들어가는 10개 페이스 전부에 있었습니다. `Agrave`, `Aacute`, `Adieresis` 같은 악센트 라틴과 `onehalf` 같은 분수 기호입니다. 한글 음절은 단순 컨투어라 무사했습니다.

변형에 들어가기 전에 아웃라인을 전부 스냅샷하도록 고쳤습니다. 다시 빌드하고 재니 로만 6종은 차이가 전부 0.0입니다. 이탤릭에 남는 42와 88은 기울어진 악센트가 원래 바운딩 박스를 넓히는 값이고, 같은 베이스 안에서 일정해서(400·500이 42, 600~900이 88) 이중 스트로크가 아닙니다.

이건 제가 못 찾았습니다. 14px 터미널에서 `Aacute`를 마주칠 일이 없고, 마주쳤어도 알아봤을 것 같지 않습니다. 화면이 아니라 코드를 읽은 Codex 리뷰가 잡아냈습니다([menlocjk#1](https://github.com/JeongJaeSoon/menlocjk/pull/1)).

## 같은 폰트를 물렸는데 세 앱이 다르게 그렸습니다

여기부터가 시간을 쓴 지점입니다. 폰트는 하나인데 세 앱의 결과가 달랐고, 네 가지 이유가 따로 있었습니다.

### iTerm2의 Thin Strokes 기본값이 Always입니다

iTerm2만 유독 가늘게 나왔습니다. Thin Strokes의 기본값이 `3`(Always)이고, 이 설정이 켜져 있으면 CoreText가 획을 얇게 그립니다. Chromium에는 대응하는 동작이 없어서 VSCode와 Orca는 영향을 받지 않습니다. `0`(Never)으로 끄면 맞습니다.

### Orca는 body에 font-smoothing을 겁니다

Orca는 번들 CSS의 `body`에 `-webkit-font-smoothing: antialiased`를 겁니다. VSCode에는 없습니다. macOS Chromium에서 이 속성은 subpixel AA를 grayscale AA로 바꾸는 스위치라, 같은 페이스가 더 얇게 그려집니다.

CSS를 덮어쓰면 될 일로 보였습니다. 플러그인으로 스타일을 주입할 방법을 찾다가 번들에서 `injectCSS`를 발견했는데, TipTap 에디터의 내부 메서드였고 플러그인 API가 아니었습니다. 플러그인 매니페스트의 `contributes`가 받는 건 keybindings, panels, vmRecipes, agents, languagePacks뿐입니다. CSS를 넣을 자리가 없습니다.

그래서 폰트 쪽에서 상쇄했습니다. 웨이트를 정확히 한 칸 올리면 Orca의 500(스템 199)이 다른 앱의 400(스템 172)과 같은 굵기로 보입니다. 27 그리드를 만들어 둔 덕을 여기서 봤습니다.

### Chromium은 시작 시점의 패밀리 구성을 캐싱합니다

새 페이스를 설치하고 Orca에서 웨이트를 바꿨는데, 400과 500이 똑같이 나오고 600에서 갑자기 확 굵어졌습니다. 폰트를 잘못 만든 줄 알았습니다.

CSS 웨이트 매칭 규칙 때문이었습니다. 패밀리에 400과 700만 있으면 500은 400으로 내려가고 600 이상은 700으로 올라갑니다. Orca가 보고 있던 패밀리에 새로 만든 중간 웨이트가 없었다는 뜻입니다. Chromium이 시작 시점의 패밀리 구성을 캐싱해서, 재시작 전까지는 새 페이스가 없는 것과 같습니다.

이 증상을 "폰트가 이상하다"에서 "앱이 폰트를 아직 못 봤다"로 뒤집은 게 결정적이었습니다. 그 전까지는 폰트를 다시 빌드하고 있었습니다.

### iTerm2는 볼드를 usWeightClass로 찾지 않습니다

12개 페이스를 처음 생성할 때 이탤릭이 아닌 페이스에 전부 `fsSelection = 0x40`, `macStyle = 0`을 박았습니다. `usWeightClass`는 400부터 900까지 제대로 들어가 있었습니다. VSCode와 Orca는 멀쩡했는데 iTerm2에서만 볼드가 이상하게 나왔습니다.

iTerm2는 폰트를 PostScript 이름으로 고르고 볼드는 "Use Bold Font" 토글 하나로 처리합니다. 실제 굵은 페이스를 찾는 일은 CoreText의 스타일 링크가 하는데, 그건 `usWeightClass`가 아니라 `fsSelection`과 `macStyle`의 bold 비트를 봅니다. 모든 페이스에 REGULAR 비트를 박아 놨으니 700이 bold 비트를 잃은 겁니다.

최종 상태는 Bold만 `fsSelection = 0x0020` / `macStyle = 0x01`, BoldItalic만 `0x0021` / `0x03`입니다. 나머지는 REGULAR나 ITALIC 비트를 답니다.

## 실행 중인 앱의 설정 파일은 고쳐도 되돌아갑니다

설정을 코드로 남기려고 `apply.py`를 쓰다가 두 앱에서 같은 벽을 만났습니다.

iTerm2는 custom prefs folder를 쓰면 종료하면서 메모리 상태를 파일 위에 덮어씁니다. plist를 고치는 시도를 세 번 했는데 mtime만 바뀌고 내용은 그대로였습니다. 백업 파일도 생기지 않았습니다. 결국 디스크를 포기하고 실행 중인 앱을 Python API로 직접 조종했습니다.

```python
for partial in await iterm2.PartialProfile.async_query(connection):
    profile = await partial.async_get_full_profile()
    diff = {k: v for k, v in wanted.items() if profile._simple_get(k) != v}
    for key, value in diff.items():
        await profile._async_simple_set(key, value)
```

`Thin Strokes`나 `Special Font Config`처럼 공개 API에 노출되지 않은 키는 `_simple_get`과 `_async_simple_set`으로 직접 다룹니다. 그래서 `apply.py`의 iTerm2 경로는 앱이 꺼져 있으면 아무것도 하지 않고 안내만 합니다.

Orca는 반대입니다. `orca-data.json`을 몇 초마다 메모리 상태로 덮어씁니다. 파일에 값을 써 넣고 백그라운드 워처로 지켜봤더니 값이 되돌아가는 게 그대로 보였습니다. Orca 폰트 입력창은 입력값을 통째로 따옴표로 감싸 CSS에 넣으므로, 따옴표를 끼워 넣으면 폴백 체인을 주입할 수 있습니다. CSS에는 실제로 들어갔지만 실행 중인 앱이 값을 되돌려서 남지 않았습니다.

Orca는 꺼져 있을 때만 고칠 수 있는데, 끄는 비용이 낮습니다. Cmd+Q를 해도 에이전트 세션은 죽지 않습니다. PTY는 분리된 데몬(`daemon-entry.js`, ppid 1)이 들고 있고 앱은 붙었다 떨어지는 뷰어입니다. 껐다 고치고 켜는 게 실제로 가능합니다.

`apply.py --check`는 이 상태를 그대로 보고합니다.

```text
$ python3 apply.py --check
[  ok] fonts: 12 faces installed
[  ok] vscode: already set
[  ok] iterm2: Default: already set
[  ok] iterm2: tmux: already set
[warn] orca: running - quit it and rerun, or set it by hand in Settings > Terminal
```

## 맞아떨어진 조합

세 앱을 나란히 놓고 눈으로 맞춘 결과입니다. Orca만 한 칸 위입니다.

| | 폰트 | 크기 | 웨이트 | 스템 |
|---|---|---:|---:|---:|
| VSCode | `MenloCJK` | 14 | 400 | 172 |
| iTerm2 | `MenloCJK-Regular` | 14 | 400 | 172 |
| Orca | `MenloCJK` | 14 | 500 | 199 |

iTerm2에서는 "Use a different font for non-ASCII text"를 끄고 Special Font Config를 비웁니다. 폴백이 폰트 안으로 들어갔으니 비ASCII 슬롯과 범위 예외를 쓸 이유가 없습니다. Thin Strokes는 Never입니다.

## 빌드 결과물은 배포할 수 없습니다

| 소스 | 라이선스 | 재배포 |
|---|---|---|
| Menlo | Apple 독점(macOS 번들) | 불가 |
| UDEV Gothic NF | SIL OFL 1.1 | 가능 |
| D2Coding | SIL OFL 1.1 | 가능 |

Menlo가 섞여 있는 한 결과물은 제 맥 안에서만 씁니다. 저장소에 스크립트만 있고 `.ttf`가 없는 이유입니다. 각자 자기 맥에서 빌드해야 합니다.

배포 가능한 변형을 원하면 `prep.py`의 Menlo 자리를 MesloLGS NF로 바꾸면 됩니다. Apache-2.0이고 Menlo 클론이라 advance가 1233으로 같아서, 위에서 맞춰 놓은 격자가 그대로 유지됩니다.

## 아직 안 풀린 것

Orca의 500은 계산해서 나온 값이 아니라 세 앱을 나란히 놓고 눈으로 맞춘 값입니다. Orca가 `-webkit-font-smoothing`을 언젠가 걷어내면 이 보정은 틀린 값이 됩니다. 플러그인에서 CSS를 건드릴 방법이 생기면 폰트 쪽 보정을 지우고 스무딩을 직접 끄는 편이 맞습니다.
