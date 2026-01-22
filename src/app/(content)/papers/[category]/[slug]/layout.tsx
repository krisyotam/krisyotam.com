import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paper",
  description: "Individual research paper",
};

export default function PaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}