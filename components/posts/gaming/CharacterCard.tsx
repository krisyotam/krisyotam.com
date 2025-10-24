import { Card, CardContent } from "@/components/ui/card"

interface GameCharacter {
  id: string
  name: string
  game: string
  role: string
  avatarImage: string
  description?: string
}

interface CharacterCardProps {
  character: GameCharacter
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card className="w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#1a1a1a] flex flex-col h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={character.avatarImage || "/placeholder.svg"}
          alt={character.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=180&width=120"
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span className="text-white text-xs font-medium">Favorite</span>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{character.name}</h3>
        <p className="text-xs text-muted-foreground">{character.game}</p>
      </CardContent>
    </Card>
  )
}

export function CharacterCards({ characters }: { characters: GameCharacter[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  )
}
