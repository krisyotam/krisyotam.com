# IndieWeb / Long Now Alignment

Reference: IndieWeb, Seirdy's best practices, werc, Gwern's Long Site/Long Content

---

## Option 1: Stay on Next.js, Add IndieWeb Layer (Minimal Change)

Keep everything, add IndieWeb building blocks:

- [ ] **Microformats2** - Add h-entry, h-card markup to HTML output
- [ ] **Webmentions endpoint** - Receive/send webmentions for cross-site conversation
- [ ] **IndieAuth** - Implement for decentralized login using your domain
- [ ] **rel="me" links** - Identity verification across platforms
- [ ] **Link archiving** - Archive all external links (archive.org, local mirrors)
- [ ] **POSSE workflow** - Publish on Own Site, Syndicate Elsewhere

**Gains**: IndieWeb membership, some resilience
**Keeps**: All current features
**Loses**: Nothing immediate
**Durability**: Still fragile (Next.js dependency complexity remains)

---

## Option 2: Hybrid Static Export (Medium Change)

Use Next.js `output: 'export'` for fully static HTML:

- [ ] Convert API routes to build-time data fetching
- [ ] Remove server-side features requiring runtime
- [ ] Pre-render everything to static HTML
- [ ] Keep MDX content structure intact
- [ ] Cache external API data at build time

**Gains**: Truly static output, archivable, faster
**Keeps**: React components, most features
**Loses**: Dynamic API routes, SSR, real-time features (live Spotify, etc.)
**Durability**: Better (static HTML survives), build system still complex

---

## Option 3: Hugo/Zola/Eleventy Migration (Major Change)

Move to a truly static site generator:

| Generator | Language | Build Speed | Notes |
|-----------|----------|-------------|-------|
| Hugo | Go | Blazing fast | Single binary, templating learning curve |
| Zola | Rust | Very fast | Similar to Hugo, fewer themes |
| Eleventy | JS | Fast | Familiar syntax, flexible |

Migration tasks:
- [ ] Port MDX content to Markdown with frontmatter
- [ ] Convert React components to templates or vanilla JS
- [ ] Move database queries to build-time JSON generation
- [ ] Replace interactive features with progressive enhancement
- [ ] Pre-generate all dynamic content as static JSON

**Gains**: True static output, simpler build (single binary), faster builds, long-term durability
**Keeps**: Content structure, most presentation
**Loses**: React ecosystem, complex interactivity, Next.js DX, server-side features

---

## Option 4: Radical Simplicity - werc/Plain HTML (Nuclear Option)

The werc philosophy: "150 lines of code."

- [ ] Convert to plain Markdown/HTML
- [ ] Use minimal or no template system
- [ ] No JavaScript (or minimal vanilla JS only)
- [ ] Static file serving exclusively
- [ ] Hand-craft essential pages

**Gains**: Maximum durability (plain HTML lasts forever), fastest loads, no build system
**Keeps**: Core content
**Loses**: Almost all current features, modern aesthetics, component library, DX

---

## Recommendation: Pragmatic Long Now

Given:
- Next.js/React investment is significant
- Content already in portable formats (MDX, SQLite)
- Aesthetics and features are essential, not optional

**Implement Option 1 + content durability practices:**

1. **Add IndieWeb building blocks**
   - Microformats2 in templates
   - Webmentions support
   - IndieAuth implementation
   - rel="me" links

2. **Implement link archiving**
   - Automatic archive.org submissions
   - Local mirrors of critical external resources
   - PDF snapshots of key references

3. **Reduce external API dependencies**
   - Cache Spotify/MAL/TMDB data locally
   - Build-time fetch where possible
   - Graceful degradation when APIs fail

4. **Document architecture**
   - Migration guide for future self
   - Dependency audit and justification
   - Content extraction procedures

5. **Regular content exports**
   - Plain Markdown + JSON metadata backups
   - Database dumps to version control
   - Independent of Next.js for recovery

6. **Accept the trade-off**
   - Content will survive (MDX is durable)
   - Presentation may not (React is ephemeral)
   - The framework is decoration around durable content

---

## Philosophy

The MDX files with YAML frontmatter are the Long Now insurance policy. If Next.js dies, content ports to whatever comes next. React components are ephemeral decoration around durable content.

You cannot fully embody minimalist web principles while using Next.js. But you can get 70-80% of the benefit by ensuring *content* is durable even if *site presentation* is not.

---

# Building Blocks: Deep Dive

## 1. rel="me" Links

### What It Is

**Just an HTML attribute.** Nothing more.

```html
<a href="https://github.com/krisyotam" rel="me">GitHub</a>
<a href="https://twitter.com/krisyotam" rel="me">Twitter</a>
```

### What It Does

It says "this link points to another page that is also me."

When GitHub/Twitter/Mastodon see that your profile links back to krisyotam.com, and krisyotam.com has `rel="me"` pointing to them, they show a **verified checkmark**.

### Implementation

Add `rel="me"` to the social links in your footer/contact page. That's it.

Then make sure each of those profiles has a link back to krisyotam.com.

**Mastodon**: Green checkmark appears next to your website
**GitHub**: Verifies your website field
**Threads**: Shows bidirectional link icon

### Effort: 5 minutes

Just add the attribute to your existing social links.

---

## 2. Microformats2

### What It Is

**CSS classes that machines can read.**

Your HTML already has classes for styling (`className="text-lg font-bold"`). Microformats adds classes that tell machines what the content *means*.

### Not Alongside Markdown — It's in the React Components

Your MDX stays exactly the same. You add microformat classes to the **components that render the MDX**.

**Before (your PostHeader):**
```tsx
<article>
  <h1>{title}</h1>
  <time>{date}</time>
  <div>{content}</div>
</article>
```

**After (with microformats):**
```tsx
<article className="h-entry">
  <h1 className="p-name">{title}</h1>
  <time className="dt-published" dateTime={date}>{date}</time>
  <div className="e-content">{content}</div>
  <a className="u-url" href={permalink}>permalink</a>
</article>
```

### What It's Used For

When another site wants to understand your content (for webmentions, feed readers, etc.), they fetch your HTML and look for these classes:

- `h-entry` = "this is a post"
- `p-name` = "this is the title"
- `dt-published` = "this is when it was published"
- `e-content` = "this is the actual content"
- `u-url` = "this is the permanent link"

**Without microformats**: Other sites see a blob of HTML, can't understand structure
**With microformats**: Other sites can parse your posts programmatically

### Effort: 1-2 hours

Add classes to PostHeader, author card, and content wrapper components.

---

## 3. Webmentions

### What It Is (Simple Version)

**Notifications between websites.**

When someone writes a blog post on their site that links to your post on your site, you get notified. Their post can then appear as a "comment" on your post — even though they never visited your site.

### The Flow

```
1. Jane writes a post on jane.com
2. Jane's post contains a link to krisyotam.com/blog/something
3. Jane's site sends a notification to krisyotam.com:
   "Hey, jane.com/post just mentioned krisyotam.com/blog/something"
4. Your site fetches jane.com/post, sees the link is real
5. Your site parses jane.com/post (using microformats) to understand:
   - Is this a reply? A like? A repost? Just a mention?
6. Jane's response appears on your post
```

### Why This Matters

Comments without a comment system. Discussion without a centralized platform. Jane's words live on her site, but appear on yours too.

### Implementation Options

**Easy (use a service):**

Add this to your `<head>`:
```html
<link rel="webmention" href="https://webmention.io/krisyotam.com/webmention">
```

Sign up at webmention.io (free). It collects mentions for you. Fetch them via API and display on your posts.

**Harder (self-hosted):**

Build an API endpoint that:
1. Receives POST requests with `source` and `target` URLs
2. Fetches the source URL
3. Verifies it actually links to the target
4. Parses microformats to understand the mention type
5. Stores it in your database
6. Displays on the relevant post

### Sending Webmentions

When YOU publish a post with external links, you can notify those sites too.

**Manual**: Use webmention.app to send
**Automatic**: Script that runs on deploy, finds all external links, sends webmentions

### Effort: 2-4 hours for receiving (with webmention.io), more for self-hosted

---

## 4. IndieAuth

### What It Is (Simple Version)

**"Log in with your website" instead of "Log in with Google"**

When you go to a site that supports IndieAuth, you type `krisyotam.com` as your username. The site then verifies you own that domain.

### Is This Part of Your Site?

**It can be either:**

**Option A: Delegate to a service (easy)**

Add to your `<head>`:
```html
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://indieauth.com/token">
```

Now when you "log in with krisyotam.com", the site redirects to indieauth.com, which verifies you via your `rel="me"` links (e.g., asks you to log into GitHub to prove you're you).

**Option B: Self-hosted (more control)**

Build your own authorization endpoint. You control exactly how you authenticate (password, passkey, email code, etc.).

### What This Enables

- **Micropub clients**: Apps like iA Writer or Quill can post directly to your site
- **IndieWeb wiki**: Edit with your domain as identity
- **Social readers**: Log in to indie feed readers
- **Any IndieAuth-supporting service**: Your domain is your universal login

### Effort: 30 minutes for delegation, several hours for self-hosted

---

## 5. Link Archiving

### What It Is

**Automatically saving copies of every link you cite, so when the original dies, you still have it.**

### Is It Automatic?

**You make it automatic.** Here's how:

### Implementation Plan

**Step 1: Build-time script**

Create a script that runs during `npm run build`:

```js
// scripts/archive-links.js
// 1. Scan all MDX files for external URLs
// 2. For each URL, check if we've archived it before
// 3. If not, submit to archive.org:
//    fetch(`https://web.archive.org/save/${url}`)
// 4. Store the archive URL in a database/JSON file
```

**Step 2: Store the mappings**

```json
// public/data/archives.json
{
  "https://example.com/article": {
    "archived": "2026-02-09",
    "archiveUrl": "https://web.archive.org/web/20260209/https://example.com/article"
  }
}
```

**Step 3: Display fallbacks**

In your link components, check if original is dead → show archive link instead.

### Internet Archive Integration

The Internet Archive has a simple API:

```bash
# Save a URL
curl -I "https://web.archive.org/save/https://example.com/article"

# Check if archived
curl "https://archive.org/wayback/available?url=example.com/article"
```

### Effort: 4-8 hours for a robust system

---

## 6. POSSE (Publish Own Site, Syndicate Elsewhere)

### What It Is (Simple Version)

**Yes, it's auto-posting to other networks. But YOUR site is the original.**

Instead of:
- Tweet something → Twitter owns it → hope it doesn't disappear

You do:
- Write on krisyotam.com → automatically post to Twitter/Mastodon/Bluesky with a link back

### The Key Difference

**Without POSSE**: Content lives on Twitter. If Twitter dies or bans you, it's gone.
**With POSSE**: Content lives on krisyotam.com. Copies exist on Twitter for reach. Canonical URL is yours.

### Implementation Options

**Manual POSSE (easiest):**
1. Publish blog post
2. Manually tweet "New post: [title] — [link to your site]"
3. Manually toot on Mastodon
4. etc.

**Semi-automatic (webhooks):**
1. Publish blog post
2. Deploy triggers a webhook
3. Webhook posts to Twitter API, Mastodon API, etc.

**Fully automatic with Bridgy:**

[brid.gy](https://brid.gy) is a free service that:
- Reads your site's h-feed (microformats)
- Posts new entries to Twitter/Mastodon/Bluesky/etc.
- **Backfeeds** responses: when someone replies on Twitter, Bridgy sends a webmention to your site

### The Dream Setup

```
1. You write a post in MDX
2. You deploy
3. Bridgy sees the new h-entry
4. Bridgy posts to Twitter: "New post: [title] krisyotam.com/blog/..."
5. Someone replies on Twitter
6. Bridgy sends webmention to your site
7. Their reply appears as a comment on your original post
```

Your site becomes the hub. Silos become distribution channels.

### Effort: 2-4 hours with Bridgy, more for custom automation

---

# Implementation Priority

Based on effort vs. value:

| Building Block | Effort | Value | Priority |
|----------------|--------|-------|----------|
| rel="me" | 5 min | Medium | **Do first** |
| Microformats2 | 1-2 hrs | High | **Do second** |
| Link archiving | 4-8 hrs | High | **Do third** |
| Webmentions (receiving) | 2-4 hrs | Medium | Do fourth |
| IndieAuth (delegated) | 30 min | Low | Do fifth |
| POSSE | 2-4 hrs | Medium | Do sixth |

---

## Status

- [ ] Review and prioritize items
- [ ] Add rel="me" to social links
- [ ] Add microformat classes to PostHeader, author card
- [ ] Build link archiving script
- [ ] Set up webmention.io
- [ ] Add IndieAuth delegation
- [ ] Configure Bridgy for POSSE
