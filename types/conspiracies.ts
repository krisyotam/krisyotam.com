// Types for conspiracies pages and data
export type ConspiracyStatus = "Draft" | "Published" | "Archived" | "Active" | "Speculative"; // Added "Speculative"
export type ConspiracyConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "ambiguous" | "uncertain" | "developing" | "moderate"; // Kept same as dossiers, adjust if needed

export interface ConspiracyMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: ConspiracyStatus;
  confidence?: ConspiracyConfidence;
  importance?: number;
}

export interface ConspiracyCategory {
  slug: string;
  title: string;
  description?: string;
  date: string;
  preview?: string;
  status?: ConspiracyStatus;
  confidence?: ConspiracyConfidence;
  importance?: number;
}

export interface Conspiracy extends ConspiracyMeta {
  content: string;
}
