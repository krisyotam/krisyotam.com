// Server component for blog layout
import { BlogLayoutClient } from "./blog-layout-client";
import { Metadata } from "next";

// Define default metadata for the blog section
export const metadata: Metadata = {
  title: {
    template: "%s | Kris Yotam",
    default: "Blog | Kris Yotam"
  },
  description: "Articles, essays, and thoughts on a variety of topics",
  openGraph: {
    type: "website",
    title: {
      template: "%s | Kris Yotam",
      default: "Blog | Kris Yotam"
    },
    description: "Articles, essays, and thoughts on a variety of topics"
  }
};

// Server component as the main layout
export default function BlogLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <BlogLayoutClient>{children}</BlogLayoutClient>;
}
