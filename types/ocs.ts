// Types for OCS pages and data
export type OCSStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
export type OCSConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

export interface OCSMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  book: string;
  status?: OCSStatus;
  confidence?: OCSConfidence;
  importance?: number;
  cover_image?: string;
  state?: "active" | "hidden";
}

export interface OCSCategory {
  slug: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  preview?: string;
  status?: OCSStatus;
  confidence?: OCSConfidence;
  importance?: number;
}
