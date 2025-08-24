import ReviewClientPage from "../ReviewClientPage";
import reviewsData from "@/data/reviews/reviews.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/review";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories and generate their slugs
  const categories = new Set(reviewsData.map(review => 
    review.category.toLowerCase().replace(/\s+/g, "-")
  ));
  
  return Array.from(categories).map(category => ({
    category: category
  }));
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const categorySlug = params.category;
  const categoryData = (await import('@/data/reviews/categories.json')).default.types.find(
    cat => cat.slug === categorySlug
  );

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

export default function ReviewsCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = reviewsData.find(review => 
    review.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }
  // Map and sort reviews by date (newest first)
  const reviews: ReviewMeta[] = reviewsData
    .map(review => ({
      ...review,
      status: review.status as ReviewStatus,
      confidence: review.confidence as ReviewConfidence,
      state: (review.state as "active" | "hidden" | undefined) || "active" // Default to "active" if state is not defined
    }))
    // Filter to only show reviews with state "active" or undefined state
    .filter(review => review.state === "active" || review.state === undefined)
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <div className="reviews-container">
      <ReviewClientPage reviews={reviews} initialCategory={originalCategory} />
    </div>
  );
}
