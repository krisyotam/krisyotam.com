/* app/conspiracies/[category]/[slug]/ConspiraciesPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";

interface ConspiracyMeta {
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
  conspiracy: ConspiracyMeta;
  allConspiracies: ConspiracyMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function ConspiraciesPageClient({ conspiracy, allConspiracies, children, headerOnly, contentOnly }: Props) {
  if (!conspiracy) notFound();

  /* prev / next */
  const sorted = [...allConspiracies].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx  = sorted.findIndex(n => n.slug === conspiracy.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;
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
          title={conspiracy.title}
          subtitle={conspiracy.subtitle}
          date={conspiracy.date}
          tags={conspiracy.tags}
          category={conspiracy.category}
          backHref="/conspiracies"
          backText="Conspiracies"
          preview={conspiracy.preview}
          status={conspiracy.status ?? "Notes"}
          confidence={conspiracy.confidence ?? "possible"}
          importance={conspiracy.importance ?? 5}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={conspiracy.title}
          slug={conspiracy.slug}
          date={conspiracy.date}
          url={`https://krisyotam.com/conspiracies/${slugifyCategory(conspiracy.category)}/${conspiracy.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Legacy layout - render everything together
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .conspiracy-content) ----------------------- */}
      <PostHeader
        className=""     
        title={conspiracy.title}
        subtitle={conspiracy.subtitle}
        date={conspiracy.date}
        tags={conspiracy.tags}
        category={conspiracy.category}
        backHref="/conspiracies"
        backText="Conspiracies"
        preview={conspiracy.preview}
        status={conspiracy.status ?? "Notes"}
        confidence={conspiracy.confidence ?? "possible"}
        importance={conspiracy.importance ?? 5}
      />
      
      {/* MDX body -------------------------------------------------------- */}
      <div className="conspiracy-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={conspiracy.title}
          slug={conspiracy.slug}
          date={conspiracy.date}
          url={`https://krisyotam.com/conspiracies/${slugifyCategory(conspiracy.category)}/${conspiracy.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}