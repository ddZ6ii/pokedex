#!/bin/bash
# Composites public/pokemon-types/*.png (one PNG per Pokémon type) into a
# single sprite sheet, then converts it to lossless WebP.
# Requires ImageMagick (`brew install imagemagick`) and cwebp
# (`brew install webp`). Re-run after adding/changing any source icon.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

TYPES_DIR="public/pokemon-types"
SPRITE_PNG="$TYPES_DIR/sprite.png"
SPRITE_WEBP="$TYPES_DIR/sprite.webp"

# Glob expansion is lexicographic, which already matches POKEMON_TYPES'
# alphabetical order in src/features/pokemons/schemas/pokemon.schema.ts —
# the frontend's sprite-index math (TypeIcon in pokemon-card.tsx) depends on
# this ordering staying in sync. Keep POKEMON_TYPES alphabetically sorted.
#
# +append lays the images out in a single row with no font/label rendering
# involved (unlike `montage`, which tries to render a per-tile filename
# label by default and fails if no system font is found for it).
magick "$TYPES_DIR"/*.png -background none +append "$SPRITE_PNG"

# -lossless: these are icons with hard edges and transparency, not photos —
# lossy WebP can introduce visible artifacts on edges and haloing around
# transparent regions. Lossless WebP still typically beats PNG's compression
# while staying pixel-perfect.
cwebp -lossless "$SPRITE_PNG" -o "$SPRITE_WEBP"

rm "$SPRITE_PNG" # intermediate only — the app references sprite.webp

echo "Generated $SPRITE_WEBP"
