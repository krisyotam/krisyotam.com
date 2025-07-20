import ProofClientPage from "./ProofClientPage";
import proofsData from "@/data/proofs/proofs.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.proofs;

export default function ProofsPage() {
  // Sort proofs by date (newest first)
  const proofs = [...proofsData.proofs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="proofs-container">
      <ProofClientPage proofs={proofs} initialCategory="all" />
    </div>
  );
}
