# Static Export Migration Plan

## Overview

Migrate krisyotam.com from Next.js SSR to static HTML export while preserving the development experience.

---

## Phase 1: Audit & Preparation

### API Routes Audit

| Route | Purpose | Action |
|-------|---------|--------|
| `/api/auth/*` | GitHub auth, sessions | Remove or externalize to Clerk/Auth0 |
| `/api/interactions` | Likes, views, comments | Move to Supabase or remove |
| `/api/content` | Content queries | Pre-fetch at build time |
| `/api/media` | Media data | Pre-fetch at build time |
| `/api/film` | TMDB proxy | Pre-fetch and cache at build time |
| `/api/tv` | Trakt proxy | Pre-fetch and cache at build time |
| `/api/games` | Game data | Pre-fetch at build time |
| `/api/surveys/submit` | Form submissions | Move to Formspree or external |
| `/api/raw/*` | Raw content serving | Generate static files at build |
| `/api/data` | Data queries | Pre-fetch at build time |
| `/api/reference` | Reference data | Pre-fetch at build time |
| `/api/utils` | Utility endpoints | Evaluate necessity |

### Features Using Server-Side

- [ ] Audit all uses of `cookies()` from `next/headers`
- [ ] Audit all uses of `headers()` from `next/headers`
- [ ] Find all `dynamic = 'force-dynamic'` exports
- [ ] Identify ISR usage (`revalidate`)

---

## Phase 2: Configuration Changes

### next.config.mjs

```js
const baseConfig = {
  output: 'export',  // Enable static export

  images: {
    unoptimized: true,  // Disable built-in optimization
    // OR use custom loader:
    // loader: 'custom',
    // loaderFile: './src/lib/image-loader.js',
  },

  // REMOVE these sections:
  // async rewrites() { ... }
  // async redirects() { ... }

  // Keep everything else
}
```

### Move Rewrites to Nginx

```nginx
# /etc/nginx/conf.d/krisyotam-rewrites.conf

# Vanity URLs
location = /me { rewrite ^ /notes/on-myself/about-kris.html last; }
location = /logo { rewrite ^ /notes/on-myself/about-my-logo.html last; }
location = /about { rewrite ^ /notes/website/about-this-website.html last; }
location = /design { rewrite ^ /notes/website/design-of-this-website.html last; }
location = /donate { rewrite ^ /notes/website/donate.html last; }
location = /faq { rewrite ^ /notes/website/faq.html last; }
location = /roti { rewrite ^ /rules-of-the-internet.html last; }

# Feed URLs
location = /rss.xml { rewrite ^ /feeds/rss.xml last; }
location = /atom.xml { rewrite ^ /feeds/atom.xml last; }
location = /feed.json { rewrite ^ /feeds/feed.json last; }

# Static file serving
location / {
    root /var/www/krisyotam.com/out;
    try_files $uri $uri.html $uri/index.html =404;
}
```

### Move Redirects to Nginx

```nginx
# External redirects
location = /clippings {
    return 301 https://fabric.so/p/clippings-5Rgtx9QgJW1kq0zfOvujaw;
}
```

---

## Phase 3: Code Changes

### Remove/Replace Server Features

1. **Auth System**
   - Option A: Remove entirely (simplest)
   - Option B: Replace with Clerk/Auth0 client-side
   - Option C: Separate auth API server

2. **Interactions (likes, views, comments)**
   - Option A: Remove entirely
   - Option B: Use Giscus for comments (GitHub-based)
   - Option C: Separate API at api.krisyotam.com

3. **View Tracking**
   - Option A: Remove
   - Option B: Client-side analytics (Plausible, Umami)
   - Option C: Separate tracking API

### Pre-fetch External Data

Create build-time scripts for:

```bash
scripts/
├── fetch-spotify-data.js      # Cache Spotify playlists
├── fetch-mal-data.js          # Cache MAL anime/manga
├── fetch-tmdb-data.js         # Cache film data
├── fetch-trakt-data.js        # Cache TV data
└── generate-static-json.js    # Compile all to static JSON
```

Run these before build:
```json
{
  "scripts": {
    "prebuild": "node scripts/fetch-all-data.js",
    "build": "next build"
  }
}
```

### Image Optimization

Option A: Pre-optimize at build time
```bash
# Use sharp or imagemin to pre-process images
scripts/optimize-images.js
```

Option B: Custom loader for external images
```js
// src/lib/image-loader.js
export default function customLoader({ src, width, quality }) {
  // Use Cloudinary, imgix, or serve unoptimized
  return src;
}
```

---

## Phase 4: Build & Test

### Build Command

```bash
npm run build
# Output: /out directory with static HTML
```

### Test Locally

```bash
# Serve static files
npx serve out

# Or with Python
cd out && python -m http.server 3000
```

### Verify

- [ ] All pages render correctly
- [ ] No hydration errors in console
- [ ] Links work (check for .html extensions if needed)
- [ ] Images load
- [ ] CSS applies correctly
- [ ] Client-side navigation works

---

## Phase 5: Deployment

### Update Dokploy/Docker

```dockerfile
# Simplified - just nginx serving static files
FROM nginx:alpine
COPY out/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Update nginx on Stargate

```nginx
server {
    listen 3080;
    server_name krisyotam.com;

    root /var/www/krisyotam.com/out;

    # Handle clean URLs
    location / {
        try_files $uri $uri.html $uri/index.html =404;
    }

    # Include rewrites
    include /etc/nginx/conf.d/krisyotam-rewrites.conf;

    # Cache static assets
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Phase 6: Optional Enhancements

### Separate API Server (if keeping dynamic features)

```
api.krisyotam.com/
├── routes/
│   ├── interactions.ts  # Likes, views
│   ├── comments.ts      # Comments
│   └── auth.ts          # Auth (if needed)
├── package.json
└── index.ts
```

Lightweight options:
- Hono (tiny, fast)
- Elysia (Bun-native)
- Express (familiar)

### External Services Alternative

| Feature | Service | Notes |
|---------|---------|-------|
| Comments | Giscus | GitHub-based, free |
| Analytics | Plausible/Umami | Privacy-focused |
| Forms | Formspree | Simple form handling |
| Auth | Clerk | If needed |

---

## Rollback Plan

If static export causes issues:

1. Revert next.config.mjs changes
2. Restore API routes
3. Remove nginx rewrites (Next.js handles them again)
4. Redeploy with `output: 'standalone'`

---

## Timeline

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Audit | 2-4 hours |
| 2 | Config changes | 1-2 hours |
| 3 | Code changes | 4-8 hours |
| 4 | Build & test | 2-4 hours |
| 5 | Deployment | 1-2 hours |
| 6 | Enhancements | Optional |

**Total: 10-20 hours**

---

## Status

- [ ] Phase 1: Audit complete
- [ ] Phase 2: Config updated
- [ ] Phase 3: Code migrated
- [ ] Phase 4: Build tested
- [ ] Phase 5: Deployed
- [ ] Phase 6: Enhancements added
