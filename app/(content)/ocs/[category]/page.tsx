/**
 * =============================================================================
 * OCS Category Page
 * =============================================================================
 *
 * Category-specific listing page for Original Characters (OCS).
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import OCSClientPage from "../OCSClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { OCSMeta, OCSStatus, OCSConfidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

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
  // Get all unique categories from database
  const ocsData = getActiveContentByType('ocs');
  const categories = new Set(ocsData.map(character =>
    slugifyCategory(character.category)
  ));

  return Array.from(categories).map(category => ({
    category: category
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = getCategoriesByContentType('ocs');
  const categoryData = categories.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const url = `https://krisyotam.com/ocs/${categorySlug}`;
  // Use Kris Yotam's logo for category pages
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 630,
      alt: `${categoryData.title} | Kris Yotam`
    }
  ];

  return {
    title: `${categoryData.title} | OCs | Kris Yotam`,
    description: categoryData.preview,
    openGraph: {
      title: categoryData.title,
      description: categoryData.preview,
      url,
      type: "website",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: categoryData.title,
      description: categoryData.preview,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function OCSCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Fetch data from database
  const ocsData = getActiveContentByType('ocs');
  const categories = getCategoriesByContentType('ocs');

  // Find the original category name
  const originalCategory = ocsData.find(character =>
    slugifyCategory(character.category) === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Map to OCSMeta type and sort by date (newest first)
  const ocs: OCSMeta[] = ocsData
    .map(character => ({
      title: character.title,
      subtitle: character.subtitle,
      preview: character.preview,
      start_date: character.start_date,
      end_date: character.end_date,
      slug: character.slug,
      tags: character.tags,
      category: character.category,
      book: character.category, // OCS uses category as book
      status: character.status as OCSStatus,
      confidence: character.confidence as OCSConfidence,
      importance: character.importance,
      cover_image: character.cover_image,
      state: (character.state as "active" | "hidden" | undefined) || "active"
    }))
    .sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="ocs-container">
      <OCSClientPage ocs={ocs} initialCategory={originalCategory} categories={categories} />
    </div>
  );
}
