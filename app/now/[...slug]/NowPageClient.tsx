"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/components/footer";
import { Citation } from "@/components/citation";

interface NowMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  date?: string; // backward compatibility
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
  now: NowMeta;
  allNows: NowMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function NowPageClient({ now, allNows, children, headerOnly, contentOnly }: Props) {
  if (!now) notFound();

  /* prev / next */
  const sorted = [...allNows].sort(
    (a, b) => {
      const aDate = a.end_date || a.start_date || a.date || "1970-01-01";
      const bDate = b.end_date || b.start_date || b.date || "1970-01-01";
      return +new Date(bDate) - +new Date(aDate);
    }
  );
  const idx  = sorted.findIndex(n => n.slug === now.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader 
          className=""     
          title={now.title}
          subtitle={now.subtitle}
          start_date={now.start_date || now.date || "2025-01-01"}
          end_date={now.end_date || new Date().toISOString().split('T')[0]}
          tags={now.tags}
          category={now.category}
          backHref="/now"
          backText="Now"
          preview={now.preview}
          status={now.status ?? "Notes"}
          confidence={now.confidence ?? "possible"}
          importance={now.importance ?? 5}
        />
      </div>
    );
  }
  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={now.title}
          slug={now.slug}
          date={now.date}
          url={`https://krisyotam.com/now/${now.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }
  // Render full layout (legacy)
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .now-content) ----------------------- */}
      <PostHeader 
        className=""     
        title={now.title}
        subtitle={now.subtitle}
        start_date={now.start_date || now.date || "2025-01-01"}
        end_date={now.end_date || new Date().toISOString().split('T')[0]}
        tags={now.tags}
        category={now.category}
        backHref="/now"
        backText="Now"
        preview={now.preview}
        status={now.status ?? "Notes"}
        confidence={now.confidence ?? "possible"}
        importance={now.importance ?? 5}
      />

      {/* content section ------------------------------------------------- */}
      <div className="now-content">
        {children}
      </div>      {/* citation, footer, etc. ------------------------------------------ */}
      <Citation 
        title={now.title}
        slug={now.slug}
        date={now.date}
        url={`https://krisyotam.com/now/${now.slug}`}
      />
      <LiveClock />
      <Footer />
    </div>
  );
}
