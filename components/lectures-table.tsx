"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Lecture {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  cover_image?: string;
  preview?: string;
  state?: string;
}

interface LecturesTableProps {
  lectures: Lecture[];
  searchQuery: string;
  activeCategory: string;
}

export function LecturesTable({ lectures, searchQuery, activeCategory }: LecturesTableProps) {
  const router = useRouter();

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Helper to build the correct route for a lecture
  function getLectureUrl(lecture: Lecture) {
    const categorySlug = lecture.category.toLowerCase().replace(/\s+/g, "-");
    return `/lectures/${categorySlug}/${encodeURIComponent(lecture.slug)}`;
  }

  if (!lectures.length) {
    return <p className="text-center py-10 text-muted-foreground">No lectures found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lecture, index) => (
            <tr
              key={lecture.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getLectureUrl(lecture))}
            >
              <td className="py-2 px-3 font-medium">{lecture.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(lecture.category)}</td>
              <td className="py-2 px-3">{formatDate(lecture.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
