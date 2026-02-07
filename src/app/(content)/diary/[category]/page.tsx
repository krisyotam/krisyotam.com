/**
 * =============================================================================
 * Diary Category Page
 * =============================================================================
 *
 * Dynamic route for diary entries filtered by category.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { notFound } from "next/navigation";
import DiaryClientPage from "../DiaryClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import type { Metadata } from "next";
import type { DiaryMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface CategoryPageProps {
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
  const entries = getActiveContentByType('diary');
  const uniqueCategories = [...new Set(entries.map(e => slugifyCategory(e.category)))];

  return uniqueCategories.map(category => ({
    category
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = getCategoriesByContentType('diary');
  const categoryData = categories.find(c => c.slug === category);

  const title = categoryData?.title || category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${title} | Diary | Kris Yotam`,
    description: categoryData?.preview || `Diary entries in ${title} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function DiaryCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const rawEntries = getActiveContentByType('diary');
  const categories = getCategoriesByContentType('diary');

  // Find the original category name
  const originalCategory = rawEntries.find(e => slugifyCategory(e.category) === category)?.category;

  if (!originalCategory) {
    notFound();
  }

  // Build slugs for view count lookup
  const slugs = rawEntries.map(entry => {
    const categorySlug = slugifyCategory(entry.category);
    return `diary/${categorySlug}/${entry.slug}`;
  });
  const viewCounts = await getViewCounts(slugs);

  // Transform entries
  const entries: (DiaryMeta & { views: number })[] = rawEntries
    .map(entry => {
      const categorySlug = slugifyCategory(entry.category);
      const viewSlug = `diary/${categorySlug}/${entry.slug}`;
      return {
        title: entry.title,
        preview: entry.preview,
        start_date: entry.start_date,
        end_date: entry.end_date,
        slug: entry.slug,
        tags: entry.tags || [],
        category: entry.category,
        cover_image: entry.cover_image,
        state: entry.state as DiaryMeta['state'],
        views: viewCounts[viewSlug] ?? 0
      };
    })
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <div className="diary-container">
      <DiaryClientPage
        entries={entries}
        categories={categories}
        initialCategory={originalCategory}
      />
    </div>
  );
}
