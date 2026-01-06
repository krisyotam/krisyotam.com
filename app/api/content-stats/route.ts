/**
 * =============================================================================
 * Content Stats API Route
 * =============================================================================
 *
 * Provides content counts from content.db for homepage widgets.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { getActiveContentByType } from "@/lib/data";
import fs from "fs";
import path from "path";

// Helper function to safely read JSON files (for non-db content)
function readJsonFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      return JSON.parse(fileContents);
    }
    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Helper function to count entries in a JSON file
function countEntries(data: any, expectedKey: string): number {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if (data[expectedKey] && Array.isArray(data[expectedKey])) return data[expectedKey].length;
  const pluralKey = `${expectedKey}s`;
  if (data[pluralKey] && Array.isArray(data[pluralKey])) return data[pluralKey].length;
  for (const key in data) {
    if (Array.isArray(data[key])) return data[key].length;
  }
  return 0;
}

export async function GET() {
  try {
    // Get stats from content database
    const dbStats = {
      blog: getActiveContentByType('blog').length,
      notes: getActiveContentByType('notes').length,
      papers: getActiveContentByType('papers').length,
      essays: getActiveContentByType('essays').length,
      fiction: getActiveContentByType('fiction').length,
      verse: getActiveContentByType('verse').length,
      ocs: getActiveContentByType('ocs').length,
      news: getActiveContentByType('news').length,
      progymnasmata: getActiveContentByType('progymnasmata').length,
      reviews: getActiveContentByType('reviews').length,
      sequences: getActiveContentByType('sequences').length,
    };

    // Get stats from other JSON files that weren't migrated
    const archive = readJsonFile("data/doc/archive.json");
    const certifications = readJsonFile("data/about/certifications.json");
    const lectureNotes = readJsonFile("data/lecture-notes/lecture-notes.json");

    const jsonStats = {
      offsite: countEntries(archive, "item"),
      certifications: countEntries(certifications, "certification"),
      lectureNotes: countEntries(lectureNotes, "note"),
    };

    return NextResponse.json({ ...dbStats, ...jsonStats });
  } catch (error) {
    console.error("Error loading content stats:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
