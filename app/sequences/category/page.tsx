import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sequence Categories",
  description: "Browse all sequence categories",
};

export default function SequenceCategoriesPage() {
  // Redirect to the categories page
  redirect("/sequences/categories");
}
