# Dependency Analysis

**Total Dependencies:** 116 (production) + 16 (dev) = **132 packages**

This document analyzes all dependencies and provides recommendations for reducing the dependency count.

---

## Summary by Category

| Category | Count | Reduction Potential |
|----------|-------|---------------------|
| Core Framework | 4 | None |
| Radix UI (shadcn) | 25 | Low |
| Animation | 5 | High |
| MDX/Markdown | 17 | Medium |
| Database/Storage | 5 | High |
| GraphQL | 3 | High |
| Maps | 4 | None (if needed) |
| Forms | 3 | None |
| Icons | 2 | Medium |
| Charts | 1 | None |
| UI Components | 13 | Medium |
| Utilities | 15 | High |
| Other | 19 | Medium |

---

## Detailed Dependency Tree

### Core Framework (Required - 4 packages)
```
next@14.2.26
react@18.3.1
react-dom@18.3.1
typescript@5.8.3 (dev)
```
**Notes:** Cannot reduce. These are essential.

---

### Radix UI / shadcn Components (25 packages)
```
@radix-ui/react-accordion@1.2.2
@radix-ui/react-alert-dialog@1.1.4
@radix-ui/react-aspect-ratio@1.1.1
@radix-ui/react-avatar@1.1.2
@radix-ui/react-checkbox@1.1.3
@radix-ui/react-collapsible@1.1.2
@radix-ui/react-context-menu@2.2.4
@radix-ui/react-dialog@1.1.4
@radix-ui/react-dropdown-menu@2.1.4
@radix-ui/react-hover-card@1.1.4
@radix-ui/react-label@2.1.1
@radix-ui/react-menubar@1.1.4
@radix-ui/react-navigation-menu@1.2.3
@radix-ui/react-popover@1.1.4
@radix-ui/react-progress@1.1.1
@radix-ui/react-radio-group@1.2.2
@radix-ui/react-scroll-area@1.2.2
@radix-ui/react-select@2.1.4
@radix-ui/react-separator@1.1.1
@radix-ui/react-slider@1.2.2
@radix-ui/react-slot@1.2.0
@radix-ui/react-switch@1.1.2
@radix-ui/react-tabs@1.1.2
@radix-ui/react-toast@1.2.4
@radix-ui/react-toggle@1.1.1
@radix-ui/react-toggle-group@1.1.1
@radix-ui/react-tooltip@1.1.6
```
**Supporting:**
```
class-variance-authority@0.7.1
clsx@2.1.1
tailwind-merge@2.6.0
tailwindcss-animate@1.0.7
```
**Notes:**
- Audit which Radix components are actually used
- Remove unused components (check imports across codebase)
- Consider: `@radix-ui/react-aspect-ratio`, `@radix-ui/react-menubar`, `@radix-ui/react-context-menu` may be unused

---

### Animation (5 packages) - HIGH REDUCTION POTENTIAL
```
framer-motion@12.4.10
motion@12.23.12          ⚠️ DUPLICATE - same library, different package name
@tsparticles/engine@3.9.1
@tsparticles/react@3.0.0
@tsparticles/slim@3.9.1
cobe@0.6.4               (3D globe animation)
```
**Notes:**
- `motion` and `framer-motion` are the same library - **REMOVE ONE** (save 1 package)
- `@tsparticles/*` - If only used for one effect, consider removing (save 3 packages)
- `cobe` - Only needed if using the 3D globe on the tracking page

**Potential savings: 1-4 packages**

---

### MDX/Markdown Processing (17 packages) - MEDIUM REDUCTION POTENTIAL
```
@mdx-js/loader@3.1.0
@mdx-js/react@3.1.0
@next/mdx@13.5.6
@types/mdx@2.0.13
next-mdx-remote@5.0.0
gray-matter@4.0.3
marked@15.0.7            ⚠️ Potentially redundant with react-markdown
react-markdown@10.1.0

rehype-autolink-headings@7.1.0
rehype-highlight@7.0.2
rehype-katex@7.0.1
rehype-raw@7.0.0
rehype-sanitize@6.0.0
rehype-slug@6.0.0
rehype-stringify@10.0.1

remark@15.0.1
remark-breaks@4.0.0
remark-gfm@4.0.1
remark-html@16.0.1       ⚠️ Redundant if using rehype-stringify
remark-math@6.0.0
remark-mdx@3.1.0

unist-util-visit@5.0.0
```
**Notes:**
- `marked` might be redundant if using `react-markdown` (save 1 package)
- `remark-html` is redundant with `rehype-stringify` (save 1 package)
- Consolidate MDX approach: use either `@next/mdx` OR `next-mdx-remote`, not both

**Potential savings: 2-3 packages**

---

### Database/Storage (5 packages) - HIGH REDUCTION POTENTIAL
```
better-sqlite3@12.5.0     ✓ Local SQLite (currently in use)
@supabase/supabase-js@2.89.0   ⚠️ Check if actively used
@upstash/redis@1.35.0     ⚠️ Check if actively used
ioredis@5.6.1             ⚠️ Check if actively used (duplicate Redis client?)
firebase@11.8.1           ⚠️ Large package - check if actively used
```
**Notes:**
- You have 3 different Redis/cache solutions - likely only need one
- Firebase is a massive bundle (~1MB) - verify it's actually needed
- Consolidate to `better-sqlite3` for local data + one remote option

**Potential savings: 2-4 packages**

---

### GraphQL (3 packages) - HIGH REDUCTION POTENTIAL
```
@apollo/client@3.13.8
graphql@16.11.0
graphql-ws@5.16.0
```
**Notes:**
- Check if any page actually uses GraphQL
- If only fetching REST APIs, these can all be removed
- Apollo Client alone is ~50KB gzipped

**Potential savings: 0-3 packages**

---

### Maps (4 packages)
```
mapbox-gl@3.10.0
mapbox-gl-globe-minimap@1.2.0
mapbox-gl-style-switcher@1.0.11
react-map-gl@8.0.1
```
**Notes:**
- Required if using the globe/map features
- If maps are rarely used, consider lazy loading or removing entirely

---

### Forms (3 packages)
```
@hookform/resolvers@3.9.1
react-hook-form@7.54.1
zod@3.24.1
```
**Notes:** Keep - standard form validation stack.

---

### Icons (2 packages) - MEDIUM REDUCTION POTENTIAL
```
lucide-react@0.454.0
@tabler/icons-react@3.34.1
```
**Notes:**
- Having two icon libraries is redundant
- Audit which icons are used from each library
- Migrate all icons to one library (prefer `lucide-react` - more common)

**Potential savings: 1 package**

---

### Charts (1 package)
```
recharts@2.15.0
```
**Notes:** Keep if using charts. Large but necessary.

---

### UI Components (13 packages) - MEDIUM REDUCTION POTENTIAL
```
embla-carousel-react@8.5.1    (carousels)
cmdk@1.1.1                    (command palette)
sonner@1.7.1                  (toast notifications)
vaul@0.9.6                    (drawer component)
react-resizable-panels@2.1.7
react-syntax-highlighter@15.6.1
react-tooltip@5.28.1          ⚠️ Redundant with @radix-ui/react-tooltip
react-wrap-balancer@1.1.1
react-window@1.8.11           (virtualization)
react-draggable@4.4.6
input-otp@1.4.1
spoiled@0.4.0                 (spoiler text)
@headlessui/react@2.2.4       ⚠️ Redundant with Radix UI
react-intersection-observer@9.16.0
```
**Notes:**
- `react-tooltip` is redundant with `@radix-ui/react-tooltip` (save 1 package)
- `@headlessui/react` overlaps significantly with Radix UI (save 1 package)
- `spoiled` - check if still used
- `react-draggable` - check if still used

**Potential savings: 2-4 packages**

---

### Social/Embeds (1 package)
```
react-tweet@3.2.2
```
**Notes:** Keep if embedding tweets.

---

### Auth/Security (1 package)
```
bcryptjs@3.0.2
```
**Notes:** Keep for password hashing.

---

### Email (1 package)
```
nodemailer@6.10.0
```
**Notes:** Keep if sending emails.

---

### Payment (1 package)
```
stripe@17.7.0
```
**Notes:** Keep if using Stripe payments.

---

### SEO (1 package)
```
next-seo@6.6.0
```
**Notes:** Keep - important for SEO.

---

### Theming (2 packages)
```
next-themes@0.4.6
geist@1.5.1 (Vercel's font)
```
**Notes:** Keep.

---

### Date/Time (2 packages)
```
date-fns@2.30.0
react-day-picker@8.10.1
```
**Notes:** Keep.

---

### Utilities (15 packages) - HIGH REDUCTION POTENTIAL
```
dotenv@16.5.0
fs-extra@11.3.0
node-fetch@3.3.2         ⚠️ Not needed in Next.js (has native fetch)
path@0.12.7              ⚠️ Built into Node.js - shouldn't need this
uuid@11.1.0
image-size@2.0.2
mime-types@3.0.2
katex@0.16.22            (math rendering)
acorn@8.14.1             (JS parser)
escodegen@2.1.0          (code generator)
@msgpack/msgpack@3.1.1   ⚠️ Duplicate msgpack library
msgpack-lite@0.1.26      ⚠️ Duplicate msgpack library
kris-yotam@file:         ⚠️ Self-reference - can remove
react-markdown@10.1.0    (listed above in MDX section)
```
**Notes:**
- `node-fetch` is not needed in Next.js which has native fetch (save 1 package)
- `path` is built into Node.js - remove this (save 1 package)
- Two msgpack libraries - pick one (save 1 package)
- `kris-yotam@file:` is a self-reference - should be removed (save 1 package)

**Potential savings: 4 packages**

---

### Dev Dependencies (16 packages)
```
@types/better-sqlite3@7.6.13
@types/escodegen@0.0.10
@types/mapbox-gl@3.4.1
@types/mime-types@3.0.1
@types/node@22.15.3
@types/nodemailer@6.4.17
@types/react@18.3.20
@types/react-dom@18.3.7
@types/react-syntax-highlighter@15.5.13
@types/react-window@1.8.8
autoprefixer@10.4.20
postcss@8.5.2
tailwindcss@3.4.17
boxen@8.0.1              ⚠️ Check if used (CLI styling)
chalk@5.6.2              ⚠️ Check if used (CLI colors)
enquirer@2.4.1           ⚠️ Check if used (CLI prompts)
```
**Notes:**
- `boxen`, `chalk`, `enquirer` are CLI tools - verify they're used in scripts
- Type packages can't be removed if using TypeScript

---

## Recommended Actions

### Immediate (Easy wins)

| Package | Action | Savings |
|---------|--------|---------|
| `motion` | Remove (duplicate of framer-motion) | 1 |
| `node-fetch` | Remove (Next.js has native fetch) | 1 |
| `path` | Remove (built into Node.js) | 1 |
| `msgpack-lite` OR `@msgpack/msgpack` | Remove one | 1 |
| `kris-yotam@file:` | Remove self-reference | 1 |
| `react-tooltip` | Remove (use @radix-ui/react-tooltip) | 1 |
| `remark-html` | Remove (use rehype-stringify) | 1 |

**Immediate savings: ~7 packages**

### Audit Required

| Package | Check if used | Potential Savings |
|---------|---------------|-------------------|
| `@supabase/supabase-js` | Check usage | 1 |
| `@upstash/redis` | Check usage | 1 |
| `ioredis` | Check usage (duplicate Redis?) | 1 |
| `firebase` | Check usage (large bundle) | 1 |
| `@apollo/client` + GraphQL | Check usage | 3 |
| `@headlessui/react` | Overlaps with Radix UI | 1 |
| `@tabler/icons-react` | Migrate to lucide-react | 1 |
| `@tsparticles/*` | Check if particle effects needed | 3 |
| `marked` | Check if needed alongside react-markdown | 1 |
| Various Radix components | Check actual usage | 3-5 |

**Potential audit savings: ~10-17 packages**

### Long-term Considerations

1. **Consolidate Database Strategy**: Pick one remote storage solution
2. **Consolidate Icon Library**: Migrate all icons to lucide-react
3. **Remove GraphQL**: If not using a GraphQL API, remove Apollo entirely
4. **Lazy Load Heavy Packages**: Maps, charts, and particles could be dynamically imported

---

## Quick Reference: Packages by Bundle Size Impact

**Large bundles (>100KB gzipped):**
- `firebase` (~1MB) - Consider removal
- `@apollo/client` (~50KB)
- `recharts` (~150KB)
- `mapbox-gl` (~200KB)
- `framer-motion` (~30KB)
- `react-syntax-highlighter` (~40KB with themes)

**Medium bundles (30-100KB):**
- `@supabase/supabase-js`
- `stripe`
- Various Radix components

---

## Summary

| Metric | Current | After Immediate | After Full Audit |
|--------|---------|-----------------|------------------|
| Total packages | 132 | ~125 | ~108-115 |
| Reduction | - | 7 | 17-24 |

**Priority order for cleanup:**
1. Remove obvious duplicates (motion, msgpack, path, node-fetch)
2. Audit database/cache usage (firebase, supabase, redis variants)
3. Audit GraphQL usage
4. Consolidate icon libraries
5. Remove unused Radix components
