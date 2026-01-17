import { Metadata } from "next";
import "../../essays.css";

export const metadata: Metadata = {
  title: "Essay",
  description: "Individual essay",
};

export default function EssayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
