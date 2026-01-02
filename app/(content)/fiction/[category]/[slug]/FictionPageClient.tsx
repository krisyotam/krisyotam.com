import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { Comments } from "@/components/core/comments";
import type { NoteMeta } from "@/types/content";

interface FictionItem extends Omit<NoteMeta, 'date'> {
  start_date: string;
  end_date?: string;
  date?: string; // fallback for compatibility
}

interface Props {
  note: FictionItem;
  allNotes: FictionItem[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function FictionPageClient({ note, allNotes, children, headerOnly, contentOnly }: Props) {
  if (!note) notFound();

  /* prev / next */
  const sorted = [...allNotes].sort(
    (a, b) => +new Date(b.start_date || b.date || '') - +new Date(a.start_date || a.date || '')
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
          start_date={note.start_date}
          end_date={note.end_date}
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

  // Add lastUpdated and rawMarkdown for SiteFooter
  const lastUpdated = (note.end_date && note.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Comments />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation
          title={note.title}
          slug={note.slug}
          start_date={note.start_date}
          end_date={note.end_date}
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
        start_date={note.start_date}
        end_date={note.end_date}
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
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={note.title}
          slug={note.slug}
          start_date={note.start_date || note.date}
          end_date={note.end_date}
          url={`https://krisyotam.com/fiction/${slugifyCategory(note.category)}/${note.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}