import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art4x3Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art4x3({ artwork, className }: Art4x3Props) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[4/3]" className={className} />
}

