# krisyotam.com

This is the blog that powers `krisyotam.com`, built on
[next.js](https://nextjs.org/) and
deployed to the cloud via [Vercel](https://vercel.com).

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
