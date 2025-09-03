import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art16x9Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art16x9({ artwork, className }: Art16x9Props) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[16/9]" className={className} />
}

