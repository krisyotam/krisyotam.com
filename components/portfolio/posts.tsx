"use client";

interface PostsProps {
  isActive: boolean;
}

export function Posts({ isActive }: PostsProps) {
  if (!isActive) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <p className="text-muted-foreground">Posts content coming soon...</p>
    </div>
  );
}
