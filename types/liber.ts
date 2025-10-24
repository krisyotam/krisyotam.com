export type LiberStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
export type LiberConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

export interface LiberMeta {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: LiberStatus;
  confidence: LiberConfidence;
  importance: number;
  preview?: string;
  cover_image?: string;
  subtitle?: string;
}
