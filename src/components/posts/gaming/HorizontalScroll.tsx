import { ReactNode } from "react"

interface HorizontalScrollProps {
  children: ReactNode
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x">
      {children}
    </div>
  )
}

interface ScrollItemProps {
  children: ReactNode
  width?: string
}

export function ScrollItem({ children, width = "w-60" }: ScrollItemProps) {
  return <div className={`${width} flex-shrink-0 snap-start`}>{children}</div>
}
