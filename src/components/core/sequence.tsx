/*
+------------------+----------------------------------------------------------+
| FILE             | sequence.tsx                                             |
| ROLE             | Unified sequence page component                          |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-04                                               |
| UPDATED          | 2026-02-04                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/sequence.tsx                                      |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| A comprehensive component for sequence detail pages combining:              |
| - Bento-style header with cover image and metadata                          |
| - Navigation bar with search and view toggle (list/grid)                    |
| - List view (table with sections)                                           |
| - Grid view (cards with section dividers)                                   |
| Handles all data fetching including post dates.                             |
+-----------------------------------------------------------------------------+
*/

"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, Info, Search, LayoutGrid, List } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatYMD, formatYMDRange, getTodayISO } from "@/lib/date";
import { Sequence } from "@/types/content";

/* ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

export type SequenceStatus =
  | "Abandoned"
  | "Notes"
  | "Draft"
  | "In Progress"
  | "Finished"
  | "Published"
  | "Planned"
  | "Active";

export type SequenceConfidence =
  | "impossible"
  | "remote"
  | "highly unlikely"
  | "unlikely"
  | "possible"
  | "likely"
  | "highly likely"
  | "certain";

interface PostDates {
  start_date?: string;
  end_date?: string;
  views?: number;
}

interface SequencePost {
  slug: string;
  order: number;
  type: string;
  title?: string;
  preview?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  views?: number;
}

interface SequenceSection {
  title: string;
  posts: SequencePost[];
}

export interface SequenceComponentProps {
  slug: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * CONSTANTS - Explanation Texts
 * ═══════════════════════════════════════════════════════════════════════════ */

const CONFIDENCE_EXPLANATION = `The confidence tag expresses how well-supported the content is, or how likely its overall ideas are right. This uses a scale from "impossible" to "certain", based on the Kesselman List of Estimative Words:

1. "certain"
2. "highly likely"
3. "likely"
4. "possible"
5. "unlikely"
6. "highly unlikely"
7. "remote"
8. "impossible"

Even ideas that seem unlikely may be worth exploring if their potential impact is significant enough.`;

const IMPORTANCE_EXPLANATION = `The importance rating distinguishes between trivial topics and those which might change your life. Using a scale from 0-10, content is ranked based on its potential impact on:

- the reader
- the intended audience
- the world at large

For example, topics about fundamental research or transformative technologies would rank 9-10, while personal reflections or minor experiments might rank 0-1.`;

const STATUS_EXPLANATION = `The status indicator reflects the current state of the work:

- Abandoned: Work that has been discontinued
- Notes: Initial collections of thoughts and references
- Draft: Early structured version with a central thesis
- In Progress: Well-developed work actively being refined
- Finished: Completed work with no planned major changes

This helps readers understand the maturity and completeness of the content.`;

/* ═══════════════════════════════════════════════════════════════════════════
 * UTILITY FUNCTIONS - Colors
 * ═══════════════════════════════════════════════════════════════════════════ */

function getConfidenceColor(confidence: string): string {
  const colors: Record<string, string> = {
    certain: "text-gray-900 dark:text-gray-100",
    "highly likely": "text-gray-800 dark:text-gray-200",
    likely: "text-gray-700 dark:text-gray-300",
    possible: "text-gray-600 dark:text-gray-400",
    unlikely: "text-gray-500 dark:text-gray-500",
    "highly unlikely": "text-gray-400 dark:text-gray-600",
    remote: "text-gray-300 dark:text-gray-700",
    impossible: "text-gray-200 dark:text-gray-800",
  };
  return colors[confidence] || "text-gray-600 dark:text-gray-400";
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Finished: "text-gray-900 dark:text-gray-100",
    Published: "text-gray-900 dark:text-gray-100",
    Active: "text-gray-900 dark:text-gray-100",
    "In Progress": "text-gray-800 dark:text-gray-200",
    Draft: "text-gray-700 dark:text-gray-300",
    Planned: "text-gray-600 dark:text-gray-400",
    Notes: "text-gray-500 dark:text-gray-500",
    Abandoned: "text-gray-400 dark:text-gray-600",
  };
  return colors[status] || "text-gray-600 dark:text-gray-400";
}

function getImportanceColor(importance: number): string {
  if (importance >= 8) return "text-gray-900 dark:text-gray-100";
  if (importance >= 6) return "text-gray-800 dark:text-gray-200";
  if (importance >= 4) return "text-gray-600 dark:text-gray-400";
  if (importance >= 2) return "text-gray-500 dark:text-gray-500";
  return "text-gray-400 dark:text-gray-600";
}

/* ═══════════════════════════════════════════════════════════════════════════
 * DATA FETCHING
 * ═══════════════════════════════════════════════════════════════════════════ */

interface FetchResult {
  sequence: Sequence;
  postUrls: Record<string, string>;
  postDates: Record<string, PostDates>;
}

async function fetchSequenceData(slug: string): Promise<FetchResult | null> {
  try {
    const response = await fetch(`/api/content?type=sequences&slug=${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch sequence");
    }
    const data = await response.json();
    return {
      sequence: data.sequence,
      postUrls: data.postUrls,
      postDates: data.postDates || {},
    };
  } catch (error) {
    console.error("Error fetching sequence:", error);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

export function SequenceComponent({ slug }: SequenceComponentProps) {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [postUrls, setPostUrls] = useState<Record<string, string>>({});
  const [postDates, setPostDates] = useState<Record<string, PostDates>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // ---------------------------------------------------------------------------
  // Data Loading
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const loadSequence = async () => {
      setLoading(true);
      const data = await fetchSequenceData(slug);
      if (data) {
        setSequence(data.sequence);
        setPostUrls(data.postUrls);
        setPostDates(data.postDates);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    loadSequence();
  }, [slug]);

  // ---------------------------------------------------------------------------
  // Early Returns
  // ---------------------------------------------------------------------------
  if (notFound || !sequence) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Derived Data
  // ---------------------------------------------------------------------------
  const isNewFormat = Boolean(sequence.sections && sequence.sections.length > 0);

  // Format header date range
  const formattedDate = sequence.start_date
    ? formatYMDRange(sequence.start_date, sequence.end_date?.trim() || getTodayISO())
    : null;

  // Get sequence metadata with defaults
  const status = (sequence.status as SequenceStatus) || "Draft";
  const confidence = (sequence.confidence as SequenceConfidence) || "possible";
  const importance = sequence.importance ?? 5;
  const tags = sequence.tags || [];
  const category = sequence.category;
  const coverUrl = (sequence as any)["cover-url"] || "";
  const preview = sequence.preview;

  // ---------------------------------------------------------------------------
  // Filter posts by search query
  // ---------------------------------------------------------------------------
  const filterPosts = (posts: SequencePost[]) => {
    if (!searchQuery) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter((post) => post.slug.toLowerCase().includes(query));
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Global Styles */}
      <style jsx global>{`
        .sequence-container {
          font-family: "Geist", sans-serif;
        }
        .section-header {
          background: #f8f9fa;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6c757d;
        }
        .dark .section-header {
          background: #1a1a1a;
          color: #9ca3af;
        }
      `}</style>

      <div className="sequence-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        {/* ═══════════════════════════════════════════════════════════════════
         * HEADER SECTION
         * ═══════════════════════════════════════════════════════════════════ */}
        <header className="mb-3 relative">
          {/* Back Navigation */}
          <Link
            href="/sequences"
            data-no-preview="true"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to Sequences
          </Link>

          {/* Bento Container */}
          <div className="border border-border bg-card">
            {/* Cover Image */}
            {coverUrl?.trim() ? (
              <div className="aspect-[21/9] border-b border-border bg-muted/30">
                <img
                  src={coverUrl.trim()}
                  alt={sequence.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[21/9] border-b border-border bg-muted/30 flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-mono">
                  {sequence.title}
                </span>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6">
              {/* Title */}
              <h1 className="font-serif font-medium tracking-tight text-2xl md:text-3xl uppercase mb-3">
                {sequence.title}
              </h1>

              {/* Preview */}
              {preview && (
                <p
                  className="font-serif text-sm text-muted-foreground italic mb-4 hyphens-auto"
                  style={{ textAlign: "justify" }}
                >
                  {preview}
                </p>
              )}

              {/* Date */}
              {formattedDate && (
                <div className="font-mono text-sm text-muted-foreground mb-3">
                  {formattedDate}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                      className="border border-border bg-secondary/40 px-2 py-1 text-xs font-mono hover:bg-secondary transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Category */}
              {category && (
                <div className="text-sm font-serif italic text-muted-foreground">
                  <Link
                    href={`/sequences/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="hover:text-foreground transition-colors"
                  >
                    Filed under: {category}
                  </Link>
                </div>
              )}
            </div>

            {/* Metadata Row */}
            <div className="grid grid-cols-3 border-t border-border divide-x divide-border">
              {/* Status */}
              <div className="py-4 px-3 text-center">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className={cn("flex items-center justify-center gap-1 cursor-help", getStatusColor(status))}>
                      <Info className="h-3 w-3" />
                      <span className="font-mono text-sm font-medium">status: {status}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="bottom" avoidCollisions={false} className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Status Indicator</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{STATUS_EXPLANATION}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* Certainty */}
              <div className="py-4 px-3 text-center">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className={cn("flex items-center justify-center gap-1 cursor-help", getConfidenceColor(confidence))}>
                      <Info className="h-3 w-3" />
                      <span className="font-mono text-sm font-medium">certainty: {confidence}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="bottom" avoidCollisions={false} className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Confidence Rating</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{CONFIDENCE_EXPLANATION}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* Importance */}
              <div className="py-4 px-3 text-center">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className={cn("flex items-center justify-center gap-1 cursor-help", getImportanceColor(importance))}>
                      <Info className="h-3 w-3" />
                      <span className="font-mono text-sm font-medium">importance: {importance}/10</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="bottom" avoidCollisions={false} className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Importance Rating</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{IMPORTANCE_EXPLANATION}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════
         * NAVIGATION BAR
         * ═══════════════════════════════════════════════════════════════════ */}
        <div className="mb-3 flex items-center gap-4 flex-wrap">
          {/* Search Input */}
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full h-9 pl-10 pr-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              aria-label="Search posts"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn("rounded-none", viewMode === "list" && "bg-secondary/50")}
              onClick={() => setViewMode("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn("rounded-none", viewMode === "grid" && "bg-secondary/50")}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
         * CONTENT VIEWS
         * ═══════════════════════════════════════════════════════════════════ */}
        {viewMode === "list" ? (
          <ListView
            sequence={sequence}
            isNewFormat={isNewFormat}
            filterPosts={filterPosts}
            postUrls={postUrls}
            postDates={postDates}
            searchQuery={searchQuery}
          />
        ) : (
          <GridView
            sequence={sequence}
            isNewFormat={isNewFormat}
            filterPosts={filterPosts}
            postUrls={postUrls}
            postDates={postDates}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * LIST VIEW COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

interface ViewProps {
  sequence: Sequence;
  isNewFormat: boolean;
  filterPosts: (posts: SequencePost[]) => SequencePost[];
  postUrls: Record<string, string>;
  postDates: Record<string, PostDates>;
  searchQuery: string;
}

function ListView({ sequence, isNewFormat, filterPosts, postUrls, postDates, searchQuery }: ViewProps) {
  return (
    <div className="border border-border overflow-hidden shadow-sm">
      {isNewFormat ? (
        // Sectioned format - single table with header
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">#</th>
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Type</th>
              <th className="py-2 text-left font-medium px-3">Date</th>
              <th className="py-2 text-right font-medium px-3">Views</th>
            </tr>
          </thead>
          <tbody>
            {sequence.sections!.map((section) => {
              const filteredPosts = filterPosts(section.posts as SequencePost[]);
              if (filteredPosts.length === 0) return null;

              return (
                <Fragment key={section.title}>
                  {/* Section Header Row */}
                  <tr className="section-header">
                    <td colSpan={5} className="py-3 px-4">{section.title}</td>
                  </tr>
                  {/* Section Posts */}
                  {filteredPosts.map((post, index) => {
                    const dates = postDates[post.slug] || {};
                    return (
                      <tr
                        key={post.slug}
                        className={cn(
                          "border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer",
                          index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                        )}
                      >
                        <td className="py-2 px-3 text-muted-foreground w-12">{post.order}</td>
                        <td className="py-2 px-3">
                          <Link href={postUrls[post.slug] || `#error-${post.slug}`}>
                            {formatPostTitle(post.slug)}
                          </Link>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{post.type}</td>
                        <td className="py-2 px-3">
                          {dates.start_date ? formatYMD(dates.start_date) : "—"}
                        </td>
                        <td className="py-2 px-3 text-right text-muted-foreground">
                          {(dates.views ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        // Flat format fallback
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">#</th>
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Type</th>
              <th className="py-2 text-left font-medium px-3">Date</th>
              <th className="py-2 text-right font-medium px-3">Views</th>
            </tr>
          </thead>
          <tbody>
            {sequence.posts &&
              [...sequence.posts]
                .sort((a, b) => a.order - b.order)
                .filter((post) => !searchQuery || post.slug.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((post, index) => {
                  const dates = postDates[post.slug] || {};
                  return (
                    <tr
                      key={post.slug}
                      className={cn(
                        "border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer",
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                      )}
                    >
                      <td className="py-2 px-3 text-muted-foreground">{post.order}</td>
                      <td className="py-2 px-3">
                        <Link href={postUrls[post.slug] || `#error-${post.slug}`}>
                          {formatPostTitle(post.slug)}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">{post.type}</td>
                      <td className="py-2 px-3">
                        {dates.start_date ? formatYMD(dates.start_date) : "—"}
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground">
                        {(dates.views ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * GRID VIEW COMPONENT
 * Matches /sequences page grid exactly, with order numbers added
 * ═══════════════════════════════════════════════════════════════════════════ */

function GridView({ sequence, isNewFormat, filterPosts, postUrls, postDates, searchQuery }: ViewProps) {
  return (
    <div className="space-y-8">
      {isNewFormat ? (
        // Sectioned format with centered section titles
        sequence.sections!.map((section) => {
          const filteredPosts = filterPosts(section.posts as SequencePost[]);
          if (filteredPosts.length === 0) return null;

          return (
            <div key={section.title}>
              {/* Section Title - Centered */}
              <div className="text-center mb-6">
                <h3 className="text-sm font-mono uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h3>
              </div>

              {/* Posts Grid - 2 columns, chronological left-to-right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts
                  .sort((a, b) => a.order - b.order)
                  .map((post) => (
                    <PostCard
                      key={post.slug}
                      post={post}
                      url={postUrls[post.slug]}
                      dates={postDates[post.slug]}
                    />
                  ))}
              </div>
            </div>
          );
        })
      ) : (
        // Flat format - all posts in grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sequence.posts &&
            [...sequence.posts]
              .sort((a, b) => a.order - b.order)
              .filter((post) => !searchQuery || post.slug.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  url={postUrls[post.slug]}
                  dates={postDates[post.slug]}
                />
              ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * POST CARD COMPONENT (for Grid View)
 * Matches /sequences page card design exactly, with order number badge
 * ═══════════════════════════════════════════════════════════════════════════ */

interface PostCardProps {
  post: SequencePost;
  url?: string;
  dates?: PostDates;
}

function PostCard({ post, url, dates }: PostCardProps) {
  return (
    <article className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
      <Link href={url || `#error-${post.slug}`} className="block">
        {/* Cover Image Area - matches /sequences aspect ratio */}
        <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center relative">
          {/* Order Badge - positioned top-left */}
          <span className="absolute top-2 left-2 text-xs font-mono text-muted-foreground bg-background/80 border border-border px-2 py-0.5">
            #{post.order}
          </span>
          {/* Placeholder - shows title since individual posts don't have cover images */}
          <span className="text-muted-foreground text-sm text-center p-4 block">
            {formatPostTitle(post.slug)}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">
            {formatPostTitle(post.slug)}
          </h3>
          {post.preview && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
              {post.preview}
            </p>
          )}

          {/* Metadata - matches /sequences layout */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span>{post.type}</span>
            </span>
            <span className="flex items-center gap-2">
              {dates?.start_date && (
                <span>{new Date(dates.start_date).getFullYear()}</span>
              )}
              <span>{(dates?.views ?? 0).toLocaleString()} views</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * UTILITY FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Format a post slug into a readable title
 * e.g., "my-post-title" → "My Post Title"
 */
function formatPostTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/* ═══════════════════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════════════════ */

export default SequenceComponent;
