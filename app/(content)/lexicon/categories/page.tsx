import categoriesData from "@/data/lexicon/categories.json";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lexicon Categories" };

export default function LexiconCategoriesPage() {
  const cats = (categoriesData as any).categories || [];
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <h1 className="text-2xl font-medium mb-4">Lexicon Categories</h1>
      <ul className="space-y-3">
        {cats.map((c: any) => (
          <li key={c.slug}>
            <Link href={`/lexicon/${c.slug}`} className="text-primary underline">{c.title}</Link>
            <div className="text-sm text-muted-foreground">{c.preview}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
