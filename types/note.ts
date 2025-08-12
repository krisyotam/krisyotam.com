export type NoteStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
export type NoteConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

export interface NoteMeta {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: NoteStatus;
  confidence: NoteConfidence;
  importance: number;
  preview?: string;
  cover_image?: string;
  subtitle?: string;
  framework?: string;
  author?: string;
  license?: string;
}