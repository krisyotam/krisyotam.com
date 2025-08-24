// /app/progymnasmata/[type]/[slug]/page.tsx



import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import postsData from "@/data/progymnasmata/progymnasmata.json";
import { PageHeader } from "@/components/page-header";
import { Citation } from "@/components/citation";
import { Footer } from "@/app/(content)/essays/components/footer";


export async function generateStaticParams() {
  return postsData.map(post => ({
    category: post.category,
    slug: post.slug,
  }));
}

export default async function ProgymnasmataSlugPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  const post = postsData.find(p => p.category === category && p.slug === slug);
  if (!post) return notFound();

  // Find the MDX file
  const mdxPath = path.join(process.cwd(), "app", "(content)", "progymnasmata", "content", category, `${slug}.mdx`);
  let mdxSource = "";
  try {
    mdxSource = fs.readFileSync(mdxPath, "utf8");
  } catch {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="container max-w-[672px] mx-auto px-4 pb-8">
        <PageHeader
          title={post.title}
          start_date={post.start_date && post.start_date.trim() ? post.start_date : "Unknown"}
          end_date={post.end_date && post.end_date.trim() ? post.end_date : new Date().toISOString().split('T')[0]}
          preview={post.preview && post.preview.trim() ? post.preview : "No preview available."}
          status={(post.status ? post.status : "Notes") as ("Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | "Active")}
          confidence={(post.confidence ? post.confidence : "possible") as ("impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "speculative")}
          importance={typeof post.importance === "number" ? post.importance : 5}
          tags={Array.isArray(post.tags) ? post.tags : []}
          backText="Progymnasmata"
          backHref="/progymnasmata"
        />
        <div className="progymnasmata-content mt-8">
          <MDXRemote source={mdxSource} />
        </div>
        <div className="mt-8">
          <Citation
            title={post.title}
            slug={post.slug}
            start_date={post.start_date}
            end_date={post.end_date}
            url={`https://krisyotam.com/progymnasmata/${post.category.toLowerCase()}/${post.slug}`}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}
