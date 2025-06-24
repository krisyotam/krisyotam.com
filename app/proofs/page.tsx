import ProofClientPage from "./ProofClientPage";
import proofsData from "@/data/proofs/proofs.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proofs",
  description: "A collection of mathematical proofs, theorems, and demonstrations",
};

export default function ProofsPage() {
  // Sort proofs by date (newest first)
  const proofs = [...proofsData.proofs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="proofs-container">
      <ProofClientPage proofs={proofs} initialCategory="all" />
    </div>
  );
}
