import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ProofHeader } from "@/components/proof-header";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import type { NoteMeta } from "@/types/note";

interface ProofItem extends Omit<NoteMeta, 'date'> {
  start_date: string;
  end_date?: string;
  date?: string; // fallback for compatibility
}

interface Props {
  note: ProofItem;
  allNotes: ProofItem[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function ProofPageClient({ note, allNotes, children, headerOnly, contentOnly }: Props) {
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
        <ProofHeader
          title={note.title}
          subtitle={note.subtitle}
          date={note.start_date || note.date || ''}
          tags={note.tags}
          category={note.category}
          backHref="/proofs"
          backText="Proofs"
          preview={note.preview}
          status={note.status ?? "Notes"}
          confidence={note.confidence ?? "possible"}
          importance={note.importance ?? 5}
          framework={note.framework}
          author={note.author}
          license={note.license}
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
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation
          title={note.title}
          slug={note.slug}
          start_date={note.start_date || note.date}
          end_date={note.end_date}
          url={`https://krisyotam.com/proofs/${slugifyCategory(note.category)}/${note.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .proof-content) */}
      <ProofHeader 
        className=""     
        title={note.title}
        subtitle={note.subtitle}
        date={note.start_date || note.date || ''}
        tags={note.tags}
        category={note.category}
        backHref="/proofs"
        backText="Proofs"
        preview={note.preview}
        status={note.status ?? "Notes"}
        confidence={note.confidence ?? "possible"}
        importance={note.importance ?? 5}
        framework={note.framework}
        author={note.author}
        license={note.license}
      />
      
      {/* MDX body */}
      <div className="proof-content">{children}</div>
      
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation 
          title={note.title}
          slug={note.slug}
          start_date={note.start_date || note.date}
          end_date={note.end_date}
          url={`https://krisyotam.com/proofs/${slugifyCategory(note.category)}/${note.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}
