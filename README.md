# Pokemons

A Pokémon browser built with React 19 and a local JSON API — browse, filter, and sort a paginated Pokédex, drill into individual Pokémon detail pages, and switch between light/dark themes.

## Stack

| Tool                                                   | Version | Purpose                   |
| ------------------------------------------------------ | ------- | ------------------------- |
| [Vite](https://vite.dev)                               | 8       | Build tool & dev server   |
| [React](https://react.dev)                             | 19      | UI framework              |
| [TypeScript](https://www.typescriptlang.org)           | 5.9     | Type safety               |
| [TanStack Router](https://tanstack.com/router)         | 1       | File-based routing        |
| [TanStack Query](https://tanstack.com/query)           | 5       | Data fetching & caching   |
| [Tailwind CSS](https://tailwindcss.com)                | 4       | Utility-first styling     |
| [shadcn/ui](https://ui.shadcn.com)                     | —       | Component library         |
| [Zustand](https://zustand-demo.pmnd.rs)                | 5       | Client state (theme mode) |
| [Zod](https://zod.dev)                                 | 4       | Schema validation         |
| [json-server](https://github.com/typicode/json-server) | 1 beta  | Local REST API            |
| [Vitest](https://vitest.dev)                           | 4       | Unit testing              |

**Tooling:** ESLint (strict TypeScript + React rules), Prettier (with Tailwind class sorting), pnpm.

## Prerequisites

- Node.js 24+ (CI runs 24; see `.github/actions/setup-environment/action.yml`)
- [pnpm](https://pnpm.io) 11 — `npm install -g pnpm` (version pinned via `packageManager` in `package.json`)

## Getting Started

```bash
pnpm install

# Terminal 1 — start the JSON API (http://localhost:3000)
pnpm json-server

# Terminal 2 — start the dev server (proxies /api requests to the JSON API)
pnpm dev
```

## Contributing

- **Branches:** `dev` is staging, `main` is production (fast-forward only, no merge commits). Create short-lived branches off `dev` using `feat/`, `fix/`, `ci/`, `docs/`, `refactor/`, `perf/`, `test/`, `style/`, or `chore/` prefixes.
- **Workflow:** rebase your branch onto `dev`, open a PR, squash-merge. `dev` → `main` is promoted locally via `git merge --ff-only` — never through a GitHub PR merge.
- **Commits:** Must follow [Conventional Commits](https://www.conventionalcommits.org/) — run `pnpm commit` for an interactive wizard. Allowed types: `feat`, `fix`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `revert`. Git hooks (`commit-msg` and `pre-push`) enforce locally; `pre-push` re-validates to catch `--no-verify` bypasses.
- Details: [Branching Strategy](docs/github-branching-strategy.md) · [Linear History Workflow](docs/github-linear-history-workflow.md)

## CI/CD

### Workflows

```mermaid
flowchart TD
    FEAT["Push to any branch<br/>except dev"]
    PR["Pull request<br/>(any base branch)"]
    DEVPUSH["Push to dev"]
    MAINPUSH["Push to main<br/>(local ff-only merge)"]

    FEAT --> CI
    PR --> CI

    subgraph CI["ci.yml"]
        direction TB
        CQ["code-quality<br/>format:check + lint"] --> T["test"]
        AA["audit-actions<br/>zizmor"] --> T
        CL["check-licences<br/>license-checker-rseidelsohn"] --> T
        AD["audit-deps<br/>audit-ci"] --> T
        CQ --> B["build<br/>tsc -b + vite build"]
    end

    DEVPUSH --> STAGING

    subgraph STAGING["staging.yml"]
        direction TB
        SSHA["get-short-sha"]
        SCQ["code-quality<br/>(calls ci.yml)"]
        SSHA --> SSTEP["build-and-deploy"]
        SCQ --> SSTEP
        SSTEP --> SSCAN["scan<br/>Trivy"]
        SSCAN --> SPUSH["push pokedex:frontend-dev-&lt;sha&gt;<br/>pokedex:api-dev-&lt;sha&gt;"]
        SPUSH --> SHOOK["HMAC-signed curl<br/>→ staging webhook"]
    end
    SCQ -.-> CI
    SHOOK --> STAGEVPS[("VPS staging containers<br/>pull + up")]

    MAINPUSH --> RELEASE

    subgraph RELEASE["release.yml"]
        direction TB
        RCQ["code-quality<br/>(calls ci.yml)"] --> RREL["release<br/>semantic-release"]
        RREL --> RSTEP["build-and-push<br/>(conditional: released)"]
        RREL --> RSYNC["sync-dev<br/>(conditional: released)"]
        RSTEP --> RSCAN["scan<br/>Trivy"]
        RSCAN --> RPUSH["push pokedex:frontend-vX.Y.Z + frontend-latest<br/>pokedex:api-vX.Y.Z + api-latest"]
    end
    RCQ -.-> CI
    RSYNC -.-> DEVPUSH
    RPUSH --> MANUAL[["scripts/deploy-prod.sh<br/>(run manually)"]]
    MANUAL --> PRODVPS[("VPS production containers<br/>pull :latest + up")]
```

### Checking audit findings locally

`audit-actions` statically analyzes your workflow files for misconfigurations like script injection or excessive permissions, and blocks `test` on violations — since `staging.yml` and `release.yml` both call `ci.yml`, this also blocks staging deploys and release builds, not just PR merges. Preview zizmor's findings before pushing (requires [`uv`](https://docs.astral.sh/uv/) and the [GitHub CLI](https://cli.github.com/), authenticated via `gh auth login`):

```bash
GH_TOKEN=$(gh auth token) uvx zizmor --config zizmor.yml .
```

Passing a token enables the same "online audit" checks CI runs with (CI runs zizmor with `online-audits: true` and a GitHub token); without one, those checks are silently skipped and a local pass could still fail in CI.

`check-licences` validates dependencies against the license allowlist and blocks `test` on violations — since `staging.yml` and `release.yml` both call `ci.yml`, this also blocks staging deploys and release builds. Check locally with:

```bash
./scripts/check-licences.sh
```

See [`docs/check-licences.md`](docs/check-licences.md) for the full license policy, the current exceptions list, and how to add a new one.

`audit-deps` runs [`audit-ci`](https://github.com/IBM/audit-ci) against production dependencies and blocks `test` on high/critical severity vulnerabilities (CVSS ≥ 7.0) — since `staging.yml` and `release.yml` both call `ci.yml`, this also blocks staging deploys and release builds. Check locally with:

```bash
pnpm dlx audit-ci@7.1.0 --config .audit-ci.json
```

See [`docs/audit-deps.md`](docs/audit-deps.md) for the severity gate rationale, the allowlist workflow for known false positives, and how to fix a flagged vulnerability.

The `scan` step in `staging.yml`/`release.yml` runs [Trivy](https://github.com/aquasecurity/trivy) against the built frontend and backend Docker images and blocks the push to Docker Hub on high/critical severity vulnerabilities (CVSS ≥ 7.0 — Trivy's severity is vendor/distro-assigned rather than a strict CVSS-base-score cutoff, a reasonable approximation for consistency with the `audit-ci` gate above). Check a locally-built image with:

```bash
docker build -t pokedex-frontend:scan-test -f docker/frontend/Dockerfile .
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image \
  --db-repository="ghcr.io/aquasecurity/trivy-db:2" \
  --severity HIGH,CRITICAL --scanners vuln pokedex-frontend:scan-test
```

(`-v /var/run/docker.sock:...` and `--db-repository` are local-only workarounds — mounting the host Docker socket so Trivy can inspect the locally-built image, and bypassing the default GCR mirror which can fail with network errors in some environments — CI's `trivy-action` handles both automatically. This local command also uses the unpinned `aquasec/trivy` image, deliberately, for the freshest scanner/DB — CI stays pinned to `aquasecurity/trivy-action@v0.36.0` for supply-chain reproducibility.) See [`docs/audit-docker-images.md`](docs/audit-docker-images.md) for the full allowlist and fix workflow.

### Dependabot

[`.github/dependabot.yml`](.github/dependabot.yml) configures weekly Dependabot scans across `npm`/pnpm, Docker (frontend + backend + local smoke-test gateway images), and GitHub Actions dependencies. `npm`/`docker` are scoped to security-only via `open-pull-requests-limit: 0` + a `security-updates` group (there is no `security-updates-only` key — it doesn't exist in Dependabot's schema); `github-actions` keeps routine weekly bumps in addition to security grouping. The gateway coverage is for this repo's local `docker-compose.yml` only — the actually-deployed staging/production gateway lives in the separate `vps-infra` repo and needs its own Dependabot setup. See [`docs/audit-deps.md`](docs/audit-deps.md#dependabot) and [`docs/audit-github-actions.md`](docs/audit-github-actions.md#dependabot) for the full mechanism.

> ⚠️ **Outstanding manual step:** Dependabot alerts and Dependabot security updates must still be enabled by a human in **Settings → Code security**. Until that's done, `npm`/`docker` will open **zero** Dependabot PRs — routine updates are capped at `0` by this config, and security updates (the feature that would fill the gap) aren't switched on yet.

### Deploying to staging (automated)

Push to `dev`:

```bash
git push origin dev
```

`staging.yml` picks it up, runs the `ci.yml` checks, builds + pushes `pokedex:frontend-dev-<short-sha>` and `pokedex:api-dev-<short-sha>` to Docker Hub, and triggers the staging webhook — no manual step needed.

### Deploying to production (manual)

1. Promote `dev` → `main` locally via `git merge --ff-only` and push — see [Linear History Workflow](docs/github-linear-history-workflow.md#2-dev--main-local-fast-forward-only) for the exact commands.

   The push to `main` triggers `release.yml`. Its `release` job runs semantic-release, which determines the next version from commits since the last tag and — if warranted — bumps `package.json`, updates `CHANGELOG.md`, tags, and creates a GitHub Release. No manual tag needed. If a release was published, `build-and-push` then pushes `pokedex:frontend-vX.Y.Z` + `pokedex:frontend-latest` and `pokedex:api-vX.Y.Z` + `pokedex:api-latest` to Docker Hub, and `sync-dev` rebases `dev` onto `main` — none of this deploys anything.

2. Trigger the actual deploy yourself, from `scripts/`:

   ```bash
   scripts/deploy-prod.sh pokedex v1.2.3
   ```

   Requires `WEBHOOK_SECRET_POKEDEX_PROD` set in `scripts/.env` (gitignored — copy `scripts/.env.sample` and fill it in). The script HMAC-signs the request and pulls `frontend-latest`/`api-latest` on the VPS.

## Docker (local smoke test)

`docker-compose.yml` spins up the same three-container topology used in staging/production — `gateway` (nginx, routes `/` → `frontend`, `/api/*` → `backend`), `frontend` (nginx serving the built SPA), `backend` (json-server + baked-in `db.json`) — so you can validate the full request path locally before touching the VPS infra:

```bash
docker compose up --build -d

curl http://localhost:8000/                                  # → SPA, 200
curl http://localhost:8000/api/pokemons?_page=1&_per_page=1   # → JSON, via gateway → backend

docker compose down
```

The gateway's host port defaults to `8000`; override with `GATEWAY_PORT`:

```bash
GATEWAY_PORT=9000 docker compose up --build -d
```

Only `gateway` is published to the host — `frontend` and `backend` stay reachable exclusively through it, mirroring how only `gateway` is exposed to the outside on the real VPS deployment (see details about [VPS setup](https://github.com/ddZ6ii/vps-infra/blob/main/docs/vps-setup.md)).
