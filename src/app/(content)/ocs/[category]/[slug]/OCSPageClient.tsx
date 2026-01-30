/* app/ocs/[category]/[slug]/OCSPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/core";
import { Footer } from "@/app/(content)/essays/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Citation } from "@/components/citation";
import { Comments } from "@/components/core/comments";
import { Footnotes } from "@/components/core/footnotes";
import { ViewTracker } from "@/components/view-tracker";

interface OCSMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  book: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain";
  importance?: number;
}

interface Props {
  character: OCSMeta;
  allCharacters: OCSMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function OCSPageClient({ character, allCharacters, children, headerOnly, contentOnly }: Props) {
  if (!character) notFound();

  const viewSlug = `ocs/${character.category.toLowerCase().replace(/\s+/g, "-")}/${character.slug}`;

  /* prev / next */
  const sorted = [...allCharacters].sort(
    (a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return +new Date(bDate) - +new Date(aDate);
    }
  );
  const idx = sorted.findIndex(n => n.slug === character.slug);
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
          title={character.title}
          subtitle={character.subtitle}
          start_date={character.start_date}
          end_date={character.end_date}
          tags={character.tags}
          category={character.category}
          backHref="/ocs"
          backText="Characters"
          preview={character.preview}
          status={character.status ?? "Draft"}
          confidence={character.confidence ?? "possible"}
          importance={character.importance ?? 5}
        />
      </div>
    );
  }

  const lastUpdated = (character.end_date && character.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Comments />
        <Footnotes containerSelector="#content" />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={character.title}
          slug={character.slug}
          start_date={character.start_date}
          end_date={character.end_date}
          url={`https://krisyotam.com/ocs/${slugifyCategory(character.category)}/${character.slug}`}
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
      {/* clean page header (outside .ocs-content) */}
      <PostHeader 
        className=""     
        title={character.title}
        subtitle={character.subtitle}
        start_date={character.start_date}
        end_date={character.end_date}
        tags={character.tags}
        category={character.category}
        backHref="/ocs"
        backText="Characters"
        preview={character.preview}
        status={character.status ?? "Draft"}
        confidence={character.confidence ?? "possible"}
        importance={character.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="content">{children}</div>
      
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={character.title}
          slug={character.slug}
          start_date={character.start_date}
          end_date={character.end_date}
          url={`https://krisyotam.com/ocs/${slugifyCategory(character.category)}/${character.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}
