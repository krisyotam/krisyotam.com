import ArtCardBase, { type ArtworkItem } from "./art-card-base"

export default function ArtCardSmall({ artwork }: { artwork: ArtworkItem }) {
  return <ArtCardBase artwork={artwork} className="aspect-square" />
}

