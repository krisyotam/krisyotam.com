import { Metadata } from "next";
import { notFound } from "next/navigation";
import DossiersClientPage from "../DossiersClientPage";
import type { DossierMeta } from "@/types/dossiers";

async function getDossiersData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data/dossiers`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch dossiers data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dossiers data:', error);
    return [];
  }
}

async function getCategoriesData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data/dossiers/categories`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch categories data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories data:', error);
    return { categories: [] };
  }
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categoriesData = await getCategoriesData();
  return categoriesData.categories.map((category: any) => ({
    category: category.slug,
  }));
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoriesData = await getCategoriesData();
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
  const dossiersData = await getDossiersData();
  const categoriesData = await getCategoriesData();
  
  const dossiers: DossierMeta[] = dossiersData as DossierMeta[];
  
  // Filter dossiers for this category
  const categoryData = categoriesData.categories.find((cat: any) => cat.slug === params.category);
  
  if (!categoryData) {
    notFound();
  }

  const filteredDossiers = dossiers.filter((dossier: DossierMeta) => dossier.category === params.category);

  return <DossiersClientPage dossiers={filteredDossiers} initialCategory={params.category} />;
}