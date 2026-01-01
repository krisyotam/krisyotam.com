export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import reviewsData from "@/data/reviews/reviews.json";
import ReviewPageClient from "./ReviewPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import { Comments } from "@/components/core/comments";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/review";

interface ReviewData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  cover_image?: string;
  subtitle?: string;
  state?: "active" | "hidden";
}

interface ReviewPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations, but only for active reviews
  return reviewsData
    .filter(review => review.state !== "hidden") // Only include active reviews
    .map(review => ({
      category: slugifyCategory(review.category),
      slug: review.slug
    }));
}

export async function generateMetadata({ params }: ReviewPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const reviewData = reviewsData.find(r => 
    slugifyCategory(r.category) === params.category && r.slug === params.slug
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
    {      url: reviewData.cover_image || 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: reviewData.title
    }
  ];

  const url = `https://krisyotam.com/reviews/${params.category}/${params.slug}`;

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

export default async function ReviewPage({ params }: ReviewPageProps) {
  const reviewData = reviewsData.find(r => 
    slugifyCategory(r.category) === params.category && r.slug === params.slug
  );

  if (!reviewData) {
    notFound();
  }
  
  // Check if the review is meant to be hidden
  if (reviewData.state === "hidden") {
    notFound();
  }
  
  const review: ReviewMeta = {
    ...reviewData,
    status: reviewData.status as ReviewStatus,
    confidence: reviewData.confidence as ReviewConfidence,
    state: (reviewData.state as "active" | "hidden" | undefined) || "active" // Default to "active" if state is not defined
  };
  
  const reviews: ReviewMeta[] = (reviewsData as ReviewData[]).map(review => ({
    ...review,
    status: review.status as ReviewStatus,
    confidence: review.confidence as ReviewConfidence,
    state: (review.state as "active" | "hidden" | undefined) || "active" // Default to "active" if state is not defined
  }))
  // Filter to only show reviews with state "active" or undefined state
  .filter(review => review.state === "active" || review.state === undefined);

  // Extract headings from the review MDX content
  const headings = await extractHeadingsFromMDX('reviews', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const Review = (await import(`@/app/(content)/reviews/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <ReviewPageClient review={review} allReviews={reviews} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="review-content">
            <Review />
          </div>
          <ReviewPageClient review={review} allReviews={reviews} contentOnly={true} />
          <Comments />
        </main>
      </div>
    </div>
  );
}