import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art5x4Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art5x4({ artwork, className }: Art5x4Props) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[5/4]" className={className} />
}

