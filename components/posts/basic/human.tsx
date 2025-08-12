import { cn } from "@/lib/utils"
import Image from "next/image"

interface HumanProps {
  image: string
  fullName: string
  birthDate: string
  deathDate?: string
  profession: string
  nationality: string
  achievements?: string[]
  className?: string
}

export default function Human({
  image,
  fullName,
  birthDate,
  deathDate,
  profession,
  nationality,
  achievements = [],
  className,
}: HumanProps) {
  return (
    <div
      className={cn(
        "!w-full !max-w-sm !flex-shrink-0 !p-8 !bg-white !border !border-gray-200 !shadow-sm",
        "!font-sans !antialiased",
        "dark:!bg-[#1A1A1A] dark:!border-zinc-800",
        className,
      )}
    >
      <div className="!space-y-6">
        <div className="!aspect-square !rounded-lg !bg-gray-100 dark:!bg-black !mx-auto !w-48 !h-48">
          <Image
            src={image || "/placeholder.svg"}
            alt={fullName}
            width={192}
            height={192}
            className="!object-cover !w-full !h-full"
          />
        </div>

        <div className="!space-y-2 !text-center">
          <h2 className="!text-2xl !font-serif !tracking-tight !text-gray-900 dark:!text-gray-100 !m-0">{fullName}</h2>
          <div className="!text-sm !text-gray-600 dark:!text-gray-400 !font-light">{profession}</div>
        </div>

        <div className="!pt-4 !border-t !border-gray-200 dark:!border-zinc-800 !text-xs !text-gray-500 dark:!text-gray-400 !font-light !space-y-2">
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Born: {birthDate}</div>
            <div className="!text-right">{deathDate ? `Died: ${deathDate}` : ""}</div>
          </div>
          <div className="!text-center">Nationality: {nationality}</div>

          {achievements && achievements.length > 0 && (
            <div className="!mt-4 !pt-3 !border-t !border-gray-200 dark:!border-zinc-800">
              <div className="!text-xs !font-medium !mb-2 !text-gray-600 dark:!text-gray-400">
                Notable Achievements:
              </div>
              <ul className="!list-disc !list-inside !text-[10px] !text-gray-500 dark:!text-gray-400 !space-y-1">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <li key={index} className="!truncate" title={achievement}>
                    {achievement}
                  </li>
                ))}
                {achievements.length > 3 && (
                  <div className="!text-[10px] !text-gray-500 dark:!text-gray-500 !italic !text-right">
                    +{achievements.length - 3} more
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

