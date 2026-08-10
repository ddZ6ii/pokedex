FROM node:24-alpine3.22

# Upgrade all Alpine packages to their latest patched versions to fix OS-level CVEs
RUN apk upgrade --no-cache

WORKDIR /app
# Strip npm/npx/corepack/yarn after install — Trivy flags several HIGH/CRITICAL
# CVEs in npm's own vendored dependencies (brace-expansion, ip-address,
# sigstore, tar, undici — bundled with the base image's npm install, not
# json-server's own dependency tree). None of these are needed at runtime:
# the container only serves json-server, never invokes a package manager
# itself after this build step. This also removes corepack's and yarn's
# lib trees (the base image ships a fully functional Yarn 1.22.22 install
# under /opt, symlinked from /usr/local/bin/yarn and yarnpkg).
RUN npm install --no-save json-server@1.0.0-beta.15 \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/lib/node_modules/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-v1.22.22
COPY src/data/db.json ./db.json

EXPOSE 3000

ARG VERSION=unknown
ARG REVISION=unknown
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.revision="${REVISION}"

# npx is gone (stripped above) — invoke json-server's bin script directly via node.
CMD ["node", "node_modules/json-server/lib/bin.js", "db.json", "--port", "3000", "--host", "0.0.0.0"]
