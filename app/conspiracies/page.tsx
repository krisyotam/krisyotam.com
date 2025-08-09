import ConspiraciesClientPage from "./ConspiraciesClientPage";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";
import type { Metadata } from "next";
import type { ConspiracyMeta } from "@/types/conspiracies";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.conspiracies;

export default function ConspiraciesPage() {
  // Sort conspiracies by date (newest first) and ensure proper typing
  const conspiracies: ConspiracyMeta[] = [...conspiraciesData]
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .map(conspiracy => ({
      ...conspiracy,
      status: conspiracy.status as any, // Type assertion for status
      confidence: conspiracy.confidence as any, // Type assertion for confidence
    }));

  return (
    <div className="conspiracies-container">
      <ConspiraciesClientPage conspiracies={conspiracies} initialCategory="all" />
    </div>
  );
}