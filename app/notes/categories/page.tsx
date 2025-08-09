import NotesCategoriesClientPage from "./NotesCategoriesClientPage";
import categoriesData from "@/data/notes/categories.json";
import notesData from "@/data/notes/notes.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes Categories",
  description: "Browse all note categories and their descriptions",
};

export default function NotesCategoriesPage() {
  // Get all unique categories that actually exist in notes (only active notes)
  const activeNotes = notesData.filter(note => note.state === "active");
  const existingCategories = Array.from(new Set(activeNotes.map(note => note.category)));
  
  // Filter categories.json to only include categories that exist in notes
  const categories = categoriesData.categories
    .filter(category => {
      // Check if this category exists in the notes
      return existingCategories.includes(category.title) || 
             existingCategories.includes(category.slug) ||
             existingCategories.some(cat => cat.toLowerCase().replace(/\s+/g, "-") === category.slug);
    })
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="notes-container">
      <NotesCategoriesClientPage categories={categories} />
    </div>
  );
}
