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

# Reuse dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Run the low-memory build
# (uses NEXT_WORKER_COUNT and restricted NODE_OPTIONS)
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
