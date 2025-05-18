import type { Metadata } from "next";
import { WantsLayout } from "./layout-client";
import "./wants-page.css";

export const metadata: Metadata = {
  title: "Wants",
  description: "Items I'm looking to purchase",
};

// Add Wants page metadata
const wantsPageData = {
  title: "Wants",
  subtitle: "Items I'm Looking to Purchase",
  date: new Date().toISOString(),
  preview: "A list of items I'm interested in purchasing if you have them available.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WantsLayout>{children}</WantsLayout>;
} 