export type TilStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
export type TilConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
export type TilState = "active" | "hidden";

export interface TilMeta {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: TilStatus;
  confidence: TilConfidence;
  importance: number;
  state: TilState;
  preview?: string;
  cover_image?: string;
  subtitle?: string;
}
