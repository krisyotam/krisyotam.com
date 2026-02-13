/*
+------------------+----------------------------------------------------------+
| FILE             | frame.tsx                                                |
| ROLE             | Unified media frame component for MDX content            |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-12                                               |
| UPDATED          | 2026-02-12                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/typography/frame.tsx                                   |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| A versatile frame component for displaying media items (films, books,       |
| manga, etc.) either individually or as ranked lists. Supports customizable  |
| creator labels and media types.                                             |
|                                                                             |
| COLLAPSED FROM:                                                             |
|   - components/media/film.tsx (Movie component)                             |
|   - components/media/filmList.tsx (Cinema component)                        |
|   - components/media/film.css (styles now inlined)                          |
+-----------------------------------------------------------------------------+
*/

"use client"

import Image from "next/image"

// ============================================================================
// Types
// ============================================================================

export interface FrameItem {
  /** URL of the cover/poster image */
  cover: string
  /** Title of the work */
  title: string
  /** Creator name (director, author, mangaka, artist, etc.) */
  creator: string
  /** Optional link to external resource */
  link?: string
  /** Optional year of release/publication */
  year?: number
  /** Optional order number for ranked lists */
  order?: number
}

export interface FrameProps extends Omit<FrameItem, 'order'> {
  /** Label for the creator field (default: "Director") */
  creatorLabel?: string
  /** @deprecated Use 'cover' instead */
  poster?: string
  /** @deprecated Use 'creator' instead */
  director?: string
}

export interface FrameListProps {
  /** Array of frame items to display */
  items: FrameItem[]
  /** Label for the creator field (default: "Director") */
  creatorLabel?: string
}

// ============================================================================
// Styles (inlined from film.css)
// ============================================================================

const frameStyles = `
  .frame-link,
  .frame-link:hover {
    text-decoration: none !important;
    border-bottom: none !important;
    color: inherit;
  }

  .frame-image-container {
    position: relative !important;
    width: 160px !important;
    height: 240px !important;
    margin-bottom: 0.5rem !important;
    display: block !important;
    background: none !important;
    border-radius: 0 !important;
    overflow: hidden !important;
  }

  .frame-image {
    object-fit: contain !important;
    position: absolute !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    filter: none !important;
    transform: none !important;
    transition: none !important;
    background: none !important;
    border-radius: 0 !important;
  }
`

// ============================================================================
// Single Frame Component
// ============================================================================

export function Frame({
  cover,
  title,
  creator,
  link,
  year,
  creatorLabel = "Director",
  // Legacy prop support
  poster,
  director,
}: FrameProps) {
  // Support legacy prop names
  const resolvedCover = cover || poster || ""
  const resolvedCreator = creator || director || ""
  const content = (
    <>
      <style jsx global>{frameStyles}</style>
      <span className="frame-image-container">
        <Image
          src={resolvedCover}
          alt={title}
          fill
          style={{ objectFit: "contain" }}
          className="frame-image"
          unoptimized={resolvedCover?.includes('krisyotam.com')}
        />
      </span>
      <span className="inline-block font-medium text-center">{title}</span>
      <span className="text-muted-foreground text-xs mt-1 text-center">
        {resolvedCreator} {year && `(${year})`}
      </span>
    </>
  )

  const containerClass = "frame-link flex flex-col items-center p-4 text-center no-underline hover:no-underline"

  return (
    <main className="p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))] text-sm flex flex-col items-center">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={containerClass}
        >
          {content}
        </a>
      ) : (
        <div className={containerClass}>
          {content}
        </div>
      )}
    </main>
  )
}

// ============================================================================
// Frame List Component (for ranked lists)
// ============================================================================

export function FrameList({ items, creatorLabel = "Director" }: FrameListProps) {
  return (
    <>
      <style jsx global>{`
        ${frameStyles}
        .frame-list-item .order-badge {
          background: #f3f4f6;
          color: #222;
          border: 1.5px solid #e5e7eb;
        }
        .dark .frame-list-item .order-badge {
          background: #23272e;
          color: #f3f4f6;
          border: 1.5px solid #444;
        }
      `}</style>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 px-5 mb-10">
        {items.map((item, index) => {
          const order = item.order ?? index + 1
          const content = (
            <>
              {/* Order badge */}
              <span
                className="order-badge absolute left-2 top-2 flex items-center justify-center shadow-sm font-mono font-semibold text-xs z-10"
                style={{
                  width: 28,
                  height: 28,
                  boxShadow: '0 1px 4px 0 rgba(0,0,0,0.07)',
                  borderRadius: 0,
                }}
              >
                {order}
              </span>
              <span className="frame-image-container">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="frame-image"
                  unoptimized={item.cover?.includes('krisyotam.com')}
                />
              </span>
              <span className="font-medium text-sm text-center">{item.title}</span>
              <span className="text-xs mt-1 text-muted-foreground text-center">{item.creator}</span>
            </>
          )

          const itemClass = "frame-list-item frame-link text-sm flex flex-col items-center bg-gray-200 dark:bg-[#333] p-4 text-center no-underline hover:no-underline relative"

          return item.link ? (
            <a
              key={`${item.title}-${order}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClass}
            >
              {content}
            </a>
          ) : (
            <div key={`${item.title}-${order}`} className={itemClass}>
              {content}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ============================================================================
// Legacy Aliases (for backwards compatibility)
// ============================================================================

/** @deprecated Use Frame instead */
export const Movie = Frame

/** @deprecated Use FrameList instead */
export function Cinema({ books }: { books: Array<{ title: string; director: string; cover: string; link?: string; order: number }> }) {
  const items: FrameItem[] = books.map(b => ({
    title: b.title,
    creator: b.director,
    cover: b.cover,
    link: b.link,
    order: b.order,
  }))
  return <FrameList items={items} creatorLabel="Director" />
}

// Default export for single frame
export default Frame
