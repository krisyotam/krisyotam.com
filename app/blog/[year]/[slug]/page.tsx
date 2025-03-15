import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import { getPostBySlug } from "@/utils/posts";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";

export const dynamicConfig = "force-dynamic";

// Fallback content component when a post is not found
function PostNotFound({ slug, year }: { slug: string; year: string }) {
  return (
    <div className="post-content">
      <h1>Post Content Not Found</h1>
      <p>We couldn't find the content for the post "{slug}" from {year}.</p>
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: { year: string; slug: string };
}) {
  console.log("🔍 DEBUG: [year]/[slug]/page.tsx is rendering with params:", params);

  try {
    const { year, slug } = params;

    // Get post data from our posts utility
    const postData = await getPostBySlug(slug);
    console.log("🔍 DEBUG: Post data retrieved:", postData ? "Found" : "Not found");

    if (!postData) {
      console.log(`Post not found in feed data: ${slug}`);
      notFound();
    }

    // Check if there's a corresponding blog post file in the blog directory
    const blogPostPath = path.join(process.cwd(), "app/blog", year, slug, "page.tsx");
    const blogPostExists = fs.existsSync(blogPostPath);
    console.log(`🔍 DEBUG: Blog post file exists at ${blogPostPath}:`, blogPostExists);

    // Add a visible debug banner
    const DebugBanner = () => (
      <div
        style={{
          background: "rgba(255, 0, 0, 0.1)",
          border: "1px solid red",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "5px",
        }}
      >
        <h3>Debug Info</h3>
        <p>Route: /blog/{year}/{slug}</p>
        <p>Component: [year]/[slug]/page.tsx</p>
        <p>Post exists: {blogPostExists ? "Yes" : "No"}</p>
      </div>
    );

    // If the post exists, dynamically import it using a relative path
    const PostContent = blogPostExists
      ? dynamic(() => import(`./page`), {
          loading: () => <div>Loading post content...</div>,
          ssr: true,
        })
      : () => <PostNotFound slug={slug} year={year} />;

    // IMPORTANT: Return the same structure whether the post exists or not
    return (
      <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        <DebugBanner />
        <PostHeader
          title={postData.title}
          date={postData.date}
          tags={postData.tags}
          category={postData.category}
        />
        <article className="post-content">
          <Suspense fallback={<div>Loading post content...</div>}>
            <PostContent />
          </Suspense>
        </article>
      </div>
    );
  } catch (error) {
    console.error("Failed to render post:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
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
