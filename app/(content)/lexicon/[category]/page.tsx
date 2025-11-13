import lexiconData from "@/data/lexicon/lexicon.json";
import { NotesTable } from "@/components/notes-table";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  return { title: `Lexicon: ${params.category}` };
}

export default function LexiconCategoryPage({ params }: { params: { category: string } }) {
  const slug = params.category;
  const items = (lexiconData as any[]).filter(item => item.category.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase());
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <h1 className="text-2xl font-medium mb-4">{slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</h1>
      {items.length > 0 ? <NotesTable notes={items} searchQuery="" activeCategory="all" /> : <div className="text-muted-foreground">No entries in this category.</div>}
    </div>
  );
}
