import { cn, formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  author?: {
    name: string;
    image?: string;
  };
}

interface TagPageContentProps {
  tag: Tag;
  posts: Post[];
  className?: string;
}

export function TagPageContent({ tag, posts, className }: TagPageContentProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {posts.map((post) => (
        <article key={post.id} className="border-b pb-8">
          <h2 className="text-2xl font-semibold mb-2">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          {post.excerpt && (
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            {post.date && (
              <time dateTime={post.date} className="mr-4">
                {formatDate(post.date)}
              </time>
            )}
            {post.author && (
              <div className="flex items-center">
                {post.author.image && (
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
} 