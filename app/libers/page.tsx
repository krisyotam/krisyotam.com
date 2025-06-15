import LibersClientPage from "./LibersClientPage";
import libersData from "@/data/libers/libers.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libers",
  description: "Dark historical studies, taboo subjects, and forbidden knowledge",
};

export default function LibersPage() {
  // Sort libers by date (newest first)
  const libers = [...libersData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="libers-container">
      <LibersClientPage libers={libers} initialCategory="all" />
    </div>
  );
}
