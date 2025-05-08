import { FavoriteCard } from "@/components/anime/anime-cards"

interface TraktFavDirectorCardProps {
  id: string | number
  name: string
  image: string
}

export function TraktFavDirectorCard({ id, name, image }: TraktFavDirectorCardProps) {
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