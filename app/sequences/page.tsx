import SequencesClientPage from "./SequencesClientPage";
import { staticMetadata } from "@/lib/staticMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = staticMetadata.sequences;

export default function SequencesPage() {
  return <SequencesClientPage />;
}
