import { cn } from "@/lib/utils"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagFilterProps {
  tags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  className?: string;
}

export function TagFilter({ tags, selectedTags, onChange, className }: TagFilterProps) {
  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={() => toggleTag(tag)}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            selectedTags.some((t) => t.id === tag.id)
              ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
              : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {tag.name}
          {tag.count !== undefined && (
            <span
              className={cn(
                "ml-1 text-xs",
                selectedTags.some((t) => t.id === tag.id)
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              ({tag.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
} 