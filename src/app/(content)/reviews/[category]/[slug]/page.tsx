/**
 * =============================================================================
 * Review Detail Page
 * =============================================================================
 *
 * Individual review page with full content.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getActiveContentByType, getContentByType } from "@/lib/data";
import ReviewPageClient from "./ReviewPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { ViewTracker } from "@/components/core/view-tracker";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface ReviewPageProps {
  params: Promise<{ category: string; slug: string }>;
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

  // Generate all category/slug combinations for active reviews
  return reviewsData.map(review => ({
    category: slugifyCategory(review.category),
    slug: review.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: ReviewPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const reviewsData = getContentByType('reviews');

  const reviewData = reviewsData.find(r =>
    slugifyCategory(r.category) === resolvedParams.category && r.slug === resolvedParams.slug
  );

  if (!reviewData) {
    return {
      title: "Review Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];

  // Use cover image if available, otherwise use Kris Yotam's logo
  const images = [
    {
      url: reviewData.cover_image || 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: reviewData.title
    }
  ];

  const url = `https://krisyotam.com/reviews/${resolvedParams.category}/${resolvedParams.slug}`;

  return {
    title: `${reviewData.title} | ${reviewData.category} Reviews | Kris Yotam`,
    description: reviewData.preview || `Review of ${reviewData.title}`,
    openGraph: {
      title: reviewData.title,
      description: reviewData.preview || `Review of ${reviewData.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: reviewData.title,
      description: reviewData.preview || `Review of ${reviewData.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ReviewPage({ params }: ReviewPageProps) {
  const resolvedParams = await params;
  const reviewsData = getContentByType('reviews');

  const reviewData = reviewsData.find(r =>
    slugifyCategory(r.category) === resolvedParams.category && r.slug === resolvedParams.slug
  );

  if (!reviewData) {
    notFound();
  }

  // Check if the review is meant to be hidden
  if (reviewData.state === "hidden") {
    notFound();
  }

  const review: ReviewMeta = {
    title: reviewData.title,
    subtitle: reviewData.subtitle,
    preview: reviewData.preview,
    start_date: reviewData.start_date,
    end_date: reviewData.end_date,
    slug: reviewData.slug,
    tags: reviewData.tags,
    category: reviewData.category,
    status: reviewData.status as ReviewStatus,
    confidence: reviewData.confidence as ReviewConfidence,
    importance: reviewData.importance,
    cover_image: reviewData.cover_image,
    state: (reviewData.state as "active" | "hidden" | undefined) || "active"
  };

  // Get all active reviews for navigation
  const reviews: ReviewMeta[] = reviewsData
    .filter(r => r.state !== "hidden")
    .map(r => ({
      title: r.title,
      subtitle: r.subtitle,
      preview: r.preview,
      start_date: r.start_date,
      end_date: r.end_date,
      slug: r.slug,
      tags: r.tags,
      category: r.category,
      status: r.status as ReviewStatus,
      confidence: r.confidence as ReviewConfidence,
      importance: r.importance,
      cover_image: r.cover_image,
      state: (r.state as "active" | "hidden" | undefined) || "active"
    }));

  // Extract headings from the review MDX content
  const headings = await extractHeadingsFromMDX('reviews', resolvedParams.slug, resolvedParams.category);

  // Dynamically import the MDX file based on category and slug
  const Review = (await import(`@/content/reviews/${resolvedParams.slug}.mdx`)).default;

  const viewSlug = `reviews/${resolvedParams.category}/${resolvedParams.slug}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <ReviewPageClient review={review} allReviews={reviews} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TOC headings={headings} />
          )}

          <div className="content">
            <Review />
          </div>
          <ReviewPageClient review={review} allReviews={reviews} contentOnly={true} />
        </main>

        {/* Sidenotes for wide viewports */}
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}
