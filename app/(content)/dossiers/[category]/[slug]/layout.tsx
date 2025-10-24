import { Metadata } from "next";
import "../../dossiers.css";

export const metadata: Metadata = {
  title: "Dossier",
  description: "Individual dossier investigation",
};

export default function DossierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}