/**
 * =============================================================================
 * Papers Category Page
 * =============================================================================
 *
 * Dynamic route for displaying papers in a specific category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import PapersCategoryPage from "./PapersCategoryPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PaperMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// Helpers
// =============================================================================

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const papers = getActiveContentByType('papers');
  const categorySlugs = new Set<string>();

  papers.forEach(paper => {
    if (paper.category) {
      categorySlugs.add(slugifyCategory(paper.category));
    }
  });

  return Array.from(categorySlugs).map(slug => ({ slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: categorySlug } = await params;
  const papers = getActiveContentByType('papers');
  const categories = getCategoriesByContentType('papers');

  // Find the original category name
  const paperWithCategory = papers.find(paper =>
    paper.category && slugifyCategory(paper.category) === categorySlug
  );

  if (!paperWithCategory) {
    return { title: "Category Not Found | Papers" };
  }

  const customCategory = categories.find(c => c.slug === categorySlug);
  const categoryTitle = customCategory?.title || paperWithCategory.category;

  return {
    title: `${categoryTitle} Papers`,
    description: `Papers in the ${categoryTitle} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function PaperCategoryPage({ params }: PageProps) {
  const { slug: categorySlug } = await params;

  // Fetch data from database
  const allPapers = getActiveContentByType('papers');
  const categories = getCategoriesByContentType('papers');

  // Find the original category name and filter papers
  let originalCategory: string | undefined;
  const papersInCategory = allPapers.filter(paper => {
    if (paper.category && slugifyCategory(paper.category) === categorySlug) {
      if (!originalCategory) {
        originalCategory = paper.category;
      }
      return true;
    }
    return false;
  });

  if (!originalCategory || papersInCategory.length === 0) {
    notFound();
  }

  // Check if this category has custom metadata
  const customCategory = categories.find(c => c.slug === categorySlug);

  // Create header data for this category
  const categoryHeaderData = customCategory ? {
    title: customCategory.title,
    subtitle: "",
    start_date: customCategory.date || new Date().toISOString().split('T')[0],
    end_date: "",
    date: customCategory.date,
    preview: customCategory.preview || `Papers in the ${customCategory.title} category.`,
    status: (customCategory.status || "Active") as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
    confidence: (customCategory.confidence || "certain") as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
    importance: customCategory.importance ?? 5,
    backText: "Categories",
    backHref: "/papers/categories"
  } : {
    title: originalCategory,
    subtitle: "",
    date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    preview: `Papers in the ${originalCategory} category.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Categories",
    backHref: "/papers/categories"
  };

  // Sort papers by date (newest first) and transform to PaperMeta
  const papers: PaperMeta[] = [...papersInCategory]
    .sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .map(paper => ({
      title: paper.title,
      subtitle: paper.preview,
      preview: paper.preview,
      start_date: paper.start_date,
      end_date: paper.end_date,
      slug: paper.slug,
      tags: paper.tags,
      category: paper.category,
      status: paper.status as PaperMeta['status'],
      confidence: paper.confidence as PaperMeta['confidence'],
      importance: paper.importance,
      state: paper.state,
      cover_image: paper.cover_image
    }));

  return (
    <div className="papers-container">
      <PapersCategoryPage papers={papers} categoryData={categoryHeaderData} />
    </div>
  );
}
