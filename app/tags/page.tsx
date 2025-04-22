// app/tags/page.tsx
import Link from "next/link";
import { getTags } from "@/utils/tags";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  try {
    const tags = await getTags();
    const currentDate = new Date().toISOString();

    if (tags.length === 0) {
      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
            <PageHeader
              title="Tags"
              subtitle="Content organized by tag"
              date={currentDate}
              preview="This directory helps you navigate content by tag."
              status="In Progress"
              confidence="certain"
              importance={8}
            />
            <p className="text-xl text-muted-foreground">No tags found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <PageHeader
            title="Tags"
            subtitle="Content organized by tag"
            date={currentDate}
            preview="Browse posts by tag to explore related ideas across the site."
            status="Finished"
            confidence="certain"
            importance={8}
          />

          <main>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {tags.map((tag) => (
                    <tr
                      key={tag.slug}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <Link href={`/tag/${tag.slug}`} className="text-foreground">
                          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                        </Link>
                      </td>
                      <td className="py-4 px-2 text-right text-muted-foreground">
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
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">
          Failed to load tags. Please try again later.
        </p>
      </div>
    );
  }
}
