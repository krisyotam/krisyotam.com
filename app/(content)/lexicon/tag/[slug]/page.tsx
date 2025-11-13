import lexiconData from "@/data/lexicon/lexicon.json";
import { NotesTable } from "@/components/notes-table";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return { title: `Tag: ${params.slug}` };
}

export default function LexiconTaggedPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const all = (lexiconData as any[]).filter(item => (item.tags || []).map((t: string) => t.toLowerCase()).includes(slug.toLowerCase()));
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <h1 className="text-2xl font-medium mb-4">Tag: {slug}</h1>
      {all.length > 0 ? <NotesTable notes={all} searchQuery="" activeCategory="all" /> : <div className="text-muted-foreground">No entries with this tag.</div>}
    </div>
  );
}
