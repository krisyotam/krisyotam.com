import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art3x2Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art3x2({ artwork, className }: Art3x2Props) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[3/2]" className={className} />
}

