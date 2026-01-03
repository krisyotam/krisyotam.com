# Task 5: Backlinks, Similar Links, and Bibliography

## Architecture Overview

Building on the database architecture from tasks2-4:

| Feature | Storage | Why |
|---------|---------|-----|
| **Backlinks** | `content.db` (new tables) | Relational data - page A links to page B |
| **Bibliography** | `content.db` (new tables) | Relational data - outgoing links per page |
| **Similar** | **Milvus** (vector DB) | Semantic similarity requires vector search |

---

## Why Milvus for Similar Links

Milvus is the right choice because:
- **Open source** (Apache 2.0)
- **Written in Go** (fast, reliable)
- **Purpose-built for vectors** - cosine similarity, HNSW indexing out of the box
- **Scales** - handles millions of vectors efficiently
- **Self-hosted** - runs via Docker, no external dependencies
- **Gwern-inspired** - he uses embeddings + vector search for his similar links

SQLite can't efficiently do:
```sql
-- This doesn't exist in SQL
SELECT * FROM posts ORDER BY cosine_similarity(embedding, target_embedding) LIMIT 5
```

Milvus does this natively:
```python
results = collection.search(
    data=[target_embedding],
    anns_field="embedding",
    param={"metric_type": "COSINE", "params": {"nprobe": 10}},
    limit=5
)
```

---

## Database Schema Additions

### content.db - New Tables

```sql
-- ===========================================
-- BACKLINKS: Who links to whom
-- ===========================================
CREATE TABLE backlinks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_slug TEXT NOT NULL,           -- The page being linked TO
  target_anchor TEXT,                  -- Optional #anchor
  source_slug TEXT NOT NULL,           -- The page containing the link
  source_type TEXT NOT NULL,           -- 'blog', 'essay', 'note', etc.
  context TEXT,                        -- ~150 chars surrounding the link
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(target_slug, target_anchor, source_slug)
);

CREATE INDEX idx_backlinks_target ON backlinks(target_slug);
CREATE INDEX idx_backlinks_source ON backlinks(source_slug);

-- ===========================================
-- BIBLIOGRAPHY: Outgoing links per page
-- ===========================================
CREATE TABLE bibliography (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_slug TEXT NOT NULL,           -- The page containing links
  source_type TEXT NOT NULL,           -- 'blog', 'essay', etc.
  href TEXT NOT NULL,                  -- The link URL
  link_text TEXT,                      -- Anchor text
  is_internal BOOLEAN DEFAULT 0,       -- Internal vs external
  target_slug TEXT,                    -- If internal: the target page slug
  domain TEXT,                         -- If external: domain name
  context TEXT,                        -- Surrounding text
  position INTEGER,                    -- Order in document

  UNIQUE(source_slug, href, position)
);

CREATE INDEX idx_bib_source ON bibliography(source_slug);
CREATE INDEX idx_bib_target ON bibliography(target_slug);
CREATE INDEX idx_bib_domain ON bibliography(domain);

-- ===========================================
-- EMBEDDINGS METADATA: Track what's been embedded
-- ===========================================
CREATE TABLE embeddings_meta (
  slug TEXT PRIMARY KEY,
  content_hash TEXT NOT NULL,          -- MD5 of content for cache invalidation
  embedded_at TEXT,                    -- When embedding was generated
  model TEXT                           -- Which model was used
);
```

---

## Milvus Setup

### Collection Schema

```python
from pymilvus import CollectionSchema, FieldSchema, DataType

fields = [
    FieldSchema(name="slug", dtype=DataType.VARCHAR, max_length=512, is_primary=True),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=384),  # all-MiniLM-L6-v2
    FieldSchema(name="content_type", dtype=DataType.VARCHAR, max_length=64),
    FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=512),
]

schema = CollectionSchema(fields, description="krisyotam.com content embeddings")
```

### Index Configuration

```python
index_params = {
    "metric_type": "COSINE",
    "index_type": "HNSW",
    "params": {"M": 16, "efConstruction": 256}
}

collection.create_index("embedding", index_params)
```

### Docker Compose for Milvus

```yaml
# docker/milvus/docker-compose.yml
version: '3.5'

services:
  etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.5
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/etcd:/etcd
    command: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd

  minio:
    container_name: milvus-minio
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/minio:/minio_data
    command: minio server /minio_data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.3.3
    command: ["milvus", "run", "standalone"]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/milvus:/var/lib/milvus
    ports:
      - "19530:19530"
      - "9091:9091"
    depends_on:
      - "etcd"
      - "minio"

networks:
  default:
    name: milvus
```

---

## File Structure

```
/home/krisyotam/Dev/krisyotam.com/
├── scripts/
│   ├── backlinks.ts              # Generate backlinks data → content.db
│   ├── similar.ts                # Generate embeddings → Milvus
│   └── bib.ts                    # Generate bibliography → content.db
│
├── docker/
│   └── milvus/
│       └── docker-compose.yml    # Milvus vector DB
│
├── lib/
│   ├── db.ts                     # SQLite access (existing)
│   ├── milvus.ts                 # Milvus client wrapper
│   └── content-graph.ts          # Link extraction utilities
│
└── components/core/
    ├── backlinks.tsx             # UI component
    ├── similar.tsx               # UI component
    └── bib.tsx                   # UI component
```

---

## 1. Backlinks Implementation

### Script: `scripts/backlinks.ts`

```typescript
import Database from 'better-sqlite3';
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { createHash } from 'crypto';

const db = new Database('data/content.db');

interface LinkMatch {
  href: string;
  text: string;
  position: number;
  context: string;
}

// Extract all internal links from MDX content
function extractInternalLinks(content: string): LinkMatch[] {
  const links: LinkMatch[] = [];

  // Match markdown links: [text](/path) or [text](/path#anchor)
  const mdLinkRegex = /\[([^\]]+)\]\((\/?[a-z0-9\-\/]+(?:#[a-z0-9\-]+)?)\)/gi;

  // Match Next.js Link components: <Link href="/path">
  const jsxLinkRegex = /<Link[^>]*href=["'](\/?[a-z0-9\-\/]+(?:#[a-z0-9\-]+)?)["'][^>]*>/gi;

  let match;

  while ((match = mdLinkRegex.exec(content)) !== null) {
    const href = match[2];
    if (href.startsWith('/') && !href.startsWith('//')) {
      links.push({
        href,
        text: match[1],
        position: match.index,
        context: extractContext(content, match.index, 150)
      });
    }
  }

  while ((match = jsxLinkRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('/') && !href.startsWith('//')) {
      links.push({
        href,
        text: '',
        position: match.index,
        context: extractContext(content, match.index, 150)
      });
    }
  }

  return links;
}

function extractContext(content: string, position: number, length: number): string {
  const start = Math.max(0, position - length / 2);
  const end = Math.min(content.length, position + length / 2);
  return content.slice(start, end).replace(/\s+/g, ' ').trim();
}

function parseHref(href: string): { slug: string; anchor: string | null } {
  const [path, anchor] = href.split('#');
  const slug = path.replace(/^\//, '').replace(/\/$/, '');
  return { slug, anchor: anchor || null };
}

async function generateBacklinks() {
  console.log('Generating backlinks...');

  // Clear existing backlinks
  db.prepare('DELETE FROM backlinks').run();

  // Find all MDX content files
  const files = await glob('app/(content)/**/content/**/*.mdx');

  const insertBacklink = db.prepare(`
    INSERT OR IGNORE INTO backlinks (target_slug, target_anchor, source_slug, source_type, context)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    // Extract source info from file path
    // e.g., app/(content)/blog/content/philosophy/some-post.mdx
    const pathParts = file.split('/');
    const sourceType = pathParts[2]; // 'blog', 'essays', etc.
    const sourceSlug = frontmatter.slug || pathParts[pathParts.length - 1].replace('.mdx', '');

    // Find all internal links
    const links = extractInternalLinks(body);

    for (const link of links) {
      const { slug: targetSlug, anchor } = parseHref(link.href);

      // Don't create self-backlinks
      if (targetSlug === sourceSlug) continue;

      insertBacklink.run(targetSlug, anchor, sourceSlug, sourceType, link.context);
    }
  }

  const count = db.prepare('SELECT COUNT(*) as count FROM backlinks').get() as { count: number };
  console.log(`Generated ${count.count} backlinks`);
}

generateBacklinks().catch(console.error);
```

### Queries

```typescript
// lib/db.ts additions

export function getBacklinks(slug: string) {
  return db.prepare(`
    SELECT
      b.*,
      p.title as source_title,
      p.preview as source_preview,
      p.category_slug as source_category
    FROM backlinks b
    LEFT JOIN posts p ON p.slug = b.source_slug
    WHERE b.target_slug = ?
    ORDER BY p.start_date DESC
  `).all(slug);
}

export function getBacklinkCount(slug: string): number {
  const result = db.prepare(`
    SELECT COUNT(*) as count FROM backlinks WHERE target_slug = ?
  `).get(slug) as { count: number };
  return result.count;
}
```

---

## 2. Bibliography Implementation

### Script: `scripts/bib.ts`

```typescript
import Database from 'better-sqlite3';
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';

const db = new Database('data/content.db');

interface ExtractedLink {
  href: string;
  text: string;
  position: number;
  context: string;
}

function extractAllLinks(content: string): ExtractedLink[] {
  const links: ExtractedLink[] = [];

  // Markdown links
  const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  let position = 0;

  while ((match = mdRegex.exec(content)) !== null) {
    links.push({
      href: match[2],
      text: match[1],
      position: position++,
      context: extractContext(content, match.index, 100)
    });
  }

  return links;
}

function isInternalLink(href: string): boolean {
  if (href.startsWith('/') && !href.startsWith('//')) return true;
  if (href.startsWith('#')) return true;
  return false;
}

function extractDomain(href: string): string | null {
  try {
    const url = new URL(href);
    return url.hostname;
  } catch {
    return null;
  }
}

async function generateBibliography() {
  console.log('Generating bibliography...');

  db.prepare('DELETE FROM bibliography').run();

  const files = await glob('app/(content)/**/content/**/*.mdx');

  const insertBib = db.prepare(`
    INSERT INTO bibliography (source_slug, source_type, href, link_text, is_internal, target_slug, domain, context, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    const pathParts = file.split('/');
    const sourceType = pathParts[2];
    const sourceSlug = frontmatter.slug || pathParts[pathParts.length - 1].replace('.mdx', '');

    const links = extractAllLinks(body);

    for (const link of links) {
      const isInternal = isInternalLink(link.href);
      const targetSlug = isInternal ? link.href.split('#')[0].replace(/^\//, '') : null;
      const domain = !isInternal ? extractDomain(link.href) : null;

      insertBib.run(
        sourceSlug,
        sourceType,
        link.href,
        link.text,
        isInternal ? 1 : 0,
        targetSlug,
        domain,
        link.context,
        link.position
      );
    }
  }

  const count = db.prepare('SELECT COUNT(*) as count FROM bibliography').get() as { count: number };
  console.log(`Generated ${count.count} bibliography entries`);
}

generateBibliography().catch(console.error);
```

### Queries

```typescript
// lib/db.ts additions

export function getBibliography(slug: string) {
  return db.prepare(`
    SELECT
      b.*,
      p.title as target_title,
      p.preview as target_preview
    FROM bibliography b
    LEFT JOIN posts p ON p.slug = b.target_slug
    WHERE b.source_slug = ?
    ORDER BY b.position ASC
  `).all(slug);
}

export function getBibliographyCount(slug: string): number {
  const result = db.prepare(`
    SELECT COUNT(*) as count FROM bibliography WHERE source_slug = ?
  `).get(slug) as { count: number };
  return result.count;
}

// Get external link stats
export function getExternalDomainStats() {
  return db.prepare(`
    SELECT domain, COUNT(*) as count
    FROM bibliography
    WHERE is_internal = 0 AND domain IS NOT NULL
    GROUP BY domain
    ORDER BY count DESC
    LIMIT 50
  `).all();
}
```

---

## 3. Similar Links Implementation (Milvus)

### Milvus Client: `lib/milvus.ts`

```typescript
import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';

const COLLECTION_NAME = 'content_embeddings';
const DIMENSION = 384; // all-MiniLM-L6-v2

let client: MilvusClient | null = null;

export async function getMilvusClient(): Promise<MilvusClient> {
  if (!client) {
    client = new MilvusClient({
      address: process.env.MILVUS_HOST || 'localhost:19530',
    });
  }
  return client;
}

export async function ensureCollection() {
  const milvus = await getMilvusClient();

  const exists = await milvus.hasCollection({ collection_name: COLLECTION_NAME });

  if (!exists.value) {
    await milvus.createCollection({
      collection_name: COLLECTION_NAME,
      fields: [
        { name: 'slug', data_type: DataType.VarChar, max_length: 512, is_primary_key: true },
        { name: 'embedding', data_type: DataType.FloatVector, dim: DIMENSION },
        { name: 'content_type', data_type: DataType.VarChar, max_length: 64 },
        { name: 'title', data_type: DataType.VarChar, max_length: 512 },
      ],
    });

    // Create HNSW index for fast similarity search
    await milvus.createIndex({
      collection_name: COLLECTION_NAME,
      field_name: 'embedding',
      index_type: 'HNSW',
      metric_type: 'COSINE',
      params: { M: 16, efConstruction: 256 },
    });
  }

  // Load collection into memory
  await milvus.loadCollection({ collection_name: COLLECTION_NAME });
}

export async function upsertEmbedding(
  slug: string,
  embedding: number[],
  contentType: string,
  title: string
) {
  const milvus = await getMilvusClient();

  await milvus.upsert({
    collection_name: COLLECTION_NAME,
    data: [{ slug, embedding, content_type: contentType, title }],
  });
}

export async function searchSimilar(
  embedding: number[],
  excludeSlug: string,
  topK: number = 5
): Promise<Array<{ slug: string; title: string; content_type: string; score: number }>> {
  const milvus = await getMilvusClient();

  const results = await milvus.search({
    collection_name: COLLECTION_NAME,
    vector: embedding,
    filter: `slug != "${excludeSlug}"`,
    limit: topK,
    output_fields: ['slug', 'title', 'content_type'],
    params: { nprobe: 10 },
  });

  return results.results.map((r: any) => ({
    slug: r.slug,
    title: r.title,
    content_type: r.content_type,
    score: r.score,
  }));
}

export async function getEmbedding(slug: string): Promise<number[] | null> {
  const milvus = await getMilvusClient();

  const result = await milvus.query({
    collection_name: COLLECTION_NAME,
    filter: `slug == "${slug}"`,
    output_fields: ['embedding'],
  });

  if (result.data.length === 0) return null;
  return result.data[0].embedding;
}
```

### Embedding Generator: `lib/embeddings.ts`

```typescript
import { pipeline, Pipeline } from '@xenova/transformers';

let embedder: Pipeline | null = null;

export async function getEmbedder(): Promise<Pipeline> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await getEmbedder();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data as Float32Array);
}

// Format content for embedding (like Gwern does)
export function formatForEmbedding(
  title: string,
  contentType: string,
  tags: string[],
  preview: string,
  content: string
): string {
  const truncatedContent = content.slice(0, 2000); // First ~2000 chars

  return `
Title: ${title}
Type: ${contentType}
Tags: ${tags.join(', ')}
Summary: ${preview}

${truncatedContent}
  `.trim();
}
```

### Script: `scripts/similar.ts`

```typescript
import Database from 'better-sqlite3';
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { createHash } from 'crypto';
import { ensureCollection, upsertEmbedding, searchSimilar, getEmbedding } from '../lib/milvus';
import { generateEmbedding, formatForEmbedding } from '../lib/embeddings';

const db = new Database('data/content.db');

function hashContent(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

async function generateSimilarLinks() {
  console.log('Generating similar links...');

  // Ensure Milvus collection exists
  await ensureCollection();

  const files = await glob('app/(content)/**/content/**/*.mdx');

  // Get existing embedding metadata
  const existingMeta = new Map<string, string>();
  const metaRows = db.prepare('SELECT slug, content_hash FROM embeddings_meta').all() as Array<{ slug: string; content_hash: string }>;
  for (const row of metaRows) {
    existingMeta.set(row.slug, row.content_hash);
  }

  const insertMeta = db.prepare(`
    INSERT OR REPLACE INTO embeddings_meta (slug, content_hash, embedded_at, model)
    VALUES (?, ?, datetime('now'), 'all-MiniLM-L6-v2')
  `);

  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    const pathParts = file.split('/');
    const contentType = pathParts[2];
    const slug = frontmatter.slug || pathParts[pathParts.length - 1].replace('.mdx', '');

    const contentHash = hashContent(body);

    // Skip if content hasn't changed
    if (existingMeta.get(slug) === contentHash) {
      skipped++;
      continue;
    }

    // Generate embedding
    const embeddingText = formatForEmbedding(
      frontmatter.title || slug,
      contentType,
      frontmatter.tags || [],
      frontmatter.preview || '',
      body
    );

    const embedding = await generateEmbedding(embeddingText);

    // Store in Milvus
    await upsertEmbedding(slug, embedding, contentType, frontmatter.title || slug);

    // Update metadata in SQLite
    insertMeta.run(slug, contentHash);

    updated++;

    if (updated % 10 === 0) {
      console.log(`Processed ${updated} embeddings...`);
    }
  }

  console.log(`Done! Updated: ${updated}, Skipped (unchanged): ${skipped}`);
}

generateSimilarLinks().catch(console.error);
```

### Query Function

```typescript
// lib/similar.ts

import { searchSimilar, getEmbedding } from './milvus';
import Database from 'better-sqlite3';

const db = new Database('data/content.db');

export interface SimilarPost {
  slug: string;
  title: string;
  content_type: string;
  preview: string;
  category: string;
  similarity: number;
}

export async function getSimilarPosts(slug: string, limit: number = 5): Promise<SimilarPost[]> {
  // Get embedding for this slug
  const embedding = await getEmbedding(slug);
  if (!embedding) return [];

  // Search Milvus
  const results = await searchSimilar(embedding, slug, limit);

  // Enrich with metadata from SQLite
  const enriched: SimilarPost[] = [];

  for (const result of results) {
    const post = db.prepare(`
      SELECT title, preview, category_slug as category
      FROM posts WHERE slug = ?
    `).get(result.slug) as { title: string; preview: string; category: string } | undefined;

    enriched.push({
      slug: result.slug,
      title: post?.title || result.title,
      content_type: result.content_type,
      preview: post?.preview || '',
      category: post?.category || '',
      similarity: Math.round(result.score * 100) / 100,
    });
  }

  return enriched;
}
```

---

## UI Components

### Component: `components/core/backlinks.tsx`

```tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Backlink {
  source_slug: string
  source_title: string
  source_type: string
  source_category: string
  context: string
  target_anchor: string | null
}

interface BacklinksProps {
  slug: string
  className?: string
}

export function Backlinks({ slug, className }: BacklinksProps) {
  const [backlinks, setBacklinks] = useState<Backlink[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/backlinks/${slug}`)
      .then(res => res.json())
      .then(data => {
        setBacklinks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading || backlinks.length === 0) return null

  const visible = isExpanded ? backlinks : backlinks.slice(0, 3)
  const hasMore = backlinks.length > 3

  return (
    <section className={cn("backlinks-section mt-12", className)} id="backlinks">
      <h2 className="text-lg font-semibold mb-4">
        Backlinks ({backlinks.length})
      </h2>

      <ul className="space-y-3">
        {visible.map((bl, i) => (
          <li key={i} className="border-l-2 border-muted pl-4">
            <Link
              href={`/${bl.source_type}/${bl.source_category}/${bl.source_slug}`}
              className="font-medium hover:underline"
            >
              {bl.source_title}
            </Link>
            {bl.context && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                ...{bl.context}...
              </p>
            )}
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? 'Show less' : `Show ${backlinks.length - 3} more`}
        </button>
      )}
    </section>
  )
}
```

### Component: `components/core/similar.tsx`

```tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SimilarPost {
  slug: string
  title: string
  content_type: string
  preview: string
  category: string
  similarity: number
}

interface SimilarProps {
  slug: string
  className?: string
}

export function Similar({ slug, className }: SimilarProps) {
  const [similar, setSimilar] = useState<SimilarPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/similar/${slug}`)
      .then(res => res.json())
      .then(data => {
        setSimilar(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading || similar.length === 0) return null

  return (
    <section className={cn("similar-section mt-12", className)} id="similar">
      <h2 className="text-lg font-semibold mb-4">
        Similar
      </h2>

      <ul className="space-y-3">
        {similar.map((post, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {Math.round(post.similarity * 100)}%
            </span>
            <div>
              <Link
                href={`/${post.content_type}/${post.category}/${post.slug}`}
                className="font-medium hover:underline"
              >
                {post.title}
              </Link>
              {post.preview && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {post.preview}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

### Component: `components/core/bib.tsx`

```tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BibEntry {
  href: string
  link_text: string
  is_internal: boolean
  target_slug: string | null
  target_title: string | null
  domain: string | null
}

interface BibProps {
  slug: string
  className?: string
}

export function Bib({ slug, className }: BibProps) {
  const [entries, setEntries] = useState<BibEntry[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/bib/${slug}`)
      .then(res => res.json())
      .then(data => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading || entries.length === 0) return null

  const internalLinks = entries.filter(e => e.is_internal)
  const externalLinks = entries.filter(e => !e.is_internal)

  const visible = isExpanded ? entries : entries.slice(0, 10)
  const hasMore = entries.length > 10

  return (
    <section className={cn("bib-section mt-12", className)} id="bibliography">
      <h2 className="text-lg font-semibold mb-4">
        Bibliography ({entries.length})
      </h2>

      <ol className="space-y-2 list-decimal list-inside">
        {visible.map((entry, i) => (
          <li key={i} className="text-sm">
            {entry.is_internal ? (
              <Link
                href={entry.href}
                className="text-foreground hover:underline"
              >
                {entry.target_title || entry.link_text}
              </Link>
            ) : (
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                {entry.link_text}
                <span className="text-muted-foreground ml-1">
                  ({entry.domain})
                </span>
              </a>
            )}
          </li>
        ))}
      </ol>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? 'Show less' : `Show ${entries.length - 10} more`}
        </button>
      )}
    </section>
  )
}
```

---

## API Routes

### `/api/backlinks/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getBacklinks } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const backlinks = getBacklinks(params.slug);
  return NextResponse.json(backlinks);
}
```

### `/api/similar/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSimilarPosts } from '@/lib/similar';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const similar = await getSimilarPosts(params.slug);
  return NextResponse.json(similar);
}
```

### `/api/bib/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getBibliography } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const bib = getBibliography(params.slug);
  return NextResponse.json(bib);
}
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "milvus:start": "docker-compose -f docker/milvus/docker-compose.yml up -d",
    "milvus:stop": "docker-compose -f docker/milvus/docker-compose.yml down",
    "generate:backlinks": "npx tsx scripts/backlinks.ts",
    "generate:bib": "npx tsx scripts/bib.ts",
    "generate:similar": "npx tsx scripts/similar.ts",
    "generate:all": "npm run generate:backlinks && npm run generate:bib && npm run generate:similar"
  }
}
```

---

## Dependencies

```bash
# SQLite (already have)
npm install better-sqlite3

# Milvus client
npm install @zilliz/milvus2-sdk-node

# Local embeddings
npm install @xenova/transformers

# Utilities
npm install gray-matter glob
```

---

## Implementation Order

1. **Phase 1: Schema** - Add tables to content.db
2. **Phase 2: Backlinks** - Simplest, no external deps
3. **Phase 3: Bibliography** - Similar to backlinks
4. **Phase 4: Milvus** - Docker setup, collection creation
5. **Phase 5: Similar** - Embeddings + vector search
6. **Phase 6: UI** - Components + API routes

---

## Production Considerations

### Milvus in Production

For production, you have options:

1. **Self-hosted Milvus** (Docker on your server)
   - Full control
   - Requires ~2GB RAM minimum

2. **Zilliz Cloud** (Managed Milvus)
   - Free tier: 2 collections, 1M vectors
   - No infrastructure management

3. **Export to static JSON at build time**
   - Pre-compute top 5 similar for each page
   - No runtime vector search needed
   - Best for static export

For a personal site, Option 3 (pre-computed) is likely best - run Milvus locally during development/build, export results to static JSON.
