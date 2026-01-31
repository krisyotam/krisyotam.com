/* app/reviews/[category]/[slug]/ReviewPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/ui/live-clock";
import { PostHeader } from "@/components/core";
import { Footer } from "@/components/core/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Citation } from "@/components/core/citation";
import { Comments } from "@/components/core/comments";
import { Footnotes } from "@/components/core/footnotes";
import { ViewTracker } from "@/components/core/view-tracker";

interface ReviewMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain";
  importance?: number;
}

interface Props {
  review: ReviewMeta;
  allReviews: ReviewMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function ReviewPageClient({ review, allReviews, children, headerOnly, contentOnly }: Props) {
  if (!review) notFound();

  const viewSlug = `reviews/${review.category.toLowerCase().replace(/\s+/g, "-")}/${review.slug}`;

  /* prev / next */
  const sorted = [...allReviews].sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) || a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) || b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  const idx = sorted.findIndex(n => n.slug === review.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;
  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader 
          className=""     
          title={review.title}
          subtitle={review.subtitle}
          start_date={review.start_date}
          end_date={review.end_date}
          tags={review.tags}
          category={review.category}
          backHref="/reviews"
          backText="Reviews"
          preview={review.preview}
          status={review.status ?? "Draft"}
          confidence={review.confidence ?? "possible"}
          importance={review.importance ?? 5}
        />
      </div>
    );
  }

  const lastUpdated = (review.end_date && review.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Comments />
        <Footnotes containerSelector="#content" />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={review.title}
          slug={review.slug}
          date={(review.end_date && review.end_date.trim()) || review.start_date}
          url={`https://krisyotam.com/reviews/${slugifyCategory(review.category)}/${review.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Legacy layout - render everything together
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <ViewTracker slug={viewSlug} />
      {/* clean page header (outside .review-content) */}
      <PostHeader 
        className=""     
        title={review.title}
        subtitle={review.subtitle}
        start_date={review.start_date}
        end_date={review.end_date}
        tags={review.tags}
        category={review.category}
        backHref="/reviews"
        backText="Reviews"
        preview={review.preview}
        status={review.status ?? "Draft"}
        confidence={review.confidence ?? "possible"}
        importance={review.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="content">{children}</div>
      
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={review.title}
          slug={review.slug}
          date={(review.end_date && review.end_date.trim()) || review.start_date}
          url={`https://krisyotam.com/reviews/${slugifyCategory(review.category)}/${review.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}