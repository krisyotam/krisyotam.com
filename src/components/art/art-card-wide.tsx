import ArtCardBase, { type ArtworkItem } from "./art-card-base"

export default function ArtCardWide({ artwork }: { artwork: ArtworkItem }) {
  return <ArtCardBase artwork={artwork} className="aspect-[7/4]" />
}

