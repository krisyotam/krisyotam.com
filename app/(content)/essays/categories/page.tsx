import EssaysCategoriesClientPage from "./EssaysCategoriesClientPage";
import categoriesData from "@/data/essays/categories.json";
import essaysData from "@/data/essays/essays.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essays Categories",
  description: "Browse all essay categories and their descriptions",
};

export default function EssaysCategoriesPage() {
  // Get all unique categories that actually exist in essays (only active essays)
  const activeEssays = essaysData.essays.filter(essay => essay.state === "active");
  const existingCategories = Array.from(new Set(activeEssays.map(essay => essay.category)));
  
  // Filter categories.json to only include categories that exist in essays
  const categories = categoriesData.categories
    .filter(category => {
      // Check if this category exists in the essays
      return existingCategories.includes(category.title) || 
             existingCategories.includes(category.slug) ||
             existingCategories.some(cat => cat.toLowerCase().replace(/\s+/g, "-") === category.slug);
    })
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="essays-container">
      <EssaysCategoriesClientPage categories={categories} />
    </div>
  );
}