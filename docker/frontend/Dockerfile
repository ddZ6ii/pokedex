# Stage 1: base
FROM node:24-alpine3.22 AS base

WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: build
FROM base AS builder

COPY vite.config.ts ./
COPY components.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY public public
COPY index.html ./
COPY src src
# Outputs to /app/dist
RUN pnpm run build:docker

# Stage 3: serve (production)
FROM nginx:1.28-alpine-slim AS prod

# Upgrade all Alpine packages, then fix nginx specifically: the official
# image pins an exact nginx=<version> in /etc/apk/world, so a plain
# `apk upgrade` silently skips nginx itself even when a patched version is
# available in Alpine's repos. The `-slim` base (switched from `-alpine`)
# already excludes 5 unused dynamic modules (acme/geoip/image-filter/njs/
# xslt — none referenced in nginx.conf) that would otherwise also need
# purging before nginx can be force-upgraded cleanly. Reinstalling the
# nginx package overwrites this image's customized main nginx.conf with
# Alpine's stock default (different `include` ordering, breaks our conf.d
# mount) — back it up and restore it around the fix.
RUN cp /etc/nginx/nginx.conf /tmp/nginx.conf.orig \
    && apk upgrade --no-cache \
    && apk add --no-cache --upgrade nginx \
    && cp /tmp/nginx.conf.orig /etc/nginx/nginx.conf \
    && rm /tmp/nginx.conf.orig

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

ARG VERSION=unknown
ARG REVISION=unknown
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.revision="${REVISION}"
