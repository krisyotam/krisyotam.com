// app/tags/page.tsx
import Link from "next/link";
import { getTags } from "@/utils/posts";
import { PageHeader } from "@/components/page-header";
import { notFound } from "next/navigation";
import { staticMetadata } from "@/lib/staticMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = staticMetadata.tags;

export const dynamic = "force-dynamic";

interface Tag {
  name: string;
  count: number;
}

export default async function TagsPage() {
  const tags = await getTags();

  if (!tags || tags.length === 0) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title="Tags"
          subtitle="Content organized by tag"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="Browse posts by tag to explore related ideas across the site."
          status="Finished"
          confidence="certain"
          importance={7}
        />

        <main className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-foreground">
                  <th className="py-2 text-left font-medium px-3">
                    Tag
                  </th>
                  <th className="py-2 text-right font-medium px-3">
                    # of Posts
                  </th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag, index) => (
                  <tr
                    key={tag.name}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                  >
                    <td className="py-2 px-3">
                      <Link href={`/tag/${tag.name}`} className="text-foreground">
                        {tag.name}
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-right text-muted-foreground">
                      {tag.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
