import { FavoriteCard } from "@/components/anime/anime-cards"

interface TraktFavProducerCardProps {
  id: string | number
  name: string
  image: string
}

export function TraktFavProducerCard({ id, name, image }: TraktFavProducerCardProps) {
  return (
    <FavoriteCard
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

