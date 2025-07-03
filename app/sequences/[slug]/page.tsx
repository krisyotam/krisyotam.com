import SequencesClientPage from "../SequencesClientPage";

interface SequencePageProps {
  params: {
    slug: string;
  };
}

export default function SequencePage({ params }: SequencePageProps) {
  return <SequencesClientPage initialCategory={params.slug} />;
}
