import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface TraktHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TraktHelpModal({ isOpen, onClose }: TraktHelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Film Page Help</DialogTitle>
          <DialogDescription>
            This page displays Kris's film and TV watching activity and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium mb-1">Profile</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View Kris's profile information and watching statistics.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Recently Watched</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse through the most recent movies and TV episodes Kris has watched.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Favorites</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Explore Kris's favorite movies, shows, actors, producers, and characters.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

