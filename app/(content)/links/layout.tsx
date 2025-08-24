import "../../globals.css";
import "./links.css";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = {
  title: {
    template: "%s | Links | Kris Yotam",
    default: "Links | Kris Yotam",
  },
  description: "Curated collection of valuable links and resources",
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="links-layout">{children}</div>;
}
