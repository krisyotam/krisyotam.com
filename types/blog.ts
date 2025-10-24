export type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
export type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

export interface BlogMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: Status;
  confidence?: Confidence;
  importance?: number;
  cover_image?: string; // Added for image support in blog posts
  state?: "active" | "hidden";
} 