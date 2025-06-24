import NotesClientPage from "../NotesClientPage";
import notesData from "@/data/notes/quick-notes.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from notes data
  const categories = Array.from(new Set(notesData.map(note => note.category)));
  
  console.log('Available categories:', categories);
  console.log('Slugified categories:', categories.map(cat => cat.toLowerCase().replace(/\s+/g, "-")));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = notesData.find(note => 
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
  
  // Find the original category name
  const originalCategory = notesData.find(note => 
    note.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort notes by date (newest first)
  const notes = [...notesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="notes-container">
      <NotesClientPage notes={notes} initialCategory={originalCategory} />
    </div>
  );
}
