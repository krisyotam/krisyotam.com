/**
 * =============================================================================
 * Essay Category Page
 * =============================================================================
 *
 * Dynamic route for displaying essays within a specific category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import EssaysCategoryPage from "./EssaysCategoryPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const essays = getActiveContentByType('essays');

  const allCategoriesSet = new Set<string>();
  essays.forEach(essay => {
    if (essay.category) {
      allCategoriesSet.add(essay.category.toLowerCase().replace(/\s+/g, "-"));
    }
  });

  return Array.from(allCategoriesSet).map(slug => ({ slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: categorySlug } = await params;
  const essays = getActiveContentByType('essays');
  const categories = getCategoriesByContentType('essays');

  // Find original category name
  let originalCategory: string | undefined;
  for (const essay of essays) {
    if (essay.category?.toLowerCase().replace(/\s+/g, "-") === categorySlug) {
      originalCategory = essay.category;
      break;
    }
  }

  if (!originalCategory) {
    return { title: "Category Not Found | Essays" };
  }

  const customCategory = categories.find(c => c.slug === categorySlug);
  const categoryTitle = customCategory?.title || originalCategory;

  return {
    title: `${categoryTitle} Essays | Kris Yotam`,
    description: `Essays in the ${categoryTitle} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function EssayCategoryPage({ params }: PageProps) {
  const { slug: categorySlug } = await params;

  // Fetch data from database
  const allEssays = getActiveContentByType('essays');
  const categories = getCategoriesByContentType('essays');

  // Find matching essays and original category name
  let originalCategory: string | undefined;
  const essaysInCategory = allEssays.filter(essay => {
    if (essay.category?.toLowerCase().replace(/\s+/g, "-") === categorySlug) {
      if (!originalCategory) originalCategory = essay.category;
      return true;
    }
    return false;
  });

  if (!originalCategory || essaysInCategory.length === 0) {
    notFound();
  }

  // Get category metadata
  const customCategory = categories.find(c => c.slug === categorySlug);

  // Build header data
  const categoryHeaderData = customCategory ? {
    title: customCategory.title,
    subtitle: "",
    start_date: customCategory.date || "Undefined",
    end_date: new Date().toISOString().split('T')[0],
    preview: customCategory.preview || `Essays in the ${customCategory.title} category.`,
    status: (customCategory.status || "Active") as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
    confidence: (customCategory.confidence || "certain") as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
    importance: customCategory.importance ?? 5,
    backText: "Categories",
    backHref: "/essays/categories"
  } : {
    title: originalCategory,
    subtitle: "",
    start_date: "Undefined",
    end_date: new Date().toISOString().split('T')[0],
    preview: `Essays in the ${originalCategory} category.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Categories",
    backHref: "/essays/categories"
  };

  // Sort and transform essays
  const essays = [...essaysInCategory]
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .map(essay => ({
      id: essay.slug,
      title: essay.title,
      abstract: essay.preview || "",
      importance: essay.importance ?? 5,
      confidence: essay.confidence ?? "certain",
      authors: [],
      subject: essay.category,
      keywords: essay.tags || [],
      postedBy: "admin",
      postedOn: (essay.end_date?.trim()) ? essay.end_date : essay.start_date,
      dateStarted: essay.start_date,
      tags: essay.tags || [],
      img: essay.cover_image,
      status: essay.status ?? "Finished",
      pdfLink: undefined,
      sourceLink: undefined,
      category: essay.category,
      customPath: undefined
    }));

  return (
    <div className="essays-container">
      <EssaysCategoryPage essays={essays} categoryData={categoryHeaderData} />
    </div>
  );
}
