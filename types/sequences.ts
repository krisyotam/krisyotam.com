// Types for sequences
export type SequenceStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Planned";
export type SequenceConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

export interface SequencePost {
  slug: string;
  order: number;
}

export interface Sequence {
  slug: string;
  title: string;
  preview: string;
  date: string;
  "cover-url": string;
  "show-status": "active" | "hidden";
  status: SequenceStatus;
  confidence: SequenceConfidence;
  importance: number;
  category?: string;
  posts: SequencePost[];
}

export interface SequencesData {
  sequences: Sequence[];
}
