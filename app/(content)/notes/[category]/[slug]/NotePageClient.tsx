/* app/notes/[category]/[slug]/NotePageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Citation } from "@/components/citation";
import { Comments } from "@/components/core/comments";
import { Footnotes } from "@/components/core/footnotes";

interface NoteMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  date?: string; // fallback for compatibility
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
  note: NoteMeta;
  allNotes: NoteMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function NotePageClient({ note, allNotes, children, headerOnly, contentOnly }: Props) {
  if (!note) notFound();

  /* prev / next */
  const sorted = [...allNotes].sort(
    (a, b) => {
      const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
      const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
      return +new Date(bDate) - +new Date(aDate);
    }
  );
  const idx  = sorted.findIndex(n => n.slug === note.slug);
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
          title={note.title}
          subtitle={note.subtitle}
          start_date={note.start_date}
          end_date={note.end_date}
          tags={note.tags}
          category={note.category}
          backHref="/notes"
          backText="Notes"
          preview={note.preview}
          status={note.status ?? "Notes"}
          confidence={note.confidence ?? "possible"}
          importance={note.importance ?? 5}
        />
      </div>
    );
  }

  const lastUpdated = (note.end_date && note.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Comments />
        <Footnotes containerSelector="#content" />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={note.title}
          slug={note.slug}
          start_date={note.start_date}
          end_date={note.end_date}
          url={`https://krisyotam.com/notes/${slugifyCategory(note.category)}/${note.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Render full layout (legacy)
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .note-content) ----------------------- */}
      <PostHeader 
        className=""     
        title={note.title}
        subtitle={note.subtitle}
        start_date={note.start_date}
        end_date={note.end_date}
        tags={note.tags}
        category={note.category}
        backHref="/notes"
        backText="Notes"
        preview={note.preview}
        status={note.status ?? "Notes"}
        confidence={note.confidence ?? "possible"}
        importance={note.importance ?? 5}
      />
      
      {/* MDX body -------------------------------------------------------- */}
      <div className="note-content">{children}</div>

      <div className="mt-8">
        <Comments />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={note.title}
          slug={note.slug}
          start_date={note.start_date}
          end_date={note.end_date}
          url={`https://krisyotam.com/notes/${slugifyCategory(note.category)}/${note.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}
