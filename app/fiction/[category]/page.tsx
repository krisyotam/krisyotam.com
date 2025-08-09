import FictionClientPage from "../FictionClientPage";
import fictionDataRaw from "@/data/fiction/fiction.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Story {
  title: string;
  start_date: string;
  end_date?: string;
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

// Type assertion and mapping to ensure the imported data matches our Story interface
const fictionData = fictionDataRaw.map(story => ({
  ...story,
  start_date: story.start_date || (story as any).date || new Date().toISOString().split('T')[0],
  end_date: story.end_date
})) as Story[];

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
  const stories = [...fictionData].sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory={originalCategory} />
    </div>
  );
}