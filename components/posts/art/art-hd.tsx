import { ArtBase, type ArtworkInfo } from "./art-base"

interface ArtHDProps {
  artwork: ArtworkInfo
  className?: string
}

export function ArtHD({ artwork, className }: ArtHDProps) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[16/9]" className={className} />
}

