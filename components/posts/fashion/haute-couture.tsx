import { cn } from "@/lib/utils"
import Image from "next/image"

interface HauteCoutureProps {
  image: string
  collectionName: string
  designer: string
  fashionHouse: string
  year: number
  season: string
  theme: string
  className?: string
}

export default function HauteCouture({
  image,
  collectionName,
  designer,
  fashionHouse,
  year,
  season,
  theme,
  className,
}: HauteCoutureProps) {
  return (
    <div
      className={cn(
        "!w-80 !flex-shrink-0 !p-8 !bg-white dark:!bg-[#1A1A1A] !border !border-gray-200 dark:!border-zinc-800 !shadow-sm",
        "!font-sans !antialiased",
        className,
      )}
    >
      <div className="!space-y-6">
        <div className="!aspect-[2/3] !overflow-hidden !rounded-md !bg-gray-100 dark:!bg-[#1A1A1A] !mx-auto">
          <Image
            src={image || "/placeholder.svg"}
            alt={collectionName}
            width={240}
            height={360}
            className="!object-cover !w-full !h-full"
          />
        </div>

        <div className="!space-y-2 !text-center">
          <h2 className="!text-2xl !font-serif !tracking-tight !text-gray-900 dark:!text-gray-100 !m-0">
            {collectionName}
          </h2>
          <div className="!text-sm !text-gray-600 dark:!text-gray-400 !font-light">
            {designer} for {fashionHouse}
          </div>
        </div>

        <div className="!pt-4 !border-t !border-gray-200 dark:!border-gray-700 !text-xs !text-gray-500 dark:!text-gray-400 !font-light !space-y-2">
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Season: {season}</div>
            <div className="!text-right">Year: {year}</div>
          </div>
          <div className="!text-center !mt-2">{theme}</div>
        </div>
      </div>
    </div>
  )
}

