import { ArtBase, type ArtworkInfo } from "./art-base"

interface ArtFullHDProps {
  artwork: ArtworkInfo
  className?: string
}

export function ArtFullHD({ artwork, className }: ArtFullHDProps) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[16/9]" className={className} />
}

