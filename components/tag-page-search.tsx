import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageSearchProps {
  tag: Tag;
  onSearch: (query: string) => void;
  className?: string;
}

export function TagPageSearch({ tag, onSearch, className }: TagPageSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className={cn("w-full", className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search in ${tag.name}...`}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
} 