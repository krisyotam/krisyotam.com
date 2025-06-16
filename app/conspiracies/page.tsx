import ConspiraciesClientPage from "./ConspiraciesClientPage";
import type { Metadata } from "next";
import type { ConspiracyMeta } from "@/types/conspiracies";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";

// Use direct import for static generation
function getConspiraciesData() {
  return conspiraciesData;
}

export const metadata: Metadata = {
  title: "Conspiracies",
  description: "Quick thoughts and ideas",
};

export default function ConspiraciesPage() {
  // Fetch conspiracies data from API
  const conspiraciesData = getConspiraciesData();
  
  // Sort conspiracies by date (newest first) and ensure proper typing
  const conspiracies: ConspiracyMeta[] = [...conspiraciesData]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((conspiracy: any) => ({
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