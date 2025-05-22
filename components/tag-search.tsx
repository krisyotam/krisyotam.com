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

interface TagSearchProps {
  tags: Tag[];
  onSelect: (tag: Tag) => void;
  className?: string;
  onSearch: (query: string) => void;
}

export function TagSearch({ tags, onSelect, className, onSearch }: TagSearchProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder="Search tags..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          onSearch(e.target.value)
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full"
      />
      {isOpen && filteredTags.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              className="w-full px-4 py-2 text-left hover:bg-accent"
              onClick={() => {
                onSelect(tag);
                setIsOpen(false);
                setSearch("");
              }}
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