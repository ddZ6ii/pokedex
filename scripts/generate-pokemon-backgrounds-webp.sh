#!/bin/bash
# Converts any public/pokemon-backgrounds/*.png into lossy WebP. Requires
# cwebp (`brew install webp`).
#
# Source PNGs aren't kept in this repo — public/ is shipped verbatim to
# production (Docker COPYs it wholesale, Vite copies it to dist/ as-is), and
# the app only ever requests the .webp files, so keeping unused source PNGs
# there would just be dead weight in the deployed image. To add or update a
# background: drop the source PNG into public/pokemon-backgrounds/, run this
# script, then delete the PNG once its .webp counterpart looks right.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

BACKGROUNDS_DIR="public/pokemon-backgrounds"

# q=90, not -lossless: unlike the flat-color type icon sprite, these are
# gradient/textured card-art backgrounds — exactly the content type where
# lossless PNG wastes the most space and lossy WebP wins big. q=90 was
# visually verified indistinguishable from the source PNG (including at the
# alpha-channel rounded corners, checked at full resolution) while cutting
# ~85-90% off file size; these are rendered even smaller in the app
# (`background-size: contain` on a ~312px-wide card), so any residual
# difference is less visible still.
for png in "$BACKGROUNDS_DIR"/*.png; do
  webp="${png%.png}.webp"
  cwebp -q 90 -quiet "$png" -o "$webp"
done

echo "Converted $(ls "$BACKGROUNDS_DIR"/*.webp | wc -l | tr -d ' ') backgrounds to WebP"
