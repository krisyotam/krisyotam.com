import { Metadata } from "next";
import { notFound } from "next/navigation";
import PapersClientPage from "../PapersClientPage";
import papersData from "@/data/papers/papers.json";
import categoriesData from "@/data/papers/categories.json";
import type { PaperMeta } from "@/types/content";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  return categoriesData.categories.map((category) => ({
    category: category.slug,
  }));
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryData = categoriesData.categories.find(cat => cat.slug === params.category);
  
  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryData.title} Papers`,
    description: categoryData.preview || `Papers in the ${categoryData.title} category`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const allPapers: PaperMeta[] = papersData.papers as PaperMeta[];
  
  // Filter papers for this category
  const categoryData = categoriesData.categories.find(cat => cat.slug === params.category);
  
  if (!categoryData) {
    notFound();
  }

  // Filter out hidden papers and only include those in the current category
  const filteredPapers = allPapers.filter(paper => 
    paper.category === params.category && paper.state !== "hidden"
  );

  return <PapersClientPage papers={filteredPapers} initialCategory={params.category} />;
}