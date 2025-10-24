import { ArtBase, type ArtworkInfo } from "./art-base"

interface ArtUltrawideProps {
  artwork: ArtworkInfo
  className?: string
}

export function ArtUltrawide({ artwork, className }: ArtUltrawideProps) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[21/9]" className={className} />
}

