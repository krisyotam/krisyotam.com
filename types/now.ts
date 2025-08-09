export type NowStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
export type NowConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
export type NowState = "active" | "hidden";

export interface NowMeta {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: NowStatus;
  confidence: NowConfidence;
  importance: number;
  state: NowState;
  preview?: string;
  cover_image?: string;
  subtitle?: string;
}
