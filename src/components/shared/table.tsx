"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export type Column<T> = {
  header: string
  key: keyof T | string
  align?: "left" | "center" | "right"
  render?: (item: T, index: number) => ReactNode
}

export type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  className?: string
}

// Client-side row component
function TableRow<T>({ 
  item, 
  columns, 
  index 
}: { 
  item: T
  columns: Column<T>[]
  index: number 
}) {
  return (
    <tr className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}>
      {columns.map((column) => (
        <td
          key={String(column.key)}
          className={cn(
            "py-2 px-3",
            column.align === "center" && "text-center",
            column.align === "right" && "text-right"
          )}
        >
          {column.render ? column.render(item, index) : String(item[column.key as keyof T])}
        </td>
      ))}
    </tr>
  )
}

export function Table<T>({ columns, data, emptyMessage = "No data found.", className }: TableProps<T>) {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "py-2 text-left font-medium px-3",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right"
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow<T>
              key={index}
              item={item}
              columns={columns}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
} 