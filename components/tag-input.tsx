import { cn } from "@/lib/utils"
import { useState } from "react"

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagInputProps {
  tags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  className?: string;
}

export function TagInput({ tags, selectedTags, onChange, className }: TagInputProps) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTags = tags.filter(
    (tag) =>
      !selectedTags.some((t) => t.id === tag.id) &&
      tag.name.toLowerCase().includes(input.toLowerCase())
  );

  const addTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onChange([...selectedTags, tag]);
    }
    setInput("");
    setIsOpen(false);
  };

  const removeTag = (tag: Tag) => {
    onChange(selectedTags.filter((t) => t.id !== tag.id));
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-primary-foreground/80"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedTags.length === 0 ? "Add tags..." : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none"
        />
      </div>
      {isOpen && filteredTags.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-accent"
              onClick={() => addTag(tag)}
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