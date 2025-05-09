import React from "react";
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

// Simple pass-through layout that preserves the URL structure
export default function BlogLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children;
}
