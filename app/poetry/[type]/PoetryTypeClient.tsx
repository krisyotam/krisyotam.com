// app/poetry/[type]/PoetryTypeClient.tsx
"use client";

import { useState, useEffect } from "react";
import { PoetryCard } from "@/components/poetry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import poemsData from "@/data/poems.json";
import type { Poem } from "@/utils/poems";
import { PageHeader } from "@/components/page-header";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function PoetryTypeClient({ type }: { type: string }) {
  const allPoems = poemsData as Poem[];
  const poemTypes = ["All", ...Array.from(new Set(allPoems.map((p) => p.type)))];

  // Find the human label for the initial `type` param
  const initialLabel =
    poemTypes.find((t) => slugify(t) === type) || "All";

  // State for current filter
  const [activeType, setActiveType] = useState(initialLabel);
  const [searchQuery, setSearchQuery] = useState("");

  // Keep back/forward buttons in sync
  useEffect(() => {
    const onPop = () => {
      const parts = window.location.pathname.split("/");
      const newLabel =
        parts[2]
          ? poemTypes.find((t) => slugify(t) === parts[2]) || "All"
          : "All";
      setActiveType(newLabel);
      setSearchQuery("");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [poemTypes]);

  // Handle clicking a filter button
  const handleTypeClick = (t: string) => {
    const slug = slugify(t);
    const newPath = t === "All" ? "/poetry" : `/poetry/${slug}`;
    window.history.pushState({}, "", newPath);
    setActiveType(t);
    setSearchQuery("");
  };

  // Determine which poems to show
  const poems =
    activeType === "All"
      ? allPoems
      : allPoems.filter((p) => slugify(p.type) === slugify(activeType));

  const filtered = poems.filter((poem) => {
    return (
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poem.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  // Header values
  const headerTitle = activeType === "All" ? "Poetry" : activeType;
  const headerPreview =
    activeType === "All"
      ? "A collection of original poems..."
      : `a list of my ${activeType.toLowerCase()} poems`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8">
        <PageHeader
          title={headerTitle}
          subtitle="Verses and Reflections"
          date={new Date().toISOString()}
          preview={headerPreview}
          status="In Progress"
          confidence="certain"
          importance={7}
        />

        <div className="mb-6">
          <Input
            placeholder="Filter within this type…"
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
          <p className="text-center text-gray-500">
            No {activeType === "All" ? "" : activeType.toLowerCase() + " "}
            poems found.
          </p>
        )}
      </div>
    </div>
  );
}
