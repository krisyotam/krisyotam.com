interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageLoadingProps {
  tag: Tag;
  className?: string;
}

export function TagPageLoading({ tag, className }: TagPageLoadingProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded mb-4" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
      {[...Array(3)].map((_, i) => (
        <article key={i} className="border-b pb-8 animate-pulse">
          <div className="h-6 w-3/4 bg-muted rounded mb-4" />
          <div className="h-4 w-full bg-muted rounded mb-4" />
          <div className="h-4 w-1/4 bg-muted rounded" />
        </article>
      ))}
    </div>
  );
} 