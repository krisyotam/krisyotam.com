/*
+------------------+----------------------------------------------------------+
| FILE             | discovery-block.tsx                                      |
| ROLE             | Content discovery block for 404 page                     |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-03-02                                               |
| UPDATED          | 2026-03-02                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/discovery-block.tsx                               |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Client component that displays random content for discovery on the 404      |
| page. Three sections: sequences (horizontal covers), reviews (portrait      |
| covers), and text columns (essays, blog, verse, diary). Uses the            |
| cell-strip design language from expanded-footer-block and citation.         |
+-----------------------------------------------------------------------------+
*/

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// =============================================================================
// Types
// =============================================================================

interface Post {
  title: string
  slug: string
  category: string
  cover_image?: string
  state?: string
}

interface Sequence {
  slug: string
  title: string
  "cover-url": string | null
  category: string | null
  state: string
  posts?: { slug: string }[]
}

interface DiscoveryData {
  sequences: Sequence[]
  reviews: Post[]
  essays: Post[]
  blog: Post[]
  verse: Post[]
  diary: Post[]
}

// =============================================================================
// Helpers
// =============================================================================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

/**
 * Pick 10 random verse entries, but cap haiku at 3 max.
 */
function pickVerseBalanced(items: Post[]): Post[] {
  const haiku = shuffle(items.filter((p) => p.category === "haiku"))
  const other = shuffle(items.filter((p) => p.category !== "haiku"))
  const pickedHaiku = haiku.slice(0, 3)
  const needed = 10 - pickedHaiku.length
  const pickedOther = other.slice(0, needed)
  return shuffle([...pickedHaiku, ...pickedOther]).slice(0, 10)
}

// =============================================================================
// Section Header Row
// =============================================================================

function SectionHeader({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-stretch border-b border-border">
      <div className="w-16 flex items-center justify-center px-2 py-2 border-r border-border bg-muted/30 flex-shrink-0">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex-1 flex items-center px-3 py-2">
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  )
}

// =============================================================================
// Component
// =============================================================================

export function DiscoveryBlock() {
  const [data, setData] = useState<DiscoveryData | null>(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [seqRes, revRes, essRes, blogRes, verseRes, diaryRes] = await Promise.all([
          fetch("/api/content?type=sequences"),
          fetch("/api/content?type=reviews"),
          fetch("/api/content?type=essays"),
          fetch("/api/content?type=blog"),
          fetch("/api/content?type=verse"),
          fetch("/api/content?type=diary"),
        ])

        const [seqJson, revJson, essJson, blogJson, verseJson, diaryJson] = await Promise.all([
          seqRes.json(),
          revRes.json(),
          essRes.json(),
          blogRes.json(),
          verseRes.json(),
          diaryRes.json(),
        ])

        // Sequences: { sequences: [...] }
        const allSequences: Sequence[] = seqJson.sequences || []
        const activeSeqWithCover = allSequences.filter(
          (s) => s.state === "active" && s["cover-url"]
        )

        // Reviews: bare array
        const allReviews: Post[] = Array.isArray(revJson) ? revJson : []
        const activeRevWithCover = allReviews.filter(
          (r) => r.state === "active" && r.cover_image
        )

        // Essays: { essays: [...] }
        const allEssays: Post[] = Array.isArray(essJson.essays) ? essJson.essays : Array.isArray(essJson) ? essJson : []
        const activeEssays = allEssays.filter((p) => p.state === "active")

        // Blog: bare array
        const allBlog: Post[] = Array.isArray(blogJson) ? blogJson : []
        const activeBlog = allBlog.filter((p) => p.state === "active")

        // Verse: bare array
        const allVerse: Post[] = Array.isArray(verseJson) ? verseJson : []
        const activeVerse = allVerse.filter((p) => p.state === "active")

        // Diary: bare array
        const allDiary: Post[] = Array.isArray(diaryJson) ? diaryJson : []
        const activeDiary = allDiary.filter((p) => p.state === "active")

        setData({
          sequences: pickRandom(activeSeqWithCover, 2),
          reviews: pickRandom(activeRevWithCover, 4),
          essays: pickRandom(activeEssays, 10),
          blog: pickRandom(activeBlog, 10),
          verse: pickVerseBalanced(activeVerse),
          diary: pickRandom(activeDiary, 10),
        })
      } catch (err) {
        console.error("Failed to fetch discovery data:", err)
      }
    }

    fetchAll()
  }, [])

  if (!data) return null

  return (
    <article className="border border-border">
      {/* ================================================================== */}
      {/* Section 1: Sequences                                               */}
      {/* ================================================================== */}
      {data.sequences.length > 0 && (
        <>
          <SectionHeader label="Explore" description="Random sequences to dive into" />
          <div className="flex items-stretch border-b border-border">
            {data.sequences.map((seq, i) => (
              <div
                key={seq.slug}
                className={`w-1/2 ${i < data.sequences.length - 1 ? "border-r border-border" : ""}`}
              >
                <Link
                  href={`/sequences/${seq.slug}`}
                  className="block hover:bg-muted/30 transition-colors"
                >
                  {seq["cover-url"] && (
                    <div className="w-full" style={{ aspectRatio: "16/9" }}>
                      <img
                        src={seq["cover-url"]}
                        alt={seq.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="px-3 py-2">
                    <div className="text-xs font-medium text-foreground truncate" title={seq.title}>{seq.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {seq.category && <span>{seq.category}</span>}
                      {seq.posts && seq.posts.length > 0 && (
                        <span>
                          {seq.category ? " · " : ""}
                          {seq.posts.length} post{seq.posts.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================================================================== */}
      {/* Section 2: Reviews                                                 */}
      {/* ================================================================== */}
      {data.reviews.length > 0 && (
        <>
          <SectionHeader label="Reviews" description="Recent reads, watches, and listens" />
          <div className="flex items-stretch border-b border-border">
            {data.reviews.map((rev, i) => (
              <div
                key={rev.slug}
                className={`w-1/4 ${i < data.reviews.length - 1 ? "border-r border-border" : ""}`}
              >
                <Link
                  href={`/reviews/${rev.category}/${rev.slug}`}
                  className="block hover:bg-muted/30 transition-colors"
                >
                  {rev.cover_image && (
                    <div className="w-full" style={{ aspectRatio: "3/4" }}>
                      <img
                        src={rev.cover_image}
                        alt={rev.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="px-2 py-2">
                    <div className="text-xs font-medium text-foreground truncate" title={rev.title}>{rev.title}</div>
                    <div className="text-[10px] text-muted-foreground">{rev.category}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================================================================== */}
      {/* Section 3: Text Columns                                            */}
      {/* ================================================================== */}
      <SectionHeader label="More" description="Random picks from the archive" />
      <div className="flex items-stretch border-b border-border">
        {[
          { label: "Essays", items: data.essays, base: "" },
          { label: "Blog", items: data.blog, base: "" },
          { label: "Verse", items: data.verse, base: "" },
          { label: "Diary", items: data.diary, base: "" },
        ].map((col, colIdx) => (
          <div
            key={col.label}
            className={`w-1/4 ${colIdx < 3 ? "border-r border-border" : ""}`}
          >
            <div className="px-2 py-2 border-b border-border">
              <span className="text-xs font-bold text-foreground">{col.label}</span>
            </div>
            {col.items.map((item, itemIdx) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className={`block px-2 py-1.5 text-xs text-foreground hover:bg-muted/30 transition-colors ${
                  itemIdx < col.items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="line-clamp-1" title={item.title}>{item.title}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* ================================================================== */}
      {/* Section 4: Key Pages                                               */}
      {/* ================================================================== */}
      <div className="flex items-stretch">
        {[
          { label: "On Me", href: "/on-me" },
          { label: "On Website", href: "/on-website" },
          { label: "On Logo", href: "/on-logo" },
          { label: "Contact", href: "/contact" },
        ].map((page, i) => (
          <Link
            key={page.href}
            href={page.href}
            className={`w-1/4 flex items-center justify-center px-2 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors ${
              i < 3 ? "border-r border-border" : ""
            }`}
          >
            {page.label}
          </Link>
        ))}
      </div>
    </article>
  )
}
