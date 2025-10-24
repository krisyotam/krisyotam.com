import ShortformClientPage from "./ShortformClientPage";
import shortformData from "@/data/shortform/shortform.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.shortform;

export default function ShortformPage() {
  // Filter shortform posts to only show active ones and sort by date (newest first)
  const activeShortform = shortformData.shortform.filter(post => post.state === "active");
  const posts = [...activeShortform].sort((a, b) => new Date(b.end_date || b.start_date).getTime() - new Date(a.end_date || a.start_date).getTime());

  return (
    <div className="shortform-container">
      <ShortformClientPage posts={posts} />
    </div>
  );
}
