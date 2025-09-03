export interface LectureNote {
  id?: string;
  title?: string;
  abstract?: string;
  importance?: number;
  confidence?: string;
  authors?: string[];
  subject?: string;
  keywords?: string[];
  postedBy?: string;
  postedOn?: string;
  dateStarted?: string;
  tags?: string[];
  bibliography?: string[];
  img?: string;
  category?: string;
  status?: string;
  pdfLink?: string;
  sourceLink?: string;
}