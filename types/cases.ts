// Types for cases pages and data
export type CaseStatus = "Draft" | "Published" | "Archived" | "Active" | "Cold";
export type CaseConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "ambiguous" | "uncertain" | "developing" | "moderate";

export interface CaseMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: CaseStatus;
  confidence?: CaseConfidence;
  importance?: number;
}

export interface CaseCategory {
  slug: string;
  title: string;
  description?: string;
  date: string;
  preview?: string;
  status?: CaseStatus;
  confidence?: CaseConfidence;
  importance?: number;
}

export interface Case extends CaseMeta {
  content: string;
}
