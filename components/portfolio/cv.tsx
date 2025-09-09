"use client";

interface CVProps {
  isActive: boolean;
}

export function CV({ isActive }: CVProps) {
  if (!isActive) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">CV</h2>
      <p className="text-muted-foreground">CV content coming soon...</p>
    </div>
  );
}
