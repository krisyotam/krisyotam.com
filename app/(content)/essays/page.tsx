import EssaysClientPage from "./EssaysClientPage";
import { getActivePosts } from "@/lib/posts";
import { staticMetadata } from "@/lib/staticMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = staticMetadata.essays

export default async function EssaysPage() {
  // Get active posts only and filter for essays
  const posts = await getActivePosts();
  const essays = posts.filter(post => post.path === 'essays');

  return (
    <div className="essays-container">
      <EssaysClientPage notes={essays} />
    </div>
  );
} 