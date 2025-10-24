import { ArtBase, type ArtworkInfo } from "./art-base"

interface ArtMobileProps {
  artwork: ArtworkInfo
  className?: string
}

export function ArtMobile({ artwork, className }: ArtMobileProps) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[9/16]" className={className} />
}

