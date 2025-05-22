interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagListProps {
  tags: Tag[];
  showCount?: boolean;
  className?: string;
}

export function TagList({ tags, showCount = false, className }: TagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
        >
          {tag.name}
          {showCount && tag.count !== undefined && (
            <span className="ml-1 text-xs text-primary-foreground/80">
              ({tag.count})
            </span>
          )}
        </Link>
      ))}
    </div>
  );
} 