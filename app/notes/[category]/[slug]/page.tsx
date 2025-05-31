import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import notesData from "@/data/notes/quick-notes.json";
import NotePageClient from "./NotePageClient";
import type { NoteMeta } from "@/types/note";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface NoteData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
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

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const note = notesData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  return {
    title: `${note.title} | ${note.category} | Kris Yotam`,
    description: `Note: ${note.title} in ${note.category} category`,
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

  // Get the year from the note's date to locate the correct MDX file
  const year = noteData.date.split('-')[0];
  
  // Dynamically import the MDX file based on year/slug
  const Note = (await import(`@/app/notes/content/${year}/${params.slug}.mdx`)).default;

  return (
    <NotePageClient note={note} allNotes={notes}>
      <div className="note-content">
        {/* MDX is now a real React component */}
        <Note />
      </div>
    </NotePageClient>
  );
}
