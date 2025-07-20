import LibersClientPage from "./LibersClientPage";
import libersData from "@/data/libers/libers.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.libers;

export default function LibersPage() {
  // Sort libers by date (newest first)
  const libers = [...libersData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="libers-container">
      <LibersClientPage libers={libers} initialCategory="all" />
    </div>
  );
}
