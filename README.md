# krisyotam.com

This is the blog that powers `krisyotam.com`, built on
[next.js](https://nextjs.org/) and
deployed to the cloud via [Vercel](https://vercel.com).

## Stability Notice

**IMPORTANT: This project has been stabilized with pinned dependency versions.**

- Next.js is locked to v14.2.26
- All dependencies have been pinned to specific versions
- Experimental Next.js features have been minimized
- TypeScript and ESLint have been configured to catch errors at build time

This approach ensures long-term stability without requiring frequent updates or chasing framework changes. Upgrades to any framework or library should only be done if absolutely necessary (e.g., critical security patches).

### Development

```bash
npm install  # Use exact versions in package.json
npm run dev  # Start development server
npm run build  # Build for production
npm start  # Start production server
```

### Pure components

Every stateless pure component is found under `./components`.

Every component that has to do with styling the post's markup
is found under `./components/post/`

These components make up the _style guide_ of the application.

### Blog posts

Every blog post is dynamically pulled from ghost as a headless cms.

You can set pages to renew after 30min in order to have cached static pages
and take advantage of automatic code splitting and lazy loading.

This means that the bloat of a single post doesn't "rub off on" the
rest of the site.

### Performance
[PageSpeed report](https://pagespeed.web.dev/analysis/https-krispuremath-vercel-app/wjowavujnl?form_factor=mobile) for Emulated Moto G Power with Lighthouse 11.0.0, Slow 4G Throttling:
![PageSpeed-Insights-01-19-2025_06_46_AM](https://github.com/user-attachments/assets/aa588b17-83e1-43f4-b1ba-58cabbc0ed80)

😔 The Accessibility `93` score cannot be `100` without sacrificing stylistic fidelity.</sup>

### API Endpoints

- `/api/get-script` - Serves the 404-suggester.js script for enhanced 404 pages
- `/api/data?file=[filename]` - Serves JSON data files from the data directory
- Various content endpoints for poems, others, directory, etc.

### Configuration

- `next.config.mjs` - Main Next.js configuration
- `global.d.ts` - TypeScript declarations for MDX and JSON imports
- `tailwind.config.js` - Tailwind CSS configuration











