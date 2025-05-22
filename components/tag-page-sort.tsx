interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageSortProps {
  tag: Tag;
  onSort: (sort: string) => void;
  className?: string;
}

export function TagPageSort({ tag, onSort, className }: TagPageSortProps) {
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <select
        onChange={(e) => onSort(e.target.value)}
        className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
} 