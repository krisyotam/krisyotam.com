import LecturesClientPage from "./LecturesClientPage";
import lecturesData from "@/data/lectures/lectures.json";
import type { Metadata } from "next";
import type { LectureMeta, LectureStatus, LectureConfidence } from "@/types/lectures";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.lectures;

export default function LecturesPage() {
  // Map and sort lectures by date (newest first)
  const lectures: LectureMeta[] = lecturesData.map(lectureItem => ({
    ...lectureItem,
    status: lectureItem.status as LectureStatus,
    confidence: lectureItem.confidence as LectureConfidence
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="lectures-container">
      <LecturesClientPage lectures={lectures} initialCategory="all" />
    </div>
  );
}
