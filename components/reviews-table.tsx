"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReviewMeta } from "@/types/review";

interface ReviewsTableProps {
  reviews: ReviewMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function ReviewsTable({ reviews, searchQuery, activeCategory }: ReviewsTableProps) {
  const [filteredReviews, setFilteredReviews] = useState<ReviewMeta[]>(reviews);
  const router = useRouter();

  useEffect(() => {
    const filtered = reviews.filter((review) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        review.title.toLowerCase().includes(q) ||
        review.tags.some((t) => t.toLowerCase().includes(q)) ||
        review.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || review.category === activeCategory;
      return matchesSearch && matchesCategory;
    });    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    setFilteredReviews(filtered);
  }, [reviews, searchQuery, activeCategory]);
  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }  
  
  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(review: ReviewMeta): string {
    const dateToUse = (review.end_date && review.end_date.trim()) || review.start_date;
    return formatDate(dateToUse);
  }
  
  // Helper to build the correct route for a review
  function getReviewUrl(review: ReviewMeta) {
    return `/reviews/${encodeURIComponent(review.category)}/${encodeURIComponent(review.slug)}`;
  }

  return (    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review, index) => (
            <tr
              key={review.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getReviewUrl(review))}            >              <td className="py-2 px-3 font-medium">{review.title}</td>              <td className="py-2 px-3">
                <Link 
                  href={`/reviews/${review.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {review.category}
                </Link>
              </td>
              <td className="py-2 px-3">{getDisplayDate(review)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredReviews.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No reviews found matching your criteria.</div>
      )}
    </div>
  );
}
