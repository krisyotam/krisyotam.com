import DossiersClientPage from "./DossiersClientPage";
import dossiersData from "@/data/dossiers/dossiers.json";
import type { Metadata } from "next";
import type { DossierMeta, DossierStatus, DossierConfidence } from "@/types/dossiers";

export const metadata: Metadata = {
  title: "Dossiers",
  description: "Classified investigations and sensitive case files with detailed intelligence reports",
};

export default function DossiersPage() {
  // Map and sort dossiers by date (newest first)
  const dossiers: DossierMeta[] = dossiersData.map(dossierItem => ({
    ...dossierItem,
    status: dossierItem.status as DossierStatus,
    confidence: dossierItem.confidence as DossierConfidence
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="dossiers-container">
      <DossiersClientPage dossiers={dossiers} initialCategory="all" />
    </div>
  );
}