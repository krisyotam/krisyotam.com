import { AnimeFavoriteCard } from "@/components/anime/anime-cards"

interface CompanyCardProps {
  id: string | number
  name: string
  image: string
  description?: string
}

export function CompanyCard({ id, name, image, description }: CompanyCardProps) {
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

