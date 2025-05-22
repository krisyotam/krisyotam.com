import { cn } from "@/lib/utils"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageErrorProps {
  tag: Tag;
  error: Error;
  className?: string;
}

export function TagPageError({ tag, error, className }: TagPageErrorProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <h2 className="text-2xl font-semibold mb-4">Error</h2>
      <p className="text-muted-foreground mb-4">
        An error occurred while loading posts for "{tag.name}".
      </p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
} 