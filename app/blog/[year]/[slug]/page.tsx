import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import { BlogPostContent } from "./blog-post-content";

export const dynamicParams = true;

export default async function PostPage({
  params,
}: {
  params: { year: string; slug: string };
}) {
  console.log("🔍 DEBUG: [year]/[slug]/page.tsx is rendering with params:", params);

  try {
    const { year, slug } = params;

    // Fetch post data from the API route
    const response = await fetch(`/api/posts`);
    if (!response.ok) {
      console.error("Error fetching posts data");
      notFound();
    }
    const data = await response.json();

    // Find the post by slug
    const postData = data.posts.find((post: any) => post.slug === slug);
    console.log("🔍 DEBUG: Post data retrieved:", postData ? "Found" : "Not found");

    if (!postData) {
      console.log(`Post not found in feed data: ${slug}`);
      notFound();
    }

    // Check if there's an MDX version of the post and get content if it exists
    const { isMDX, mdxData, blogPostExists } = await getPostContent(year, slug);
    console.log(`🔍 DEBUG: Is MDX post:`, isMDX);

    return (
      <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        <PostHeader
          title={postData.title}
          date={postData.date}
          tags={postData.tags}
          category={postData.category}
        />
        <article className="post-content">
          <BlogPostContent
            year={year}
            slug={slug}
            isMDX={isMDX}
            mdxData={mdxData}
            blogPostExists={blogPostExists}
          />
        </article>
      </div>
    );
  } catch (error) {
    console.error("Failed to render post:", error);
    return (
      <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        <h1>Error</h1>
        <p>Sorry, something went wrong while loading this post.</p>
      </div>
    );
  }
}