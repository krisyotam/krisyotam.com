import PapersCategoriesClientPage from "./PapersCategoriesClientPage";
import categoriesData from "@/data/papers/categories.json";
import papersData from "@/data/papers/papers.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Papers Categories",
  description: "Browse all paper categories and their descriptions",
};

export default function PapersCategoriesPage() {
  // Get all unique categories that actually exist in papers (only active papers)
  const activePapers = papersData.papers.filter(paper => paper.state === "active");
  const existingCategories = Array.from(new Set(activePapers.map(paper => paper.category)));
  
  // Filter categories.json to only include categories that exist in papers
  const categories = categoriesData.categories
    .filter(category => {
      // Check if this category exists in the papers
      return existingCategories.includes(category.title) || 
             existingCategories.includes(category.slug) ||
             existingCategories.some(cat => cat.toLowerCase().replace(/\s+/g, "-") === category.slug);
    })
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="papers-container">
      <PapersCategoriesClientPage categories={categories} />
    </div>
  );
}
