"use client"

import React from 'react'
import { cn } from '@/lib/utils'

type Week = { week: number; text: string; status: string }
type Year = { year: number; weeks: Week[] }
type Life = { born: string; timezone?: string; years: Year[] }

const pastelPalette = [
  'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-300',
  'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/30 dark:border-purple-800/50 dark:text-purple-300',
  'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800/50 dark:text-blue-300',
  'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800/50 dark:text-red-300',
  'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800/50 dark:text-green-300',
  'bg-pink-50 border-pink-200 text-pink-900 dark:bg-pink-950/30 dark:border-pink-800/50 dark:text-pink-300',
  'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/30 dark:border-sky-800/50 dark:text-sky-300',
  'bg-lime-50 border-lime-200 text-lime-900 dark:bg-lime-950/30 dark:border-lime-800/50 dark:text-lime-300',
  'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800/50 dark:text-rose-300',
  'bg-cyan-50 border-cyan-200 text-cyan-900 dark:bg-cyan-950/30 dark:border-cyan-800/50 dark:text-cyan-300',
  'bg-violet-50 border-violet-200 text-violet-900 dark:bg-violet-950/30 dark:border-violet-800/50 dark:text-violet-300',
  'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900 dark:bg-fuchsia-950/30 dark:border-fuchsia-800/50 dark:text-fuchsia-300',
]

// tooltipPalette uses stronger solid backgrounds for the hover tooltip so
// the text inside is clearly readable against the color.
const tooltipPalette = [
  'bg-amber-600 text-white dark:bg-amber-500',
  'bg-purple-600 text-white dark:bg-purple-500',
  'bg-blue-600 text-white dark:bg-blue-500',
  'bg-red-600 text-white dark:bg-red-500',
  'bg-green-600 text-white dark:bg-green-500',
  'bg-pink-600 text-white dark:bg-pink-500',
  'bg-sky-600 text-white dark:bg-sky-500',
  'bg-lime-600 text-white dark:bg-lime-500',
  'bg-rose-600 text-white dark:bg-rose-500',
  'bg-cyan-600 text-white dark:bg-cyan-500',
  'bg-violet-600 text-white dark:bg-violet-500',
  'bg-fuchsia-600 text-white dark:bg-fuchsia-500',
]

export default function WeeksClient({ life }: { life: Life }) {
  const years = life.years || []

  return (
    <section className="space-y-6 pb-16">
      {years.map((y, yi) => {
        const color = pastelPalette[yi % pastelPalette.length]
        return (
          <article key={y.year} className={cn('p-3 rounded-sm border shadow-sm', 'rounded-none')}>
            <div className={cn('mb-3 p-2 rounded-none border', color)}>
              <h3 className="text-sm font-semibold">{y.year}</h3>
              {/* thin divider under the year heading for a subtle aesthetic */}
              <div className="border-t border-border mt-2" />
            </div>

            <div className="flex flex-wrap gap-2">
              {y.weeks.map((w) => {
                const tooltipColor = tooltipPalette[yi % tooltipPalette.length]
                return (
                  <div
                    key={`${y.year}-${w.week}`}
                    className="group relative select-none rounded-none border border-border bg-card text-card-foreground p-2 w-14 h-10 flex items-center justify-center text-xs"
                    aria-label={w.text ? `Week ${w.week}: ${w.text}` : `Week ${w.week}: Hidden`}
                    tabIndex={0}
                  >
                    <div className="text-[11px] font-mono opacity-90">{w.week}</div>

                    {/* custom solid tooltip: hidden by default, shows above the bento on hover/focus */}
                    <div className={cn('pointer-events-none absolute -top-9 left-1/2 transform -translate-x-1/2 z-10 rounded px-3 py-0.5 text-sm text-center truncate opacity-0 scale-95 transition-all duration-150 max-w-[340px]', 'group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100', tooltipColor)}>
                      <span className="block max-w-[320px] truncate">{w.text || 'Hidden'}</span>
                    </div>

                    {/* caret removed: tooltip now shows without an arrow */}
                  </div>
                )
              })}
            </div>
          </article>
        )
      })}
    </section>
  )
}
