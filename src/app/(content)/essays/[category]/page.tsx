/**
 * =============================================================================
 * Essays Category Page
 * =============================================================================
 *
 * Dynamic route for displaying essays within a specific category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import EssaysClientPage from "../EssaysClientPage";
import type { Post } from "@/lib/posts";

// =============================================================================
// Types
// =============================================================================

interface EssaysCategoryPageProps {
  params: Promise<{ category: string }>;
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
  const essays = getActiveContentByType('essays');
  const categorySlugs = new Set<string>();

  essays.forEach(essay => {
    if (essay.category) {
      categorySlugs.add(slugifyCategory(essay.category));
    }
  });

  return Array.from(categorySlugs).map(category => ({ category }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: EssaysCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const essays = getActiveContentByType('essays');
  const categories = getCategoriesByContentType('essays');

  const categoryPost = essays.find(essay =>
    slugifyCategory(essay.category) === categorySlug
  );

  if (!categoryPost) {
    return { title: "Category Not Found" };
  }

  const customCategory = categories.find(c => c.slug === categorySlug);
  const categoryTitle = customCategory?.title || categoryPost.category;
  const description = customCategory?.preview || `Essays in the ${categoryTitle} category`;

  return {
    title: `${categoryTitle} | Essays`,
    description,
    openGraph: {
      title: `${categoryTitle} Essays`,
      description,
      url: `https://krisyotam.com/essays/${categorySlug}`,
      type: "website",
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} Essays`,
      description,
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function EssaysCategoryPage({ params }: EssaysCategoryPageProps) {
  const { category: categorySlug } = await params;

  // Fetch data from database
  const allEssays = getActiveContentByType('essays');
  const categories = getCategoriesByContentType('essays');

  // Verify this category exists
  const hasCategory = allEssays.some(essay =>
    slugifyCategory(essay.category) === categorySlug
  );

  if (!hasCategory) {
    notFound();
  }

  // Build slugs for view count lookup
  const slugs = allEssays.map(essay => `essays/${essay.category}/${essay.slug}`);
  const viewCounts = await getViewCounts(slugs);

  // Transform to Post format with views
  const essays: (Post & { views: number })[] = allEssays.map(essay => {
    const viewSlug = `essays/${essay.category}/${essay.slug}`;
    return {
      slug: essay.slug,
      title: essay.title,
      date: (essay.end_date?.trim()) ? essay.end_date : essay.start_date,
      start_date: essay.start_date,
      end_date: essay.end_date || "",
      preview: essay.preview || "",
      tags: essay.tags || [],
      status: (essay.status || "Finished") as Post['status'],
      confidence: (essay.confidence || "certain") as Post['confidence'],
      importance: essay.importance ?? 5,
      category: essay.category,
      state: essay.state as Post['state'],
      path: "essays",
      cover_image: essay.cover_image,
      views: viewCounts[viewSlug] ?? 0
    };
  });

  // Transform categories with defaults
  const transformedCategories = categories.map(cat => ({
    slug: cat.slug,
    title: cat.title,
    preview: cat.preview || `Essays in the ${cat.title} category.`,
    date: cat.date,
    status: cat.status,
    confidence: cat.confidence,
    importance: cat.importance ?? 5,
  }));

  return (
    <div className="essays-container">
      <EssaysClientPage
        notes={essays}
        categories={transformedCategories}
        initialCategory={categorySlug}
      />
    </div>
  );
}
