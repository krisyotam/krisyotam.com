/**
 * =============================================================================
 * Reviews Category Page
 * =============================================================================
 *
 * Dynamic category page for reviews.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import ReviewClientPage from "../ReviewClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/content";

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
  const reviewsData = getActiveContentByType('reviews');

  // Get all unique categories and generate their slugs
  const categories = new Set(reviewsData.map(review =>
    slugifyCategory(review.category)
  ));

  return Array.from(categories).map(category => ({
    category: category
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  const categoriesData = getCategoriesByContentType('reviews');
  const categoryData = categoriesData.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const url = `https://krisyotam.com/reviews/${categorySlug}`;

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
    title: `${categoryData.title} | Reviews | Kris Yotam`,
    description: categoryData.preview || `Reviews in the ${categoryData.title} category`,
    openGraph: {
      title: categoryData.title,
      description: categoryData.preview || `Reviews in the ${categoryData.title} category`,
      url,
      type: "website",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: categoryData.title,
      description: categoryData.preview || `Reviews in the ${categoryData.title} category`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ReviewsCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;

  // Fetch reviews and categories from database
  const reviewsData = getActiveContentByType('reviews');
  const categoriesData = getCategoriesByContentType('reviews');

  // Find the original category name
  const originalCategory = reviewsData.find(review =>
    slugifyCategory(review.category) === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Map and sort reviews by date (newest first)
  const reviews: ReviewMeta[] = reviewsData
    .map(review => ({
      title: review.title,
      subtitle: review.subtitle,
      preview: review.preview,
      start_date: review.start_date,
      end_date: review.end_date,
      slug: review.slug,
      tags: review.tags,
      category: review.category,
      status: review.status as ReviewStatus,
      confidence: review.confidence as ReviewConfidence,
      importance: review.importance,
      cover_image: review.cover_image,
      state: (review.state as "active" | "hidden" | undefined) || "active"
    }))
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  // Map categories to the format expected by client component
  const categories = categoriesData.map(cat => ({
    slug: cat.slug,
    title: cat.title,
    preview: cat.preview,
    date: cat.date,
    status: cat.status,
    confidence: cat.confidence,
    importance: cat.importance
  }));

  return (
    <div className="reviews-container">
      <ReviewClientPage
        reviews={reviews}
        categories={categories}
        initialCategory={originalCategory}
      />
    </div>
  );
}
