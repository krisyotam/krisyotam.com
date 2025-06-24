// app/tag/page.tsx
import Link from "next/link";
import { getTags, getAllTagData } from "@/utils/tags";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TagsPage() {
  try {
    const tags = await getTags();
    const allTagData = await getAllTagData();
    const tagDataMap = new Map(
      allTagData
        .filter((t) => t["show-status"] === "active")
        .map((t) => [t.slug, t])
    );

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <header className="mb-16">
            <h1 className="text-3xl font-medium mb-2 text-foreground">Tags</h1>
            <p className="text-muted-foreground">Browse content by tag</p>
          </header>

          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tags.map((tag) => {
                const data = tagDataMap.get(tag.slug);
                return (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="block p-6 border border-border rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <h2 className="text-xl font-medium mb-2 text-foreground">
                      {data?.title || tag.name}
                    </h2>
                    {data?.subtitle && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {data.subtitle}
                      </p>
                    )}
                    {data?.preview && (
                      <p className="text-muted-foreground">
                        {data.preview}
                      </p>
                    )}
                  </Link>
                );
              })}
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
