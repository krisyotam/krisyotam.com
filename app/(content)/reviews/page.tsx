import ReviewClientPage from "./ReviewClientPage";
import reviewsData from "@/data/reviews/reviews.json";
import type { Metadata } from "next";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/review";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.reviews;

export default function ReviewsPage() {  // Map and sort reviews by date (newest first)
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
      <ReviewClientPage reviews={reviews} initialCategory="all" />
    </div>
  );
}