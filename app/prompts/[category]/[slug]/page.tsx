import { notFound } from "next/navigation";
import { PromptsHeader } from "@/components/prompts-header";
import { PromptViewer } from "./prompt-viewer";
import promptsData from "@/data/prompts/prompts.json";
import categoriesData from "@/data/prompts/categories.json";

export const dynamicParams = true;

interface PromptPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return promptsData.prompts.map(prompt => ({
    category: prompt.category.toLowerCase().replace(/\s+/g, "-"),
    slug: prompt.slug
  }));
}

export async function generateMetadata({ params }: PromptPageProps) {
  const prompt = promptsData.prompts.find(p => 
    p.category.toLowerCase().replace(/\s+/g, "-") === params.category && 
    p.slug === params.slug
  );
  
  if (!prompt) {
    return {
      title: "Prompt Not Found",
      description: "The requested prompt could not be found",
    };
  }

  return {
    title: `${prompt.title} | Prompts`,
    description: prompt.preview,
  };
}

export default function PromptPage({ params }: PromptPageProps) {
  const prompt = promptsData.prompts.find(p => 
    p.category.toLowerCase().replace(/\s+/g, "-") === params.category && 
    p.slug === params.slug
  );

  if (!prompt) {
    notFound();
  }

  // Get category data for back link
  const categoryData = categoriesData.categories.find(cat => 
    cat.slug === params.category
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-[650px] mx-auto mb-8">
        <PromptsHeader
          title={prompt.title}
          subtitle="Prompt"
          date={prompt.date}
          tags={prompt.tags}
          category={prompt.category}
          preview={prompt.preview}
          status={prompt.status as any}
          confidence={prompt.confidence as any}
          importance={prompt.importance}
          model={prompt.model}
          author={prompt.author}
          license={prompt.license}
          backText={prompt.category}
          backHref={`/prompts/${params.category}`}
        />
      </div>

      {/* Prompt content viewer */}
      {prompt.filename && (
        <PromptViewer filename={prompt.filename} />
      )}

      {!prompt.filename && (
        <div className="max-w-[650px] mx-auto text-center py-8">
          <p className="text-muted-foreground">No prompt file specified for this entry.</p>
        </div>
      )}
    </main>
  );
}
