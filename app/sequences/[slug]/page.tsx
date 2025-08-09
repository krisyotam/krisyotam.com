import SequenceDetailPage from "@/components/sequence-detail-page";
import sequencesData from "@/data/sequences/sequences.json";
import type { Metadata } from "next";

interface SequencePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: SequencePageProps): Promise<Metadata> {
  const sequence = sequencesData.sequences.find(seq => seq.slug === params.slug);
  
  if (!sequence) {
    return {
      title: "Sequence Not Found",
      description: "The sequence you're looking for doesn't exist."
    };
  }

  return {
    title: `${sequence.title} - Learning Sequence`,
    description: sequence.preview,
    openGraph: {
      title: `${sequence.title} - Learning Sequence`,
      description: sequence.preview,
      type: "article",
      publishedTime: sequence.start_date,
      tags: sequence.tags,
      ...(sequence["cover-url"] && { images: [{ url: sequence["cover-url"] }] })
    },
    twitter: {
      card: "summary_large_image",
      title: `${sequence.title} - Learning Sequence`,
      description: sequence.preview,
      ...(sequence["cover-url"] && { images: [sequence["cover-url"]] })
    }
  };
}

export default function SequencePage({ params }: SequencePageProps) {
  return <SequenceDetailPage slug={params.slug} />;
}
