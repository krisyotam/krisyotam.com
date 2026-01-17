/**
 * =============================================================================
 * Progymnasmata Category Page
 * =============================================================================
 *
 * Dynamic category page for Progymnasmata exercises.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { ProgymnasmataClient } from "../progymnasmata-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ category: string }>;
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  // Get all unique categories from active exercises
  const activeExercises = getActiveContentByType('progymnasmata');
  const categories = Array.from(new Set(activeExercises.map((item) => item.category)));
  return categories.map((category) => ({ category: category.toLowerCase().replace(/\s+/g, "-") }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const activeExercises = getActiveContentByType('progymnasmata');
  const originalCategory = activeExercises.find((item) =>
    item.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Progymnasmata",
    };
  }

  return {
    title: `${originalCategory} | Progymnasmata | Kris Yotam`,
    description: `Progymnasmata exercises in the ${originalCategory} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ProgymnasmataCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const activeExercises = getActiveContentByType('progymnasmata');

  const originalCategory = activeExercises.find((item) =>
    item.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort by date (newest first) and transform with defaults
  const posts = [...activeExercises].filter((item) =>
    item.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  ).sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  }).map(post => ({
    ...post,
    state: post.state || "active",
    status: post.status || "Finished",
    confidence: post.confidence || "certain",
    importance: post.importance ?? 5,
    tags: post.tags || []
  }));

  // Get categories from database and transform with defaults
  const rawCategories = getCategoriesByContentType('progymnasmata');
  const categories = rawCategories.map(cat => ({
    ...cat,
    preview: cat.preview || `Exercises in the ${cat.title} category.`,
    status: cat.status || "Active",
    confidence: cat.confidence || "certain",
    importance: cat.importance ?? 5,
    date: cat.date || new Date().toISOString().split('T')[0]
  }));

  return (
    <div className="progymnasmata-container">
      <ProgymnasmataClient posts={posts} categories={categories} initialCategory={originalCategory} />
    </div>
  );
}
