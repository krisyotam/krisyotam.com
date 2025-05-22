import Link from "next/link";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageUnauthorizedProps {
  tag: Tag;
  className?: string;
}

export function TagPageUnauthorized({ tag, className }: TagPageUnauthorizedProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <h2 className="text-2xl font-semibold mb-4">Unauthorized</h2>
      <p className="text-muted-foreground mb-4">
        You don't have permission to view posts for "{tag.name}".
      </p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        Sign in
      </Link>
    </div>
  );
} 