export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import notesData from "@/data/notes/notes.json";
import NotePageClient from "./NotePageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { NoteMeta } from "@/types/note";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface NoteData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  cover_image?: string;
  preview?: string;
  state?: string;
}

interface NotePageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return notesData.map(note => ({
    category: slugifyCategory(note.category),
    slug: note.slug
  }));
}

export async function generateMetadata({ params }: NotePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const note = notesData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  // Get cover image URL - prioritize cover_image field, fallback to a placeholder
  const coverUrl = note.cover_image || 
    `https://picsum.photos/1200/630?text=${encodeURIComponent(note.title)}`

  const url = `https://krisyotam.com/notes/${params.category}/${params.slug}`;

  return {
    title: `${note.title} | Kris Yotam`,
    description: note.preview || `Note: ${note.title} in ${note.category} category`,
    openGraph: {
      title: note.title,
      description: note.preview || `Note: ${note.title} in ${note.category} category`,
      url,
      type: "article",
      images: [{
        url: coverUrl,
        width: 1200,
        height: 630,
        alt: note.title
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.preview || `Note: ${note.title} in ${note.category} category`,
      images: [coverUrl],
      creator: "@krisyotam"
    }
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const noteData = notesData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!noteData) {
    notFound();
  }

  const note: NoteMeta = {
    ...noteData,
    status: noteData.status as Status,
    confidence: noteData.confidence as Confidence
  };

  const notes: NoteMeta[] = notesData.map((note: NoteData) => ({
    ...note,
    status: note.status as Status,
    confidence: note.confidence as Confidence
  }));

  // Extract headings from the note MDX content
  const headings = await extractHeadingsFromMDX('notes', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const Note = (await import(`@/app/(content)/notes/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <NotePageClient note={note} allNotes={notes} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="note-content">
            <Note />
          </div>
          <NotePageClient note={note} allNotes={notes} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
