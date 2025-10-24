import LinksClientPage from "../LinksClientPage";
import linksData from "@/data/links/links.json";
import categoriesData from "@/data/links/categories.json";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = categoriesData.categories.find(
    (cat) => cat.slug === params.category
  );

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  return {
    title: category.title,
    description: category.preview,
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = categoriesData.categories.find(
    (cat) => cat.slug === params.category
  );

  if (!category) {
    notFound();
  }

  // Get category title from slug
  const categoryTitle = category.title;
  
  // Sort links by date (newest first)
  const links = [...linksData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return <LinksClientPage links={links} initialCategory={categoryTitle} />;
}
