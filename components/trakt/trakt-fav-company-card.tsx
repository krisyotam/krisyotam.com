import { AnimeFavoriteCard } from "@/components/anime/anime-cards"

interface TraktFavCompanyCardProps {
  id: string | number
  name: string
  image: string
  description?: string
}

export function TraktFavCompanyCard({ id, name, image, description }: TraktFavCompanyCardProps) {
  return (
    <AnimeFavoriteCard
      item={{
        name: name,
        images: { jpg: { image_url: image } },
        url: `https://trakt.tv/studios/${id}`,
        description: description,
      }}
      type="character"
      isCompany={true}
    />
  )
}

