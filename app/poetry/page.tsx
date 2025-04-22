// app/poetry/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PoetryCard } from "@/components/poetry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import poemsData from "@/data/poems.json";
import type { Poem } from "@/utils/poems";
import { PageHeader } from "@/components/page-header";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function PoetryPage() {
  const allPoems = poemsData as Poem[];
  const poemTypes = ["All", ...Array.from(new Set(allPoems.map((p) => p.type)))];

  // start with "All"; will be overridden on mount
  const [activeType, setActiveType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // sync activeType to URL on mount and on back/forward
  useEffect(() => {
    const syncTypeFromPath = () => {
      const parts = window.location.pathname.split("/");
      const type = parts[2]
        ? poemTypes.find((t) => slugify(t) === parts[2])
        : "All";
      setActiveType(type || "All");
    };

    syncTypeFromPath();
    window.addEventListener("popstate", syncTypeFromPath);
    return () => window.removeEventListener("popstate", syncTypeFromPath);
  }, [poemTypes]);

  // update URL + state when clicking a type
  const handleTypeClick = (t: string) => {
    const slug = slugify(t);
    const newPath = t === "All" ? "/poetry" : `/poetry/${slug}`;
    window.history.pushState({}, "", newPath);
    setSearchQuery("");
    setActiveType(t);
  };

  // filter poems by type + search
  const filtered = allPoems.filter((poem) => {
    const matchesType = activeType === "All" || poem.type === activeType;
    const matchesSearch =
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8">
        <PageHeader
          title="Poetry"
          subtitle="Verses and Reflections"
          date={new Date().toISOString()}
          preview="A collection of original poems..."
          status="In Progress"
          confidence="certain"
          importance={7}
        />

        <div className="mb-6">
          <Input
            placeholder="Search poems…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {poemTypes.map((t) => {
            const isActive = t === activeType;
            return (
              <Button
                key={t}
                variant={isActive ? "default" : "secondary"}
                className="text-sm"
                onClick={() => handleTypeClick(t)}
              >
                {t}
              </Button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((poem) => (
              <PoetryCard key={poem.id} poem={poem} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No poems found.</p>
        )}
      </div>
    </div>
  );
}
