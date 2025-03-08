import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function NameBreakdown() {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardContent className="p-6">
        <div className="grid gap-6">
          <NamePart name="Kris" pronunciation="KRISS" meaning="Follower of Christ" />

          <Separator />

          <NamePart name="Lael" pronunciation="LAY-el" meaning="Belonging to God" />

          <Separator />

          <NamePart name="Uri" pronunciation="OO-ree" meaning="Of Light" />

          <Separator />

          <NamePart name="Mayim" pronunciation="mah-YEEM" meaning="Water" />

          <Separator />

          <NamePart name="Yotam" pronunciation="yo-TAHM" meaning="God is Perfect" />
        </div>
      </CardContent>
    </Card>
  )
}

interface NamePartProps {
  name: string
  pronunciation: string
  meaning: string
}

function NamePart({ name, pronunciation, meaning }: NamePartProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
        <span className="text-sm text-muted-foreground">({pronunciation})</span>
      </div>
      <p className="text-muted-foreground">{meaning}</p>
    </div>
  )
}

