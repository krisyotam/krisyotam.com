import FictionClientPage from "./FictionClientPage";
import fictionDataRaw from "@/data/fiction/fiction.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

interface Story {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  cover_image?: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  state: "active" | "hidden";
}

// Type assertion to ensure the imported data matches our Story interface
const fictionData = fictionDataRaw as Story[];

export const metadata: Metadata = staticMetadata.fiction;

export default function FictionPage() {
  // Filter and sort fiction by date (newest first) - only show active stories
  const stories = fictionData
    .filter(story => story.state === "active" || story.state === undefined)
    .sort((a, b) => new Date(b.end_date || b.start_date).getTime() - new Date(a.end_date || a.start_date).getTime());

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory="all" />
    </div>
  );
}