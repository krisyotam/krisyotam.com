// app/poetry/[type]/[year]/[slug]/page.tsx
import poemsData from "@/data/poems.json";
import type { Poem } from "@/utils/poems";
import PoemPageClient from "./PoemPageClient";

export async function generateStaticParams() {
  const poems = poemsData as Poem[];
  return poems.map((poem) => ({
    type: poem.type.toLowerCase().replace(/\s+/g, "-"),
    year: poem.year.toString(),
    slug: poem.slug,
  }));
}

export default function PoemPage({
  params: { type, year, slug },
}: {
  params: { type: string; year: string; slug: string };
}) {
  return <PoemPageClient params={{ type, year, slug }} />;
}
