import { Metadata } from "next";
import "../../cases.css";

export const metadata: Metadata = {
  title: "Case",
  description: "Individual case investigation",
};

export default function CaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}