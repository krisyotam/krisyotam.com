import { cn } from "@/lib/utils"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageTabsProps {
  tag: Tag;
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function TagPageTabs({
  tag,
  activeTab,
  onTabChange,
  className,
}: TagPageTabsProps) {
  return (
    <div className={cn("border-b", className)}>
      <nav className="flex space-x-8">
        <button
          type="button"
          onClick={() => onTabChange("posts")}
          className={cn(
            "border-b-2 py-4 text-sm font-medium",
            activeTab === "posts"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Posts
        </button>
        <button
          type="button"
          onClick={() => onTabChange("about")}
          className={cn(
            "border-b-2 py-4 text-sm font-medium",
            activeTab === "about"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          About
        </button>
      </nav>
    </div>
  );
} 