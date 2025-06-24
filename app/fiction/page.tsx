import FictionClientPage from "./FictionClientPage";
import fictionData from "@/data/fiction/fiction.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiction",
  description: "A collection of short stories, flash fiction, and novel excerpts",
};

export default function FictionPage() {
  // Sort fiction by date (newest first)
  const stories = [...fictionData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory="all" />
    </div>
  );
}