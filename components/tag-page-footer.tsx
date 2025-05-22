interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

interface TagPageFooterProps {
  tag: Tag;
  className?: string;
}

export function TagPageFooter({ tag, className }: TagPageFooterProps) {
  return (
    <div className={cn("border-t pt-8", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">About {tag.name}</h2>
          {tag.description && (
            <p className="text-muted-foreground">{tag.description}</p>
          )}
        </div>
        {tag.count !== undefined && (
          <p className="text-sm text-muted-foreground">
            {tag.count} {tag.count === 1 ? "post" : "posts"}
          </p>
        )}
      </div>
    </div>
  );
} 