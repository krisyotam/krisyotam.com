"use client";

import { useRouter } from "next/navigation";

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

interface ProjectsTableProps {
  projects: Project[];
  categories: Category[];
}

export function ProjectsTable({ projects, categories }: ProjectsTableProps) {
  const router = useRouter();

  // Format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Format category for display
  function formatCategoryDisplayName(category: string) {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (!projects.length) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        No projects found.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Name</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={project.url}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
              }`}
              onClick={() => window.open(project.url, "_blank")}
            >
              <td className="py-2 px-3 font-medium">{project.name}</td>
              <td className="py-2 px-3">
                {formatCategoryDisplayName(project.category)}
              </td>
              <td className="py-2 px-3">{formatDate(project.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
