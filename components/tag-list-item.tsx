import { cn } from "@/lib/utils"
import Link from "next/link"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagListItemProps {
  tag: Tag;
  className?: string;
}

export function TagListItem({ tag, className }: TagListItemProps) {
  return (
    <Link
      href={`/tag/${tag.slug}`}
      className={cn(
        "flex items-center justify-between p-4 border rounded-lg hover:bg-accent",
        className
      )}
    >
      <div>
        <h3 className="font-semibold">{tag.name}</h3>
        {tag.description && (
          <p className="text-sm text-muted-foreground">{tag.description}</p>
        )}
      </div>
      {tag.count !== undefined && (
        <span className="text-sm text-muted-foreground">{tag.count}</span>
      )}
    </Link>
  );
} 