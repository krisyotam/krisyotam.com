import { getPostBySlug, getPosts } from "../../../utils/ghost"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const post = await getPostBySlug(params.slug)

    if (!post) {
      notFound()
    }

    const categories = post.tags
      .filter((tag) => !tag.name.startsWith("#"))
      .map((tag) => tag.name)
      .join(" · ")

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
          <article className="prose dark:prose-invert">
            <header className="not-prose mb-16">
              <h1 className="text-4xl font-semibold tracking-tight mb-4 text-foreground">{post.title}</h1>
              <div className="text-sm text-muted-foreground font-light">
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {categories}
              </div>
            </header>
            <div dangerouslySetInnerHTML={{ __html: post.html }} className="post-content text-foreground" />
          </article>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch post:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load post. Please try again later.</p>
      </div>
    )
  }
}

