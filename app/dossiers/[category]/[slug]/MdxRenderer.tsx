"use client";

import { useState, useEffect } from "react";

interface MdxRendererProps {
  category: string;
  slug: string;
}

export default function MdxRenderer({ category, slug }: MdxRendererProps) {
  const [MdxComponent, setMdxComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMdx = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Dynamically import the MDX file
        const mdxModule = await import(`../content/${category}/${slug}.mdx`);
        setMdxComponent(() => mdxModule.default);
      } catch (err) {
        console.error("Failed to load MDX:", err);
        setError("Dossier content not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    loadMdx();
  }, [category, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading dossier content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-muted border border-border rounded-lg p-6 my-8">
        <h2 className="text-lg font-semibold mb-2">Content Not Available</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <p className="text-sm text-muted-foreground">
          This dossier may be classified or the content is being prepared.
        </p>
      </div>
    );
  }

  if (!MdxComponent) {
    return (
      <div className="bg-muted border border-border rounded-lg p-6 my-8">
        <h2 className="text-lg font-semibold mb-2">Content Not Available</h2>
        <p className="text-muted-foreground">
          This dossier content is not yet available.
        </p>
      </div>
    );
  }

  return <MdxComponent />;
}