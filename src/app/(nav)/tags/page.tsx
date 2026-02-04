// app/tags/page.tsx
import { getAllUniversalTags } from "@/lib/content";
import { TagsClient } from "./tags-client";
import { notFound } from "next/navigation";
import { staticMetadata } from "@/lib/staticMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = staticMetadata.tags;

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const tags = await getAllUniversalTags();

  if (!tags || tags.length === 0) {
    notFound();
  }

  return <TagsClient tags={tags} />;
}
