import ProblemClientPage from "./ProblemClientPage";
import problemsData from "@/data/problems/problems.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.problems;

export default function ProblemsPage() {
  // Sort problems by date (newest first)
  const problems = [...problemsData.problems].sort((a, b) => {
    const aDate = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="problems-container">
      <ProblemClientPage problems={problems} initialCategory="all" />
    </div>
  );
}
