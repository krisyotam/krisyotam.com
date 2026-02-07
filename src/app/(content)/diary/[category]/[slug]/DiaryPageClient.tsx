"use client";

/**
 * =============================================================================
 * DiaryPageClient.tsx
 * =============================================================================
 *
 * Client component for diary entry detail page.
 * Simplified header without status, certainty, or importance.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { notFound } from "next/navigation";
import { LiveClock } from "@/components/ui/live-clock";
import { PostHeader } from "@/components/core";
import { Footer } from "@/components/core/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Citation } from "@/components/core/citation";
import { Comments } from "@/components/core/comments";
import { Footnotes } from "@/components/core/footnotes";
import type { DiaryMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface Props {
  entry: DiaryMeta;
  allEntries: DiaryMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export default function DiaryPageClient({ entry, allEntries, children, headerOnly, contentOnly }: Props) {
  if (!entry) notFound();

  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  const lastUpdated = (entry.end_date && entry.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader
          title={entry.title}
          start_date={entry.start_date}
          end_date={entry.end_date}
          tags={entry.tags}
          category={entry.category}
          backHref="/diary"
          backText="Diary"
          preview={entry.preview}
          hideStatus={true}
        />
      </div>
    );
  }

  if (contentOnly) {
    return (
      <div className="mt-8 w-full">
        <Comments />
        <Footnotes containerSelector="#content" />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation
          title={entry.title}
          slug={entry.slug}
          date={(entry.end_date && entry.end_date.trim()) || entry.start_date}
          url={`https://krisyotam.com/diary/${slugifyCategory(entry.category)}/${entry.slug}`}
        />
        <div className="mt-4 w-full">
          <LiveClock />
          <Footer />
        </div>
      </div>
    );
  }

  // Full layout (legacy fallback)
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-16 flex flex-col min-h-screen">
      <PostHeader
        title={entry.title}
        start_date={entry.start_date}
        end_date={entry.end_date}
        tags={entry.tags}
        category={entry.category}
        backHref="/diary"
        backText="Diary"
        preview={entry.preview}
        hideStatus={true}
      />

      <div className="content flex-1">{children}</div>

      <div className="mt-8 w-full">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation
          title={entry.title}
          slug={entry.slug}
          date={(entry.end_date && entry.end_date.trim()) || entry.start_date}
          url={`https://krisyotam.com/diary/${slugifyCategory(entry.category)}/${entry.slug}`}
        />
        <div className="mt-4 w-full">
          <LiveClock />
          <Footer />
        </div>
      </div>
    </div>
  );
}
