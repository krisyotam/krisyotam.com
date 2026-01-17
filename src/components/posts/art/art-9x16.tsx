import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art9x16Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art9x16({ artwork, className }: Art9x16Props) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[9/16]" className={className} />
}

