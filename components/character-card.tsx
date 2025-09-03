import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CharacterCardProps {
  imageUrl: string
  name: string
  book: string
  slug: string
}

export function CharacterCard({ imageUrl, name, book, slug }: CharacterCardProps) {
  return (
    <Card className="flex overflow-hidden transition-colors hover:bg-accent/50 group cursor-pointer h-full">
      <div className="w-[100px] bg-muted p-4 flex items-center justify-center">
        <div className="relative w-full h-[100px]">
          <Image src={imageUrl || "/placeholder-square.svg"} alt={name} fill className="object-cover rounded-md" />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between">
        <div className="space-y-1.5">
          <Link href={`/ocs/${slug}`}>
            <h3 className="font-medium leading-tight line-clamp-2">{name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-1">{book}</p>
          <p className="text-sm text-muted-foreground truncate">by Kris Yotam</p>
        </div>
        <div className="mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/ocs/${slug}`}>View Character</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

