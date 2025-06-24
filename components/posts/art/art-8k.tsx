import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art8KProps {
  artwork: ArtworkInfo
  className?: string
}

export function Art8K({ artwork, className }: Art8KProps) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[16/9]" className={className} />
}

