interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageLayoutProps {
  tag: Tag;
  children: React.ReactNode;
  className?: string;
}

export function TagPageLayout({ tag, children, className }: TagPageLayoutProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{tag.name}</h1>
        {tag.description && (
          <p className="text-lg text-muted-foreground">{tag.description}</p>
        )}
        {tag.count !== undefined && (
          <p className="text-sm text-muted-foreground">
            {tag.count} {tag.count === 1 ? "post" : "posts"}
          </p>
        )}
      </div>
      {children}
    </div>
  );
} 