import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import type { NoteMeta } from "@/types/note";

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
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx = sorted.findIndex(n => n.slug === note.slug);
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
          title={note.title}
          subtitle={note.subtitle}
          date={note.date}
          tags={note.tags}
          category={note.category}
          backHref="/fiction"
          backText="Fiction"
          preview={note.preview}
          status={note.status ?? "Notes"}
          confidence={note.confidence ?? "possible"}
          importance={note.importance ?? 5}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation
          title={note.title}
          slug={note.slug}
          date={note.date}
          url={`https://krisyotam.com/fiction/${slugifyCategory(note.category)}/${note.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .note-content) */}
      <PostHeader 
        className=""     
        title={note.title}

        date={note.date}
        tags={note.tags}
        category={note.category}
        backHref="/fiction"
        backText="Fiction"
        preview={note.preview}
        status={note.status ?? "Notes"}
        confidence={note.confidence ?? "possible"}
        importance={note.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="note-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={note.title}
          slug={note.slug}
          date={note.date}
          url={`https://krisyotam.com/fiction/${slugifyCategory(note.category)}/${note.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}