import { cn } from "@/lib/utils"
import Link from "next/link"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagCloudProps {
  tags: Tag[];
  className?: string;
}

export function TagCloud({ tags, className }: TagCloudProps) {
  const maxCount = Math.max(...tags.map((tag) => tag.count || 0));
  const minCount = Math.min(...tags.map((tag) => tag.count || 0));
  const range = maxCount - minCount;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => {
        const size = tag.count
          ? Math.max(
              0.8,
              1 - (maxCount - (tag.count || 0)) / (range || 1)
            )
          : 0.8;

        return (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
            style={{
              transform: `scale(${size})`,
            }}
          >
            {tag.name}
            {tag.count !== undefined && (
              <span className="ml-1 text-xs text-primary-foreground/80">
                ({tag.count})
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
} 