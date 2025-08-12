"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ----------  metadata-only type ---------- */
interface Note {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
}

interface NotesListProps {
  notes: Note[];
  searchQuery: string;
  activeCategory: string;
}

export function NotesList({ notes, searchQuery, activeCategory }: NotesListProps) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);
  const [groupedNotes, setGroupedNotes] = useState<Record<string, Record<string, Note[]>>>({});

  /* ----------  filter + group ---------- */
  useEffect(() => {
    const filtered = notes.filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q)) ||
        note.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || note.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    setFilteredNotes(filtered);

    /* group by year → month */
    const grouped: Record<string, Record<string, Note[]>> = {};
    filtered.forEach((note) => {
      const d = new Date(note.date);
      const year = d.getFullYear().toString();
      const month = d.toLocaleString("default", { month: "long" });

      grouped[year] ??= {};
      grouped[year][month] ??= [];
      grouped[year][month].push(note);
    });

    /* sort newest-first inside each month */
    Object.values(grouped).forEach((months) =>
      Object.values(months).forEach((list) =>
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      )
    );

    setGroupedNotes(grouped);
  }, [notes, searchQuery, activeCategory]);

  if (!filteredNotes.length) return <p className="text-center py-10">No notes found.</p>;

  return (
    <div>
      {Object.keys(groupedNotes)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => (
          <div key={year}>
            {Object.keys(groupedNotes[year]).map((month) => (
              <div key={`${year}-${month}`} className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium">
                    {year} — {month}
                  </div>
                </div>

                <div className="border-t border-border">
                  {groupedNotes[year][month].map((note) => {
                    const d = new Date(note.date);
                    const day = d.getDate();
                    const suffix = getDaySuffix(day);

                    return (
                      <Link
                        /* ----------  new URL pattern ---------- */
                        href={`/notes/${year}/${note.slug}`}
                        key={note.slug}
                        className="block border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-center py-4">
                          <span className="text-foreground">{note.title}</span>
                          <span className="text-muted-foreground">
                            {day}
                            {suffix}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

/* helper for 1st/2nd/3rd/4th… */
function getDaySuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
