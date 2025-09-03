import CasesClientPage from "./CasesClientPage";
import casesData from "@/data/cases/cases.json";
import type { Metadata } from "next";
import type { CaseMeta, CaseStatus, CaseConfidence } from "@/types/cases";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.cases;

export default function CasesPage() {
  // Map and sort cases by date (newest first)
  const cases: CaseMeta[] = casesData.map(caseItem => ({
    ...caseItem,
    status: caseItem.status as CaseStatus,
    confidence: caseItem.confidence as CaseConfidence
  })).sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="cases-container">
      <CasesClientPage cases={cases} initialCategory="all" />
    </div>
  );
}