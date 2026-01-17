import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art2x3Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art2x3({ artwork, className }: Art2x3Props) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[2/3]" className={className} />
}

