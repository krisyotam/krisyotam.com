export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import reviewsData from "@/data/reviews/reviews.json";
import ReviewPageClient from "./ReviewPageClient";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/review";

interface ReviewData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  cover_image?: string;
  subtitle?: string;
}

interface ReviewPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return reviewsData.map(review => ({
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
  const review: ReviewMeta = {
    ...reviewData,
    status: reviewData.status as ReviewStatus,
    confidence: reviewData.confidence as ReviewConfidence
  };
  const reviews: ReviewMeta[] = (reviewsData as ReviewData[]).map(review => ({
    ...review,
    status: review.status as ReviewStatus,
    confidence: review.confidence as ReviewConfidence
  }));  // Dynamically import the MDX file based on category and slug
  const Review = (await import(`@/app/reviews/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <ReviewPageClient review={review} allReviews={reviews}>
      <div className="review-content">
        <Review />
      </div>
    </ReviewPageClient>
  );
}