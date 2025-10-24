import { notFound } from "next/navigation";
import PromptsClientPage from "../PromptsClientPage";
import promptsData from "@/data/prompts/prompts.json";
import categoriesData from "@/data/prompts/categories.json";
import type { Metadata } from "next";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from prompts data
  const categories = Array.from(new Set(promptsData.prompts.map(prompt => prompt.category)));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = promptsData.prompts.find(prompt => 
    prompt.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Prompts",
    };
  }

  return {
    title: `${originalCategory} Prompts`,
    description: `Prompts in the ${originalCategory} category`,
  };
}

export default function PromptsCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = promptsData.prompts.find(prompt => 
    prompt.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort prompts by date (newest first)
  const prompts = [...promptsData.prompts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="prompts-container">
      <PromptsClientPage prompts={prompts} initialCategory={originalCategory} />
    </div>
  );
}
