# gwern.net Architecture Notes

Reference notes from exploring `/dev/gwern.net`. For future use when building annotation, automation, and AI-assisted content tooling for krisyotam.com.

---

## Content System

- **Framework**: Custom Hakyll (Haskell) static site generator + Pandoc. No Next.js, no React, no MDX.
- **Content format**: Plain Markdown with YAML frontmatter. Strictly validated schema (title, description, created, status mandatory).
- **Build**: `sync.sh` compiles Haskell generators, runs Hakyll, does HTML tidy, MathJax pre-render, link checking, image optimization, then rsyncs to server.
- **Components**: Not React/JSX. Pandoc AST transformations in Haskell (auto-linking, interwiki links, typography, inflation adjustment, etc.)

## Tag System

Tags are **filesystem directories**, not database entries:
- `ai/nn/transformer/gpt` maps to `doc/ai/nn/transformer/gpt/index.md` on disk
- Hierarchical: more specific tags suppress parent tags in display
- Validated against actual directories on disk at build time
- Tag directory pages are auto-generated listings of all annotated links with that tag

## Blog System

Blog posts are NOT hand-written. They are:
- Auto-generated stubs from the **annotation database** (`.gtx` files)
- Each stub transcludes an annotation with `id: gwern-YYYY-slug`
- A "blog post" is a named alias to a URL annotation

## Annotation System (Core)

Every hyperlink on the site can have a hover popup showing title, authors, date, tags, and abstract. This is the heart of gwern.net.

### Data Model

Each annotation is a 7-tuple (`MetadataItem` in Haskell):
```
(Title, Author, Date, DateCreated, KV-pairs, Tags, Abstract)
```

### GTX File Format

Custom newline-delimited flat-file format (replaced YAML/Haskell Read/Show):
```
---
https://arxiv.org/abs/1706.03762
Attention Is All You Need
Ashish Vaswani, Noam Shazeer, Niki Parmar, ...
12 June 2017
10.48550/arXiv.1706.03762
ai/nn/transformer
<p>The dominant sequence transduction models are based on complex recurrent...</p>
```

### Four GTX Files (Priority Order)

| File | Purpose | Priority |
|------|---------|----------|
| `me.gtx` | Gwern's own essays (self-annotations) | Highest |
| `full.gtx` | Hand-written annotations with full abstracts | 2nd |
| `half.gtx` | Tagged but no written abstract | 3rd |
| `auto.gtx` | Auto-scraped by the build system | Lowest |

Left-biased merge: higher files override lower. "Promoting" = moving entry upward.

### Automated Annotation Pipeline

When the build encounters an unseen link:

1. **URL dispatch** routes by domain to a specialized scraper:
   - `arxiv.org` -> arXiv API (XML)
   - `biorxiv.org` -> scrape `<meta>` tags
   - `openreview.net` -> custom shell scraper
   - Local `.pdf` -> `exiftool` + CrossRef API by DOI
   - Local gwern essay -> curl compiled HTML, extract `<meta>` + `<div class="abstract">`
   - Generic URL -> download HTML, extract `<title>`

2. **LLM post-processing** (GPT via OpenAI API):
   - `paragraphizer.py` (GPT-4o) - reflows single-paragraph abstracts >768 chars into multi-paragraph
   - `italicizer.py` (GPT-4.1) - adds `<em>` italics to book/film/species titles
   - `title-cleaner.py` (GPT-4.1) - strips boilerplate from scraped `<title>` tags
   - `date-guesser.py` (GPT-4o) - guesses date from URL/title when none found

3. **Auto-linking** - scans abstract for known phrases, auto-links to Wikipedia/relevant pages

4. **Storage** - appended to `metadata/auto.gtx`

5. **Fragment generation** - each annotation rendered to `metadata/annotation/<url>.html` for popup JS

### Manual Workflow Tools

- **`gwa <query>`** - search all annotations from CLI
- **`gwtag URL tag1 tag2`** - add tags, promotes from auto.gtx to half.gtx
- **`link-prioritize.hs`** - ranks unannotated URLs by backlink count (what to annotate next)
- **`link-suggester.hs`** - builds Emacs auto-complete dictionary of (anchor text -> URL) pairs
- **`preprocess-markdown.hs`** - Emacs helper: pipe draft annotation for preview with auto-links + "See Also" suggestions

## Similarity/Seriation System

`GenerateSimilar.hs` implements:
- OpenAI embeddings (`text-embedding-3-large`, 512 dims) via `embed.sh`
- RP-tree (random projection tree) vector index for nearest-neighbor lookup
- `sortSimilars` - greedy TSP-like nearest-neighbor walk for ordering items by semantic similarity
- `clusterIntoSublist` - clusters sorted list by largest pairwise distance gaps
- `tagguesser.py` (GPT-4o-mini) auto-labels each cluster

This is what "seriate.py" would have been - the seriation is implemented in Haskell, not Python.

## File Upload System

**`upload.sh`** - auto-lowercases, converts WebP->PNG, renames `surname1994.pdf` -> `1994-surname.pdf`, strips EXIF, OCR+JBIG2 compresses PDFs, avoids filename collisions, rsyncs to production.

**`linkArchive.sh`** - archives URLs as local SingleFile HTML snapshots by SHA1 hash.

## Integrity Checks (Build-Time)

Every build validates:
- No duplicate URLs or abstracts across GTX files
- All tags exist as directories on disk
- DOI format validation
- Balanced quotes/brackets in abstracts and titles
- Date format validation (not in future)
- Local file existence for all local paths
- Link ID uniqueness

## Key Scripts Reference

### Haskell
| Script | Purpose |
|--------|---------|
| `hakyll.hs` | Core static site compiler |
| `generateBacklinks.hs` | Bidirectional link database |
| `generateDirectory.hs` | Tag directory index pages |
| `generateSimilarLinks.hs` | "See Also" via embeddings |
| `changeTag.hs` | Rename tags site-wide |
| `rename.hs` | Rename files + update all references |
| `link-prioritize.hs` | Rank unannotated links by backlink count |
| `link-suggester.hs` | Emacs auto-link dictionary |
| `preprocess-markdown.hs` | Emacs annotation preview helper |
| `checkMetadata.hs` | Validate annotation DB |

### Python (LLM-Assisted)
| Script | Model | Purpose |
|--------|-------|---------|
| `paragraphizer.py` | GPT-4o | Reflow single-paragraph abstracts |
| `italicizer.py` | GPT-4.1 | Add semantic italics to titles |
| `title-cleaner.py` | GPT-4.1 | Clean scraped `<title>` tags |
| `date-guesser.py` | GPT-4o | Extract dates from natural language |
| `tagguesser.py` | GPT-4o-mini | Auto-label article clusters |

### Shell
| Script | Purpose |
|--------|---------|
| `sync.sh` | Master build+deploy |
| `upload.sh` | File upload with auto-processing |
| `linkArchive.sh` | URL archival as SingleFile HTML |
| `embed.sh` | OpenAI embeddings API call |
| `bash.sh` | Shell helpers (gwsed, gwmv, gwa, gwtag, etc.) |
