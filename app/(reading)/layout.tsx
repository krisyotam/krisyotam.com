
import { ReactNode } from "react"
import { ReadingDataProvider } from "@/contexts/reading-data-context"

interface ReadingLayoutProps {
  children: ReactNode
}

export default function ReadingLayout({ children }: ReadingLayoutProps) {
  return (
    <ReadingDataProvider>
      {children}
    </ReadingDataProvider>
  )
}
