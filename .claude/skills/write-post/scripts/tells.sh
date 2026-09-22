#!/usr/bin/env bash
# Grep for the mechanical AI-tone tells in en.md and ko.md.
# Japanese goes through the humanize-japanese skill instead.
#
#   tells.sh content/posts/<slug>          # both languages
#   tells.sh content/posts/<slug>/en.md    # one file
set -uo pipefail

if [ $# -eq 0 ]; then
  echo "usage: $0 <post-dir|file>..." >&2
  exit 2
fi

EN='In this post|In this article|Let'"'"'s (dive|take a look|explore)|It'"'"'s (important|worth) (to note|noting|mentioning)'
EN="$EN"'|powerful tool|game changer|seamless|robust|cutting-edge|delve|unpack'
EN="$EN"'|\b(simply|just|easily|effortlessly)\b|\b(leverage|utilize)\b'
EN="$EN"'|Whether you'"'"'re|Not only .* but also|In conclusion|To sum up|At the end of the day'
EN="$EN"'|might potentially|can be (beneficial|useful|helpful)'

KO='이 글에서는|본 글에서는|알아보겠습니다|살펴보겠습니다|알아봅시다|소개하겠습니다'
KO="$KO"'|중요합니다|하는 것이 좋습니다|바람직합니다|권장됩니다'
KO="$KO"'|효율적으로|적절히|손쉽게|간편하게|다양한|여러 가지'
KO="$KO"'|라고 할 수 있습니다|인 것 같습니다|하지 않을까요'
# Translationese ("~을 통해", "~에 의해") is left to voice.md - too many
# legitimate uses to grep for without crying wolf.
KO="$KO"'|정리하자면|결론적으로|마무리하며'

status=0

scan() {
  local file=$1 pattern=$2
  [ -f "$file" ] || return 0
  local hits
  hits=$(grep -nEi "$pattern" "$file") || return 0
  echo "== $file"
  echo "$hits"
  echo
  status=1
}

for target in "$@"; do
  if [ -d "$target" ]; then
    scan "$target/en.md" "$EN"
    scan "$target/ko.md" "$KO"
  else
    case "$target" in
      *ko.md) scan "$target" "$KO" ;;
      *en.md) scan "$target" "$EN" ;;
      *ja.md) echo "skip $target - use the humanize-japanese skill" ;;
      *) echo "skip $target - not en.md or ko.md" ;;
    esac
  fi
done

[ $status -eq 0 ] && echo "no mechanical tells found"
exit $status
