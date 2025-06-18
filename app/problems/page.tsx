import ProblemClientPage from "./ProblemClientPage";
import problemsData from "@/data/problems/problems.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problems",
  description: "A collection of mathematical problems, exercises, and challenging questions",
};

export default function ProblemsPage() {
  // Sort problems by date (newest first)
  const problems = [...problemsData.problems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="problems-container">
      <ProblemClientPage problems={problems} initialCategory="all" />
    </div>
  );
}
