import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art21x9Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art21x9({ artwork, className }: Art21x9Props) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[21/9]" className={className} />
}

