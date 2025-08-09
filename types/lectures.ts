// Types for lectures pages and data
export type LectureStatus = "Draft" | "Published" | "Archived" | "Active" | "Notes";
export type LectureConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "ambiguous" | "uncertain" | "developing" | "moderate" | "speculative" | "tentative" | "evidential" | "theoretical" | "controversial" | "debated" | "philosophical";

export interface LectureMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: LectureStatus;
  confidence?: LectureConfidence;
  importance?: number;
  state?: string;
  cover_image?: string;
}

export interface LectureCategory {
  slug: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  preview?: string;
  status?: LectureStatus;
  confidence?: LectureConfidence;
  importance?: number;
  "show-status"?: string;
}

export interface Lecture extends LectureMeta {
  content: string;
}
