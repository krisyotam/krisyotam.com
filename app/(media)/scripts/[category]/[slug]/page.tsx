import { notFound } from "next/navigation";
import { ScriptsHeader } from "@/components/scripts-header";
import { ScriptViewer } from "./script-viewer";
import scriptsData from "@/data/scripts/scripts.json";
import categoriesData from "@/data/scripts/categories.json";

export const dynamicParams = true;

interface ScriptPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return scriptsData.scripts.map(script => ({
    category: script.category.toLowerCase().replace(/\s+/g, "-"),
    slug: script.slug
  }));
}

export async function generateMetadata({ params }: ScriptPageProps) {
  const script = scriptsData.scripts.find(s => 
    s.category.toLowerCase().replace(/\s+/g, "-") === params.category && 
    s.slug === params.slug
  );
  
  if (!script) {
    return {
      title: "Script Not Found",
      description: "The requested script could not be found",
    };
  }

  return {
    title: `${script.title} | Scripts`,
    description: script.preview,
  };
}

export default function ScriptPage({ params }: ScriptPageProps) {
  const script = scriptsData.scripts.find(s => 
    s.category.toLowerCase().replace(/\s+/g, "-") === params.category && 
    s.slug === params.slug
  );

  if (!script) {
    notFound();
  }

  // Get category data for back link
  const categoryData = categoriesData.categories.find(cat => 
    cat.slug === params.category
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-[650px] mx-auto mb-8">
        <ScriptsHeader
          title={script.title}
          subtitle="Script"
          date={script.date}
          tags={script.tags}
          category={script.category}
          preview={script.preview}
          status={script.status as any}
          confidence={script.confidence as any}
          importance={script.importance}
          language={script.language}
          author={script.author}
          license={script.license}
          backText={script.category}
          backHref={`/scripts/${params.category}`}
        />
      </div>      {/* Script content viewer */}
      {script.filename && (
        <ScriptViewer filename={script.filename} />
      )}

      {!script.filename && (
        <div className="max-w-[650px] mx-auto text-center py-8">
          <p className="text-muted-foreground">No script file specified for this entry.</p>
        </div>
      )}
    </main>
  );
}
