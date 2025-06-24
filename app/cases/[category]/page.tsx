import { Metadata } from "next";
import { notFound } from "next/navigation";
import CasesClientPage from "../CasesClientPage";
import casesData from "@/data/cases/cases.json";
import categoriesData from "@/data/cases/categories.json";
import type { CaseMeta } from "@/types/cases";

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
    title: `${categoryData.title} Cases`,
    description: categoryData.preview || `Cases in the ${categoryData.title} category`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const cases: CaseMeta[] = casesData as CaseMeta[];
  
  // Filter cases for this category
  const categoryData = categoriesData.categories.find(cat => cat.slug === params.category);
  
  if (!categoryData) {
    notFound();
  }

  const filteredCases = cases.filter(caseItem => caseItem.category === params.category);

  return <CasesClientPage cases={filteredCases} initialCategory={params.category} />;
}