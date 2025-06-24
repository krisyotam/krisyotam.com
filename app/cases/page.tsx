import CasesClientPage from "./CasesClientPage";
import casesData from "@/data/cases/cases.json";
import type { Metadata } from "next";
import type { CaseMeta, CaseStatus, CaseConfidence } from "@/types/cases";

export const metadata: Metadata = {
  title: "Cases",
  description: "Case studies and investigations into mysteries, cold cases, and unresolved incidents",
};

export default function CasesPage() {
  // Map and sort cases by date (newest first)
  const cases: CaseMeta[] = casesData.map(caseItem => ({
    ...caseItem,
    status: caseItem.status as CaseStatus,
    confidence: caseItem.confidence as CaseConfidence
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="cases-container">
      <CasesClientPage cases={cases} initialCategory="all" />
    </div>
  );
}