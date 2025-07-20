import FictionClientPage from "./FictionClientPage";
import fictionData from "@/data/fiction/fiction.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.fiction;

export default function FictionPage() {
  // Sort fiction by date (newest first)
  const stories = [...fictionData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory="all" />
    </div>
  );
}