// Types for dossiers pages and data
export type DossierStatus = "Draft" | "Published" | "Archived" | "Active" | "Classified";
export type DossierConfidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "ambiguous" | "uncertain" | "developing" | "moderate";

export interface DossierMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: DossierStatus;
  confidence?: DossierConfidence;
  importance?: number;
}

export interface DossierCategory {
  slug: string;
  title: string;
  description?: string;
  date: string;
  preview?: string;
  status?: DossierStatus;
  confidence?: DossierConfidence;
  importance?: number;
}

export interface Dossier extends DossierMeta {
  content: string;
}
