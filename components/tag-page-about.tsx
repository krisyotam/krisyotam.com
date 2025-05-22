interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageAboutProps {
  tag: Tag;
  className?: string;
}

export function TagPageAbout({ tag, className }: TagPageAboutProps) {
  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <h2>About {tag.name}</h2>
      {tag.description ? (
        <p>{tag.description}</p>
      ) : (
        <p>No description available for this tag.</p>
      )}
      {tag.count !== undefined && (
        <p>
          This tag has {tag.count} {tag.count === 1 ? "post" : "posts"}.
        </p>
      )}
    </div>
  );
} 