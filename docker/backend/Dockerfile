FROM node:24-alpine3.22

# Upgrade all Alpine packages to their latest patched versions to fix OS-level CVEs
RUN apk upgrade --no-cache

WORKDIR /app
RUN npm install --no-save json-server@1.0.0-beta.15
COPY src/data/db.json ./db.json

EXPOSE 3000

ARG VERSION=unknown
ARG REVISION=unknown
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.revision="${REVISION}"

CMD ["npx", "json-server", "db.json", "--port", "3000", "--host", "0.0.0.0"]
