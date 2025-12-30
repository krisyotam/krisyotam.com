/* app/til/[...slug]/TilPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/components/footer";
import { Citation } from "@/components/citation";

interface TilMeta {
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
  state?: "active" | "hidden";
  cover_image?: string;
}

interface Props {
  til: TilMeta;
  allTils: TilMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function TilPageClient({ til, allTils, children, headerOnly, contentOnly }: Props) {
  if (!til) notFound();

  /* prev / next */
  const sorted = [...allTils].sort(
    (a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return +new Date(bDate) - +new Date(aDate);
    }
  );
  const idx  = sorted.findIndex(t => t.slug === til.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader 
          className=""     
          title={til.title}
          subtitle={til.subtitle}
          start_date={til.start_date}
          end_date={til.end_date}
          tags={til.tags}
          category={til.category}
          backHref="/til"
          backText="Today I Learned"
          preview={til.preview}
          status={til.status ?? "Finished"}
          confidence={til.confidence ?? "certain"}
          importance={til.importance ?? 9}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={til.title}
          slug={til.slug}
          start_date={til.start_date}
          end_date={til.end_date}
          url={`https://krisyotam.com/til/${til.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Render full layout (legacy)
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .til-content) ----------------------- */}
      <PostHeader 
        className=""     
        title={til.title}
        subtitle={til.subtitle}
        start_date={til.start_date}
        end_date={til.end_date}
        tags={til.tags}
        category={til.category}
        backHref="/til"
        backText="Today I Learned"
        preview={til.preview}
        status={til.status ?? "Finished"}
        confidence={til.confidence ?? "certain"}
        importance={til.importance ?? 9}
      />
      
      {/* MDX body -------------------------------------------------------- */}
      <div className="til-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={til.title}
          slug={til.slug}
          start_date={til.start_date}
          end_date={til.end_date}
          url={`https://krisyotam.com/til/${til.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}
