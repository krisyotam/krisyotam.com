import DossiersClientPage from "./DossiersClientPage";
import type { Metadata } from "next";
import type { DossierMeta, DossierStatus, DossierConfidence } from "@/types/dossiers";
import dossiersData from "@/data/dossiers/dossiers.json";

function getDossiersData() {
  return dossiersData;
}

export const metadata: Metadata = {
  title: "Dossiers",
  description: "Classified investigations and sensitive case files with detailed intelligence reports",
};

export default async function DossiersPage() {
  // Fetch dossiers data from API
  const dossiersData = getDossiersData();
  
  // Map and sort dossiers by date (newest first)
  const dossiers: DossierMeta[] = dossiersData.map((dossierItem: any) => ({
    ...dossierItem,
    status: dossierItem.status as DossierStatus,
    confidence: dossierItem.confidence as DossierConfidence
  })).sort((a: DossierMeta, b: DossierMeta) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="dossiers-container">
      <DossiersClientPage dossiers={dossiers} initialCategory="all" />
    </div>
  );
}