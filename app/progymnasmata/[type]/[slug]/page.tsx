// /app/progymnasmata/[type]/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProgymnasmataEntryPage from "@/components/progymnasmata/progymnasmata-entry-page";

interface PageProps {
  params: { type: string; slug: string };
}

// fetches the raw entry JSON from your API (which doesn’t include `type`)
async function getProgymnasmataEntry(type: string, slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/progymnasmata/entry?type=${encodeURIComponent(
        type.toLowerCase()
      )}&slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching progymnasmata entry:", err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = await getProgymnasmataEntry(params.type, params.slug);
  if (!raw) {
    return { title: "Entry Not Found | Progymnasmata" };
  }
  return {
    title: `${raw.title} | Progymnasmata | Kris Yotam`,
    description: raw.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { type, slug } = params;
  const raw = await getProgymnasmataEntry(type, slug);
  if (!raw) notFound();

  // ⚡️ Inject the `type` back onto the entry
  const entry = { ...(raw as any), type };

  return <ProgymnasmataEntryPage entry={entry} />;
}
