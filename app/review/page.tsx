import ReviewClientPage from "./ReviewClientPage";
import reviewsData from "@/data/reviews/reviews.json";
import type { Metadata } from "next";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/review";

export const metadata: Metadata = {
  title: "Reviews",
  description: "In-depth reviews of books, media, and more",
};

export default function ReviewsPage() {  // Map and sort reviews by date (newest first)
  const reviews: ReviewMeta[] = reviewsData.map(review => ({
    ...review,
    status: review.status as ReviewStatus,
    confidence: review.confidence as ReviewConfidence
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="reviews-container">
      <ReviewClientPage reviews={reviews} initialCategory="all" />
    </div>
  );
}