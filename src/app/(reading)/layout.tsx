
import { ReactNode } from "react"
import { ReadingDataProvider } from "@/app/(reading)/reading-data-context"

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
