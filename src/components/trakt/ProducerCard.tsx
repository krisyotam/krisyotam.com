import { AnimeFavoriteCard } from "@/components/anime/anime-cards"

interface ProducerCardProps {
  id: string | number
  name: string
  image: string
}

export function ProducerCard({ id, name, image }: ProducerCardProps) {
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

