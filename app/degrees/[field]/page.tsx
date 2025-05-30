import { notFound } from "next/navigation";

export default function DegreeFieldPage({
  params,
}: {
  params: { field: string };
}) {
  // Temporary redirect to the main site until this feature is implemented
  notFound();
}