import ConspiraciesClientPage from "./ConspiraciesClientPage";
import type { Metadata } from "next";
import type { ConspiracyMeta } from "@/types/conspiracies";

async function getConspiraciesData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data/conspiracies`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch conspiracies data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching conspiracies data:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Conspiracies",
  description: "Quick thoughts and ideas",
};

export default async function ConspiraciesPage() {
  // Fetch conspiracies data from API
  const conspiraciesData = await getConspiraciesData();
  
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