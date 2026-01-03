# Performance Optimization Task List

**Created:** 2026-01-02
**Reference Project:** [NextFaster](https://github.com/ethanniser/NextFaster) by @ethanniser
**Goal:** Achieve 90+ Lighthouse performance score on krisyotam.com

---

## Current State Assessment

### Lighthouse Audit Results (2026-01-02)

| Category | Score | Status |
|----------|-------|--------|
| Performance | 42% | CRITICAL |
| Accessibility | 100% | PASS |
| Best Practices | 96% | PASS |
| SEO | 100% | PASS |

### Core Web Vitals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **First Contentful Paint (FCP)** | 2.0s | < 1.8s | NEEDS WORK |
| **Largest Contentful Paint (LCP)** | 6.9s | < 2.5s | CRITICAL |
| **Total Blocking Time (TBT)** | 2,730ms | < 200ms | CRITICAL |
| **Cumulative Layout Shift (CLS)** | 0.062 | < 0.1 | PASS |
| **Speed Index** | 4.7s | < 3.4s | NEEDS WORK |
| **Time to Interactive (TTI)** | 69.2s | < 3.8s | CRITICAL |
| **Max Potential FID** | 2,320ms | < 100ms | CRITICAL |

### Failing Audits (Sorted by Severity)

1. **Time to Interactive: 69.2s** - Page takes over a minute to become fully interactive
2. **Total Blocking Time: 2,730ms** - Main thread blocked for nearly 3 seconds
3. **Largest Contentful Paint: 6.9s** - Hero content takes 7 seconds to render
4. **Main Thread Work: 4.1s** - Too much JavaScript execution on main thread
5. **JavaScript Execution: 3.4s** - Scripts taking too long to execute
6. **Unused JavaScript: 193 KiB** - Dead code being shipped to client
7. **Unused CSS: 28 KiB** - Unused styles being shipped
8. **Total Payload: 12,751 KiB (12.7 MB)** - Enormous page weight
9. **Page Redirects: 860ms** - Unnecessary redirect chain
10. **Render Blocking Resources: 250ms** - Scripts blocking initial render

---

## Root Cause Analysis

### 1. Image Optimization Disabled

**Location:** `next.config.mjs:81`
```javascript
images: {
  unoptimized: true,  // THIS IS THE PROBLEM
  // ...
}
```

**Impact:** Images served at full resolution without WebP/AVIF conversion, no srcset generation, no lazy loading optimization.

**Fix:** Remove `unoptimized: true` and configure proper image optimization:
```javascript
images: {
  minimumCacheTTL: 31536000, // 1 year cache
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    { protocol: 'https', hostname: 'api.qrserver.com', pathname: '/v1/**' },
    { protocol: 'https', hostname: 'i.postimg.cc', pathname: '/**' },
    { protocol: 'https', hostname: 'gateway.pinata.cloud', pathname: '/**' },
  ],
}
```

### 2. SWC Minification Disabled

**Location:** `next.config.mjs:17`
```javascript
swcMinify: false,  // THIS IS THE PROBLEM
```

**Impact:** JavaScript not properly minified, larger bundle sizes, slower parsing.

**Fix:** Enable SWC minification:
```javascript
swcMinify: true,
```

### 3. Render-Blocking External Script

**Location:** `app/layout.tsx:80`
```html
<script async src="https://cdn.seline.so/seline.js" data-token="9bc08e3c42882e0"></script>
```

**Impact:** Even with `async`, script in `<head>` can delay First Contentful Paint. External domain requires DNS lookup + connection.

**Fix:** Use Next.js Script component with `afterInteractive` or `lazyOnload`:
```tsx
import Script from 'next/script'

// In body, not head:
<Script
  src="https://cdn.seline.so/seline.js"
  data-token="9bc08e3c42882e0"
  strategy="lazyOnload"
/>
```

Or better, self-host via rewrites like NextFaster does:
```javascript
// next.config.mjs rewrites
{
  source: "/analytics/seline.js",
  destination: "https://cdn.seline.so/seline.js",
},
```

### 4. No Partial Prerendering (PPR)

**Impact:** Pages fully server-rendered or fully client-rendered. No streaming of dynamic content into static shells.

**Fix:** Upgrade to Next.js 15 and enable PPR:
```javascript
experimental: {
  ppr: true,
}
```

### 5. No CSS Inlining

**Impact:** CSS loaded as separate requests, causing render blocking and FOUC potential.

**Fix:** Enable CSS inlining (Next.js 15+):
```javascript
experimental: {
  inlineCss: true,
}
```

### 6. No React Compiler

**Impact:** Manual memoization required, unnecessary re-renders, larger runtime overhead.

**Fix:** Enable React Compiler (Next.js 15+):
```javascript
reactCompiler: true,
```

### 7. Heavy Dependencies

**Location:** `package.json`

The following dependencies are heavy and should be lazy-loaded or reconsidered:

| Package | Approx Size | Usage | Recommendation |
|---------|-------------|-------|----------------|
| `mapbox-gl` | ~500KB | Maps | Lazy load, only on map pages |
| `recharts` | ~300KB | Charts | Lazy load, only when needed |
| `@tsparticles/*` | ~200KB | Particles | Remove or lazy load |
| `firebase` | ~200KB | Auth? | Consider lighter alternative |
| `framer-motion` | ~150KB | Animations | Use CSS animations where possible |
| `react-syntax-highlighter` | ~100KB | Code blocks | Lazy load |
| `katex` | ~300KB | Math | Lazy load on math-heavy pages |
| `cobe` | ~50KB | Globe | Lazy load |

### 8. No Suspense Boundaries

**Impact:** All components render synchronously, blocking the main thread.

**Fix:** Wrap heavy components in Suspense:
```tsx
import { Suspense } from 'react'

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

### 9. Inefficient Link Prefetching

**Current:** Default Next.js Link prefetching (prefetches everything in viewport).

**NextFaster Approach:** Smart prefetching with IntersectionObserver + hover-based image prefetching:
- Only prefetch links visible for 300ms+
- Prefetch images on hover
- Navigate on mouseDown (saves ~100ms vs click)

---

## NextFaster Architecture Analysis

### Key Files and Patterns

#### 1. next.config.mjs
```javascript
const nextConfig = {
  experimental: {
    ppr: true,        // Partial Prerendering
    inlineCss: true,  // Inline critical CSS
  },
  reactCompiler: true, // React 19 Compiler
  images: {
    minimumCacheTTL: 31536000, // 1 year
  },
  // Proxy analytics to avoid external requests
  async rewrites() {
    return [
      {
        source: "/insights/vitals.js",
        destination: "https://cdn.vercel-insights.com/v1/speed-insights/script.js",
      },
    ];
  },
};
```

#### 2. Smart Link Component (`src/components/ui/link.tsx`)

Key techniques:
- **IntersectionObserver prefetching:** Only prefetch links visible in viewport for 300ms+
- **Mouse hover prefetching:** Prefetch route + images on hover
- **mouseDown navigation:** Navigate immediately on mouseDown instead of waiting for click (saves ~100ms)
- **Image prefetching API:** Custom endpoint returns images for a page, prefetched on hover

```tsx
// Simplified version of NextFaster's Link
export const Link = ({ children, ...props }) => {
  const router = useRouter();
  const linkRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            router.prefetch(props.href);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(linkRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <NextLink
      ref={linkRef}
      prefetch={false}  // Disable default, use custom
      onMouseEnter={() => router.prefetch(props.href)}
      onMouseDown={(e) => {
        if (e.button === 0 && !e.metaKey) {
          e.preventDefault();
          router.push(props.href);
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
};
```

#### 3. Cache Wrapper (`src/lib/unstable-cache.ts`)

Combines Next.js cache with React's request deduplication:

```typescript
import { unstable_cache as next_unstable_cache } from "next/cache";
import { cache } from "react";

export const unstable_cache = <Inputs extends unknown[], Output>(
  callback: (...args: Inputs) => Promise<Output>,
  key: string[],
  options: { revalidate: number },
) => cache(next_unstable_cache(callback, key, options));
```

#### 4. Image Loading Strategy

```tsx
// First 15 images load eagerly, rest lazy
<Image
  loading={imageCount++ < 15 ? "eager" : "lazy"}
  decoding="sync"
  quality={65}  // Lower quality for thumbnails
  // ...
/>
```

#### 5. Suspense Boundaries

Every dynamic component wrapped in Suspense with appropriate fallback:

```tsx
<Suspense fallback={<div className="h-[20px]" />}>
  <AuthServer />
</Suspense>
```

---

## Implementation Plan

### Phase 1: Quick Wins (No Breaking Changes)

**Estimated Impact: +15-20 points**

- [ ] **1.1** Enable `swcMinify: true` in next.config.mjs
- [ ] **1.2** Move seline script to `afterInteractive` strategy
- [ ] **1.3** Add `minimumCacheTTL: 31536000` for images
- [ ] **1.4** Enable image optimization (remove `unoptimized: true`)
- [ ] **1.5** Add image domains/remotePatterns for all external sources

### Phase 2: Suspense & Code Splitting

**Estimated Impact: +10-15 points**

- [ ] **2.1** Add Suspense boundaries around heavy components in layout.tsx
- [ ] **2.2** Lazy load CommandMenu component
- [ ] **2.3** Lazy load SettingsMenu component
- [ ] **2.4** Lazy load UniversalLinkModal component
- [ ] **2.5** Dynamic import for react-syntax-highlighter
- [ ] **2.6** Dynamic import for katex (only on math pages)
- [ ] **2.7** Dynamic import for mapbox-gl (only on map pages)
- [ ] **2.8** Dynamic import for recharts (only on chart pages)

### Phase 3: Next.js 15 Upgrade

**Estimated Impact: +15-20 points**

- [ ] **3.1** Upgrade Next.js from 14.2.26 to 15.x
- [ ] **3.2** Upgrade React from 18.3.1 to 19.x
- [ ] **3.3** Enable `experimental.ppr: true`
- [ ] **3.4** Enable `experimental.inlineCss: true`
- [ ] **3.5** Enable `reactCompiler: true`
- [ ] **3.6** Update all async components for React 19 patterns

### Phase 4: Smart Prefetching

**Estimated Impact: +5-10 points**

- [ ] **4.1** Create custom Link component with IntersectionObserver
- [ ] **4.2** Implement mouseDown navigation
- [ ] **4.3** Create image prefetch API endpoint
- [ ] **4.4** Replace all Link imports with custom Link

### Phase 5: Bundle Optimization

**Estimated Impact: +5-10 points**

- [ ] **5.1** Audit all dependencies with `npx depcheck`
- [ ] **5.2** Remove unused dependencies
- [ ] **5.3** Replace heavy dependencies with lighter alternatives
- [ ] **5.4** Configure tree-shaking for large libraries
- [ ] **5.5** Analyze bundle with `@next/bundle-analyzer`

### Phase 6: Caching Strategy

**Estimated Impact: +5 points**

- [ ] **6.1** Implement unstable_cache wrapper for all data fetching
- [ ] **6.2** Configure appropriate revalidation times
- [ ] **6.3** Add stale-while-revalidate headers
- [ ] **6.4** Implement ISR for static content pages

---

## Testing & Validation

### Lighthouse Testing Commands

```bash
# Full audit
npx lighthouse https://krisyotam.com \
  --output=json \
  --output-path=./lighthouse-$(date +%Y%m%d).json \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless --no-sandbox --disable-gpu"

# Extract scores
cat lighthouse-*.json | jq '{
  performance: .categories.performance.score,
  accessibility: .categories.accessibility.score,
  bestPractices: .categories["best-practices"].score,
  seo: .categories.seo.score,
  metrics: {
    fcp: .audits["first-contentful-paint"].displayValue,
    lcp: .audits["largest-contentful-paint"].displayValue,
    tbt: .audits["total-blocking-time"].displayValue,
    cls: .audits["cumulative-layout-shift"].displayValue
  }
}'
```

### Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "ANALYZE=true next build"

# Install analyzer
npm install @next/bundle-analyzer

# Run analysis
npm run analyze
```

### Core Web Vitals Monitoring

- PageSpeed Insights: https://pagespeed.web.dev/
- web.dev Measure: https://web.dev/measure/
- Chrome DevTools Performance tab
- Vercel Analytics (if deployed on Vercel)

---

## Reference Links

- [NextFaster GitHub](https://github.com/ethanniser/NextFaster)
- [NextFaster Twitter Thread](https://x.com/ethanniser/status/1848442738204643330)
- [NextFaster PageSpeed Report](https://pagespeed.web.dev/analysis/https-next-faster-vercel-app/7iywdkce2k?form_factor=desktop)
- [Next.js PPR Documentation](https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [Core Web Vitals](https://web.dev/vitals/)

---

## Progress Tracking

| Date | Performance Score | LCP | TBT | Notes |
|------|-------------------|-----|-----|-------|
| 2026-01-02 | 42% | 6.9s | 2,730ms | Baseline measurement |
| | | | | |
| | | | | |

---

## Notes

- The site description in package.json says "Upgrades to any framework or library should be done never" - this policy needs to be reconsidered for performance reasons
- NextFaster uses React 19 RC and Next.js 15 canary - these provide significant performance improvements
- The 12.7 MB total payload is the biggest issue - need to identify what's being sent
- TTI of 69.2s is catastrophic and indicates severe JavaScript execution issues
