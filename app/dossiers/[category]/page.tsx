import { Metadata } from "next";
import { notFound } from "next/navigation";
import DossiersClientPage from "../DossiersClientPage";
import type { DossierMeta } from "@/types/dossiers";
import dossiersData from "@/data/dossiers/dossiers.json";
import categoriesData from "@/data/dossiers/categories.json";

function getDossiersData() {
  return dossiersData;
}

function getCategoriesData() {
  return categoriesData;
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categoriesData = getCategoriesData();
  return categoriesData.categories.map((category: any) => ({
    category: category.slug,
  }));
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoriesData = getCategoriesData();
  const categoryData = categoriesData.categories.find((cat: any) => cat.slug === params.category);
  
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const dossiersData = getDossiersData();
  const categoriesData = getCategoriesData();
  
  const dossiers: DossierMeta[] = dossiersData as DossierMeta[];
  
  // Filter dossiers for this category
  const categoryData = categoriesData.categories.find((cat: any) => cat.slug === params.category);
  
  if (!categoryData) {
    notFound();
  }

  const filteredDossiers = dossiers.filter((dossier: DossierMeta) => dossier.category === params.category);

  return <DossiersClientPage dossiers={filteredDossiers} initialCategory={params.category} />;
}