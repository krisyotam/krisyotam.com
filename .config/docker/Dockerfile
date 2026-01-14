################################################################################
# Dependencies stage
# - Installs ALL dependencies (dev + prod) for build
# - Uses legacy peer deps to avoid strict React peer conflicts in CI/Docker
################################################################################
FROM node:20-alpine AS deps

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (tailwind, postcss, etc. needed at build time)
# --legacy-peer-deps is required due to React 19 peer incompatibilities
RUN npm ci --legacy-peer-deps


################################################################################
# Build stage
# - Reuses installed node_modules (includes dev deps for build)
# - Runs a constrained, low-memory build for Next.js
################################################################################
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Next.js (NEXT_PUBLIC_* are embedded at build time)
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_MAPBOX_SECRET_TOKEN
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ARG NEXT_PUBLIC_SPOTIFY_CLIENT_ID
ARG NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_ANALYTICS_ID

# Server-side build args (needed for static page generation)
ARG SUPABASE_SERVICE_ROLE_KEY
ARG MAL_CLIENT_ID
ARG MAL_CLIENT_SECRET
ARG MAL_ACCESS_TOKEN
ARG MAL_REFRESH_TOKEN
ARG UPSTASH_REDIS_REST_TOKEN
ARG UPSTASH_REDIS_REST_URL
ARG MAPBOX_SECRET_TOKEN
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG GITHUB_TOKEN
ARG MONKEY_TYPE_API_KEY
ARG TMDB_API_KEY
ARG TMDB_READ_ACCESS_TOKEN

# Convert ARGs to ENVs so they're available during build
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_MAPBOX_SECRET_TOKEN=$NEXT_PUBLIC_MAPBOX_SECRET_TOKEN
ENV NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ENV NEXT_PUBLIC_SPOTIFY_CLIENT_ID=$NEXT_PUBLIC_SPOTIFY_CLIENT_ID
ENV NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=$NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_ANALYTICS_ID=$NEXT_PUBLIC_ANALYTICS_ID
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV MAL_CLIENT_ID=$MAL_CLIENT_ID
ENV MAL_CLIENT_SECRET=$MAL_CLIENT_SECRET
ENV MAL_ACCESS_TOKEN=$MAL_ACCESS_TOKEN
ENV MAL_REFRESH_TOKEN=$MAL_REFRESH_TOKEN
ENV UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN
ENV UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL
ENV MAPBOX_SECRET_TOKEN=$MAPBOX_SECRET_TOKEN
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV MONKEY_TYPE_API_KEY=$MONKEY_TYPE_API_KEY
ENV TMDB_API_KEY=$TMDB_API_KEY
ENV TMDB_READ_ACCESS_TOKEN=$TMDB_READ_ACCESS_TOKEN

# Reuse dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Run the low-memory build
# (uses NEXT_WORKER_COUNT and restricted NODE_OPTIONS)
# --webpack flag required for MDX support (Turbopack doesn't support it)
RUN npm run build:lowmem

# Prune dev dependencies after build for smaller runtime image
RUN npm prune --production --legacy-peer-deps


################################################################################
# Runtime stage
# - Minimal production image
# - Contains only built assets and runtime dependencies
################################################################################
FROM node:20-alpine AS runner

WORKDIR /app

# Explicitly set production environment
ENV NODE_ENV=production

# Copy required runtime assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose Next.js port
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
