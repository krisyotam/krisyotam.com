import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import { getPostBySlug } from "@/utils/posts";
import { Suspense } from "react";
import { postContent } from "@/app/posts/content";

export const dynamic = "force-dynamic";

// Fallback content component when a post is not found
function PostNotFound({ slug }: { slug: string }) {
  return (
    <div className="post-content">
      <h1>Post Content Not Found</h1>
      <p>We couldn't find the content for the post "{slug}". This could be because:</p>
      <ul>
        <li>The content file doesn't exist</li>
        <li>There was an error importing the content</li>
        <li>The post metadata exists but the content is missing</li>
      </ul>
      <p>
        Please check that the content file exists at <code>app/posts/content/{slug}.tsx</code> and that it exports a
        default React component.
      </p>
      <p>
        Also ensure that the content is registered in <code>app/posts/content/index.ts</code>.
      </p>
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }; // Only the slug is needed
}) {
  try {
    console.log(`Rendering post with slug: ${params.slug}`);

    // Get post data from our posts utility
    const postData = await getPostBySlug(params.slug);

    if (!postData) {
      console.log(`Post not found in feed data: ${params.slug}`);
      notFound(); // Handles post not found
    }

    // Dynamically extract the year from the post's `date` field
    const postYear = new Date(postData.date).getFullYear();

    // For Ghost posts, we render the HTML content
    if (postData.type === "ghost" && postData.html) {
      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
            <PostHeader
              title={postData.title}
              date={postData.date}
              tags={postData.tags}
              category={postData.category}
            />
            <article className="prose dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: postData.html }}
                className="post-content"
              />
            </article>
          </div>
        </div>
      );
    }

    // For TSX posts, get the content component dynamically
    if (postData.type === "tsx") {
      // Dynamically import the post content based on the slug
      const ContentModule =
        (await postContent[params.slug as keyof typeof postContent]?.()) ?? null;
      const PostContent = ContentModule?.default ?? null;

      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
            <PostHeader
              title={postData.title}
              date={postData.date}
              tags={postData.tags}
              category={postData.category}
            />
            <article className="prose dark:prose-invert max-w-none">
              <div className="post-content">
                <Suspense fallback={<div>Loading post content...</div>}>
                  {PostContent ? (
                    <PostContent />
                  ) : (
                    <PostNotFound slug={params.slug} />
                  )}
                </Suspense>
              </div>
            </article>
          </div>
        </div>
      );
    }

    // If we get here, something went wrong
    return notFound();
  } catch (error) {
    console.error("Failed to render post:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Error Loading Post</h1>
          <p className="text-xl text-muted-foreground mb-4">
            We encountered an error while trying to load this post.
          </p>
          <pre className="bg-secondary p-4 rounded-md overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}
