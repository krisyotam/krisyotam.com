/* app/reviews/[category]/[slug]/ReviewPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";

interface ReviewMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
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

  /* prev / next */
  const sorted = [...allReviews].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
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
          date={review.date}
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

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={review.title}
          slug={review.slug}
          date={review.date}
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
      {/* clean page header (outside .review-content) */}
      <PostHeader 
        className=""     
        title={review.title}
        subtitle={review.subtitle}
        date={review.date}
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
      <div className="review-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={review.title}
          slug={review.slug}
          date={review.date}
          url={`https://krisyotam.com/reviews/${slugifyCategory(review.category)}/${review.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}