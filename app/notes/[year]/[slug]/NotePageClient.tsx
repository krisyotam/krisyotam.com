/* app/notes/[year]/[slug]/NotePageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";

interface NoteMeta {
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
  note: NoteMeta;
  allNotes: NoteMeta[];
  children: React.ReactNode;
}

export default function NotePageClient({ note, allNotes, children }: Props) {
  if (!note) notFound();

  /* prev / next */
  const sorted = [...allNotes].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx  = sorted.findIndex(n => n.slug === note.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* breadcrumb ------------------------------------------------------ */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/"        className="hover:underline">home</Link>
        <span className="mx-2">›</span>
        <Link href="/notes"   className="hover:underline">notes</Link>
        <span className="mx-2">›</span>
        <span>{note.title}</span>
      </nav>

      {/* clean page header (outside .note-content) ----------------------- */}
      <PostHeader 
        className="text-center"     
        title={note.title}
        subtitle={note.subtitle}
        date={note.date}
        tags={note.tags}
        category={note.category}
        preview={note.preview}
        status={note.status ?? "Notes"}
        confidence={note.confidence ?? "possible"}
        importance={note.importance ?? 5}
      />

      {/* MDX body -------------------------------------------------------- */}
      <div className="note-content">{children}</div>

      {/* prev / next nav ------------------------------------------------- */}
      <div className="border-t border-border pt-6 mt-12 flex justify-between">
        {prev && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Previous</div>
            <Link
              href={`/notes/${prev.date.slice(0,4)}/${prev.slug}`}
              className="hover:underline"
            >{prev.title}</Link>
          </div>
        )}
        {next && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Next</div>
            <Link
              href={`/notes/${next.date.slice(0,4)}/${next.slug}`}
              className="hover:underline"
            >{next.title}</Link>
          </div>
        )}
      </div>

      <LiveClock />
    </div>
  );
}
