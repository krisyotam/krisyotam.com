import FictionClientPage from "../FictionClientPage";
import fictionDataRaw from "@/data/fiction/fiction.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Story {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  cover_image?: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  state: "active" | "hidden";
}

// Type assertion to ensure the imported data matches our Story interface
const fictionData = fictionDataRaw as Story[];

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