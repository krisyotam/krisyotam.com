interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageEmptyProps {
  tag: Tag;
  className?: string;
}

export function TagPageEmpty({ tag, className }: TagPageEmptyProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
      <p className="text-muted-foreground">
        There are no posts tagged with "{tag.name}" yet.
      </p>
    </div>
  );
} 