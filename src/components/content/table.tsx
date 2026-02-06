/**
 * Generic Content Table Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description
 * A unified table component for displaying content lists across all content types.
 * Provides consistent styling, filtering, sorting, and navigation for essays, blog posts,
 * papers, notes, and all other content types.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ContentItem {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  cover_image?: string;
  preview?: string;
  state?: string;
  type?: string; // Content type (essays, notes, papers, etc.)
  route?: string; // URL route override
  views?: number; // View count
}

interface ContentTableProps {
  items: ContentItem[];
  /**
   * Base path for content items (e.g., "/blog", "/essays", "/papers")
   * Only required if `route` is not provided in items
   */
  basePath?: string;
  /**
   * Whether to show category links (default: false)
   */
  showCategoryLinks?: boolean;
  /**
   * Whether to format category names from slugs (default: true)
   */
  formatCategoryNames?: boolean;
  /**
   * Whether to show content type column (default: false)
   */
  showType?: boolean;
  /**
   * Whether to show views column (default: false)
   */
  showViews?: boolean;
  /**
   * Custom empty state message
   */
  emptyMessage?: string;
}

export function ContentTable({
  items,
  basePath = "",
  showCategoryLinks = false,
  formatCategoryNames = true,
  showType = false,
  showViews = true,
  emptyMessage = "No items found.",
}: ContentTableProps) {
  const router = useRouter();

  // Helper to format date as "YYYY.MM.DD"
  function formatDate(dateString: string): string {
    if (!dateString) return "";
    try {
      const [year, month, day] = dateString.split("-").map((num) => parseInt(num, 10));
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      return `${year}.${mm}.${dd}`;
    } catch (error) {
      return dateString;
    }
  }

  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(item: ContentItem): string {
    const dateToUse = (item.end_date && item.end_date.trim()) || item.start_date;
    return formatDate(dateToUse);
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    if (!formatCategoryNames) return category;

    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Helper to build the correct route for an item
  function getItemUrl(item: ContentItem) {
    // If item has a route field, use it directly
    if (item.route) {
      const categorySlug = item.category.toLowerCase().replace(/\s+/g, "-");
      return `${item.route}/${categorySlug}/${encodeURIComponent(item.slug)}`;
    }

    // Otherwise use basePath
    const categorySlug = item.category.toLowerCase().replace(/\s+/g, "-");
    return `${basePath}/${categorySlug}/${encodeURIComponent(item.slug)}`;
  }

  // Helper to format content type display name
  function formatTypeDisplayName(type: string) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  // Helper to build category URL
  function getCategoryUrl(category: string) {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    return `${basePath}/${categorySlug}`;
  }

  if (!items.length) {
    return <p className="text-center py-10 text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div>
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm table-fixed">
        <colgroup>
          <col className="w-[45%]" />
          {showType && <col className="w-[12%]" />}
          <col className="w-[18%]" />
          <col className="w-[15%]" />
          {showViews && <col className="w-[10%]" />}
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            {showType && <th className="py-2 text-left font-medium px-3">Type</th>}
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
            {showViews && <th className="py-2 text-right font-medium px-3">Views</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
              }`}
              onClick={() => router.push(getItemUrl(item))}
            >
              <td className="py-2 px-3 truncate">{item.title}</td>
              {showType && item.type && (
                <td className="py-2 px-3 text-muted-foreground truncate">
                  {formatTypeDisplayName(item.type)}
                </td>
              )}
              <td className="py-2 px-3 truncate">
                {showCategoryLinks ? (
                  <Link
                    href={getCategoryUrl(item.category)}
                    className="text-foreground hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatCategoryDisplayName(item.category)}
                  </Link>
                ) : (
                  formatCategoryDisplayName(item.category)
                )}
              </td>
              <td className="py-2 px-3 whitespace-nowrap">{getDisplayDate(item)}</td>
              {showViews && (
                <td className="py-2 px-3 text-right text-muted-foreground whitespace-nowrap">
                  {(item.views ?? 0).toLocaleString()}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
