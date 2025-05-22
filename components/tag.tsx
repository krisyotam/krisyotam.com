import { cn } from "@/lib/utils"
import Link from "next/link"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagProps {
  tag: Tag;
  className?: string;
}

export function Tag({ tag, className }: TagProps) {
  return (
    <Link
      href={`/tag/${tag.slug}`}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        className
      )}
    >
      {tag.name}
      {tag.count !== undefined && (
        <span className="ml-1 text-xs text-primary-foreground/80">
          ({tag.count})
        </span>
      )}
    </Link>
  );
} 