import { cn } from "@/lib/utils"
import Image from "next/image"

interface CompanyProps {
  logo: string
  name: string
  foundedYear: number
  headquarters: string
  industry: string
  ceo: string
  tagline?: string
  stockSymbol?: string
  employees?: number
  className?: string
}

export default function Company({
  logo,
  name,
  foundedYear,
  headquarters,
  industry,
  ceo,
  tagline,
  stockSymbol,
  employees,
  className,
}: CompanyProps) {
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
        <div className="!h-32 !flex !items-center !justify-center">
          <div className="!w-56 !h-24 !relative">
            <Image src={logo || "/placeholder.svg"} alt={`${name} logo`} fill className="!object-contain" />
          </div>
        </div>

        <div className="!space-y-2 !text-center">
          <h2 className="!text-2xl !font-serif !tracking-tight !text-gray-900 dark:!text-gray-100 !m-0">{name}</h2>
          {tagline && (
            <div className="!text-sm !text-gray-600 dark:!text-gray-400 !font-light !italic">"{tagline}"</div>
          )}
        </div>

        <div className="!pt-4 !border-t !border-gray-200 dark:!border-zinc-800 !text-xs !text-gray-500 dark:!text-gray-400 !font-light !space-y-2">
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Founded: {foundedYear}</div>
            <div className="!text-right">Industry: {industry}</div>
          </div>

          <div className="!grid !grid-cols-2 !gap-4">
            <div className="!truncate" title={headquarters}>
              HQ: {headquarters}
            </div>
            <div className="!text-right !truncate" title={ceo}>
              CEO: {ceo}
            </div>
          </div>

          {(stockSymbol || employees) && (
            <div className="!grid !grid-cols-2 !gap-4 !mt-3 !pt-3 !border-t !border-gray-200 dark:!border-zinc-800">
              {stockSymbol && <div>Symbol: {stockSymbol}</div>}
              {employees && (
                <div className={cn("!text-right", !stockSymbol && "!col-span-2 !text-center")}>
                  Employees: {employees.toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

