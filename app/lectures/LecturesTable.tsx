"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LectureMeta } from "@/types/lectures";

interface LecturesTableProps {
  lectures: LectureMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function LecturesTable({ lectures, searchQuery, activeCategory }: LecturesTableProps) {
  const [filteredLectures, setFilteredLectures] = useState<LectureMeta[]>(lectures);
  const router = useRouter();

  useEffect(() => {
    const filtered = lectures.filter((lecture) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        lecture.title.toLowerCase().includes(q) ||
        lecture.tags.some((t) => t.toLowerCase().includes(q)) ||
        lecture.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || lecture.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredLectures(filtered);
  }, [lectures, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper to build the correct route for a lecture
  function getLectureUrl(lecture: LectureMeta) {
    return `/lectures/${encodeURIComponent(lecture.category)}/${encodeURIComponent(lecture.slug)}`;
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
          {filteredLectures.map((lecture, index) => (
            <tr
              key={lecture.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getLectureUrl(lecture))}
            >
              <td className="py-2 px-3 font-medium">{lecture.title}</td>
              <td className="py-2 px-3">
                <Link 
                  href={`/lectures/${lecture.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {lecture.category}
                </Link>
              </td>
              <td className="py-2 px-3">{formatDate(lecture.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredLectures.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No lectures found matching your criteria.</div>
      )}
    </div>
  );
}
