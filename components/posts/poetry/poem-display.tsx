import { cn } from "@/lib/utils"

interface PoemProps {
  title: string
  author: string
  year: number
  lines: string[]
  rhymeScheme: string[]
  meter: string
  className?: string
}

export default function PoemDisplay({ title, author, year, lines, rhymeScheme, meter, className }: PoemProps) {
  return (
    <div
      className={cn(
        "max-w-md mx-auto p-8 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 shadow-sm !important",
        "font-sans antialiased !important",
        className,
      )}
    >
      <div className="space-y-6 !important">
        <div className="space-y-2 text-center !important">
          <h2 className="text-2xl font-serif tracking-tight text-gray-800 dark:text-white m-0 !important">{title}</h2>
          <div className="text-sm text-gray-600 dark:text-zinc-400 font-light !important">
            {author}, {year}
          </div>
        </div>

        <div className="flex !important">
          <div className="flex-1 font-serif leading-relaxed text-gray-700 dark:text-zinc-300 space-y-4 !important">
            {lines.map((line, index) => (
              <div key={index} className="flex items-start gap-6 !important">
                <div className="flex-1 !important">{line}</div>
                {line && (
                  <div className="text-xs text-gray-500 dark:text-zinc-500 font-light w-4 !important">
                    {rhymeScheme[index]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-500 font-light !important">
          <div className="grid grid-cols-2 gap-4 !important">
            <div className="!important">Meter: {meter}</div>
            <div className="text-right !important">Rhyme scheme: {rhymeScheme.filter(Boolean).join("-")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

