interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageProps {
  tag: Tag;
  posts: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    date?: string;
    author?: {
      name: string;
      image?: string;
    };
  }[];
}

export function TagPage({ tag, posts }: TagPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{tag.name}</h1>
        {tag.description && (
          <p className="text-lg text-muted-foreground">{tag.description}</p>
        )}
      </div>
      <div className="grid gap-8">
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
    </div>
  );
} 