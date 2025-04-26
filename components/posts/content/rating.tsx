import { cn } from "@/lib/utils"

interface RatingDisplayProps {
  ratings: {
    story: number
    visuals: number
    audio: number
    characters: number
    direction: number
    atmosphere: number
  }
  className?: string
}

export default function RatingDisplay({ ratings, className }: RatingDisplayProps) {
  // Helper to round to nearest 0.25
  const roundToQuarter = (num: number) => Math.round(num * 4) / 4

  // Compute individual rounded ratings
  const safeRatings = {
    story: Math.max(0, Math.min(5, roundToQuarter(ratings.story))),
    visuals: Math.max(0, Math.min(5, roundToQuarter(ratings.visuals))),
    audio: Math.max(0, Math.min(5, roundToQuarter(ratings.audio))),
    characters: Math.max(0, Math.min(5, roundToQuarter(ratings.characters))),
    direction: Math.max(0, Math.min(5, roundToQuarter(ratings.direction))),
    atmosphere: Math.max(0, Math.min(5, roundToQuarter(ratings.atmosphere))),
  }

  const totalRating =
    (safeRatings.story +
      safeRatings.visuals +
      safeRatings.audio +
      safeRatings.characters +
      safeRatings.direction +
      safeRatings.atmosphere) /
    6

  const roundedTotal = roundToQuarter(totalRating)

  return (
    <div
      className={cn(
        "w-80 flex-shrink-0 p-6 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 shadow-sm font-sans antialiased",
        className,
      )}
    >
      <div className="flex flex-col space-y-4">
        {/* Stars */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative h-10 w-10">
              {/* Empty star */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full text-gray-300 dark:text-zinc-700"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>

              {/* Filled star overlay */}
              {roundedTotal >= star - 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute top-0 left-0 h-full w-full text-gray-900 dark:text-white"
                  style={{
                    clipPath:
                      roundedTotal >= star
                        ? "inset(0)"
                        : `inset(0 ${100 - (roundedTotal % 1) * 100}% 0 0)`,
                  }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Category ratings */}
        <div className="space-y-2 text-xs text-gray-600 dark:text-zinc-400">
          <div className="flex justify-between">
            <span>Story</span>
            <span>{safeRatings.story.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Visuals</span>
            <span>{safeRatings.visuals.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Audio</span>
            <span>{safeRatings.audio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Characters</span>
            <span>{safeRatings.characters.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Direction</span>
            <span>{safeRatings.direction.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Atmosphere</span>
            <span>{safeRatings.atmosphere.toFixed(2)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-4 flex justify-between items-center text-sm text-gray-700 dark:text-zinc-300">
          <span>Total</span>
          <span>{roundedTotal.toFixed(2)} / 5.00</span>
        </div>
      </div>
    </div>
  )
}
