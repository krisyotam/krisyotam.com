/* app/ocs/[category]/[slug]/OCSPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";

interface OCSMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
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

  /* prev / next */
  const sorted = [...allCharacters].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
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
          date={character.date}
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

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={character.title}
          slug={character.slug}
          date={character.date}
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
      {/* clean page header (outside .ocs-content) */}
      <PostHeader 
        className=""     
        title={character.title}
        subtitle={character.subtitle}
        date={character.date}
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
      <div className="ocs-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={character.title}
          slug={character.slug}
          date={character.date}
          url={`https://krisyotam.com/ocs/${slugifyCategory(character.category)}/${character.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    </div>
  );
}
