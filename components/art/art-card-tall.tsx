import ArtCardBase, { type ArtworkItem } from "./art-card-base"

export default function ArtCardTall({ artwork }: { artwork: ArtworkItem }) {
  return <ArtCardBase artwork={artwork} className="aspect-[4/7]" />
}

