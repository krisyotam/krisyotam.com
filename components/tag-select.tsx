import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagSelectProps {
  tags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  className?: string;
  onSelect: (tag: string) => void;
}

export function TagSelect({ tags, selectedTags, onChange, className, onSelect }: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("")

  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder="Select a tag..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          onSelect(e.target.value)
        }}
      />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <div className="flex flex-wrap gap-2">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTag(tag);
                  }}
                  className="ml-1 hover:text-primary-foreground/80"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">Select tags...</span>
          )}
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-accent"
              onClick={() => toggleTag(tag)}
            >
              <div className="flex items-center justify-between">
                <span>{tag.name}</span>
                {tag.count !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {tag.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 