// Types for news pages and data
export type NewsStatus = "Draft" | "Published" | "Archived" | "Breaking" | "Developing";
export type NewsConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

export interface NewsMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: NewsStatus;
  confidence?: NewsConfidence;
  importance?: number;
}

export interface NewsCategory {
  slug: string;
  title: string;
  description?: string;
  date: string;
  preview?: string;
  status?: NewsStatus;
  confidence?: NewsConfidence;
  importance?: number;
}

export interface News extends NewsMeta {
  content: string;
}
