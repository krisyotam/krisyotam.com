import LecturesClientPage from "./LecturesClientPage";
import lecturesData from "@/data/lectures/lectures.json";
import type { Metadata } from "next";
import type { LectureMeta, LectureStatus, LectureConfidence } from "@/types/lectures";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.lectures;

export default function LecturesPage() {
  // Filter lectures to only show active ones and sort by date (newest first)
  const activeLectures = lecturesData.filter(lecture => lecture.state === "active");
  const lectures: LectureMeta[] = activeLectures.map(lectureItem => ({
    ...lectureItem,
    status: lectureItem.status as LectureStatus,
    confidence: lectureItem.confidence as LectureConfidence
  })).sort((a, b) => new Date(b.end_date || b.start_date).getTime() - new Date(a.end_date || a.start_date).getTime());

  return (
    <div className="lectures-container">
      <LecturesClientPage lectures={lectures} initialCategory="all" />
    </div>
  );
}
