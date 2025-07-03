import NotesCategoriesClientPage from "./NotesCategoriesClientPage";
import categoriesData from "@/data/notes/categories.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes Categories",
  description: "Browse all note categories and their descriptions",
};

export default function NotesCategoriesPage() {
  // Sort categories by importance (highest first)
  const categories = [...categoriesData.categories].sort((a, b) => b.importance - a.importance);

  return (
    <div className="notes-container">
      <NotesCategoriesClientPage categories={categories} />
    </div>
  );
}
