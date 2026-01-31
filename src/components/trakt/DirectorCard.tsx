import { AnimeFavoriteCard } from "@/components/anime/anime-cards"

interface DirectorCardProps {
  id: string | number
  name: string
  image: string
}

export function DirectorCard({ id, name, image }: DirectorCardProps) {
  return (
    <AnimeFavoriteCard
      item={{
        name: name,
        images: { jpg: { image_url: image } },
        url: `https://trakt.tv/people/${id}`,
      }}
      type="character"
      isCompany={false}
    />
  )
} 