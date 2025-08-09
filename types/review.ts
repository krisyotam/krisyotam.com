// Types for review pages and data
export type ReviewStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
export type ReviewConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

export interface ReviewMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: ReviewStatus;
  confidence?: ReviewConfidence;
  importance?: number;
  cover_image?: string;
  state?: "active" | "hidden";
}

export interface ReviewCategory {
  slug: string;
  title: string;
  description?: string;
  date: string;
  preview?: string;
  status?: ReviewStatus;
  confidence?: ReviewConfidence;
  importance?: number;
}

export interface Review extends ReviewMeta {
  content: string;
}
