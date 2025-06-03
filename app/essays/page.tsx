import EssaysClientPage from "./EssaysClientPage";
import { getAllPosts } from "@/utils/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essays",
  description: "Long-term stable essays",
};

export default async function EssaysPage() {
  // Get all posts and filter for essays only
  const posts = await getAllPosts();
  const essays = posts.filter(post => post.path === 'essays');

  return (
    <div className="essays-container">
      <EssaysClientPage notes={essays} />
    </div>
  );
} 