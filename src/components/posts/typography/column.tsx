// components/posts/typography/Column.tsx
import { cn } from "@/lib/utils"
import React, { ReactNode } from "react"

export interface ColumnProps {
  children: ReactNode
  type: 'left' | 'right'
  className?: string
}

export function Column({ children, type, className }: ColumnProps) {
  const baseClasses = [
    "w-full",
    "mb-6",
    // Scale down headers for column content
    "[&_h1]:text-2xl [&_h1]:md:text-3xl",
    "[&_h2]:text-xl [&_h2]:md:text-2xl", 
    "[&_h3]:text-lg [&_h3]:md:text-xl",
    "[&_h4]:text-base [&_h4]:md:text-lg",
    "[&_h5]:text-sm [&_h5]:md:text-base",
    "[&_h6]:text-xs [&_h6]:md:text-sm",
  ].join(" ")

  return <div className={cn(baseClasses, className)} data-column-type={type}>{children}</div>
}

// Wrapper component using CSS Grid for proper two-column layout
export interface ColumnContainerProps {
  children: ReactNode
  className?: string
}

export function ColumnContainer({ children, className }: ColumnContainerProps) {
  // Validate that every right column has a left column directly before it
  const validateColumnStructure = (children: ReactNode) => {
    if (process.env.NODE_ENV === 'development') {
      const childArray = React.Children.toArray(children)
      let previousColumnType: 'left' | 'right' | null = null
      
      childArray.forEach((child, index) => {
        if (React.isValidElement<ColumnProps>(child) && child.type === Column) {
          const columnType = child.props.type
          
          if (columnType === 'right' && previousColumnType !== 'left') {
            console.warn(`Column warning: Right column at position ${index} does not have a left column directly before it. Every right column must be preceded by a left column.`)
          }
          
          previousColumnType = columnType
        }
      })
    }
  }

  validateColumnStructure(children)

  // Group children into pairs and create grid layout
  const childArray = React.Children.toArray(children)
  const columnPairs: ReactNode[][] = []
  
  for (let i = 0; i < childArray.length; i += 2) {
    const leftColumn = childArray[i]
    const rightColumn = childArray[i + 1] || null
    columnPairs.push([leftColumn, rightColumn])
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {columnPairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="w-full">
            {pair[0]}
          </div>
          <div className="w-full">
            {pair[1]}
          </div>
        </div>
      ))}
    </div>
  )
}
