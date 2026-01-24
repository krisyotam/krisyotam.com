"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgymnasmataCard } from "./progymnasmata-card";
import { ProgymnasmataSearch } from "./progymnasmata-search";
import { ProgymnasmataTypeFilter } from "./progymnasmata-type-filter";

export interface ProgymnasmataEntry {
  title: string;
  type: string;
  date: string;
  description: string;
  slug: string;
  paragraphs: string[];
}

export function Progymnasmata() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [entries, setEntries] = useState<ProgymnasmataEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ProgymnasmataEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all entries once
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/content?type=progymnasmata");
        const data: ProgymnasmataEntry[] = await res.json();
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(data);
      } catch (err) {
        console.error("Error fetching entries:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntries();
  }, []);

  // Build the list of types once entries arrive
  const types = ["All", ...Array.from(new Set(entries.map((e) => e.type)))];

  // Sync selectedType from URL ?type=slug
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      // find the display name whose slug matches
      const match = types.find(
        (t) => t.toLowerCase().replace(/\s+/g, "-") === typeParam
      );
      if (match) {
        setSelectedType(match);
      } else {
        setSelectedType("All");
      }
    } else {
      setSelectedType("All");
    }
  }, [searchParams, types]);

  // Whenever entries, searchQuery, or selectedType change, recompute filteredEntries
  useEffect(() => {
    let result = entries;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    if (selectedType !== "All") {
      result = result.filter((e) => e.type === selectedType);
    }

    setFilteredEntries(result);
  }, [entries, searchQuery, selectedType]);

  const handleSearch = (q: string) => setSearchQuery(q);
  const handleTypeChange = (t: string) => {
    setSelectedType(t);
    // update the URL, too
    const slug = t.toLowerCase().replace(/\s+/g, "-");
    router.push(`/progymnasmata?type=${slug}`);
  };

  const handleViewContent = (entry: ProgymnasmataEntry) => {
    router.push(
      `/progymnasmata/${entry.type.toLowerCase()}/${entry.slug}`
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col space-y-6 mb-8">
        <ProgymnasmataSearch onSearch={handleSearch} />
        <ProgymnasmataTypeFilter
          types={types}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-[hsl(214.3,31.8%,91.4%)] dark:border-[#2a2a2a] rounded-lg p-4 h-64 bg-white dark:bg-[#121212]"
            >
              <div className="bg-[hsl(215.4,16.3%,46.9%)] dark:bg-[#4d4d4d] h-4 w-3/4 mb-2 rounded" />
              <div className="bg-[hsl(215.4,16.3%,46.9%)] dark:bg-[#4d4d4d] h-4 w-1/2 mb-4 rounded" />
              <div className="bg-[hsl(215.4,16.3%,46.9%)] dark:bg-[#4d4d4d] h-24 w-full mb-4 rounded" />
              <div className="bg-[hsl(215.4,16.3%,46.9%)] dark:bg-[#4d4d4d] h-4 w-1/4 rounded" />
            </div>
          ))}
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <ProgymnasmataCard
              key={entry.slug}
              entry={entry}
              onViewContent={() => handleViewContent(entry)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No entries found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
