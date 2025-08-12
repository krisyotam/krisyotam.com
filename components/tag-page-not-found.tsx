import { cn } from "@/lib/utils"
import Link from "next/link"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageNotFoundProps {
  tag: Tag;
  className?: string;
}

export function TagPageNotFound({ tag, className }: TagPageNotFoundProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <h2 className="text-2xl font-semibold mb-4">Tag not found</h2>
      <p className="text-muted-foreground mb-4">
        The tag "{tag.name}" could not be found.
      </p>
      <Link
        href="/tags"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        View all tags
      </Link>
    </div>
  );
} 