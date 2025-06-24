import { cn } from "@/lib/utils"
import Link from "next/link"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageNavigationProps {
  tag: Tag;
  className?: string;
}

export function TagPageNavigation({ tag, className }: TagPageNavigationProps) {
  return (
    <nav className={cn("flex items-center space-x-4", className)}>
      <Link
        href="/tags"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        All Tags
      </Link>
      <span className="text-sm text-muted-foreground">/</span>
      <span className="text-sm font-medium">{tag.name}</span>
    </nav>
  );
} 