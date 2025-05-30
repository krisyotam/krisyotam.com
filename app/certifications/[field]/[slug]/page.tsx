import { notFound } from "next/navigation";

export default function CertificationDetailPage({
  params,
}: {
  params: { field: string; slug: string };
}) {
  // Temporary redirect to the main site until this feature is implemented
  notFound();
}