"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export interface WikiFilmProps {
  title: string
  poster: string
  directedBy?: string[]
  screenplayBy?: string[]
  basedOn?: string
  basedOnAuthor?: string
  producedBy?: string[]
  starring?: string[]
  cinematography?: string[]
  editedBy?: string[]
  musicBy?: string[]
  productionCompanies?: string[]
  distributedBy?: string[]
  releaseDate?: string
  runningTime?: string
  country?: string
  language?: string
  budget?: string
  boxOffice?: string
  className?: string
  float?: "left" | "right" | "none"
  width?: number
}

export function WikiFilm({ 
  title,
  poster,
  directedBy,
  screenplayBy,
  basedOn,
  basedOnAuthor,
  producedBy,
  starring,
  cinematography,
  editedBy,
  musicBy,
  productionCompanies,
  distributedBy,
  releaseDate,
  runningTime,
  country,
  language,
  budget,
  boxOffice,
  className,
  float = "right",
  width = 300
}: WikiFilmProps) {
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
        <h3 className="text-center p-2 font-bold">{title}</h3>
      </div>
      <div className="flex flex-col justify-center p-2 bg-muted/20 dark:bg-[hsl(var(--popover))]">
        <div className="relative w-48 h-60 mx-auto">
          <Image
            src={poster || "/placeholder.svg"}
            alt={`Poster of ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
          />
        </div>
        <div className="text-xs text-center mt-2 text-muted-foreground">
          Theatrical release poster
        </div>
      </div>
      <div className="p-0">
        <table className="w-full text-sm">
          <tbody>
            {directedBy && directedBy.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Directed by</th>
                <td className="p-2 dark:text-gray-300">{directedBy.join(", ")}</td>
              </tr>
            )}
            {screenplayBy && screenplayBy.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Screenplay by</th>
                <td className="p-2 dark:text-gray-300">{screenplayBy.join(", ")}</td>
              </tr>
            )}
            {basedOn && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Based on</th>
                <td className="p-2 dark:text-gray-300">
                  <em>{basedOn}</em>
                  {basedOnAuthor && (
                    <>
                      <br />
                      by {basedOnAuthor}
                    </>
                  )}
                </td>
              </tr>
            )}
            {producedBy && producedBy.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Produced by</th>
                <td className="p-2 dark:text-gray-300">{producedBy.join(", ")}</td>
              </tr>
            )}
            {starring && starring.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Starring</th>
                <td className="p-2 dark:text-gray-300">
                  <ul className="list-none">
                    {starring.map((actor, index) => (
                      <li key={index}>{actor}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
            {cinematography && cinematography.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Cinematography</th>
                <td className="p-2 dark:text-gray-300">{cinematography.join(", ")}</td>
              </tr>
            )}
            {editedBy && editedBy.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Edited by</th>
                <td className="p-2 dark:text-gray-300">{editedBy.join(", ")}</td>
              </tr>
            )}
            {musicBy && musicBy.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Music by</th>
                <td className="p-2 dark:text-gray-300">{musicBy.join(", ")}</td>
              </tr>
            )}
            {productionCompanies && productionCompanies.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Production companies</th>
                <td className="p-2 dark:text-gray-300">
                  <ul className="list-none">
                    {productionCompanies.map((company, index) => (
                      <li key={index}>{company}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
            {distributedBy && distributedBy.length > 0 && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Distributed by</th>
                <td className="p-2 dark:text-gray-300">
                  <ul className="list-none">
                    {distributedBy.map((distributor, index) => (
                      <li key={index}>{distributor}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
            {releaseDate && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Release date</th>
                <td className="p-2 dark:text-gray-300">{releaseDate}</td>
              </tr>
            )}
            {runningTime && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Running time</th>
                <td className="p-2 dark:text-gray-300">{runningTime}</td>
              </tr>
            )}
            {country && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Country</th>
                <td className="p-2 dark:text-gray-300">{country}</td>
              </tr>
            )}
            {language && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Language</th>
                <td className="p-2 dark:text-gray-300">{language}</td>
              </tr>
            )}
            {budget && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Budget</th>
                <td className="p-2 dark:text-gray-300">{budget}</td>
              </tr>
            )}
            {boxOffice && (
              <tr className="border-t border-border">
                <th className="p-2 text-left font-bold bg-muted/30 dark:bg-[hsl(var(--muted))]">Box office</th>
                <td className="p-2 dark:text-gray-300">{boxOffice}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
