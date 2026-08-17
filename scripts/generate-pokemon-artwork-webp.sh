#!/bin/bash
# Downloads official-artwork PNGs from the PokeAPI sprites repo for every
# pokemon in src/data/db.json and converts them to lossy WebP under
# public/pokemon-artwork/. Requires cwebp (`brew install webp`) and curl.
#
# Self-hosting these (instead of hotlinking raw.githubusercontent.com at
# runtime, see git history of src/features/pokemons/hooks/usePokemonImage.ts)
# fixes two Lighthouse audits at once: the GitHub-hosted PNGs have a short
# cache TTL we don't control, and aren't WebP. public/ is shipped verbatim to
# production and picked up by the existing nginx `expires 1y, immutable`
# rule, so no server/infra changes are needed.
#
# Re-run this whenever src/data/db.json's pokemon set changes.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

DB_FILE="src/data/db.json"
ARTWORK_DIR="public/pokemon-artwork"
SOURCE_BASE="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

mkdir -p "$ARTWORK_DIR"

ids=$(node -e "console.log(require('./$DB_FILE').pokemons.map((p) => p.id).join('\n'))")

count=0
for id in $ids; do
  webp="$ARTWORK_DIR/$id.webp"
  [ -f "$webp" ] && continue

  tmp_png="$(mktemp).png"
  curl -sL -o "$tmp_png" "$SOURCE_BASE/$id.png"
  cwebp -q 90 -quiet "$tmp_png" -o "$webp"
  rm -f "$tmp_png"
  count=$((count + 1))
done

echo "Generated $count new artwork WebP file(s) in $ARTWORK_DIR ($(ls "$ARTWORK_DIR"/*.webp | wc -l | tr -d ' ') total)"
