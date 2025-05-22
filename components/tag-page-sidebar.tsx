interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageSidebarProps {
  tag: Tag;
  relatedTags: Tag[];
  className?: string;
}

export function TagPageSidebar({ tag, relatedTags, className }: TagPageSidebarProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h2 className="text-lg font-semibold mb-4">About {tag.name}</h2>
        {tag.description && (
          <p className="text-muted-foreground">{tag.description}</p>
        )}
        {tag.count !== undefined && (
          <p className="text-sm text-muted-foreground mt-2">
            {tag.count} {tag.count === 1 ? "post" : "posts"}
          </p>
        )}
      </div>
      {relatedTags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Related Tags</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((relatedTag) => (
              <Link
                key={relatedTag.id}
                href={`/tag/${relatedTag.slug}`}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
              >
                {relatedTag.name}
                {relatedTag.count !== undefined && (
                  <span className="ml-1 text-xs text-primary-foreground/80">
                    ({relatedTag.count})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 