#!/bin/bash
# Audits dependency licenses via license-checker-rseidelsohn.
# Blocks strong-copyleft licenses (GPL/AGPL/LGPL/SSPL) from landing as dependencies.
# Run locally to preview findings before pushing: ./scripts/check-licences.sh

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

# Base allowlist — always-safe permissive licenses.
ALLOWED_LICENSES='MIT;ISC;BSD-2-Clause;BSD-3-Clause;Apache-2.0'

# Packages under legitimately permissive/public-domain licenses outside the
# base allowlist, each with a one-line justification. A NEW package under a
# non-base license still fails CI until reviewed and added here — this is a
# documented per-package allowlist, not a broadened license-type allowlist.
EXCLUDED_PACKAGES=(
  '@fontsource-variable/fredoka@5.2.10'             # OFL-1.1 — SIL Open Font License, commercial use allowed, no share-alike on the app
  '@fontsource-variable/geist@5.2.9'                # OFL-1.1 — same as above
  '@fontsource-variable/nunito@5.2.7'               # OFL-1.1 — same as above
  'isexe@3.1.5'                                     # BlueOak-1.0.0 — OSI-recognized permissive, equivalent to MIT/BSD
  'lru-cache@11.5.1'                                # BlueOak-1.0.0 — same as above
  'minimatch@10.2.5'                                # BlueOak-1.0.0 — same as above
  '@csstools/color-helpers@6.1.0'                   # MIT-0 — MIT without attribution requirement
  '@csstools/css-syntax-patches-for-csstree@1.1.6'  # MIT-0 — same as above
  'language-subtag-registry@0.3.23'                 # CC0-1.0 — public domain dedication
  'mdn-data@2.27.1'                                 # CC0-1.0 — public domain dedication
  'type-fest@0.21.3'                                # (MIT OR CC0-1.0) — dual-licensed, either permissive
  'type-fest@5.7.0'                                 # (MIT OR CC0-1.0) — same as above
  'tslib@2.8.1'                                     # 0BSD — zero-clause BSD, more permissive than BSD-2-Clause
  'isbot@5.2.1'                                     # Unlicense — public domain dedication
  'argparse@2.0.1'                                  # Python-2.0 — permissive, OSI-approved
  'caniuse-lite@1.0.30001800'                       # CC-BY-4.0 — attribution-only, browser compat data not code
  'axe-core@4.12.1'                                 # MPL-2.0 — weak/file-level copyleft; we don't modify its source, no obligation triggered
  'lightningcss@1.32.0'                             # MPL-2.0 — same reasoning as above
)

# Join array elements into a semicolon-separated string for --excludePackages.
# Verified empirically: bash strips each element's trailing `# comment` at
# parse time (since `#` starts a comment from that point to end-of-line
# within the array literal), so the array itself already holds only the
# 'pkg@version' values — no comment text ends up in the joined string.
EXCLUDED_PACKAGES_LIST=$(IFS=';'; echo "${EXCLUDED_PACKAGES[*]}")

pnpm dlx license-checker-rseidelsohn@5.0.1 \
  --onlyAllow "$ALLOWED_LICENSES" \
  --excludePackages "$EXCLUDED_PACKAGES_LIST" \
  --excludePrivatePackages \
  --summary
