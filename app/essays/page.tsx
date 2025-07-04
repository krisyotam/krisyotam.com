import EssaysClientPage from "./EssaysClientPage";
import { getActivePosts } from "@/utils/posts";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Essays",
  description: "Long-term stable essays and reflections",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteConfig.url}/essays`,
    title: "Essays",
    description: "Long-term stable essays and reflections",
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Essays"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Essays",
    description: "Long-term stable essays and reflections",
    images: [`${siteConfig.url}/images/og-image.jpg`]
  }
};

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