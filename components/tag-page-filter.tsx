interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageFilterProps {
  tag: Tag;
  onFilter: (filter: string) => void;
  className?: string;
}

export function TagPageFilter({ tag, onFilter, className }: TagPageFilterProps) {
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <span className="text-sm text-muted-foreground">Filter by:</span>
      <select
        onChange={(e) => onFilter(e.target.value)}
        className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">All</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>
  );
} 