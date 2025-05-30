"use client";

interface AccreditationDetailClientProps {
  field: string;
  slug: string;
}

export default function AccreditationDetailClient({ field, slug }: AccreditationDetailClientProps) {
  return (
    <div className="p-8">
      <h1>Certification Detail: {slug}</h1>
      <p>Field: {field}</p>
      <p>This feature is coming soon.</p>
    </div>
  );
}