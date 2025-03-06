import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "../../../utils/ghost";
import ocsData from "../../../data/ocs.json";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  return ocsData.characters.map((character) => ({
    slug: character.slug,
  }));
}

export default async function CharacterPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug);
    const characterData = ocsData.characters.find((c) => c.slug === params.slug);

    if (!post || !characterData || characterData.status === "hidden") {
      notFound();
    }

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link href="/ocs">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Characters
              </Link>
            </Button>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-sm"> {/* Changed max-w-md to max-w-sm for a smaller image */}
              <Image
                src={post.feature_image || "/placeholder-square.svg"}
                alt={characterData.name}
                layout="responsive"
                width={150}  // Further reduced width
                height={150} // Further reduced height
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-center">{characterData.name}</h1>
          <p className="text-xl mb-4 text-center">from {characterData.book}</p>
          <p className="text-center mb-8 text-muted-foreground">by Kris Yotam</p>

          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch character:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">
          Failed to load character. Please try again later.
        </p>
      </div>
    );
  }
}
