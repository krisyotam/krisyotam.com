import FictionClientPage from "../FictionClientPage";
import fictionData from "@/data/fiction/fiction.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from fiction data
  const categories = Array.from(new Set(fictionData.map(story => story.category)));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = fictionData.find(story => 
    story.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Fiction",
    };
  }

  return {
    title: `${originalCategory} Fiction | Kris Yotam`,
    description: `Fiction in the ${originalCategory} category`,
  };
}

export default function FictionCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = fictionData.find(story => 
    story.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort stories by date (newest first)
  const stories = [...fictionData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory={originalCategory} />
    </div>
  );
}