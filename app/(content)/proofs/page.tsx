import ProofClientPage from "./ProofClientPage";
import proofsData from "@/data/proofs/proofs.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.proofs;

export default function ProofsPage() {
  // Sort proofs by date (newest first)
  const proofs = [...proofsData.proofs].sort((a, b) => {
    const aDate = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="proofs-container">
      <ProofClientPage proofs={proofs} initialCategory="all" />
    </div>
  );
}
