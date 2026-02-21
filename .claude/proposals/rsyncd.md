# Proposal: Public rsyncd.conf Serving

**Author:** Claude
**Date:** 2026-02-20
**Status:** Draft

---

## Overview

Serve the site's `rsyncd.conf` publicly so users can discover available rsync modules. Two routes handle different use cases: one for viewing in-browser, one for downloading the raw file.

---

## Routes

| Route | Behavior | Content-Type |
|-------|----------|-------------|
| `/rsyncd.conf` | Serves the file inline (browser renders it) | `text/plain` |
| `/rsyncd` | Downloads the file as an attachment | `text/plain` with `Content-Disposition: attachment` |

---

## Implementation

### 1. Static file

Place `rsyncd.conf` in `public/rsyncd.conf`. This gives us `/rsyncd.conf` for free via Next.js static serving (inline, viewable in browser).

### 2. Download route

Create a route handler at `src/app/rsyncd/route.ts` that reads `public/rsyncd.conf` and serves it with a `Content-Disposition: attachment` header to trigger a download.

```ts
// src/app/rsyncd/route.ts
import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "rsyncd.conf")
  const content = readFileSync(filePath, "utf-8")

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": "attachment; filename=rsyncd.conf",
    },
  })
}
```

### 3. Reserved slug

Add `rsyncd` to the `RESERVED` set in `next.config.mjs` to prevent sexy URL collisions.

---

## rsyncd.conf Format

The conf file will contain both public and restricted modules. Restricted modules use `auth users` + a separate `secrets file` (never served publicly). Comments on restricted modules instruct users to email for access.

```ini
# ============================================================================
# rsyncd.conf — krisyotam.com
# Public rsync modules. Connect: rsync krisyotam.com::
# ============================================================================

# --- Public Modules ---------------------------------------------------------

[papers]
    path = /srv/rsync/papers
    comment = Published papers and research
    read only = yes
    list = yes

[dotfiles]
    path = /srv/rsync/dotfiles
    comment = Public dotfiles (lazykris)
    read only = yes
    list = yes

# --- Restricted Modules -----------------------------------------------------
# These modules require authentication.
# Email krisyotam@protonmail.com to request access credentials.

[archive]
    path = /srv/rsync/archive
    comment = Personal archive (request access via email)
    auth users = *
    secrets file = /etc/rsyncd.secrets
    read only = yes
    list = yes
```

### Security notes

- `rsyncd.secrets` (user:password pairs) is a separate file, chmod 600, owned by root. Never served publicly.
- The public conf contains no credentials — only module names, paths, descriptions, and auth directives.
- This is standard practice (kernel.org, archlinux.org, university mirrors all publish their module lists).

---

## Contact page integration (optional)

Add an rsync entry to the contact page or a dedicated `/mirrors` page listing available modules, similar to how PGP is presented. Low priority — the conf file itself serves as documentation.

---

## Timeline

Blocked until rsync servers are deployed (ETA: ~2 months). The site-side implementation (`/rsyncd`, `/rsyncd.conf`, reserved slug) can be scaffolded ahead of time with a placeholder conf.
