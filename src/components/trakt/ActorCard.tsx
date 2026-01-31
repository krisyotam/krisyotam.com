import { AnimeFavoriteCard } from "@/components/anime/anime-cards"

interface ActorCardProps {
  id: string | number
  name: string
  image: string
}

export function ActorCard({ id, name, image }: ActorCardProps) {
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

