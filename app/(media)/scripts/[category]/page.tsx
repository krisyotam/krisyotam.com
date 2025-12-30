import { notFound } from "next/navigation";
import ScriptsClientPage from "../ScriptsClientPage";
import scriptsData from "@/data/scripts/scripts.json";
import categoriesData from "@/data/scripts/categories.json";
import type { Metadata } from "next";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from scripts data
  const categories = Array.from(new Set(scriptsData.scripts.map(script => script.category)));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = scriptsData.scripts.find(script => 
    script.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Scripts",
    };
  }

  return {
    title: `${originalCategory} Scripts`,
    description: `Scripts in the ${originalCategory} category`,
  };
}

export default function ScriptsCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = scriptsData.scripts.find(script => 
    script.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort scripts by date (newest first)
  const scripts = [...scriptsData.scripts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="scripts-container">
      <ScriptsClientPage scripts={scripts} initialCategory={originalCategory} />
    </div>
  );
}
