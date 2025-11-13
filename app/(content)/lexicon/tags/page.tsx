import tagsData from "@/data/lexicon/tags.json";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lexicon Tags" };

export default function LexiconTagsPage() {
  const tags = (tagsData as any).tags || [];
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <h1 className="text-2xl font-medium mb-4">Lexicon Tags</h1>
      <ul className="space-y-3">
        {tags.map((t: any) => (
          <li key={t.slug}>
            <Link href={`/lexicon/tag/${t.slug}`} className="text-primary underline">{t.title}</Link>
            <div className="text-sm text-muted-foreground">{t.preview}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
