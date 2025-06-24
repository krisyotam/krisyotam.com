import { cn } from "@/lib/utils"
import Link from "next/link"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPagePaginationProps {
  tag: Tag;
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function TagPagePagination({
  tag,
  currentPage,
  totalPages,
  className,
}: TagPagePaginationProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        {currentPage > 1 && (
          <Link
            href={`/tag/${tag.slug}?page=${currentPage - 1}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={`/tag/${tag.slug}?page=${currentPage + 1}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
} 