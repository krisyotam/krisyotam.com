import PromptsClientPage from "./PromptsClientPage";
import promptsData from "@/data/prompts/prompts.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.prompts;

export default function PromptsPage() {
  // Sort prompts by date (newest first)
  const prompts = [...promptsData.prompts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="prompts-container">
      <PromptsClientPage prompts={prompts} initialCategory="all" />
    </div>
  );
}
