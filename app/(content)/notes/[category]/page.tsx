import NotesClientPage from "../NotesClientPage";
import notesData from "@/data/notes/notes.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from active notes data only
  const activeNotes = notesData.filter(note => note.state === "active");
  const categories = Array.from(new Set(activeNotes.map(note => note.category)));
  
  console.log('Available categories:', categories);
  console.log('Slugified categories:', categories.map(cat => cat.toLowerCase().replace(/\s+/g, "-")));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const activeNotes = notesData.filter(note => note.state === "active");
  const originalCategory = activeNotes.find(note => 
    note.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Notes",
    };
  }

  return {
    title: `${originalCategory} Notes | Kris Yotam`,
    description: `Notes in the ${originalCategory} category`,
  };
}

export default function NotesCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Filter notes to only show active ones first
  const activeNotes = notesData.filter(note => note.state === "active");
  
  // Find the original category name
  const originalCategory = activeNotes.find(note => 
    note.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort notes by date (newest first)
  const notes = [...activeNotes].sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="notes-container">
      <NotesClientPage notes={notes} initialCategory={originalCategory} />
    </div>
  );
}
