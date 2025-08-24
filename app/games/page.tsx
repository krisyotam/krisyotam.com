import GameClientPage from "./games-client-page"
import "./games.css"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.games

export default function GamesPage() {
  return <GameClientPage />
}
