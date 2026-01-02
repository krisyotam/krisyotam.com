import OCSClientPage from "./OCSClientPage";
import ocsData from "@/data/ocs/ocs.json";
import type { Metadata } from "next";
import type { OCSMeta, OCSStatus, OCSConfidence } from "@/types/content";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.ocs;

export default function OCSPage() {  // Map and sort OCS by date (newest first)
  const ocs: OCSMeta[] = ocsData
    .map(character => ({
      ...character,
      status: character.status as OCSStatus,
      confidence: character.confidence as OCSConfidence,
      state: (character.state as "active" | "hidden" | undefined) || "active" // Default to "active" if state is not defined
    }))
    // Filter to only show characters with state "active" or undefined state
    .filter(character => character.state === "active" || character.state === undefined)
    .sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="ocs-container">
      <OCSClientPage ocs={ocs} initialCategory="all" />
    </div>
  );
}
