"use client";

interface AccreditationsFieldClientProps {
  field: string;
}

export default function AccreditationsFieldClient({ field }: AccreditationsFieldClientProps) {
  return (
    <div className="p-8">
      <h1>Certifications in {field}</h1>
      <p>This feature is coming soon.</p>
    </div>
  );
}