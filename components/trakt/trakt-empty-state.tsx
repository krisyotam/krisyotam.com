import type React from "react"
import { AlertCircle } from "lucide-react"

interface TraktEmptyStateProps {
  message: string
}

interface NoFavoritesStateProps {
  type: "movies" | "shows"
}

interface NoMostWatchedStateProps {
  type: "genres" | "shows" | "movies"
}

export function TraktEmptyState({ message }: TraktEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-background rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-8 text-center">
      <AlertCircle className="h-10 w-10 mx-auto mb-4 text-gray-400 dark:text-zinc-500" />
      <p className="text-gray-500 dark:text-zinc-400">{message}</p>
    </div>
  )
}

export const TraktNoFavoritesState: React.FC<NoFavoritesStateProps> = ({ type }) => {
  const messages = {
    movies: "Kris hasn't added any favorite movies yet.",
    shows: "Kris hasn't added any favorite shows yet.",
  }

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-lg text-center">
      <p className="text-gray-600 dark:text-zinc-400">{messages[type]}</p>
    </div>
  )
}

export const TraktNoMostWatchedState: React.FC<NoMostWatchedStateProps> = ({ type }) => {
  const messages = {
    genres: "Kris has no most watched genres at this time.",
    shows: "Kris has no most watched shows at this time.",
    movies: "Kris has no most watched movies at this time.",
  }

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-lg text-center">
      <p className="text-gray-600 dark:text-zinc-400">{messages[type]}</p>
    </div>
  )
}

