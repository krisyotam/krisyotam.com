import { Gamepad2 } from "lucide-react"

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8 text-center">
      <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-zinc-600" />
      <p className="text-gray-500 dark:text-zinc-400">{message}</p>
    </div>
  )
}
