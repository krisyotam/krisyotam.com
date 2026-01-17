/**
 * =============================================================================
 * Papers Category Page
 * =============================================================================
 *
 * Dynamic route for displaying papers within a specific category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import PapersClientPage from "../PapersClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { PaperMeta, PaperStatus, PaperConfidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const categories = getCategoriesByContentType('papers');
  return categories.map(category => ({ category: category.slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = getCategoriesByContentType('papers');

  const categoryData = categories.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${categoryData.title} Papers`,
    description: categoryData.preview || `Papers in the ${categoryData.title} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  // Fetch data from database
  const allPapers = getActiveContentByType('papers');
  const categories = getCategoriesByContentType('papers');

  const categoryData = categories.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    notFound();
  }

  // Filter and transform papers
  const filteredPapers: PaperMeta[] = allPapers
    .filter(paper => paper.category === categorySlug)
    .map(paper => ({
      ...paper,
      status: paper.status as PaperStatus,
      confidence: paper.confidence as PaperConfidence
    }));

  return (
    <PapersClientPage
      papers={filteredPapers}
      categories={categories}
      initialCategory={categorySlug}
    />
  );
}
