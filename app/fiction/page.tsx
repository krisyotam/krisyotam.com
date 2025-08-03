import FictionClientPage from "./FictionClientPage";
import fictionData from "@/data/fiction/fiction.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.fiction;

export default function FictionPage() {
  // Filter and sort fiction by date (newest first) - only show active stories
  const stories = fictionData
    .filter(story => story.state === "active" || story.state === undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory="all" />
    </div>
  );
}