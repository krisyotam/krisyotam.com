import { AnimeFavoriteCard } from "@/components/anime/anime-cards"

interface TraktFavActorCardProps {
  id: string | number
  name: string
  image: string
}

export function TraktFavActorCard({ id, name, image }: TraktFavActorCardProps) {
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

