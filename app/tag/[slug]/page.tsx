// app/tag/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTags, getTagDataBySlug, getPostsByTag } from "@/utils/tags";
import { TagHeader } from "@/components/tag-header";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export default async function TagPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const posts = await getPostsByTag(params.slug);
    const tagData = await getTagDataBySlug(params.slug);

    if (posts.length === 0) {
      notFound();
    }

    // Fallback title if no metadata provided
    const tagTitle =
      tagData?.title ||
      params.slug
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          {tagData ? (
            <TagHeader
              title={tagData.title}
              subtitle={tagData.subtitle}
              date={tagData.date}
              preview={tagData.preview}
              status={(tagData.status || "Draft") as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"}
              confidence={(tagData.confidence || "possible") as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"}
              importance={tagData.importance || 5}
              className="mb-12"
            />
          ) : (
            <header className="mb-16">
              <div className="mb-4">
                <Link
                  href="/tags"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Tags
                </Link>
              </div>
              <h1 className="text-xl font-medium mb-1 text-foreground">
                {tagTitle}
              </h1>
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </header>
          )}

          <main>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-2 font-semibold text-foreground">
                      Title
                    </th>
                    <th className="text-right py-4 px-2 font-semibold text-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => {
                    const year = new Date(post.date).getFullYear().toString();
                    const postUrl = `/blog/${year}/${post.slug}`;
                    return (
                      <tr
                        key={post.slug}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-4 px-2">
                          <Link href={postUrl} className="text-foreground">
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-4 px-2 text-right text-muted-foreground">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch tag posts:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">
          Failed to load tag posts. Please try again later.
        </p>
      </div>
    );
  }
}
