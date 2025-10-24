import { Metadata } from "next";
import "../../lectures.css";

export const metadata: Metadata = {
  title: "Lecture",
  description: "Individual educational lecture",
};

export default function LectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
