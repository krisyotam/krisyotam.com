import OCSClientPage from "./OCSClientPage";
import ocsData from "@/data/ocs/ocs.json";
import type { Metadata } from "next";
import type { OCSMeta, OCSStatus, OCSConfidence } from "@/types/ocs";
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
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="ocs-container">
      <OCSClientPage ocs={ocs} initialCategory="all" />
    </div>
  );
}
