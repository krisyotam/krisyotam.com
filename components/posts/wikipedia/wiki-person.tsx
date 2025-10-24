"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export interface WikiPersonProps {
  name: string
  image: string
  born?: string | number
  died?: string | number
  career?: string
  fields?: string[]
  nationality?: string
  knownFor?: string[]
  className?: string
  float?: "left" | "right" | "none"
  width?: number
}

export function WikiPerson({ 
  name, 
  image, 
  born, 
  died, 
  career, 
  fields, 
  nationality, 
  knownFor,
  className,
  float = "right",
  width = 300
}: WikiPersonProps) {
  const floatClass = {
    "left": "float-left mr-2 mb-0 mt-9",
    "right": "float-right ml-2 mb-0 mt-9",
    "none": "mt-9"
  }[float];

  return (
    <div 
      className={cn(
        "max-w-xs border overflow-hidden rounded-none",
        "bg-muted/50 dark:bg-[hsl(var(--popover))]",
        "border-border dark:border-border",
        floatClass,
        className
      )}
      style={{ width: `${width}px` }}
    >
      <div className="p-0 bg-muted/50 dark:bg-[hsl(var(--popover))] border-b border-border">
        <h3 className="text-center p-2 font-bold">{name}</h3>
      </div>
      <div className="flex justify-center p-2 bg-muted/20 dark:bg-[hsl(var(--popover))]">
        <div className="relative w-48 h-60">
          <Image
            src={image || "/placeholder.svg"}
            alt={`Photo of ${name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
          />
        </div>
      </div>
      <div className="p-0">
        <table className="w-full text-sm">
          <tbody>
            {born && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Born</th>
                <td className="p-2 dark:text-gray-300">{born}</td>
              </tr>
            )}
            {died && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Died</th>
                <td className="p-2 dark:text-gray-300">{died}</td>
              </tr>
            )}
            {nationality && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Nationality</th>
                <td className="p-2 dark:text-gray-300">{nationality}</td>
              </tr>
            )}
            {career && (
              <tr className="border-t border-border">
                <th colSpan={2} className="p-2 text-center font-bold bg-muted/50 dark:bg-[hsl(var(--popover))]">
                  {career}
                </th>
              </tr>
            )}
            {fields && fields.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Fields</th>
                <td className="p-2 dark:text-gray-300">{fields.join(", ")}</td>
              </tr>
            )}
            {knownFor && knownFor.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Known for</th>
                <td className="p-2 dark:text-gray-300">
                  <ul className="list-disc pl-4">
                    {knownFor.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
