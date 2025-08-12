// Types for sequences
export type SequenceStatus = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Planned";
export type SequenceConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
export type PostType = "essay" | "note" | "paper" | "review" | "fiction" | "case" | "dossier" | "conspiracy" | "liber" | "proof" | "lecture-note" | "verse";

export interface SequencePost {
  slug: string;
  order: number;
  type: PostType;
}

export interface SequenceSection {
  title: string;
  posts: SequencePost[];
}

export interface Sequence {
  slug: string;
  title: string;
  preview: string;
  start_date: string;
  end_date?: string;
  "cover-url": string;
  state: "active" | "hidden";
  status: SequenceStatus;
  confidence: SequenceConfidence;
  importance: number;
  category?: string;
  tags: string[];
  posts?: SequencePost[]; // For backwards compatibility
  sections?: SequenceSection[]; // New sectioned format
}

export interface SequencesData {
  sequences: Sequence[];
}
