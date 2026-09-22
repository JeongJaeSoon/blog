---
title: ターミナル3つの見た目を揃えるのに手こずったのはフォントではなかった
date: '2026-09-22'
summary: >-
  MenloとUDEV Gothic NF、D2Codingを1つのファミリーにまとめたあとも、VSCode・iTerm2・Orcaは
  同じ文字を別々に描きました。詰まった箇所はすべてフォントの外、アプリ側のレンダリング設定でした。
lang: ja
tags:
  - fonts
  - terminal
  - macos
draft: true
---

VSCodeとiTerm2、Orcaを並べて同じファイルを開くと、ハングルが3つとも違って見えました。サイズはどれも14pxに揃えてあります。それでも違うのは、3つのアプリがハングルをそれぞれ別のフォントから取ってきているからです。

フォントを1つにまとめれば片付く話だと思っていました。まとめる作業自体はスクリプト3本で終わりました。問題はその先です。同じフォントを同じサイズで指定しても3つの見た目は揃わず、原因はすべてフォントファイルの外にありました。

スクリプトは[JeongJaeSoon/menlocjk](https://github.com/JeongJaeSoon/menlocjk)に置いてあります。導入手順はそちらに書いたので、ここでは途中で分かったことだけ残します。

## フォールバックの指定を3つに共通化できない

3つのアプリはフォントフォールバックの扱いがそれぞれ違います。

| アプリ | フォールバックの方式 |
|---|---|
| VSCode | CSSのフォントリスト。個数の制限なし |
| iTerm2 | ASCIIフォントと非ASCIIフォントの2枠、加えてコードポイント範囲の例外指定（Special Font Config） |
| Orca | ファミリー1つ。入力値をそのまま引用符で囲んでCSSに入れる |

`Menlo, UDEV Gothic NF, D2Coding`というチェーンを3つに同じように書く手はありません。VSCodeはそのまま受け取り、iTerm2は2枠に分けて入れる必要があり、Orcaはこの文字列全体を1つのファミリー名として扱います。そこでフォールバックをアプリ設定から外し、フォントファイルの中に押し込むことにしました。

既製品ならSarasa Term Kなどの選択肢があります。それでも自分で合成したのは、使い慣れたMenloのラテン文字と行間をそのまま残したかったからです。

## 合成の部分はfontToolsがほぼやってくれる

`prep.py`が3つのソースを2048 upemに揃え、`GSUB`・`GPOS`・`GDEF`・`DSIG`・`morx`・`kern`を落とします。ターミナルはシェーピング機能を要求しないので、なくても困りません。D2Codingはupemが1000なので、`scaleUpem`で2048まで上げます。

`merge.py`がその3つを1つに結合します。cmapが衝突したときは先頭のフォントが勝つので、並び順がそのまま優先順位です。

| 文字 | 出典 |
|---|---|
| ラテン文字・数字・記号、罫線、ブロック | Menlo |
| かな・漢字、Nerd Fontアイコン、Powerline | UDEV Gothic NF |
| ハングルの音節・字母 | D2Coding |

D2Codingが入っている理由は1つです。UDEV Gothic NFにハングルがありません。日本語とアイコンはUDEV 1つで埋まるのに、ハングルだけ穴が開いてソースが3つになりました。

縦方向のメトリクスはMenloの値で上書きします。`hhea`の`ascent`・`descent`・`lineGap`と、`OS/2`のtypo系・win系メトリクスをMenloから持ってこないと行間がずれます。advanceには手を付けていません。`A`が1233（0.602em）、`가`と`漢`が2048で、あとから作った12フェイスすべてこの値が同じです。幅を触らないのでターミナルのグリッドは変わらず、元のフォールバックチェーンと同じ位置に文字が落ちます。

合成後のグリフは54,587字です。ビルドは手元のMacで6分ほどでしたが、これはきちんと計測した数字ではなく体感です。

## ウェイトは27単位のグリッドに組み直した

最初に作ったウェイトのランプは捨てました。段の間隔がばらばらで、600がMenloの描いたBoldの位置に来ていません。画面で見ると、差の見えない区間と急に飛ぶ区間ができます。

Menloに実際に描かれているウェイトは2つだけで、ステムが172と227。差は55しかありません。14pxの画面でその1/3は見分けられないので、実際に差が見える最小の単位である27を1段と決めて組み直しました。するとMenloのBoldがちょうど600に落ちます。172 + 2×27 = 226で、元が227です。

| ウェイト | ステム | 出典 |
|---|---|---|
| 400 Regular | 172 | Menlo Regularの原本 |
| 500 Medium | 199 | 合成 |
| 600 SemiBold | 227 | Menlo Boldの原本 |
| 700 Bold | 254 | 合成 |
| 800 ExtraBold | 281 | 合成 |
| 900 Black | 308 | 合成 |

ローマン体とイタリック体が各6種、合わせて12フェイスです。合成のほうはskia-pathopsで、元のアウトラインとそれをストロークした複製をunionして作ります。ストローク幅が左右に半分ずつステムへ加わるので、幅27のストロークでステムがちょうど27上がります。1フェイスあたり1〜2字はunionが失敗するので、そのグリフは元のアウトラインのままにしてあります。

12個をmacOSに1ファミリーとして扱わせるため、name ID 16（typographic family）と17（subfamily）を使いました。

代償が1つあります。700はもうMenloが描いたBoldではなく、それより1段太い合成です。ターミナルのANSIボールドは既定で700を使うので、ボールドが原本より太くなります。描かれたBoldをボールドに使いたければ、アプリ側のボールドウェイトを600に下げれば戻ります。Orcaは`Bold Font Weight`、VSCodeは`terminal.integrated.fontWeightBold`です。

## 同じフォントを指定しても3つの描画が揃わない

時間を使ったのはここからです。フォントは1つなのに3つの結果が違い、理由が4つ別々にありました。

### iTerm2のThin Strokesの既定値がAlways

iTerm2だけが細く出ていました。Thin Strokesの既定値が`3`（Always）で、これが有効だとCoreTextが線を細く描くのに対し、Chromiumには対応する挙動がないのでVSCodeとOrcaは影響を受けません。`0`（Never）で切ると揃います。

### Orcaはbodyにfont-smoothingをかけている

Orcaはバンドルされたcssの`body`に`-webkit-font-smoothing: antialiased`をかけています。VSCodeにはありません。macOSのChromiumでこの指定はサブピクセルAAをグレースケールAAに切り替えるスイッチなので、同じフェイスが細く描かれます。

CSSを上書きすれば済む話に見えました。プラグインからスタイルを差し込む方法を探してバンドル内に`injectCSS`を見つけたものの、TipTapエディタの内部メソッドでプラグインAPIではありませんでした。プラグインマニフェストの`contributes`が受け取るのはkeybindings、panels、vmRecipes、agents、languagePacksだけです。CSSを置く場所がありません。

そこでフォント側で相殺しました。ウェイトをちょうど1段上げると、Orcaの500（ステム199）が他のアプリの400（ステム172）と同じ太さに見えます。27のグリッドを作っておいたのがここで効きました。

### Chromiumは起動時点のファミリー構成をキャッシュする

新しいフェイスを入れてOrcaでウェイトを変えたところ、400と500が同じに見え、600で急に太くなりました。フォントの作りを間違えたと思いました。

CSSのウェイトマッチングの規則が理由です。ファミリーに400と700しかなければ、500は400へ下がり、600以上は700へ上がります。つまりOrcaが見ていたファミリーには、新しく作った中間のウェイトが入っていませんでした。Chromiumが起動時点のファミリー構成をキャッシュするので、再起動するまで新しいフェイスは存在しないのと同じです。

この症状を「フォントがおかしい」から「アプリがまだフォントを見ていない」に裏返したのが決め手でした。それまではフォントを作り直していました。

### iTerm2はボールドをusWeightClassで探さない

12フェイスを最初に生成したとき、イタリックでないフェイスすべてに`fsSelection = 0x40`と`macStyle = 0`を書き込んでいました。`usWeightClass`のほうは400から900まで正しく入っています。VSCodeとOrcaは問題なく、iTerm2だけボールドがおかしくなりました。

iTerm2はフォントをPostScript名で選び、ボールドは「Use Bold Font」のトグル1つで処理します。太いフェイスを実際に探すのはCoreTextのスタイルリンクで、こちらが見るのは`usWeightClass`ではなく`fsSelection`と`macStyle`のboldビットです。全フェイスにREGULARのビットを立てたせいで、700がboldビットを失っていました。

最終的な状態は、Boldだけが`fsSelection = 0x0020` / `macStyle = 0x01`、BoldItalicだけが`0x0021` / `0x03`です。残りはREGULARかITALICのビットを持ちます。

## 起動中のアプリは設定ファイルを直しても戻される

設定をコードに残そうと`apply.py`を書いていて、2つのアプリで同じ壁に当たりました。

iTerm2はcustom prefs folderを使っていると、終了する際にメモリ上の状態をファイルへ上書きします。plistを直す試みを3回しましたが、mtimeが変わるだけで中身はそのままでした。バックアップファイルもできません。ディスク側を諦め、起動中のアプリをPython APIで直接操作することにしました。

```python
for partial in await iterm2.PartialProfile.async_query(connection):
    profile = await partial.async_get_full_profile()
    diff = {k: v for k, v in wanted.items() if profile._simple_get(k) != v}
    for key, value in diff.items():
        await profile._async_simple_set(key, value)
```

`Thin Strokes`や`Special Font Config`のように公開APIに出ていないキーは、`_simple_get`と`_async_simple_set`で直に触ります。`apply.py`のiTerm2側がアプリの起動を前提にしているのはこれが理由です。起動していなければ何もせず、案内だけ出します。

Orcaは逆です。`orca-data.json`を数秒おきにメモリ上の状態で上書きします。ファイルに値を書き込んでバックグラウンドのウォッチャーで見ていたら、値が戻っていくのがそのまま見えました。Orcaのフォント入力欄は入力値を丸ごと引用符で囲んでCSSに入れるので、引用符を仕込めばフォールバックチェーンを注入できます。CSSには確かに入りましたが、起動中のアプリが値を戻すので残りません。

Orcaは終了しているときしか直せないものの、落とす代償は小さいです。Cmd+Qしてもエージェントのセッションは死にません。PTYは切り離されたデーモン（`daemon-entry.js`、ppid 1）が握っていて、アプリはそこに繋いだり外れたりするビューアです。落として直して起動し直す手が実際に使えます。

`apply.py --check`はこの状態をそのまま報告します。

```text
$ python3 apply.py --check
[  ok] fonts: 12 faces installed
[  ok] vscode: already set
[  ok] iterm2: Default: already set
[  ok] iterm2: tmux: already set
[warn] orca: running - quit it and rerun, or set it by hand in Settings > Terminal
```

## 揃った組み合わせ

3つを並べて目で合わせた結果です。Orcaだけ1段上になります。

| | フォント | サイズ | ウェイト | ステム |
|---|---|---:|---:|---:|
| VSCode | `MenloCJK` | 14 | 400 | 172 |
| iTerm2 | `MenloCJK-Regular` | 14 | 400 | 172 |
| Orca | `MenloCJK` | 14 | 500 | 199 |

iTerm2では「Use a different font for non-ASCII text」を切り、Special Font Configを空にします。フォールバックはフォントの中に入ったので、非ASCIIの枠も範囲の例外指定も出番がありません。Thin StrokesはNeverです。

## ビルド結果は配布できない

| ソース | ライセンス | 再配布 |
|---|---|---|
| Menlo | Appleの独占（macOSにバンドル） | 不可 |
| UDEV Gothic NF | SIL OFL 1.1 | 可 |
| D2Coding | SIL OFL 1.1 | 可 |

Menloが混ざっている限り、成果物は自分のMacの中だけで使います。リポジトリにスクリプトだけあって`.ttf`がないのはそのためで、各自が手元でビルドします。

配布できる派生が欲しければ、`prep.py`のMenloの位置をMesloLGS NFに替えれば済みます。Apache-2.0でMenloのクローン、advanceも同じ1233なので、ここまで合わせたグリッドはそのまま残ります。

## まだ解けていないところ

Orcaの500は計算で出た値ではなく、3つのウィンドウを並べて目で合わせた値です。Orcaがいつか`-webkit-font-smoothing`を外せば、この補正は間違った値になります。プラグインからCSSを触る手段ができたら、フォント側の補正を消してスムージングを直接切るほうが筋が通ります。
