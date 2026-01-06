/**
 * =============================================================================
 * Fiction Category Page
 * =============================================================================
 *
 * Dynamic category page for fiction stories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import FictionClientPage from "../FictionClientPage";
import { getContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

interface Story {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  cover_image?: string;
  status?: string;
  confidence?: string;
  importance?: number;
  preview: string;
  state: string;
}

interface PageProps {
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
  const fictionData = getContentByType('fiction');

  // Get all unique categories from fiction data
  const categories = Array.from(new Set(fictionData.map(story => story.category)));

  return categories.map(category => ({
    category: slugifyCategory(category)
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  const fictionData = getContentByType('fiction');

  // Convert slug back to category name
  const originalCategory = fictionData.find(story =>
    slugifyCategory(story.category) === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Fiction",
    };
  }

  return {
    title: `${originalCategory} Fiction | Kris Yotam`,
    description: `Fiction in the ${originalCategory} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function FictionCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;

  const fictionData = getContentByType('fiction');
  const categories = getCategoriesByContentType('fiction');

  // Find the original category name
  const originalCategory = fictionData.find(story =>
    slugifyCategory(story.category) === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort stories by date (newest first) and filter active ones
  const stories = fictionData
    .filter(story => story.state === 'active')
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    }) as Story[];

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory={originalCategory} categories={categories} />
    </div>
  );
}
