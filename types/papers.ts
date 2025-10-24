// Types for papers pages and data
export type PaperStatus = "Draft" | "Published" | "Archived" | "Active" | "Notes";
export type PaperConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "ambiguous" | "uncertain" | "developing" | "moderate" | "speculative" | "tentative" | "evidential" | "theoretical" | "controversial" | "debated" | "philosophical";

export interface PaperMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: PaperStatus;
  confidence?: PaperConfidence;
  importance?: number;
  state?: string;
  cover_image?: string;
  publication_year?: number;
  author?: string;
}

export interface PaperCategory {
  slug: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  preview?: string;
  status?: PaperStatus;
  confidence?: PaperConfidence;
  importance?: number;
  "show-status"?: string;
}

export interface Paper extends PaperMeta {
  content: string;
}
