import { AnimeFavoriteCard } from "@/components/anime/anime-cards";
import { Card, CardContent } from "@/components/ui/card";

interface TraktFavCharacterCardProps {
  id: string | number;
  name: string;
  image: string;
  actor?: string;
}

export function TraktFavCharacterCard({ id, name, image, actor }: TraktFavCharacterCardProps) {
  // If we have an actor name, use our custom card with actor display
  if (actor) {
    return (
      <Card className="w-full overflow-hidden border dark:border-gray-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={image || "/placeholder.svg?height=270&width=180"}
            alt={name}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=180&width=120";
            }}
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <span className="text-white text-xs font-medium">Favorite</span>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-2">
            <a
              href={`https://trakt.tv/people/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {name}
            </a>
          </h3>
          {actor && <p className="text-xs text-muted-foreground mt-1">{actor}</p>}
        </CardContent>
      </Card>
    );
  }

  // If no actor name, use the original FavoriteCard component
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
  );
}
