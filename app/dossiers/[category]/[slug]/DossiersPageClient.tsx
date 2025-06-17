"use client";

import { PageHeader } from "@/components/page-header";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import type { DossierMeta, DossierStatus, DossierConfidence } from "@/types/dossiers";

interface Props {
  dossierData: DossierMeta;
  allDossiers: DossierMeta[];
  children: React.ReactNode;
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export default function DossierPageClient({ dossierData: dossierItem, allDossiers, children }: Props) {  // Function to map dossier status to PageHeader compatible status
  const mapDossierStatusToPageHeaderStatus = (dossierStatus: DossierStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<DossierStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned", 
      Active: "In Progress",
      Classified: "In Progress"
    };
    return statusMap[dossierStatus] || "Draft";
  };

  // Function to map dossier confidence to PageHeader compatible confidence
  const mapDossierConfidenceToPageHeaderConfidence = (dossierConfidence?: DossierConfidence): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" => {
    if (!dossierConfidence) return "possible";
    
    const confidenceMap: Record<DossierConfidence, "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"> = {
      impossible: "impossible",
      remote: "remote",
      "highly unlikely": "highly unlikely",
      unlikely: "unlikely",
      possible: "possible",
      likely: "likely",
      "highly likely": "highly likely",
      certain: "certain",
      ambiguous: "possible",
      uncertain: "possible",
      developing: "possible",
      moderate: "likely"
    };
    return confidenceMap[dossierConfidence] || "possible";
  };

  return (
    <div className="dossiers-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={dossierItem.title}
        subtitle={dossierItem.subtitle}
        date={dossierItem.date}
        backHref="/dossiers"
        backText="Dossiers"
        preview={dossierItem.preview}
        status={mapDossierStatusToPageHeaderStatus(dossierItem.status ?? "Draft")}
        confidence={mapDossierConfidenceToPageHeaderConfidence(dossierItem.confidence)}
        importance={dossierItem.importance ?? 5}
      />
      
      {/* MDX body */}
      <div className="dossiers-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={dossierItem.title}
          slug={dossierItem.slug}
          date={dossierItem.date}
          url={`https://krisyotam.com/dossiers/${slugifyCategory(dossierItem.category)}/${dossierItem.slug}`}
        />      </div>
        <LiveClock />
      <Footer />
    </div>
  );
}