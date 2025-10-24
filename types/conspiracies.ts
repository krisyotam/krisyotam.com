// Types for conspiracies pages and data

export type ConspiracyStatus =
  | "Abandoned"
  | "Notes"
  | "Draft"
  | "In Progress"
  | "Finished";

export type ConspiracyConfidence =
  | "impossible"
  | "remote"
  | "highly unlikely"
  | "unlikely"
  | "possible"
  | "likely"
  | "highly likely"
  | "certain";

export interface ConspiracyMeta {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: ConspiracyStatus;
  confidence: ConspiracyConfidence;
  importance: number;
  preview?: string;
  // Backward compatibility
  date?: string;
  cover_image?: string;
  subtitle?: string;
}

export interface Conspiracy extends ConspiracyMeta {
  content: string;
}
