import { Metadata } from "next";
import { notFound } from "next/navigation";
import DossiersClientPage from "../DossiersClientPage";
import dossiersData from "@/data/dossiers/dossiers.json";
import categoriesData from "@/data/dossiers/categories.json";
import type { DossierMeta } from "@/types/dossiers";

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
    title: `${categoryData.title} Dossiers`,
    description: categoryData.preview || `Dossiers in the ${categoryData.title} category`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const dossiers: DossierMeta[] = dossiersData as DossierMeta[];
  
  // Filter dossiers for this category
  const categoryData = categoriesData.categories.find(cat => cat.slug === params.category);
  
  if (!categoryData) {
    notFound();
  }

  const filteredDossiers = dossiers.filter(dossier => dossier.category === params.category);

  return <DossiersClientPage dossiers={filteredDossiers} initialCategory={params.category} />;
}