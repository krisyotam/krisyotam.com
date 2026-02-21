# Proposal: Replace Dokploy with Headless Deploy Pipeline

**Author:** Kris Yotam
**Date:** 2026-02-16
**Status:** Draft
**Scope:** krisyotam.com, notes.krisyotam.com (and any future sites on stargate)

---

## 1. Problem

Dokploy is a GUI-first deployment platform running as a Docker Swarm stack (3 containers: app, postgres, redis) on stargate. It manages builds and deploys for krisyotam.com, notes.krisyotam.com, and ai.krisyotam.com via a web dashboard at `https://10.0.0.142:3000`.

**Why it needs to go:**

- **No reliable CLI/API access.** Dokploy v0.26.5 uses `better-auth` with session cookies. The tRPC API requires authenticating through an undocumented flow, making headless automation fragile. Every deploy currently requires either the web UI or reverse-engineering the auth chain.
- **Opaque build pipeline.** Dokploy clones the repo, runs the Dockerfile, tags the image, and updates the swarm service internally. When builds fail or env vars don't propagate, debugging requires querying Dokploy's Postgres database directly.
- **NEXT_PUBLIC_* build-time problem.** Next.js embeds `NEXT_PUBLIC_*` variables at build time. Dokploy's env var management sets runtime env on the swarm service, but these are invisible to the Next.js client bundle unless the image is rebuilt. This caused the outage on 2026-02-16 where env vars were updated but the site still used stale values.
- **Resource overhead.** Three always-on containers (Dokploy app, Postgres, Redis) consuming memory and CPU for a deployment tool used a few times a week.
- **Port conflict.** Dokploy occupies port 3000, which conflicts with local development.

---

## 2. Proposed Architecture

Replace Dokploy with a single shell script (`deploy.sh`) and a `docker-compose.yml` per site, stored on stargate at `/mnt/storage/deploy/`. Claude Code manages deploys over SSH.

### 2.1 Directory Layout on Stargate

```
/mnt/storage/deploy/
├── krisyotam.com/
│   ├── .env                    # All env vars (build-time + runtime)
│   ├── docker-compose.yml      # Service definition
│   ├── deploy.sh               # Build + deploy script
│   └── repo/                   # Git clone of krisyotam/krisyotam.com
│       └── ...
│
├── notes.krisyotam.com/
│   ├── .env
│   ├── docker-compose.yml
│   ├── deploy.sh
│   └── repo/
│       └── ...
│
└── shared/
    └── deploy-lib.sh           # Shared functions (logging, health checks, rollback)
```

### 2.2 docker-compose.yml (krisyotam.com)

```yaml
services:
  web:
    build:
      context: ./repo
      dockerfile: .config/docker/Dockerfile
      args:
        # NEXT_PUBLIC_* must be build args (baked into the JS bundle)
        NEXT_PUBLIC_BASE_URL: ${NEXT_PUBLIC_BASE_URL}
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        NEXT_PUBLIC_MAPBOX_SECRET_TOKEN: ${NEXT_PUBLIC_MAPBOX_SECRET_TOKEN}
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: ${NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        NEXT_PUBLIC_SPOTIFY_CLIENT_ID: ${NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
        NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: ${NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
        NEXT_PUBLIC_LITERAL_TOKEN: ${NEXT_PUBLIC_LITERAL_TOKEN}
        # Server-side build args (needed during static generation)
        SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
        MAL_CLIENT_ID: ${MAL_CLIENT_ID}
        MAL_CLIENT_SECRET: ${MAL_CLIENT_SECRET}
        MAL_ACCESS_TOKEN: ${MAL_ACCESS_TOKEN}
        MAL_REFRESH_TOKEN: ${MAL_REFRESH_TOKEN}
        UPSTASH_REDIS_REST_TOKEN: ${UPSTASH_REDIS_REST_TOKEN}
        UPSTASH_REDIS_REST_URL: ${UPSTASH_REDIS_REST_URL}
        MAPBOX_SECRET_TOKEN: ${MAPBOX_SECRET_TOKEN}
        GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
        GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
        GITHUB_TOKEN: ${GITHUB_TOKEN}
        MONKEY_TYPE_API_KEY: ${MONKEY_TYPE_API_KEY}
        TMDB_API_KEY: ${TMDB_API_KEY}
        TMDB_READ_ACCESS_TOKEN: ${TMDB_READ_ACCESS_TOKEN}
    container_name: krisyotam-com
    restart: unless-stopped
    ports:
      - "3080:3000"
    env_file:
      - .env
    volumes:
      - /mnt/storage/krisyotam.com/analytics.db:/app/public/data/analytics.db
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

**Key design decisions:**
- `env_file: .env` passes ALL vars as runtime env (covers server-side needs like `NEON_DATABASE_URL`, `EMAIL_*`, `SELINE_API_TOKEN`)
- `build.args` explicitly passes `NEXT_PUBLIC_*` and server-side vars needed at build time (static generation)
- The Dockerfile's `ARG` declarations already handle the `ARG` → `ENV` conversion
- `analytics.db` bind mount preserved from current setup
- Container name is deterministic (`krisyotam-com`), not a random Dokploy hash
- `restart: unless-stopped` replaces Docker Swarm's restart policy

### 2.3 deploy.sh

```bash
#!/bin/bash
set -euo pipefail

# ============================================================================
# deploy.sh — Headless deploy for krisyotam.com
# Usage: deploy.sh [--no-pull] [--force-rebuild] [--rollback]
# ============================================================================

SITE_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$SITE_DIR/repo"
COMPOSE_FILE="$SITE_DIR/docker-compose.yml"
ENV_FILE="$SITE_DIR/.env"
LOG_FILE="$SITE_DIR/deploy.log"
CONTAINER_NAME="krisyotam-com"
HEALTH_URL="http://127.0.0.1:3080"
HEALTH_TIMEOUT=60

# Timestamp helper
ts() { date '+%Y-%m-%d %H:%M:%S'; }

# Log to file and stdout
log() { echo "[$(ts)] $*" | tee -a "$LOG_FILE"; }

# ── Flags ──────────────────────────────────────────────────────────────────
NO_PULL=false
FORCE_REBUILD=false
ROLLBACK=false

for arg in "$@"; do
  case "$arg" in
    --no-pull)        NO_PULL=true ;;
    --force-rebuild)  FORCE_REBUILD=true ;;
    --rollback)       ROLLBACK=true ;;
  esac
done

# ── Rollback ───────────────────────────────────────────────────────────────
if [ "$ROLLBACK" = true ]; then
  log "Rolling back to previous image..."
  PREV_IMAGE=$(docker images "$CONTAINER_NAME" --format "{{.ID}}" | sed -n '2p')
  if [ -z "$PREV_IMAGE" ]; then
    log "ERROR: No previous image found to roll back to."
    exit 1
  fi
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  docker tag "$PREV_IMAGE" "${CONTAINER_NAME}:rollback"
  # Restart with previous image using compose (will use cached layer)
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
  log "Rollback complete."
  exit 0
fi

# ── Pre-flight checks ─────────────────────────────────────────────────────
log "========== DEPLOY START =========="

if [ ! -f "$ENV_FILE" ]; then
  log "ERROR: $ENV_FILE not found."
  exit 1
fi

if [ ! -d "$REPO_DIR/.git" ]; then
  log "ERROR: $REPO_DIR is not a git repository."
  exit 1
fi

# ── Step 1: Git pull ──────────────────────────────────────────────────────
if [ "$NO_PULL" = false ]; then
  log "Pulling latest code..."
  cd "$REPO_DIR"
  git fetch origin main
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse origin/main)

  if [ "$LOCAL" = "$REMOTE" ] && [ "$FORCE_REBUILD" = false ]; then
    log "Already up to date ($LOCAL). Use --force-rebuild to rebuild anyway."
    exit 0
  fi

  git reset --hard origin/main
  log "Updated to $(git rev-parse --short HEAD)"

  # Update content submodule
  if [ -f ".gitmodules" ]; then
    log "Updating content submodule..."
    git submodule update --init --recursive --depth 1
  fi
else
  log "Skipping git pull (--no-pull)."
fi

# ── Step 2: Save previous image ID for rollback ──────────────────────────
PREV_IMAGE=$(docker images "${SITE_DIR##*/}-web" --format "{{.ID}}" | head -1)
log "Previous image: ${PREV_IMAGE:-none}"

# ── Step 3: Build and deploy ─────────────────────────────────────────────
log "Building image..."
cd "$SITE_DIR"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache 2>&1 | tee -a "$LOG_FILE"

BUILD_EXIT=${PIPESTATUS[0]}
if [ "$BUILD_EXIT" -ne 0 ]; then
  log "ERROR: Build failed (exit $BUILD_EXIT)."
  exit 1
fi

log "Starting container..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d 2>&1 | tee -a "$LOG_FILE"

# ── Step 4: Health check ─────────────────────────────────────────────────
log "Waiting for health check ($HEALTH_URL)..."
ELAPSED=0
while [ $ELAPSED -lt $HEALTH_TIMEOUT ]; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    log "Health check passed (HTTP $STATUS) after ${ELAPSED}s."
    break
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

if [ "$STATUS" != "200" ]; then
  log "ERROR: Health check failed after ${HEALTH_TIMEOUT}s (last HTTP $STATUS)."
  log "Rolling back..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
  if [ -n "$PREV_IMAGE" ]; then
    docker tag "$PREV_IMAGE" "${SITE_DIR##*/}-web:latest"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    log "Rolled back to previous image."
  fi
  exit 1
fi

# ── Step 5: Cleanup ──────────────────────────────────────────────────────
log "Pruning dangling images..."
docker image prune -f >> "$LOG_FILE" 2>&1

log "========== DEPLOY SUCCESS =========="
log "Image: $(docker images "${SITE_DIR##*/}-web" --format '{{.ID}}' | head -1)"
log "Commit: $(cd "$REPO_DIR" && git rev-parse --short HEAD)"
echo ""
```

### 2.4 .env File

Single flat file. Identical to the current `.env.local` in the repo, synced manually or via `scp` from the dev machine.

```bash
# To sync env vars from dev machine to stargate:
scp ~/dev/krisyotam.com/.env.local server:/mnt/storage/deploy/krisyotam.com/.env
```

No more Dokploy env var management. No more Docker Swarm `--env-add`/`--env-rm` gymnastics.

---

## 3. Deployment Workflow

### 3.1 Standard Deploy (Claude Code or manual)

```bash
# From dev machine (or Claude Code via SSH):
ssh server /mnt/storage/deploy/krisyotam.com/deploy.sh
```

That's it. One command. The script:
1. Pulls latest code from GitHub
2. Skips if already up-to-date (unless `--force-rebuild`)
3. Builds the Docker image with env vars baked in
4. Replaces the running container
5. Waits for health check (HTTP 200 on port 3080)
6. Auto-rolls back if health check fails
7. Prunes old images

### 3.2 Env Var Update

```bash
# 1. Edit .env on stargate (or scp from dev machine)
ssh server vim /mnt/storage/deploy/krisyotam.com/.env

# 2. Rebuild (env changes require rebuild for NEXT_PUBLIC_* vars)
ssh server /mnt/storage/deploy/krisyotam.com/deploy.sh --force-rebuild
```

### 3.3 Force Rebuild (same code, new image)

```bash
ssh server /mnt/storage/deploy/krisyotam.com/deploy.sh --force-rebuild
```

### 3.4 Rollback

```bash
ssh server /mnt/storage/deploy/krisyotam.com/deploy.sh --rollback
```

### 3.5 Claude Code Integration

Claude Code can manage the full lifecycle headlessly:

| Action | Command |
|--------|---------|
| Deploy latest | `ssh server /mnt/storage/deploy/krisyotam.com/deploy.sh` |
| Force rebuild | `ssh server /mnt/storage/deploy/krisyotam.com/deploy.sh --force-rebuild` |
| Update env var | `ssh server "sed -i 's/^KEY=.*/KEY=newvalue/' /mnt/storage/deploy/krisyotam.com/.env"` then deploy |
| Sync env from dev | `scp .env.local server:/mnt/storage/deploy/krisyotam.com/.env` then deploy |
| Rollback | `ssh server /mnt/storage/deploy/krisyotam.com/deploy.sh --rollback` |
| Check logs | `ssh server tail -50 /mnt/storage/deploy/krisyotam.com/deploy.log` |
| Check status | `ssh server docker ps -f name=krisyotam-com` |
| View app logs | `ssh server docker logs krisyotam-com --tail 50` |

---

## 4. Migration Plan

### Phase 1: Set Up New Pipeline (no downtime)

1. Create directory structure on stargate:
   ```bash
   mkdir -p /mnt/storage/deploy/krisyotam.com/repo
   ```

2. Clone the repo:
   ```bash
   cd /mnt/storage/deploy/krisyotam.com/repo
   git clone --depth 1 --recurse-submodules \
     https://x-access-token:<GITHUB_TOKEN>@github.com/krisyotam/krisyotam.com.git .
   ```

3. Write `docker-compose.yml`, `deploy.sh`, copy `.env`.

4. Run a test build (don't start — the old container still occupies port 3080):
   ```bash
   docker compose build
   ```

### Phase 2: Cutover (~30s downtime)

5. Stop the Dokploy-managed swarm service:
   ```bash
   docker service rm krisyotam-com-yzufff
   ```

6. Start via new pipeline:
   ```bash
   ./deploy.sh --no-pull --force-rebuild
   ```

7. Verify health: `curl -I https://krisyotam.com`

### Phase 3: Cleanup

8. Repeat Phase 1-2 for `notes.krisyotam.com` (port 3081) and any other sites.

9. Remove Dokploy entirely:
   ```bash
   docker service rm dokploy dokploy-postgres dokploy-redis
   docker volume prune
   ```
   This frees port 3000 and reclaims ~500MB+ of memory.

10. Leave Docker Swarm mode (optional, only if no other swarm services remain):
    ```bash
    docker swarm leave --force
    ```

11. Remove Dokploy volumes and data:
    ```bash
    rm -rf /mnt/storage/docker/volumes/dokploy-*
    ```

---

## 5. What Changes, What Stays

| Component | Before (Dokploy) | After (Headless) |
|-----------|-------------------|-------------------|
| Build trigger | Dokploy web UI or flaky API | `ssh server deploy.sh` |
| Env var management | Dokploy UI + Docker Swarm env | `.env` file on stargate |
| Container orchestration | Docker Swarm | `docker compose` |
| Image registry | Local swarm images | Local compose images |
| Health checks | None (Dokploy doesn't check) | Built-in with auto-rollback |
| Rollback | Manual (redeploy old commit) | `deploy.sh --rollback` |
| Deploy log | Dokploy DB | `deploy.log` flat file |
| Nginx config | Unchanged | Unchanged |
| SSL/certbot | Unchanged | Unchanged |
| Port mapping | 3080 → 3000 | 3080 → 3000 |
| analytics.db mount | Unchanged | Unchanged |
| Port 3000 conflict | Occupied by Dokploy | Freed |
| Resource usage | 3 extra containers | 0 extra containers |

---

## 6. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Downtime during cutover | Pre-build image before stopping old service. Cutover window ~30s. |
| Bad deploy breaks the site | Health check with auto-rollback. Previous image retained. |
| `.env` file on disk with secrets | Same security posture as Dokploy (env vars were in Dokploy's Postgres in plaintext). File permissions set to `600`. |
| Forgetting to deploy after push | Can add a GitHub webhook later if desired, or rely on Claude Code as the deploy trigger. |
| Docker Swarm removal breaks other services | Check all swarm services first. `donlamarcom-4es7yn`, `ai-krisyotam-com-bepgpr`, and `notes-krisyotam-com-9zckuk` need to be migrated too before leaving swarm. |

---

## 7. Future Enhancements (Not Required for v1)

- **GitHub webhook listener**: Tiny HTTP server on stargate that receives push events and runs `deploy.sh` automatically. Replaces Dokploy's auto-deploy.
- **Deploy notifications**: Append a curl to a Discord/ntfy webhook at the end of `deploy.sh`.
- **Multi-site deploy**: A top-level `/mnt/storage/deploy/deploy-all.sh` that iterates over all site directories.
- **Log rotation**: `logrotate` config for `deploy.log` files.

---

## 8. Summary

Dokploy is a 3-container deployment platform that we've been fighting against because it doesn't expose a clean headless interface. The replacement is a 50-line shell script, a docker-compose.yml, and an `.env` file. Claude Code can run the entire deploy lifecycle over SSH with a single command. Health checks and auto-rollback are built in. Port 3000 is freed. Three containers are eliminated.

Total new files: 3 per site (`docker-compose.yml`, `deploy.sh`, `.env`).
Total containers removed: 3 (Dokploy app, Postgres, Redis).
Downtime: ~30 seconds during cutover.
