/**
 * Navigation Component
 *
 * @author Kris Yotam
 * @date 2025-12-29
 *
 * @description
 * A unified navigation component providing consistent search, filtering, and view mode
 * controls across all content pages. This component standardizes the UI for browsing
 * collections of content items (blog posts, essays, papers, etc.) with support for:
 * - Full-text search with icon
 * - Optional category/filter dropdown
 * - Grid/List view toggle with icons
 * - Responsive layout that wraps gracefully on mobile
 *
 * @usage
 * ```tsx
 * <Navigation
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   searchPlaceholder="Search posts..."
 *   categoryOptions={[
 *     { value: "all", label: "All Categories" },
 *     { value: "tech", label: "Technology" }
 *   ]}
 *   selectedCategory="all"
 *   onCategoryChange={setCategory}
 *   viewMode="grid"
 *   onViewModeChange={setViewMode}
 *   showCategoryFilter={true}
 * />
 * ```
 */

"use client";

import { Search, LayoutGrid, List, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { cn } from "@/lib/utils";

export interface NavigationProps {
  // Search functionality
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  // Category/Filter functionality (optional)
  showCategoryFilter?: boolean;
  categoryOptions?: SelectOption[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categoryPlaceholder?: string;

  // View mode functionality
  viewMode: "grid" | "list" | "directory";
  onViewModeChange: (mode: "grid" | "list" | "directory") => void;
  showViewToggle?: boolean;
  showGridOption?: boolean;
  showDirectoryOption?: boolean;

  // Optional styling
  className?: string;
}

export function Navigation({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  showCategoryFilter = false,
  categoryOptions = [],
  selectedCategory = "all",
  onCategoryChange,
  categoryPlaceholder = "All Categories",
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  showGridOption = true,
  showDirectoryOption = false,
  className,
}: NavigationProps) {
  return (
    <div className={cn("mb-4 mt-1 flex items-center gap-4 flex-wrap", className)} suppressHydrationWarning>
      {/* Search bar - takes most of the horizontal space */}
      <div className="flex-1 min-w-[240px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full h-9 pl-10 pr-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchQuery}
          aria-label="Search"
        />
      </div>

      {/* Category filter - optional, compact dropdown */}
      {showCategoryFilter && categoryOptions.length > 0 && onCategoryChange && (
        <div className="flex items-center gap-2">
          <CustomSelect
            id="category-filter"
            value={selectedCategory}
            onValueChange={onCategoryChange}
            options={categoryOptions}
            placeholder={categoryPlaceholder}
            className="text-sm min-w-[160px]"
          />
        </div>
      )}

      {/* View mode toggle - icon-based buttons */}
      {showViewToggle && (
        <div className="flex items-center gap-2">
          {showDirectoryOption && (
            <Button
              variant="outline"
              size="icon"
              className={cn("rounded-none", viewMode === "directory" && "bg-secondary/50")}
              onClick={() => onViewModeChange("directory")}
              aria-label="Directory view"
              aria-pressed={viewMode === "directory"}
            >
              <Layers className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className={cn("rounded-none", viewMode === "list" && "bg-secondary/50")}
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List className="h-4 w-4" />
          </Button>
          {showGridOption && (
            <Button
              variant="outline"
              size="icon"
              className={cn("rounded-none", viewMode === "grid" && "bg-secondary/50")}
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
