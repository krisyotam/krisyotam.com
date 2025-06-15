import ConspiraciesClientPage from "./ConspiraciesClientPage";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";
import type { Metadata } from "next";
import type { ConspiracyMeta } from "@/types/conspiracies";

export const metadata: Metadata = {
  title: "Conspiracies",
  description: "Quick thoughts and ideas",
};

export default function ConspiraciesPage() {
  // Sort conspiracies by date (newest first) and ensure proper typing
  const conspiracies: ConspiracyMeta[] = [...conspiraciesData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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