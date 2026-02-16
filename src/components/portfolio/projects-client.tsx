"use client";

import { useState, useEffect } from "react";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { ProjectsTable } from "./projects-table"; // MUST be this exact relative path
import { ProjectCard } from "./project-card";

interface Project {
  name: string;
  url: string;
  src: string;
  description: string;
  category: string;
  date: string;
}

interface Category {
  name: string;
  slug: string;
}

interface ProjectsClientProps {
  projects: Project[];
  categories: Category[];
  isActive: boolean;
}

export function ProjectsClient({ projects, categories, isActive }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, activeCategory]);

  // Don't render anything if not active
  if (!isActive) {
    return null;
  }
  
  const categoryOptions: SelectOption[] = categories.map((category) => ({
    value: category.slug,
    label: category.name,
  }));

  const handleCategoryChange = (selectedValue: string) => {
    setActiveCategory(selectedValue);
  };

  const filteredProjects = projects
    .filter((project) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q);

      const matchesCategory =
        !activeCategory ||
        project.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
    });

  return (
    <div className="projects-section">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full h-9 px-3 py-2 border border-border text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter + view toggle */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">
            Filter by category:
          </label>
          <CustomSelect
            value={activeCategory}
            onValueChange={handleCategoryChange}
            options={categoryOptions}
            className="text-sm min-w-[140px]"
          />
        </div>

        <div className="flex items-center gap-1 border border-border">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 text-xs transition-colors ${
              viewMode === "grid"
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-secondary/50"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 text-xs transition-colors ${
              viewMode === "list"
                ? "bg-foreground text-background"
                : "bg-background text-foreground hover:bg-secondary/50"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* View modes */}
      {filteredProjects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.url}
                project={project}
                categories={categories}
              />
            ))}
          </div>
        ) : (
          <>
            {console.log("Debug list view - projects:", filteredProjects.length, "categories:", categories.length)}
            <ProjectsTable
              projects={filteredProjects}
              categories={categories}
            />
          </>
        )
      ) : (
        <div className="text-muted-foreground text-sm mt-6 text-center">
          {projects.length > 0
            ? "No projects found matching your criteria."
            : "No projects data available. Check your JSON file."}
        </div>
      )}
    </div>
  );
}
