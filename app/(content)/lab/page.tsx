import LabClientPage from "./LabClientPage";
import type { Metadata } from "next";
import type { LabMeta } from "@/types/lab";
import { staticMetadata } from "@/lib/staticMetadata";
import "./lab.css";

export const metadata: Metadata = staticMetadata.lab;

export default async function LabPage() {
  // For development, we'll use a simple data fetch approach
  let labData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lab/labs`, {
      cache: 'no-store'
    });
    labData = await response.json();
  } catch (error) {
    // Fallback to direct import if API is not available
    const { default: fallbackData } = await import("@/data/lab/labs.json");
    labData = fallbackData;
  }

  // Sort labs by date (newest first)
  const labs: LabMeta[] = [...labData]
    .map(lab => ({
      ...lab,
      status: lab.status as LabMeta['status'],
      confidence: lab.confidence as LabMeta['confidence']
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="lab-container">
      <LabClientPage labs={labs} initialCategory="all" />
    </div>
  );
}
