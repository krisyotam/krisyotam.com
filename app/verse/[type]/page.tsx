import VerseTypeClient from "./VerseTypeClient";

export default function VerseTypePage({ params }: { params: { type: string } }) {
  return <VerseTypeClient params={params} />;
} 