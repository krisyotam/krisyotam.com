import { cn } from "@/lib/utils"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageHeaderProps {
  tag: Tag;
  className?: string;
}

export function TagPageHeader({ tag, className }: TagPageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h1 className="text-4xl font-bold">{tag.name}</h1>
      {tag.description && (
        <p className="text-lg text-muted-foreground">{tag.description}</p>
      )}
      {tag.count !== undefined && (
        <p className="text-sm text-muted-foreground">
          {tag.count} {tag.count === 1 ? "post" : "posts"}
        </p>
      )}
    </div>
  );
} 