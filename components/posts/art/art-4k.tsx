import { ArtBase, type ArtworkInfo } from "./art-base"

interface Art4KProps {
  artwork: ArtworkInfo
  className?: string
}

export function Art4K({ artwork, className }: Art4KProps) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[16/9]" className={className} />
}

